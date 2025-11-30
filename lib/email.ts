/**
 * EMAIL SERVICE
 * 
 * Handles sending emails via Resend API.
 * Used primarily for contact form submissions.
 */

import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/**
 * Sends a contact form submission email via Resend
 * 
 * This function is called by the /api/contact POST endpoint when a user
 * submits the contact form. It sends an email notification to the site owner.
 * 
 * SETUP REQUIRED:
 * Add these environment variables to .env.local:
 * - RESEND_API_KEY: Your Resend API key (get from resend.com)
 * - EMAIL_FROM: Sender email address (must be verified in Resend)
 * - CONTACT_EMAIL_TO: Recipient email address (where notifications go)
 * - CONTACT_EMAIL_SUBJECT: Email subject line (optional, has default)
 * 
 * @param data - Contact form data (name, email, phone, message)
 * @throws Error if email configuration is missing or sending fails
 * 
 * EMAIL FORMAT:
 * The email includes:
 * - Sender's name, email, phone (if provided)
 * - Message content
 * - Timestamp
 * - Reply-to is set to sender's email for easy replies
 */
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  // Get Resend configuration from environment variables
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const emailTo = process.env.CONTACT_EMAIL_TO;
  const emailSubject = process.env.CONTACT_EMAIL_SUBJECT || 'New Contact Form Submission';

  // Debug logging (only in development)
  // Helps troubleshoot missing environment variables
  if (process.env.NODE_ENV === 'development') {
    console.log('Email config check:', {
      resendApiKey: resendApiKey ? '✓ Set' : '✗ Missing',
      emailFrom,
      emailTo: emailTo ? '✓ Set' : '✗ Missing',
      emailSubject,
    });
  }

  // Validate required environment variables before attempting to send
  if (!resendApiKey || !emailFrom || !emailTo) {
    const missing = [];
    if (!resendApiKey) missing.push('RESEND_API_KEY');
    if (!emailFrom) missing.push('EMAIL_FROM');
    if (!emailTo) missing.push('CONTACT_EMAIL_TO');
    throw new Error(`Email configuration is incomplete. Missing: ${missing.join(', ')}`);
  }

  // Initialize Resend client with API key
  const resend = new Resend(resendApiKey);

  // Format email body as plain text
  // This is a simple text email - can be enhanced with HTML if needed
  const emailBody = `
New contact form submission:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Message:
${data.message}

---
Submitted at: ${new Date().toISOString()}
  `.trim();

  // Send email using Resend API
  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      text: emailBody,
      replyTo: data.email, // Allow replying directly to the sender
    });

    // Check for API errors
    if (result.error) {
      console.error('Resend API error:', result.error);
      throw new Error(`${result.error.message || 'Unknown error'}`);
    }

    // Log success (includes Resend email ID for tracking)
    console.log('Email sent successfully:', result.data?.id);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
