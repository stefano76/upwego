# Cloudflare Setup Guide

This guide will help you integrate Cloudflare with your Upwego Digital website to improve security, performance, and reliability.

## 🎯 What Cloudflare Provides

### Security Benefits
- **DDoS Protection**: Automatic protection against distributed denial-of-service attacks
- **Web Application Firewall (WAF)**: Blocks malicious requests and common attack patterns
- **Bot Management**: Identifies and mitigates bot traffic
- **SSL/TLS Encryption**: Free SSL certificates with automatic renewal
- **Rate Limiting**: Protects against brute force attacks
- **Security Headers**: Additional security headers and protections

### Performance Benefits
- **Global CDN**: Content delivered from 300+ data centers worldwide
- **Caching**: Static assets cached at the edge for faster delivery
- **HTTP/2 & HTTP/3**: Modern protocols for faster connections
- **Image Optimization**: Automatic image optimization (with paid plans)
- **Minification**: Automatic CSS/JS minification
- **Brotli Compression**: Advanced compression for smaller file sizes

### Additional Benefits
- **Analytics**: Detailed traffic and security analytics
- **Page Rules**: Custom caching and redirect rules
- **Workers**: Edge computing capabilities (advanced)

---

## 📋 Prerequisites

- Cloudflare account (free tier is sufficient for most needs)
- Domain registered and accessible
- Current hosting on Vercel (or other platform)
- Access to domain DNS settings

---

## 🚀 Step-by-Step Setup

### Step 1: Create Cloudflare Account

