# Pre-Launch Checklist

This checklist ensures everything is ready before making the Upwego Digital website public. Complete each section and check off items as you verify them.

---

## 🔧 Configuration & Settings

### SEO & Indexing
- [ ] Update `robots.txt` from `Disallow: /` to `Allow: /`
- [ ] Add sitemap reference to `robots.txt`: `Sitemap: https://www.upwego.digital/sitemap.xml`
- [ ] Update metadata robots in `app/layout.tsx`:
  - Change `index: false` to `index: true`
  - Change `follow: false` to `follow: true`
- [ ] Verify `sitemap.xml` is accessible at `/sitemap.xml`
- [ ] Test sitemap contains all pages (home, about, services, process, privacy)

### Environment Variables
- [ ] `NEXT_PUBLIC_SITE_URL` is set to `https://www.upwego.digital`
- [ ] `RESEND_API_KEY` is configured in production
- [ ] `EMAIL_FROM` is set and verified in Resend
- [ ] `EMAIL_FROM_NAME` is set (optional but recommended)
- [ ] `CONTACT_EMAIL_TO` is set to correct recipient email
- [ ] `CONTACT_EMAIL_SUBJECT` is set (optional, has default)
- [ ] All environment variables are set in production hosting platform (Vercel, etc.)

### Domain & SSL
- [ ] Domain is properly configured and pointing to hosting
- [ ] HTTPS/SSL certificate is active and valid
- [ ] All HTTP requests redirect to HTTPS
- [ ] Certificate is valid for `www.upwego.digital` and `upwego.digital` (if using both)

---

## 🧪 Functionality Testing

### Pages & Navigation
- [ ] Homepage loads correctly
- [ ] All sections on homepage are visible and functional
- [ ] About page loads and displays correctly
- [ ] Services page loads and displays correctly
- [ ] Process page loads and displays correctly
- [ ] Privacy page loads and displays correctly
- [ ] All navigation menu links work correctly
- [ ] Footer links work correctly
- [ ] 404 page displays correctly for non-existent routes

### Contact Form
- [ ] Contact form displays correctly
- [ ] Form validation works (required fields, email format)
- [ ] Form submission works successfully
- [ ] Email is received at `CONTACT_EMAIL_TO` address
- [ ] Email contains correct information (name, email, phone, message)
- [ ] Success message displays after submission
- [ ] Error handling works if email fails to send
- [ ] Contact modal opens and closes correctly
- [ ] Contact form works on all pages (homepage, footer CTA, etc.)

### Animations & Interactions
- [ ] Scroll animations trigger correctly
- [ ] Logo animations work on homepage
- [ ] Hover effects work on images (About page)
- [ ] Process step animations work correctly
- [ ] Mobile menu opens and closes correctly
- [ ] All interactive elements respond to clicks/taps

---

## 📱 Responsive Design

### Mobile Devices
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Text is readable and not cut off
- [ ] Buttons are easily tappable (min 44x44px)
- [ ] Images load and display correctly
- [ ] Navigation menu works on mobile
- [ ] Forms are usable on mobile
- [ ] No horizontal scrolling

### Tablets
- [ ] Test on iPad (Safari)
- [ ] Test on Android tablet
- [ ] Layout adapts correctly
- [ ] Touch interactions work

### Desktop
- [ ] Test on Chrome/Edge
- [ ] Test on Firefox
- [ ] Test on Safari (Mac)
- [ ] Layout looks correct at various screen sizes
- [ ] Hover effects work correctly

---

## 🔒 Security

