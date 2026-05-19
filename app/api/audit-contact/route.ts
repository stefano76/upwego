import { sendAuditEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, websiteUrl, message } = body;

    if (!name || !email || !websiteUrl) {
      return NextResponse.json(
        { message: 'Name, Email, and Website URL are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    await sendAuditEmail({ name, email, websiteUrl, message });

    return NextResponse.json(
      { message: "Audit requested successfully! We’ll be in touch shortly." },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing audit form:', error);
    return NextResponse.json(
      { message: 'Failed to request audit. Please try again.' },
      { status: 500 }
    );
  }
}
