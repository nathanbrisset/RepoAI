import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, message } = await request.json();

    console.log("About to send email with data:", { firstName, lastName, email, message });
    console.log("Resend API Key:", process.env.RESEND_API_KEY?.slice(0, 6));
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: ['aitoolsrequest@gmail.com'],
      replyTo: email,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: `\nName: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}\n`,
    });
    console.log("Resend API response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 