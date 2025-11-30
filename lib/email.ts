import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  // Get Resend configuration from environment variables
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  const emailTo = process.env.CONTACT_EMAIL_TO;
  const emailSubject = process.env.CONTACT_EMAIL_SUBJECT || 'New Contact Form Submission';

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Email config check:', {
      resendApiKey: resendApiKey ? '✓ Set' : '✗ Missing',
      emailFrom,
      emailTo: emailTo ? '✓ Set' : '✗ Missing',
      emailSubject,
    });
  }

  // Validate required environment variables
  if (!resendApiKey || !emailFrom || !emailTo) {
    const missing = [];
    if (!resendApiKey) missing.push('RESEND_API_KEY');
    if (!emailFrom) missing.push('EMAIL_FROM');
    if (!emailTo) missing.push('CONTACT_EMAIL_TO');
    throw new Error(`Email configuration is incomplete. Missing: ${missing.join(', ')}`);
  }

  // Initialize Resend
  const resend = new Resend(resendApiKey);

  // Format email body
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

  // Send email using Resend
  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      text: emailBody,
      replyTo: data.email, // Allow replying directly to the sender
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      throw new Error(`${result.error.message || 'Unknown error'}`);
    }

    console.log('Email sent successfully:', result.data?.id);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
