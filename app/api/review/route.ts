import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, rating, comment, toolId } = await req.json();
    if (!name || !email || !rating || !comment || !toolId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Save review to DB
    const review = await prisma.review.create({
      data: { name, email, rating, comment, toolId },
    });

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'aitoolsrequest@gmail.com',
      subject: `New Review for Tool: ${toolId}`,
      text: `Name: ${name}\nEmail: ${email}\nRating: ${rating}\nComment: ${comment}`,
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const toolId = searchParams.get('toolId');
    if (!toolId) {
      return NextResponse.json({ error: 'Missing toolId' }, { status: 400 });
    }
    const reviews = await prisma.review.findMany({
      where: { toolId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 