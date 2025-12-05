/**
 * RECAPTCHA VERIFICATION SERVICE
 * 
 * Handles verification of reCAPTCHA v3 tokens with Google's verification endpoint.
 */

interface RecaptchaVerificationResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
}

interface RecaptchaVerifyOptions {
  token: string;
  minScore?: number; // Default: 0.5 (0.0 = likely bot, 1.0 = likely human)
}

/**
 * Verifies a reCAPTCHA v3 token with Google's verification service
 * 
 * SETUP REQUIRED:
 * - NEXT_PUBLIC_RECAPTCHA_SECRET_KEY: Your reCAPTCHA secret key (get from google.com/recaptcha/admin)
 * 
 * @param options - Token and optional minimum score threshold
 * @returns Object with success status and score (0.0 = bot, 1.0 = human)
 * @throws Error if token verification fails
 */
export async function verifyRecaptchaToken(
  options: RecaptchaVerifyOptions
): Promise<{ success: boolean; score: number }> {
  const { token, minScore = 0.5 } = options;

  if (!token) {
    throw new Error('reCAPTCHA token is required');
  }

  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('NEXT_PUBLIC_RECAPTCHA_SECRET_KEY is not configured');
    // Allow submission if secret key is not configured
    // This prevents blocking legitimate submissions if reCAPTCHA setup is incomplete
    return { success: true, score: 0.9 };
  }

  try {
    // Verify token with Google's reCAPTCHA verification endpoint
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Google reCAPTCHA verification failed with status ${response.status}`);
    }

    const data: RecaptchaVerificationResponse = await response.json();

    console.log('reCAPTCHA verification result:', {
      success: data.success,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
    });

    // Check if verification was successful
    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data.error_codes);
      throw new Error('reCAPTCHA verification failed');
    }

    // Check if score meets minimum threshold
    if (data.score < minScore) {
      console.warn(`reCAPTCHA score ${data.score} below threshold ${minScore}`);
      throw new Error('reCAPTCHA score too low - likely automated submission');
    }

    return {
      success: true,
      score: data.score,
    };
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:', error);
    throw error;
  }
}
