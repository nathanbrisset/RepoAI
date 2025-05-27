import { NextRequest, NextResponse } from 'next/server';
import { mockTools } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // Use all tools
    const tools = mockTools;
    const toolList = tools.map((tool, i) => `${i + 1}. ${tool.name}: ${tool.description} (id: ${tool.id})`).join('\n');

    const systemPrompt = `You are an AI tool recommendation assistant. Here is a list of available tools:\n${toolList}\n\nGiven a user's request, recommend the single best tool from the list above and explain your reasoning. Your response MUST end with the tool's ID in exactly this format: "id: <tool-id>". For example: "id: tool-name". Reply in natural language, but ensure the ID is at the very end of your response. If you're unsure which tool to recommend, choose the most relevant one from the list.`;

    const togetherApiKey = process.env.TOGETHER_API_KEY;
    if (!togetherApiKey) {
      return NextResponse.json({ error: 'Together API key not set' }, { status: 500 });
    }

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${togetherApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 256,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Together API error:", errorText);
      return NextResponse.json({ error: 'Together API error', details: errorText }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Try multiple patterns to extract the tool ID
    let toolId = null;
    const patterns = [
      /id:\s*([a-zA-Z0-9-]+)(?:\s*$|\s*\.)/i,  // id: tool-name
      /tool\s*id:\s*([a-zA-Z0-9-]+)/i,         // tool id: tool-name
      /recommended\s*tool:\s*([a-zA-Z0-9-]+)/i, // recommended tool: tool-name
      /tool:\s*([a-zA-Z0-9-]+)/i               // tool: tool-name
    ];

    for (const pattern of patterns) {
      const match = content?.match(pattern);
      if (match) {
        toolId = match[1];
        break;
      }
    }
    
    if (!toolId) {
      console.error("Could not find tool ID in response:", content);
      // If no tool ID found, try to find a tool that matches the content
      const toolMatch = tools.find(tool => 
        content?.toLowerCase().includes(tool.id.toLowerCase()) ||
        content?.toLowerCase().includes(tool.name.toLowerCase())
      );
      if (toolMatch) {
        toolId = toolMatch.id;
      } else {
        // If still no match, return the first tool as a fallback
        toolId = tools[0].id;
      }
    }

    const tool = tools.find(t => t.id === toolId);
    if (!tool) {
      return NextResponse.json({ error: 'Recommended tool not found' }, { status: 500 });
    }

    return NextResponse.json({
      tool,
      explanation: content
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
} 