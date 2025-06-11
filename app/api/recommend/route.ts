import { NextRequest, NextResponse } from 'next/server';
import { mockTools } from '@/lib/data';

// Find top 3 copywriting tools by rating
const copywritingTools = mockTools
  .filter(tool => tool.tags?.includes('copywriting') || tool.subcategory?.toLowerCase().includes('copywriting'))
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 3)
  .map(tool => ({
    tool,
    explanation: tool.description
  }));

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    // If prompt is gibberish or too short, return copywriting tools
    const isGibberish = !/\w{3,}/.test(prompt) || /[a-z]{3,}/i.test(prompt) === false;
    if (isGibberish) {
      return NextResponse.json({
        recommendations: copywritingTools
      });
    }

    // Use all tools
    const tools = mockTools;
    const toolList = tools.map((tool, i) => `${i + 1}. ${tool.name}: ${tool.description} (id: ${tool.id})`).join('\n');

    const systemPrompt = `You are an AI tool recommendation assistant. Here is a list of available tools:\n${toolList}\n\nGiven a user's request, first write a short, friendly intro paragraph tailored to their query. Label it as 'Intro:'.\n\nThen, recommend the 3 best tools from the list above and explain your reasoning for each.\nFor both the intro and each tool explanation, write in a fun, friendly, conversational tone—like a helpful, upbeat friend.\nFor each tool, your explanation should be at least 3 sentences, engaging, and include specific examples or scenarios of how the tool could help the user.\nFor each tool, write a SEPARATE explanation, then on a new line write \"id: <tool-id>\".\nSeparate each tool's explanation/id pair with TWO newlines.\n\nFormat:\nIntro: <your intro paragraph here>\n\n<tool 1 explanation>\nid: tool-1\n\n<tool 2 explanation>\nid: tool-2\n\n<tool 3 explanation>\nid: tool-3`;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using fallback tools');
      return NextResponse.json({
        recommendations: copywritingTools,
        warning: 'Using fallback recommendations due to missing API configuration'
      });
    }

    // --- OPENAI GPT-4o FETCH BLOCK START ---
    const openaiUrl = "https://api.openai.com/v1/chat/completions";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
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
        signal: controller.signal
    });

      clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
        return NextResponse.json({ 
          recommendations: copywritingTools,
          warning: 'Using fallback recommendations due to API error',
          error: errorText 
        });
    }

    const data = await response.json();
    console.log('Full response from /api/recommend route:', data);
    const content = data.choices[0].message.content;
    console.log('Extracted content from /api/recommend route:', content);

      // Extract intro paragraph and tool recommendations
      const introMatch = content.match(/Intro:\s*([\s\S]*?)(?=\n{2,}|$)/i);
      const intro = introMatch ? introMatch[1].trim() : '';
      // Remove the intro from content for tool parsing
      const contentWithoutIntro = content.replace(/Intro:[\s\S]*?(\n{2,}|$)/i, '');
      // Extract up to 3 tool IDs and their explanations using regex
      const regex = /([\s\S]*?)\s*id:\s*([\w-]+)/gi;
      const toolBlocks = [];
      let match;
      while ((match = regex.exec(contentWithoutIntro)) !== null) {
        const explanation = match[1].trim().replace(/^[\d]+\.|^First,|^Second,|^Third,|^Next,|^Finally,|^Then,|^Also,|^Additionally,|^\s+/gi, '').replace(/\n+$/, '');
        const id = match[2].trim();
        toolBlocks.push({ id, explanation });
      }

    // Map tool IDs to tool objects and filter out any null tools
    const recommendedTools = toolBlocks
      .map(block => {
        let tool = tools.find(t => t.id.toLowerCase() === block.id.toLowerCase());
        if (!tool) {
            tool = tools.find(t => t.name.toLowerCase().includes(block.id.toLowerCase()) || block.id.toLowerCase().includes(t.name.toLowerCase()));
        }
        if (!tool) {
          console.warn(`Tool not found for ID: ${block.id}`);
          return null;
        }
        return {
          tool,
            explanation: block.explanation || tool.description || ''
        };
      })
        .filter(Boolean);

    // If we have no valid tools, use fallback tools
    if (recommendedTools.length === 0) {
      console.log('No valid tools found, using fallback tools');
      return NextResponse.json({
          intro,
          recommendations: copywritingTools,
          warning: 'Using fallback recommendations due to no valid tools found'
      });
    }

    return NextResponse.json({
        intro,
      recommendations: recommendedTools
    });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('Request timeout');
        return NextResponse.json({
          recommendations: copywritingTools,
          warning: 'Using fallback recommendations due to request timeout'
        });
      }
      throw error;
    }
  } catch (err) {
    console.error('Error in /api/recommend route:', err);
    return NextResponse.json({ 
      recommendations: copywritingTools,
      warning: 'Using fallback recommendations due to internal error',
      error: String(err) 
    });
  }
} 