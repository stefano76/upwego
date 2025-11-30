# Testing Guide - Upwego Website

## Overview

This guide covers testing best practices for the Upwego website. Testing ensures your site works correctly, provides a good user experience, and catches bugs before they reach production.

---

## Types of Testing

### 1. **Manual Testing** (Start Here)
Quick, visual checks you can do yourself before deploying.

### 2. **Automated Testing** (Recommended for Long-term)
Tests that run automatically to catch regressions.

---

## Manual Testing Checklist

### ✅ Pre-Deployment Checklist

#### **Critical Paths** (Test Every Deployment)
- [ ] **Homepage loads** - All sections visible, animations work
- [ ] **Navigation** - All menu links work, footer links work
- [ ] **Contact Form** - Submit form, verify email received
- [ ] **All Pages Load** - Home, About, Services, Process, Privacy
- [ ] **Mobile Responsive** - Test on phone/tablet, check all breakpoints
- [ ] **Password Protection** - Works on protected pages

#### **Functionality Tests**
- [ ] **Form Validation** - Try submitting empty form, invalid email
- [ ] **404 Page** - Navigate to non-existent URL
- [ ] **Scroll Animations** - Scroll through pages, verify animations trigger
- [ ] **Modal/Contact Form** - Opens, closes, submits correctly
- [ ] **API Routes** - All API endpoints return data (check Network tab)

#### **Cross-Browser Testing**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

#### **Performance Checks**
- [ ] Page loads quickly (< 3 seconds)
- [ ] Images load properly
- [ ] No console errors
- [ ] No broken links

---

## Automated Testing Setup

### Recommended Testing Stack

1. **Unit Tests** - Jest + React Testing Library
   - Test utilities, components, API routes
   
2. **E2E Tests** - Playwright
   - Test complete user flows (form submission, navigation)

3. **Visual Regression** - Playwright (optional)
   - Catch visual bugs automatically

---

## What to Test

### High Priority (Critical Features)

1. **Contact Form**
   - Form validation works
   - Submission sends email
   - Error handling works
   - Success message displays

2. **API Routes**
   - All routes return correct data
   - Error handling works
   - Content loads from markdown files

3. **Navigation**
   - All links work
   - Menu opens/closes
   - Footer links work

### Medium Priority

4. **Content Loading**
   - Pages load content from API
   - Markdown renders correctly
   - Images display properly

5. **Responsive Design**
   - Mobile layout works
   - Tablet layout works
   - Desktop layout works

### Low Priority

6. **Animations**
   - Scroll animations trigger
   - No animation bugs
   - Performance is good

---

## Testing Workflow

### Before Every Deployment

1. **Run Manual Checklist** (5-10 minutes)
   - Test critical paths
   - Check mobile view
   - Submit contact form

2. **Run Automated Tests** (if set up)
   ```bash
   npm test          # Unit tests
   npm run test:e2e  # E2E tests
   ```

3. **Check Browser Console**
   - Open DevTools → Console
   - Look for errors/warnings

4. **Test on Staging/Preview**
   - Use Vercel preview deployments
   - Test before merging to main

### Weekly Testing

- Full manual checklist
- Test on multiple browsers
- Check analytics for errors
- Review user feedback

---

## Quick Test Scenarios

### Scenario 1: Contact Form Submission
```
1. Navigate to homepage
2. Click "Contact" or open contact modal
3. Fill out form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Message: "This is a test"
4. Submit form
5. Verify success message appears
6. Check email inbox for notification
```

### Scenario 2: Navigation Flow
```
1. Start on homepage
2. Click each menu item (About, Services, Process)
3. Verify page loads correctly
4. Click logo to return home
5. Test footer links
```

### Scenario 3: Mobile Experience
```
1. Open site on mobile device (or DevTools mobile view)
2. Test navigation menu
3. Scroll through pages
4. Submit contact form
5. Verify everything is readable and usable
```

---

## Testing Tools & Resources

### Browser DevTools
- **Chrome DevTools** - Network, Console, Performance
- **Lighthouse** - Performance, SEO, Accessibility audits

### Online Tools
- **BrowserStack** - Cross-browser testing (free tier available)
- **PageSpeed Insights** - Performance testing
- **WAVE** - Accessibility testing

### Manual Testing Tips
- Use **Incognito/Private mode** to avoid cache issues
- Test with **slow 3G** network throttling
- Test with **JavaScript disabled** (should show basic content)
- Test with **ad blockers** enabled

---

## Setting Up Automated Tests

See `TESTING_SETUP.md` for detailed instructions on setting up Jest and Playwright.

---

## Common Issues to Watch For

1. **Environment Variables** - Missing env vars break email functionality
2. **API Routes** - Content not loading from markdown files
3. **Form Validation** - Invalid data getting through
4. **Mobile Layout** - Text overflow, buttons too small
5. **Image Loading** - Broken images, slow loading
6. **Console Errors** - JavaScript errors breaking functionality

---

## Reporting Bugs

When you find a bug:

1. **Document it**
   - What page/feature
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/device info
   - Screenshots if visual bug

2. **Priority**
   - **Critical**: Site broken, form not working
   - **High**: Major feature broken
   - **Medium**: Minor issue, workaround exists
   - **Low**: Cosmetic issue

---

## Next Steps

1. ✅ Start with manual testing checklist
2. ⏭️ Set up automated tests (see `TESTING_SETUP.md`)
3. ⏭️ Add tests to CI/CD pipeline
4. ⏭️ Set up error monitoring (Sentry, etc.)

---

**Remember**: Testing is an investment. Good tests save time by catching bugs early!
