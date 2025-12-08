# Upwego Digital Website

A modern, responsive website for Upwego Digital built with Next.js 15, featuring a markdown-based content management system, contact form functionality, and scroll-based animations.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 12.23
- **Content**: Markdown files with frontmatter
- **Email**: Resend API
- **Security**: Google reCAPTCHA v3 (bot detection)
- **Fonts**: Inter (Google Fonts)

## 📋 Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Git
- Resend account (for contact form emails)
- Google reCAPTCHA v3 account (for bot protection)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd upwego
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://www.upwego.digital
   
   # Email Configuration (Resend API)
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_FROM_NAME=Upwego Digital
   CONTACT_EMAIL_TO=contact@yourdomain.com
   CONTACT_EMAIL_SUBJECT=New Contact Form Submission
   
   # reCAPTCHA v3 (Bot Protection)
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   NEXT_PUBLIC_RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
   
   # Google Analytics (Optional)
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   
   # Password Protection (Optional - currently disabled)
   NEXT_PUBLIC_UPWEGO_PASSWORD=your_password
   ```
   
   **Required variables:**
   - `RESEND_API_KEY` - Get from [resend.com](https://resend.com)
   - `EMAIL_FROM` - Must be verified in Resend
   - `CONTACT_EMAIL_TO` - Where contact form submissions are sent
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Get from [Google reCAPTCHA Console](https://www.google.com/recaptcha/admin) (must have `NEXT_PUBLIC_` prefix)
   - `NEXT_PUBLIC_RECAPTCHA_SECRET_KEY` - Get from [Google reCAPTCHA Console](https://www.google.com/recaptcha/admin) (must have `NEXT_PUBLIC_` prefix)
   
   **Optional variables:**
   - `NEXT_PUBLIC_GA_ID` - Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX). Get from [Google Analytics](https://analytics.google.com/)
   
   **reCAPTCHA Setup**: See [RECAPTCHA_SETUP.md](./RECAPTCHA_SETUP.md) for detailed instructions.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
upwego/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── about/         # About page content API
│   │   ├── contact/       # Contact form handler
│   │   ├── home/          # Home page content API
│   │   ├── process/       # Process page content API
│   │   ├── services/      # Services page content API
│   │   └── ...
│   ├── components/        # React components
│   │   ├── ContactForm/   # Contact form component
│   │   ├── ContactSection/
│   │   ├── Button/
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # CSS files
│   ├── about/            # About page
│   ├── process/          # Process page
│   ├── services/         # Services page
│   ├── privacy/          # Privacy policy page
│   ├── page.tsx          # Home page
│   ├── layout.tsx        # Root layout
│   ├── not-found.tsx     # 404 page
│   └── sitemap.ts        # Dynamic sitemap
├── content/              # Content files (markdown)
│   ├── pages/           # Page definitions
│   ├── sections/        # Section definitions
│   └── blocks/          # Content blocks
├── lib/                 # Library functions
│   ├── content.ts       # Content loader
│   ├── email.ts         # Email service
│   ├── metadata.ts      # SEO metadata
│   └── menu.ts          # Menu items
├── public/              # Static files
│   ├── img/            # Images
│   └── robots.txt      # Robots configuration
└── config/             # Configuration files
    └── animations.js   # Animation definitions
```

## 🎯 Key Features

- **Markdown-based CMS**: Content managed through markdown files with frontmatter
- **Dynamic Routing**: File-based routing with Next.js App Router
- **Contact Form**: Email submissions via Resend API
- **Scroll Animations**: Custom hooks for scroll-based animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Dynamic metadata, Open Graph tags, sitemap generation
- **Security Headers**: Comprehensive security headers configured
- **TypeScript**: Full type safety throughout the codebase

## 🧑‍💻 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Content Management

Content is managed through markdown files in the `/content` directory:
- **Pages**: Define page structure (`content/pages/`)
- **Sections**: Define sections within pages (`content/sections/`)
- **Blocks**: Define content blocks (`content/blocks/`)

See `DEVELOPER_GUIDE.md` for detailed content management instructions.

## 🏗️ Building for Production

```bash
npm run build
npm start
```

The build process will:
- Optimize all assets
- Generate static pages where possible
- Create production-ready bundles
- Generate sitemap.xml

## 🚢 Deployment

### Recommended: Vercel

1. Push code to GitHub/GitLab
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Alternative: Any Node.js Hosting

1. Build the project: `npm run build`
2. Start the server: `npm start`
3. Ensure Node.js 18+ is available
4. Set all required environment variables

### Pre-Launch Checklist

Before making the site public:

- [ ] Update `robots.txt` to `Allow: /` (currently `Disallow: /`)
- [ ] Update metadata robots in `app/layout.tsx` to `index: true, follow: true`
- [ ] Verify all environment variables are set in production
- [ ] Test contact form submission
- [ ] Verify HTTPS is configured (required for HSTS header)
- [ ] Test all pages and navigation
- [ ] Run accessibility audit
- [ ] Test on multiple devices/browsers

## 📚 Documentation

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Comprehensive development guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing best practices
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Manual testing checklist
- **[TESTING_SETUP.md](./TESTING_SETUP.md)** - Automated testing setup
- **[CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md)** - Cloudflare integration guide for security and performance

## 🔒 Security

The project includes comprehensive security headers:
- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- And more...

See `next.config.ts` for full configuration.

**Cloudflare Integration**: For enhanced security, DDoS protection, and performance improvements, see [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) for setup instructions.

## 🐛 Troubleshooting

### Contact Form Not Working

- Verify `RESEND_API_KEY` is set correctly
- Ensure `EMAIL_FROM` is verified in Resend
- Check `CONTACT_EMAIL_TO` is correct
- Check browser console and server logs for errors

### Content Not Loading

- Verify markdown files exist in `/content` directory
- Check API routes are accessible (`/api/home`, `/api/about`, etc.)
- Check browser Network tab for failed requests

### Build Errors

- Ensure Node.js 18+ is installed
- Delete `node_modules` and `.next` folders, then `npm install`
- Check TypeScript errors: `npm run lint`

## 📝 License

Private project - All rights reserved

## 👥 Contributors

- Stefano Bonuccelli
- Nadja Salewski

---

For detailed development information, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).
