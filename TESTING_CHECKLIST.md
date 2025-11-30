# Quick Testing Checklist

Use this checklist before every deployment to production.

## 🚀 Pre-Deployment Checklist

### Critical Paths (Must Test)
- [ ] **Homepage loads** - All sections visible
- [ ] **Contact form works** - Submit test message, verify email received
- [ ] **Navigation works** - All menu links functional
- [ ] **All pages load** - Home, About, Services, Process, Privacy
- [ ] **Mobile responsive** - Test on phone or DevTools mobile view
- [ ] **No console errors** - Open DevTools → Console, check for red errors

### Quick Functionality Tests
- [ ] **Form validation** - Try submitting empty form (should show errors)
- [ ] **Invalid email** - Try submitting form with "invalid-email" (should show error)
- [ ] **404 page** - Navigate to `/this-does-not-exist` (should show 404 page)
- [ ] **Footer links** - Click footer links, verify they work
- [ ] **Contact modal** - Opens and closes correctly

### Cross-Browser (Pick 2-3)
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (Mac only)
- [ ] Mobile browser

### Performance Quick Check
- [ ] Page loads in < 3 seconds
- [ ] Images load properly
- [ ] No broken images

---

## 📱 Mobile Testing Quick Guide

1. Open Chrome DevTools (F12)
2. Click device toggle icon (or Ctrl+Shift+M)
3. Select "iPhone 12" or "Pixel 5"
4. Test:
   - Navigation menu
   - Contact form
   - Scrolling through pages
   - All buttons/links work

---

## 🐛 Common Issues to Check

- [ ] Contact form not sending emails → Check environment variables
- [ ] Content not loading → Check API routes in Network tab
- [ ] Layout broken on mobile → Check responsive CSS
- [ ] Console errors → Fix JavaScript errors

---

## ⚡ Quick Test Scenarios

### Test 1: Contact Form (2 minutes)
```
1. Go to homepage
2. Click "Contact" 
3. Fill: Name, Email, Message
4. Submit
5. ✅ Success message appears
6. ✅ Email received in inbox
```

### Test 2: Navigation (1 minute)
```
1. Click each menu item
2. Verify page loads
3. Click logo → back to home
```

### Test 3: Mobile (2 minutes)
```
1. Open DevTools mobile view
2. Test navigation menu
3. Submit contact form
4. Verify everything readable
```

---

**Time Required**: ~5-10 minutes for full checklist

**When to Run**: Before every production deployment
