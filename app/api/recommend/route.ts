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

    const systemPrompt = `You are an AI tool recommendation assistant. Here is a list of available tools:\n${toolList}\n\nGiven a user's request, recommend the 3 best tools from the list above and explain your reasoning for each. Your response MUST follow this exact format:\n\n1. Write a brief explanation for the first tool, then on a new line write \"id: \" followed by the exact tool ID from the list.\n2. Write a brief explanation for the second tool, then on a new line write \"id: \" followed by the exact tool ID from the list.\n3. Write a brief explanation for the third tool, then on a new line write \"id: \" followed by the exact tool ID from the list.\n\nFor example:\nThis tool is perfect for your needs because it specializes in exactly what you're looking for.\nid: tool-1\n\nThis tool is also a good fit because it offers additional features.\nid: tool-2\n\nThis tool is worth considering for its ease of use.\nid: tool-3\n\nRemember: The tool IDs must be from the list above.`;

    // --- OPENAI GPT-4o FETCH BLOCK START ---
    const openaiUrl = "https://api.openai.com/v1/chat/completions";
    const response = await fetch(openaiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        stream: false
      }),
    });
    // --- OPENAI GPT-4o FETCH BLOCK END ---

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return NextResponse.json({ error: 'OpenAI API error', details: errorText }, { status: 500 });
    }

    const data = await response.json();
    console.log('Full response from /api/recommend route:', data);
    const content = data.choices[0].message.content;
    console.log('Extracted content from /api/recommend route:', content);

    // Extract up to 3 tool IDs and their explanations
    const toolBlocks = content.split(/\n\s*id:/i).map((block, idx) => {
      if (idx === 0) return null; // skip the first split part (before first id:)
      const lines = block.trim().split(/\n/);
      const idLine = lines[0].trim();
      const explanation = content.split(/\n\s*id:/i)[idx - 1]?.trim();
      return { id: idLine, explanation };
    }).filter(Boolean);

    // Map tool IDs to tool objects and filter out any null tools
    const recommendedTools = toolBlocks
      .map(block => {
        // Try to find the tool by exact ID match first
        let tool = tools.find(t => t.id.toLowerCase() === block.id.toLowerCase());
        
        // If no exact match, try to find by name
        if (!tool) {
          tool = tools.find(t => t.name.toLowerCase().includes(block.id.toLowerCase()) || 
                                block.id.toLowerCase().includes(t.name.toLowerCase()));
        }
        
        if (!tool) {
          console.warn(`Tool not found for ID: ${block.id}`);
          return null;
        }
        
        return {
          tool,
          explanation: block.explanation || ''
        };
      })
      .filter(Boolean); // Remove any null entries

    // If we have no valid tools, use fallback tools
    if (recommendedTools.length === 0) {
      console.log('No valid tools found, using fallback tools');
      const fallbackTools = tools.slice(0, 3).map(tool => ({
        tool,
        explanation: `Fallback recommendation: ${tool.name} - ${tool.description}`
      }));
      return NextResponse.json({
        recommendations: fallbackTools
      });
    }

    return NextResponse.json({
      recommendations: recommendedTools
    });
  } catch (err) {
    console.error('Error in /api/recommend route:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
} 