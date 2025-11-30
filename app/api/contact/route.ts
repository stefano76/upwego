import { getContactLinks } from "@/lib/contact";
import { sendContactEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contactLinks = getContactLinks();
    return NextResponse.json(contactLinks);
  } catch (error) {
    console.error('Error in API route /api/contact:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Send email notification
    await sendContactEmail({
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Detailed error:', errorMessage);
    if (errorStack) {
      console.error('Error stack:', errorStack);
    }
    
    // Return more specific error message for debugging (but don't expose sensitive info)
    return NextResponse.json(
      { 
        message: 'Failed to send message. Please try again.',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
