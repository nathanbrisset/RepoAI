import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function fetchOpenAIRecommendation(prompt: string, tools: any[]) {
  const toolList = tools.map(tool => `Name: ${tool.name}\nDescription: ${tool.description}\nCategories: ${tool.categories.join(", ")}\nTags: ${tool.tags.join(", ")}`).join("\n---\n");
  const systemPrompt = `You are an expert AI assistant. Given a user's request and a list of AI tools, recommend the single best tool for their needs. Reply with the tool name, a short reason, and nothing else.`;
  const userPrompt = `User request: ${prompt}\n\nAvailable tools:\n${toolList}`;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 300,
      temperature: 0.2,
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No recommendation found.';
}

import { tools } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    if (!OPENAI_API_KEY) return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    const recommendation = await fetchOpenAIRecommendation(prompt, tools);
    return NextResponse.json({ recommendation });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 