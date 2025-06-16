import nodemailer from 'nodemailer';

export async function POST(req) {
  const { name, email, message, type } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // your@gmail.com
      pass: process.env.GMAIL_APP_PASSWORD, // your app password
    },
  });

  const subject = type === 'tool' ? 'Tool Submission' : 'New Contact Form Submission';

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.GMAIL_USER,
      subject,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}