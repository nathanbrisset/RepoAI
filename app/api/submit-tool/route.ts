import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { toolName, description, website, category, tags, logo } = await request.json();

    // Compose email content
    const text = `New AI Tool Submission:\n\n` +
      `Tool Name: ${toolName}\n` +
      `Description: ${description}\n` +
      `Website: ${website}\n` +
      `Category: ${category}\n` +
      `Tags: ${tags}\n` +
      `Logo: ${logo || 'N/A'}\n`;

    const data = await resend.emails.send({
      from: 'Tool Submission <onboarding@resend.dev>',
      to: ['aitoolsrequest@gmail.com'],
      subject: `New Tool Submission: ${toolName}`,
      text,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting tool:', error);
    return NextResponse.json({ error: 'Failed to submit tool' }, { status: 500 });
  }
} 