### Headers & Security
- [ ] Security headers are present (check with browser DevTools)
- [ ] Content-Security-Policy header is set
- [ ] Strict-Transport-Security (HSTS) header is present
- [ ] X-Frame-Options header is set
- [ ] X-Content-Type-Options header is set
- [ ] Test security headers with [securityheaders.com](https://securityheaders.com)

### Form Security
- [ ] Contact form has CSRF protection (Next.js default)
- [ ] No sensitive data exposed in client-side code
- [ ] API routes validate input properly

### Environment Variables
- [ ] No API keys or secrets exposed in client-side code
- [ ] `.env.local` is in `.gitignore` (not committed)
- [ ] Production environment variables are set securely

---

## ⚡ Performance

### Page Speed
- [ ] Homepage loads in < 3 seconds on 3G connection
- [ ] All pages load quickly
- [ ] Images are optimized and load efficiently
- [ ] No large JavaScript bundles blocking render
- [ ] Fonts load quickly

### Testing Tools
- [ ] Run Lighthouse audit (target: 90+ score)
  - [ ] Performance: 90+
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+
- [ ] Test with [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Check bundle size (should be reasonable)

### Optimization
- [ ] Images use Next.js Image component where appropriate
- [ ] Unused CSS is removed
- [ ] JavaScript is minified in production
- [ ] Static assets are cached properly

---

## ♿ Accessibility

### Basic Checks
- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Screen reader testing (if possible)

### Tools
- [ ] Run [WAVE](https://wave.webaim.org/) accessibility audit
- [ ] Check with browser accessibility tools
- [ ] Test keyboard-only navigation

---

## 🔍 SEO

### Metadata
- [ ] Each page has unique title tag
- [ ] Each page has unique meta description
- [ ] Open Graph tags are present and correct
- [ ] Twitter Card tags are present and correct
- [ ] OG image is set and accessible

### Content
- [ ] All pages have proper heading hierarchy (h1, h2, etc.)
- [ ] URLs are clean and descriptive
- [ ] Internal links are working
- [ ] Content is readable and well-structured

### Technical SEO
- [ ] Sitemap.xml is valid and accessible
- [ ] Robots.txt is configured correctly
- [ ] Canonical URLs are set (if needed)
- [ ] Structured data (JSON-LD) added (optional but recommended)

---

## 📧 Email & Notifications

### Contact Form Email
- [ ] Test email delivery from contact form
- [ ] Email format is correct and readable
- [ ] Reply-to address is set correctly
- [ ] Email subject line is correct
- [ ] Email arrives in inbox (not spam)

### Email Service
- [ ] Resend account is active
- [ ] Sender email (`EMAIL_FROM`) is verified in Resend
- [ ] Email sending limits are acceptable
- [ ] Error handling works if email service fails

---

## 🌐 Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Check for console errors in each browser

### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome Mobile
- [ ] Samsung Internet (if targeting)

### Browser Features
- [ ] JavaScript disabled (should show basic content)
- [ ] Cookies disabled (should still function)
- [ ] Ad blockers enabled (should not break site)

---

## 📄 Content Review

### Text Content
- [ ] All text is proofread for typos
- [ ] Contact information is correct
- [ ] Company information is accurate
- [ ] Privacy policy is complete and accurate
- [ ] All links in content work correctly

### Images & Media
- [ ] All images load correctly
- [ ] Images are optimized (not too large)
- [ ] Alt text is descriptive and accurate
- [ ] No broken image links

### Legal
- [ ] Privacy policy is complete
- [ ] Terms of use (if applicable)
- [ ] Cookie consent (if required by jurisdiction)

---

## 🚀 Deployment

### Pre-Deployment
- [ ] Code is committed to version control
- [ ] All tests pass (if automated tests exist)
- [ ] Build completes without errors (`npm run build`)
- [ ] Production build starts successfully (`npm start`)

### Deployment Platform (Vercel)
- [ ] Repository is connected
- [ ] Production branch is set correctly
- [ ] Environment variables are configured
- [ ] Custom domain is connected
- [ ] SSL certificate is active
- [ ] Deployment succeeds without errors

### Post-Deployment
- [ ] Site is accessible via production URL
- [ ] HTTPS redirects work correctly
- [ ] All pages load correctly
- [ ] Contact form works in production
- [ ] No console errors in production
- [ ] Performance is acceptable

---

## 📊 Monitoring & Analytics

### Analytics (Optional but Recommended)
- [ ] Analytics tool is set up (Google Analytics, Plausible, etc.)
- [ ] Tracking code is added to site
- [ ] Analytics is working correctly
- [ ] Goals/conversions are configured (form submissions)

### Monitoring
- [ ] Error monitoring set up (Sentry, etc.) - optional
- [ ] Uptime monitoring configured - optional
- [ ] Email notifications for errors - optional

---

## ✅ Final Checks

### Documentation
- [ ] README.md is up to date
- [ ] DEVELOPER_GUIDE.md is current
- [ ] Environment variables are documented

### Backup & Recovery
- [ ] Code is backed up (Git repository)
- [ ] Content files are backed up
- [ ] Database backup (if applicable)
- [ ] Recovery plan is documented

### Team Communication
- [ ] Team is notified of launch
- [ ] Support contacts are ready
- [ ] Launch date/time is communicated

---

## 🎯 Launch Day

### Final Verification (1 hour before launch)
- [ ] Run through critical paths one more time
- [ ] Check all environment variables are set
- [ ] Verify domain DNS is correct
- [ ] Test contact form one final time
- [ ] Check site loads correctly

### Post-Launch (First 24 hours)
- [ ] Monitor site uptime
- [ ] Check for error logs
- [ ] Monitor contact form submissions
- [ ] Check analytics for traffic
- [ ] Respond to any issues quickly

---

## 📝 Notes

Use this section to document any issues found during testing or special considerations:

```
Date: ___________
Tester: ___________

Issues Found:
- 
- 
- 

Special Notes:
- 
- 
```

---

## ✅ Sign-Off

- [ ] **Technical Review**: All technical items completed
- [ ] **Content Review**: All content items verified
- [ ] **Design Review**: All design items checked
- [ ] **Final Approval**: Ready for launch

**Approved by**: _________________  
**Date**: _________________  
**Time**: _________________

---

**Remember**: It's better to delay launch and fix issues than to launch with problems. Take your time and be thorough!

For questions or issues, refer to:
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
- [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- [README.md](./README.md)
