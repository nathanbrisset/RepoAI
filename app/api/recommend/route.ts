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

    const systemPrompt = `You are an AI tool recommendation assistant. Here is a list of available tools:\n${toolList}\n\nGiven a user's request, recommend the 3 best tools from the list above and explain your reasoning for each. Your response MUST follow this exact format:\n\n1. Write a friendly, advice-style explanation of at least 2–3 sentences for the first tool. The explanation MUST mention the tool by name and give specific, practical advice for why it is a good fit. Then, on a new line, write \"id: \" followed by the exact tool ID from the list.\n2. Do the same for the second tool.\n3. Do the same for the third tool.\n\nIMPORTANT: Each explanation must be on its own line, immediately before its corresponding id: line. Do NOT group explanations together. Do NOT leave any explanation blank.\n\nFor example:\nJasper is a fantastic choice for content creation. It helps you write engaging copy quickly and is especially useful for marketing and newsletters. If you want to save time and get great results, Jasper is a top pick.\nid: jasper\n\nGrammarly is perfect for making sure your writing is clear and error-free. It catches grammar mistakes and helps you sound professional. I always recommend Grammarly for anyone who wants polished writing.\nid: grammarly\n\nNotion AI is great for organizing your ideas and collaborating with others. It makes managing drafts and feedback easy, so your workflow stays smooth. If you like to keep things organized, Notion AI is a smart choice.\nid: notion-ai\n\nRemember: The tool IDs must be from the list above.`;

    // Create an AbortController for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    try {
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
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", errorText);
        return NextResponse.json({ error: 'OpenAI API error', details: errorText }, { status: 500 });
      }

      const data = await response.json();
      console.log('Full response from /api/recommend route:', data);
      const content = data.choices[0].message.content;
      console.log('Extracted content from /api/recommend route:', content);

      // Detect if the LLM response is a clarification request or indicates confusion
      const unclearPatterns = [
        /couldn't understand/i,
        /could not understand/i,
        /please clarify/i,
        /unclear/i,
        /provide more details/i,
        /please provide/i,
        /what you need help with/i,
        /what you're looking for/i,
        /may contain a typo/i,
        /your request is unclear/i,
        /could you please/i,
        /not sure what you mean/i,
        /not sure what you need/i,
        /please describe/i,
        /try again/i,
        /try describing/i,
        /clarify/i,
        /could you clarify/i,
        /could you provide/i,
        /need more information/i,
        /need more details/i,
        /not enough information/i,
        /not enough details/i,
        /uncertain/i,
        /not sure/i,
        /don't understand/i,
        /do not understand/i,
        /unclear input/i,
        /unclear request/i,
        /unclear what you want/i,
        /unclear what you need/i
      ];
      if (unclearPatterns.some((pattern) => pattern.test(content))) {
        // Return a funny message and 3 real text generation tools
        const textTools = tools.filter(tool => tool.categories.includes('text'));
        // Pick 3 top-rated or most popular text tools
        const fallbackTools = [
          textTools.find(t => t.id === 'writer-com'),
          textTools.find(t => t.id === 'ink-for-all'),
          textTools.find(t => t.id === 'wordtune')
        ].filter(Boolean).map(tool => ({
          tool,
          explanation: `Maybe you need an AI to help you write a good prompt! Try this one for size.`
        }));
        return NextResponse.json({
          funny: true,
          message: "Oops! It looks like your prompt stumped even our AI. Maybe you need an AI to help you write a good prompt! Here are some (actually real) AI tools that can help you craft the perfect prompt:",
          recommendations: fallbackTools
        }, { status: 200 });
      }

      // Extract up to 3 tool IDs and their explanations
      const idPattern = /\n\s*id:\s*(.+)/gi;
      let match;
      const toolBlocks = [];
      let lastIndex = 0;
      let lastId = null;

      // After extracting explanation, replace tool name with neutral phrase
      function neutralizeToolName(explanation, toolName) {
        const phrases = [
          'This tool',
          'This AI',
          'This solution',
          'This platform',
          'This assistant'
        ];
        // Create regex to match tool name (case-insensitive, word boundaries)
        const regex = new RegExp(`\\b${toolName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
        // Pick a random neutral phrase
        const neutral = phrases[Math.floor(Math.random() * phrases.length)];
        return explanation.replace(regex, neutral);
      }

      while ((match = idPattern.exec(content)) !== null) {
        const id = match[1].trim();
        let explanation = content.slice(lastIndex, match.index).trim().replace(/^(\d+\.|\*)?\s*/g, '');
        // Remove tool name from start of explanation if present
        const tool = tools.find(t => t.id.toLowerCase() === id.toLowerCase() || t.name.toLowerCase() === id.toLowerCase());
        if (tool) {
          // Replace tool name in explanation with neutral phrase
          explanation = neutralizeToolName(explanation, tool.name);
        }
        if (tool && explanation.toLowerCase().startsWith(tool.name.toLowerCase())) {
          explanation = explanation.slice(tool.name.length).trim();
        }
        if (lastId !== null) {
          toolBlocks.push({ id: lastId, explanation });
        }
        lastId = id;
        lastIndex = idPattern.lastIndex;
      }
      // Add the last block
      if (lastId !== null) {
        let explanation = content.slice(lastIndex).trim().replace(/^(\d+\.|\*)?\s*/g, '');
        const tool = tools.find(t => t.id.toLowerCase() === lastId.toLowerCase() || t.name.toLowerCase() === lastId.toLowerCase());
        if (tool && explanation.toLowerCase().startsWith(tool.name.toLowerCase())) {
          explanation = explanation.slice(tool.name.length).trim();
        }
        if (tool && explanation && !explanation.toLowerCase().includes(tool.name.toLowerCase())) {
          explanation = `${tool.name} is a great choice for your needs. ${explanation}`;
        }
        toolBlocks.push({ id: lastId, explanation });
      }

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

          // Generate a more detailed explanation if none exists or if it's too generic
          let explanation = block.explanation;
          if (!explanation || explanation === 'This tool is recommended for your needs.') {
            switch (tool.id.toLowerCase()) {
              case 'grammarly':
                explanation = `${tool.name} is essential for ensuring your content is polished and professional. It helps catch grammar mistakes, improves clarity, and enhances your writing style to make your content more engaging and credible.`;
                break;
              case 'jasper':
                explanation = `${tool.name} is perfect for generating high-quality content quickly. It helps create engaging copy, blog posts, and marketing materials with AI-powered writing assistance.`;
                break;
              case 'mailchimp':
                explanation = `${tool.name} is a comprehensive email marketing platform that helps you design, send, and track newsletters. It offers powerful automation features and detailed analytics to grow your audience.`;
                break;
              default:
                explanation = `${tool.name} is a powerful tool that can help you achieve your goals. It offers ${tool.description}`;
            }
          }
          
          return {
            tool,
            explanation
          };
        })
        .filter(Boolean); // Remove any null entries

      // If we have no valid tools, use fallback tools
      if (recommendedTools.length === 0) {
        console.log('No valid tools found, using fallback tools');
        const fallbackTools = tools.slice(0, 3).map(tool => ({
          tool,
          explanation: `${tool.name} is a great choice because ${tool.description}`
        }));
        return NextResponse.json({
          recommendations: fallbackTools
        });
      }

      // Ensure we have exactly 3 tools with explanations
      while (recommendedTools.length < 3) {
        const remainingTools = tools.filter(t => !recommendedTools.some(rt => rt.tool.id === t.id));
        if (remainingTools.length === 0) break;
        const tool = remainingTools[0];
        let explanation = '';
        switch (tool.id.toLowerCase()) {
          case 'grammarly':
            explanation = `${tool.name} is essential for ensuring your content is polished and professional. It helps catch grammar mistakes, improves clarity, and enhances your writing style to make your content more engaging and credible.`;
            break;
          case 'jasper':
            explanation = `${tool.name} is perfect for generating high-quality content quickly. It helps create engaging copy, blog posts, and marketing materials with AI-powered writing assistance.`;
            break;
          case 'mailchimp':
            explanation = `${tool.name} is a comprehensive email marketing platform that helps you design, send, and track newsletters. It offers powerful automation features and detailed analytics to grow your audience.`;
            break;
          default:
            explanation = `${tool.name} is a powerful tool that can help you achieve your goals. It offers ${tool.description}`;
        }
        recommendedTools.push({
          tool,
          explanation
        });
      }

      return NextResponse.json({
        recommendations: recommendedTools.slice(0, 3)
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Request timed out');
          return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 408 });
        }
        console.error('Error in OpenAI API call:', error);
        return NextResponse.json({ error: 'Error processing request', details: error.message }, { status: 500 });
      }
      throw error; // Re-throw if it's not an Error instance
    }
  } catch (err) {
    console.error('Error in /api/recommend route:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
} 