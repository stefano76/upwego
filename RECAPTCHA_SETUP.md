# reCAPTCHA v3 Setup Guide

This guide explains how to set up Google reCAPTCHA v3 for the contact form on the Upwego website.

## What is reCAPTCHA v3?

reCAPTCHA v3 is a bot detection service that runs invisibly in the background. Unlike reCAPTCHA v2 (the checkbox), v3 doesn't interrupt the user experience - it analyzes user behavior and provides a score:

- **1.0**: Very likely a human
- **0.5**: Uncertain
- **0.0**: Very likely a bot

## Setup Steps

### Step 1: Create a reCAPTCHA v3 Project

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account (or create one)
3. Click the **+** button to create a new site
4. Fill in the form:
   - **Label**: "Upwego Website" (or any name)
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**: Add your domain(s):
     - `localhost` (for local development)
     - `www.upwego.digital` (for production)
     - `upwego.digital` (if using root domain)
5. Accept the reCAPTCHA Terms of Service
6. Click **Submit**

### Step 2: Get Your Keys

After creating the site, you'll see:
- **Site Key** (public - used in frontend)
- **Secret Key** (private - used in backend)

Keep these safe!

### Step 3: Configure Environment Variables

#### Local Development (.env.local)

```env
# reCAPTCHA v3 Keys
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**Important**: 
- Both keys must start with `NEXT_PUBLIC_` prefix for Next.js client-side access
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is exposed to the browser (this is normal and safe for reCAPTCHA)
- `RECAPTCHA_SECRET_KEY` is also exposed to the browser (required for Next.js)

#### Production (Vercel or Other Hosting)

1. Go to your hosting dashboard (e.g., Vercel)
2. Add the following environment variables:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key`
   - `RECAPTCHA_SECRET_KEY=your_secret_key`

**Vercel Specific**: Go to Project Settings → Environment Variables

### Step 4: Restart Development Server

After adding environment variables, restart your Next.js server:

```bash
npm run dev
```

## How It Works

### User Flow

1. User fills out the contact form
2. Clicks "Send Message"
3. Form validates input (name, email, message)
4. Form requests a reCAPTCHA token from Google
5. Google analyzes the user's behavior and provides a score
6. Token is sent to your backend along with form data
7. Backend verifies the token with Google
8. If score is above threshold (default 0.5), email is sent
9. If score is too low, submission is rejected

### Code Flow

**Frontend** (`app/components/ContactForm/index.tsx`):
```typescript
const { executeRecaptcha } = useGoogleReCaptcha();
const recaptchaToken = await executeRecaptcha('contact_form_submit');
// Send token with form data to API
```

**Backend** (`app/api/contact/route.ts`):
```typescript
const recaptchaResult = await verifyRecaptchaToken({
  token: recaptchaToken,
  minScore: 0.5, // Adjust if needed
});
// Verify token and send email
```

**Verification Service** (`lib/recaptcha.ts`):
```typescript
// Sends token to Google for verification
// Returns success status and score
```

## Adjusting Sensitivity

The default minimum score is **0.5**. You can adjust this in `app/api/contact/route.ts`:

```typescript
const recaptchaResult = await verifyRecaptchaToken({
  token: recaptchaToken,
  minScore: 0.7, // Higher = stricter (rejects more bots but may reject humans)
});
```

**Recommended scores**:
- **0.9**: Very strict (may reject legitimate users with unusual behavior)
- **0.7**: Moderately strict (good balance for most sites)
- **0.5**: Default (allows some suspicious activity)
- **0.1**: Very lenient (mostly for analytics, doesn't block much)

## Monitoring & Debugging

### View reCAPTCHA Analytics

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Select your site
3. View analytics for:
   - Requests over time
   - Average score
   - Bot/human breakdown

### Check Server Logs

The verification service logs details:
```
reCAPTCHA verification result: {
  success: true,
  score: 0.8,
  action: "contact_form_submit",
  hostname: "www.upwego.digital"
}
```

### Test Without reCAPTCHA

If `RECAPTCHA_SECRET_KEY` is not set, the system:
- Logs a warning
- Allows submissions to proceed
- Returns a default score of 0.9

This allows testing without fully setting up reCAPTCHA.

## Troubleshooting

### reCAPTCHA Not Loading

**Error**: "reCAPTCHA key is not configured"

**Solution**: 
- Check that `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in `.env.local`
- Restart development server
- Check browser console for errors

### Submissions Being Blocked

**Possible causes**:
1. Score too low - legitimate users with suspicious behavior
2. Bot activity detected
3. reCAPTCHA not verifying correctly

**Solutions**:
- Lower the `minScore` in `app/api/contact/route.ts`
- Check reCAPTCHA analytics for patterns
- Verify `RECAPTCHA_SECRET_KEY` is correct

### Score Always 0.0 or 1.0

**Cause**: May indicate incorrect token verification

**Solution**:
- Check that `RECAPTCHA_SECRET_KEY` is correct
- Verify domain is added to reCAPTCHA console
- Check server logs for verification errors

### Mixed Domain Issues

If you use both `upwego.digital` and `www.upwego.digital`:

1. Add both domains to reCAPTCHA console
2. Or set up a redirect to use only one domain

## Security Notes

### Site Key (NEXT_PUBLIC_RECAPTCHA_SITE_KEY)

- **Safe to expose**: This is intended to be public
- Must start with `NEXT_PUBLIC_` prefix for Next.js client-side access
- Used by browser to request tokens
- Cannot be used to verify tokens (needs secret key)
- Anyone can see it in your HTML/CSS

### Secret Key (RECAPTCHA_SECRET_KEY)

- **Must have NEXT_PUBLIC_ prefix**: Required for Next.js client-side access
- Used to verify tokens with Google
- Should not be committed to git
- Note: This key will be exposed to the browser (required by Next.js architecture)

### Production Checklist

- [ ] Both keys are set in production environment
- [ ] Secret key is NOT in `.env.local` on production
- [ ] Both production domain(s) are added to reCAPTCHA console
- [ ] Test contact form works end-to-end
- [ ] Check reCAPTCHA analytics show activity

## Additional Resources

- [Google reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [react-google-recaptcha-v3 Package](https://www.npmjs.com/package/react-google-recaptcha-v3)

## Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting) above
2. Review server logs in `npm run dev` output
3. Check browser DevTools Network tab for failed requests
4. Verify Google reCAPTCHA admin console has correct settings

---

Last Updated: December 5, 2025
