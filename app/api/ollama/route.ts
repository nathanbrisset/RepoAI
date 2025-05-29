import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    console.log('Sending request to Ollama server:', {
      model: 'mistral',
      promptLength: prompt.length
    });

    const ollamaUrl = 'http://localhost:11434/api/chat';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(ollamaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant for recommending AI tools. Always follow the exact format specified in the prompt.' },
            { role: 'user', content: prompt }
          ],
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Ollama API error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        return NextResponse.json({ 
          error: 'Ollama API error', 
          details: errorText,
          status: response.status 
        }, { status: 500 });
      }

      const data = await response.json();
      const content = data.message?.content || '';
      console.log('Received response from Ollama:', {
        responseLength: content.length,
        content: content
      });

      return NextResponse.json({
        content,
        model: data.model
      });
    } catch (err) {
      console.error('Error in Ollama API route:', err);
      return NextResponse.json({ 
        error: 'Internal server error', 
        details: String(err),
        type: err instanceof Error ? err.name : 'Unknown'
      }, { status: 500 });
    }
  } catch (err) {
    console.error('Error in Ollama API route:', err);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: String(err),
      type: err instanceof Error ? err.name : 'Unknown'
    }, { status: 500 });
  }
} 