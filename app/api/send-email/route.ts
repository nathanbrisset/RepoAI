import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    // Validate required fields
    if (!body.email || !body.message) {
      console.error("Missing required fields:", body);
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract data with fallbacks for optional fields
    const firstName = body.firstName || body.first_name || '';
    const lastName = body.lastName || body.last_name || '';
    const email = body.email;
    const message = body.message;
    const subject = body.subject || `New Contact Form Submission from ${firstName} ${lastName}`;

    console.log("Sending email with data:", { firstName, lastName, email, message, subject });

    const data = await resend.emails.send({
      from: 'AI Tools Directory <contact@aitoolsninja.com>',
      to: ['aitoolsrequest@gmail.com'],
      reply_to: email,
      subject: subject,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}\n`,
    });

    console.log("Email sent successfully:", data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 