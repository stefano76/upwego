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
 * - Verifies reCAPTCHA token for bot detection
 * - Sends email notification via Resend API
 * - Returns success/error response to the client
 * 
 * ENVIRONMENT VARIABLES REQUIRED:
 * - RESEND_API_KEY: API key for Resend email service
 * - EMAIL_FROM: Sender email address
 * - CONTACT_EMAIL_TO: Recipient email address
 * - CONTACT_EMAIL_SUBJECT: Email subject line (optional)
 * - RECAPTCHA_SECRET_KEY: reCAPTCHA v3 secret key for verification
 */
import { getContactLinks } from "@/lib/contact";
import { sendContactEmail } from "@/lib/email";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { isLocalhost } from "@/app/utils/environment";
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
 *   message: string (required),
 *   recaptchaToken: string (required - from reCAPTCHA v3)
 * }
 * 
 * RESPONSE:
 * - 200: Success - Email sent
 * - 400: Validation error (missing fields, invalid email, or reCAPTCHA failed)
 * - 500: Server error (email sending failed)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, recaptchaToken } = body;

    // Basic validation - ensure required fields are present
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token (skip on localhost)
    if (!isLocalhost()) {
      // Production: require and verify reCAPTCHA token
      if (!recaptchaToken) {
        return NextResponse.json(
          { message: 'reCAPTCHA token is required' },
          { status: 400 }
        );
      }

      try {
        const recaptchaResult = await verifyRecaptchaToken({
          token: recaptchaToken,
          minScore: 0.5, // Adjust based on your needs (0.0 = bot, 1.0 = human)
        });

        if (!recaptchaResult.success) {
          console.warn('reCAPTCHA verification failed for submission from:', email);
          return NextResponse.json(
            { message: 'reCAPTCHA verification failed' },
            { status: 400 }
          );
        }

        // Log reCAPTCHA score for monitoring (optional)
        console.log('Contact form submission - reCAPTCHA score:', recaptchaResult.score);
      } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        // Don't block submission if reCAPTCHA verification fails unexpectedly
        // This prevents legitimate submissions from being blocked due to service issues
        console.warn('Allowing submission despite reCAPTCHA error - service may be temporarily unavailable');
      }
    } else {
      // Localhost: skip reCAPTCHA verification
      console.log('Contact form submission on localhost - skipping reCAPTCHA verification');
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