1. Go to [cloudflare.com](https://www.cloudflare.com)
2. Click **Sign Up** (free account is sufficient)
3. Enter your email and create a password
4. Verify your email address

### Step 2: Add Your Website to Cloudflare

1. Log in to Cloudflare dashboard
2. Click **Add a Site**
3. Enter your domain: `upwego.digital` (or `www.upwego.digital`)
4. Click **Add site**
5. Select the **Free** plan (or upgrade if needed)
6. Click **Continue**

### Step 3: Review DNS Records

Cloudflare will scan your existing DNS records. You'll see:

- **A Records**: Point to your hosting IP (Vercel)
- **CNAME Records**: Subdomains (like `www`)
- **MX Records**: Email (if applicable)
- **TXT Records**: Verification records

**Important**: 
- Keep all existing DNS records
- Cloudflare will show you what it found automatically
- You can add/edit records if needed

### Step 4: Update Nameservers

Cloudflare will provide you with two nameservers, for example:
- `lara.ns.cloudflare.com`
- `marc.ns.cloudflare.com`

**To activate Cloudflare:**

1. Copy the nameservers provided by Cloudflare
2. Go to your domain registrar (where you bought the domain)
3. Find the **Nameservers** or **DNS** settings
4. Replace existing nameservers with Cloudflare's nameservers
5. Save changes

**Note**: DNS propagation can take 24-48 hours, but usually happens within a few hours.

### Step 5: Wait for DNS Propagation

1. Cloudflare will show "Pending" status
2. Wait for DNS to propagate (check status in Cloudflare dashboard)
3. Once active, you'll see "Active" status

---

## ⚙️ Configuration

### SSL/TLS Settings

1. Go to **SSL/TLS** in Cloudflare dashboard
2. Set encryption mode to **Full (strict)**
   - This ensures end-to-end encryption between Cloudflare and Vercel
   - Requires valid SSL certificate on Vercel (which you already have)

**Settings:**
- **SSL/TLS encryption mode**: Full (strict)
- **Always Use HTTPS**: On
- **Minimum TLS Version**: TLS 1.2
- **Opportunistic Encryption**: On
- **TLS 1.3**: On
- **Automatic HTTPS Rewrites**: On

### Security Settings

#### 1. Security Level
- Go to **Security** → **Settings**
- Set **Security Level** to **Medium** (or **High** for stricter protection)
  - Medium: Challenges suspicious traffic
  - High: Challenges more traffic (may affect some legitimate users)

#### 2. Web Application Firewall (WAF)
- Go to **Security** → **WAF**
- Enable **WAF** (available on Free plan with basic rules)
- Review and enable recommended rules:
  - Cloudflare Managed Ruleset
  - OWASP Core Ruleset (if available on your plan)

#### 3. Bot Fight Mode
- Go to **Security** → **Bots**
- Enable **Bot Fight Mode** (free)
- This helps protect against automated attacks

#### 4. Rate Limiting (Optional - Paid Feature)
- If you have a paid plan, set up rate limiting for:
  - Contact form submissions
  - API endpoints
  - Login attempts (if applicable)

### Performance Settings

#### 1. Caching Configuration
- Go to **Caching** → **Configuration**
- Set **Caching Level** to **Standard**
- Set **Browser Cache TTL** to **Respect Existing Headers**
  - This allows Next.js/Vercel to control cache headers

#### 2. Auto Minify
- Go to **Speed** → **Optimization**
- Enable:
  - ✅ **JavaScript**
  - ✅ **CSS**
  - ✅ **HTML**

#### 3. Brotli Compression
- Go to **Speed** → **Optimization**
- Enable **Brotli** compression

#### 4. HTTP/2 & HTTP/3
- Go to **Network**
- Ensure **HTTP/2** is enabled (default)
- Enable **HTTP/3 (with QUIC)** if available

### Page Rules (Optional but Recommended)

Create page rules for better caching:

1. Go to **Rules** → **Page Rules**
2. Create rules:

**Rule 1: Cache Static Assets**
- URL Pattern: `*upwego.digital/_next/static/*`
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: Respect Existing Headers

**Rule 2: Cache Images**
- URL Pattern: `*upwego.digital/img/*`
- Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month

**Rule 3: Don't Cache API Routes**
- URL Pattern: `*upwego.digital/api/*`
- Settings:
  - Cache Level: Bypass

**Rule 4: Don't Cache HTML Pages**
- URL Pattern: `*upwego.digital/*`
- Settings:
  - Cache Level: Bypass
  - (This ensures dynamic Next.js pages aren't cached)

---

## 🔧 Code Updates Required

### Update Content Security Policy

Cloudflare may inject scripts and resources. Update your CSP in `next.config.ts`:

```typescript
// Add Cloudflare domains to CSP
"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://cdn-cookieyes.com https://static.cloudflareinsights.com",
"connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://log.cookieyes.com https://cdn-cookieyes.com https://cloudflareinsights.com",
```

### Verify Security Headers

Your existing security headers in `next.config.ts` are good, but ensure:
- HSTS header is compatible with Cloudflare
- CSP allows Cloudflare resources if needed
- X-Forwarded-For header is handled correctly (Cloudflare adds this)

---

## 🧪 Testing Checklist

After setup, verify everything works:

### DNS & SSL
- [ ] Domain resolves correctly
- [ ] SSL certificate is valid (green lock in browser)
- [ ] HTTPS redirects work
- [ ] Both `www.upwego.digital` and `upwego.digital` work

### Performance
- [ ] Website loads faster (check PageSpeed Insights)
- [ ] Static assets are cached (check Network tab)
- [ ] Images load from Cloudflare CDN
- [ ] Compression is working (check Response Headers)

### Security
- [ ] Security headers are present (check Security Headers tool)
- [ ] WAF is active (check Cloudflare dashboard)
- [ ] Bot protection is working
- [ ] DDoS protection is active

### Functionality
- [ ] All pages load correctly
- [ ] Contact form works
- [ ] API routes work correctly
- [ ] reCAPTCHA works (may need domain whitelist update)
- [ ] Google Analytics works
- [ ] CookieYes consent banner works

### reCAPTCHA Domain Update

**Important**: Update your reCAPTCHA configuration:

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Select your site
3. Add Cloudflare domain if needed (usually not required, but verify)
4. Test contact form submission

---

## 📊 Monitoring & Analytics

### Cloudflare Analytics

1. Go to **Analytics** → **Overview**
2. Monitor:
   - **Traffic**: Requests, bandwidth, page views
   - **Security**: Threats blocked, bot traffic
   - **Performance**: Cache hit ratio, response times
   - **Reliability**: Uptime, errors

### Set Up Alerts (Optional)

1. Go to **Notifications**
2. Configure alerts for:
   - High traffic spikes
   - Security threats
   - SSL certificate expiration
   - DNS changes

---

## 🔍 Troubleshooting

### Issue: Website Shows "Checking your browser before accessing..."

**Solution**: 
- This is Cloudflare's challenge page (usually for bots)
- If legitimate users see this:
  - Lower Security Level to "Medium" or "Low"
  - Check Bot Fight Mode settings
  - Add IP to whitelist if needed

### Issue: Contact Form Not Working

**Possible Causes**:
- Cloudflare blocking POST requests
- CSP headers blocking form submission
- reCAPTCHA domain not whitelisted

**Solution**:
- Check Cloudflare WAF logs
- Verify CSP allows form submissions
- Update reCAPTCHA domain whitelist
- Check browser console for errors

### Issue: API Routes Returning Errors

**Solution**:
- Ensure Page Rules don't cache API routes
- Check WAF isn't blocking legitimate requests
- Review Cloudflare Firewall Events
- Whitelist API endpoints if needed

### Issue: Images Not Loading

**Solution**:
- Check Page Rules for image caching
- Verify CSP allows images from Cloudflare
- Check image URLs in browser Network tab
- Ensure image optimization isn't breaking images

### Issue: Slow Performance

**Solution**:
- Check cache hit ratio (should be >80%)
- Verify caching rules are correct
- Check if too many Page Rules (limit is 3 on free plan)
- Review Cloudflare Analytics for bottlenecks

---

## 🎯 Best Practices

### Security
1. **Keep Security Level at Medium** unless experiencing attacks
2. **Review WAF logs regularly** to understand blocked traffic
3. **Enable Bot Fight Mode** for additional protection
4. **Set up rate limiting** for sensitive endpoints (if on paid plan)
5. **Monitor Security Events** in Cloudflare dashboard

### Performance
1. **Cache static assets aggressively** (images, CSS, JS)
2. **Don't cache dynamic content** (HTML pages, API routes)
3. **Use Page Rules wisely** (free plan has 3 rule limit)
4. **Monitor cache hit ratio** (aim for >80%)
5. **Enable all optimization features** (minify, Brotli, HTTP/3)

### Maintenance
1. **Review analytics weekly** to spot trends
2. **Check SSL certificate status** monthly
3. **Update DNS records** as needed
4. **Monitor uptime** and performance metrics
5. **Review security events** regularly

---

## 📚 Additional Resources

- [Cloudflare Learning Center](https://www.cloudflare.com/learning/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [Next.js with Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

---

## ✅ Post-Setup Checklist

After completing Cloudflare setup:

- [ ] DNS nameservers updated at registrar
- [ ] DNS propagation complete (status: Active)
- [ ] SSL/TLS set to Full (strict)
- [ ] Security Level configured
- [ ] WAF enabled
- [ ] Bot Fight Mode enabled
- [ ] Caching configured
- [ ] Page Rules created (if needed)
- [ ] CSP headers updated (if needed)
- [ ] reCAPTCHA domain verified
- [ ] All functionality tested
- [ ] Analytics monitoring set up
- [ ] Team notified of changes

---

## 🆘 Support

If you encounter issues:

1. Check Cloudflare dashboard for errors/warnings
2. Review Cloudflare Analytics for anomalies
3. Check browser console for client-side errors
4. Review server logs (Vercel) for backend errors
5. Consult Cloudflare Community forums
6. Contact Cloudflare support (if on paid plan)

---

**Last Updated**: [Date]
**Maintained By**: Upwego Digital Team

