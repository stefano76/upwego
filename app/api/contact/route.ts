/**
 * API ROUTE: /api/contact
 * 
 * Handles contact form submissions and contact link data.
 * 
 * GET /api/contact
 * - Returns contact links (email, phone, LinkedIn, etc.)
 * - Used by Footer and other components to display contact information
 * 
 * POST /api/contact
 * - Processes contact form submissions
 * - Validates form data (name, email, message required)
 * - Sends email notification via Resend API
 * - Returns success/error response to the client
 * 
 * ENVIRONMENT VARIABLES REQUIRED:
 * - RESEND_API_KEY: API key for Resend email service
 * - EMAIL_FROM: Sender email address
 * - CONTACT_EMAIL_TO: Recipient email address
 * - CONTACT_EMAIL_SUBJECT: Email subject line (optional)
 */
import { getContactLinks } from "@/lib/contact";
import { sendContactEmail } from "@/lib/email";
import { NextResponse } from "next/server";

/**
 * GET endpoint - Returns contact links
 * Used by components that need to display contact information
 */
export async function GET() {
  try {
    const contactLinks = getContactLinks();
    return NextResponse.json(contactLinks);
  } catch (error) {
    console.error('Error in API route /api/contact:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * POST endpoint - Handles contact form submissions
 * 
 * REQUEST BODY:
 * {
 *   name: string (required),
 *   email: string (required),
 *   phone: string (optional),
 *   message: string (required)
 * }
 * 
 * RESPONSE:
 * - 200: Success - Email sent
 * - 400: Validation error (missing fields or invalid email)
 * - 500: Server error (email sending failed)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Basic validation - ensure required fields are present
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Send email notification using Resend service
    // This will send an email to the address configured in CONTACT_EMAIL_TO
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
    // In development, include error details. In production, keep it generic.
    return NextResponse.json(
      { 
        message: 'Failed to send message. Please try again.',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
