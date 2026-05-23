# Developer Guide - Upwego Website

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Content Management System](#content-management-system)
4. [Pages](#pages)
5. [API Routes](#api-routes)
6. [Components](#components)
7. [Utilities](#utilities)
8. [Design Decisions](#design-decisions)
9. [Future Improvements](#future-improvements)
10. [Setup Instructions](#setup-instructions)
11. [File Structure](#file-structure)

---

## Overview

This is a Next.js website built with React and TypeScript. The site uses a markdown-based content management system, allowing non-developers to update content without touching code.

**Key Technologies:**

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **Content:** Markdown files with frontmatter
- **Email:** Resend API
- **Deployment:** Vercel

---

## Architecture

### High-Level Flow

```
User Request → Next.js Page Component → API Route → Content Loader → Markdown Files → JSON Response → Component Rendering
```

### Key Concepts

1. **Pages** (`app/*/page.tsx`): React components that render the actual pages
2. **API Routes** (`app/api/*/route.ts`): Server endpoints that load content from markdown files
3. **Content Files** (`content/`): Markdown files organized by pages → sections → blocks
4. **Components** (`app/components/`): Reusable React components
5. **Utilities** (`app/utils/`): Helper functions for text rendering, visibility detection, etc.

---

## Content Management System

### How It Works

The website uses a **three-tier content structure**:

```
content/
├── pages/          # Page definitions (which sections belong to each page)
├── sections/       # Section definitions (which blocks belong to each section)
└── blocks/         # Actual content (text, images, CTAs, etc.)
```

### Example Flow

1. **Page File** (`content/pages/about.md`):

   ```yaml
   ---
   title: "About Us"
   slug: "/about"
   sections:
     - about-intro
     - about-owners
     - about-values
   ---
   ```

2. **Section File** (`content/sections/about-intro.md`):

   ```yaml
   ---
   title: "Introduction"
   blocks:
     - about-intro-text
   ---
   ```

3. **Block File** (`content/blocks/about-intro-text.md`):
   ```yaml
   ---
   title: "Welcome"
   text: "We are a digital agency..."
   ---
   ```

### Loading Content

**Function:** `lib/content.ts` → `getAllBlocksData(pageName)`

**Process:**

1. Reads `content/pages/{pageName}.md` to get section list
2. For each section, reads `content/sections/{sectionId}.md` to get block list
3. For each block, reads `content/blocks/{blockId}.md` to get content
4. Returns nested JSON structure

**Usage in Pages:**

```typescript
// In app/about/page.tsx
useEffect(() => {
  const response = await fetch("/api/about");
  const blocks = await response.json();
  setBlocks(blocks);
}, []);
```

**Why This Approach?**

- ✅ Non-developers can edit content without touching code
- ✅ Content is version-controlled (git)
- ✅ Easy to add new pages/sections/blocks
- ✅ Content changes don't require code deployment
- ✅ Supports markdown formatting

---

## Pages

### Home Page (`app/page.tsx`)

**Purpose:** Main landing page with multiple sections and animations.

**Sections:**

1. **Intro** - Hero section with tagline and animated logo strips
2. **About** - Company logo and description
3. **Challenge** - Two challenge cards (web/data) with complex animations
4. **Services** - Service cards with scroll-triggered animations
5. **Process** - Process overview with slide-down animation
6. **Contact** - Call-to-action section

**Data Sources:**

- `/api/home` - Page content blocks
- `/api/tagline` - Main tagline text
- `/api/generic-texts` - Reusable text strings

**Key Features:**

- Multiple animation hooks for scroll-based effects
- `ScrollDisabler` prevents scrolling until animations complete
- Responsive design with mobile/desktop breakpoints

**File:** `app/page.tsx`

---

### About Page (`app/about/page.tsx`)

**Purpose:** Displays company information and team profiles.

**Sections:**

1. **Intro** - Hero section with main title
2. **Owners** - Team member profiles (Stefano, Nadja) with hover effects
3. **Values** - Mission and vision statements
4. **Work** - "How we work" section with animated image
5. **Contact** - Call-to-action section

**Data Source:** `/api/about`

**Key Features:**

- Scroll-based visibility detection for animations
- Image hover effects (black & white → color)
- CTA processing (handles single or array of CTAs)

**File:** `app/about/page.tsx`

---

### Process Page (`app/process/page.tsx`)

**Purpose:** Shows the company's workflow in a step-by-step format.

**Sections:**

1. **Intro** - Hero section with background image
2. **Steps** - Sequential process steps displayed in boxes
3. **Contact** - Call-to-action section

**Data Source:** `/api/process`

**Key Features:**

- Steps sorted by `number` field
- Vertical connecting line between steps
- `ProcessStepBox` components for each step

**File:** `app/process/page.tsx`

---

### Services Page (`app/services/page.tsx`)

**Purpose:** Displays services and offerings.

**Sections:**

1. **Intro** - Hero section with title and description
2. **Areas** - Service cards with features lists
3. **Contact** - Call-to-action section

**Data Source:** `/api/services`

**Key Features:**

- Service cards with icons (data, web, combined)
- Special styling for "combined" service (neon border)
- Features list rendering

**File:** `app/services/page.tsx`

---

### Privacy Page (`app/privacy/page.tsx`)

**Purpose:** Displays privacy policy content.

**Data Source:** `/api/privacy`

**Key Features:**

- Simple markdown rendering
- Fallback content if API fails
- Responsive layout

**File:** `app/privacy/page.tsx`

---

### Not Found Page (`app/not-found.tsx`)

**Purpose:** 404 error page displayed when route doesn't exist.

**Key Features:**

- Automatically used by Next.js for 404 errors
- Friendly error message
- "Go Back Home" button

**File:** `app/not-found.tsx`

---

## API Routes

All API routes follow the same pattern: load content from markdown files and return JSON.

### Content API Routes

**Pattern:** `app/api/{pageName}/route.ts`

**Function:** `getAllBlocksData(pageName)` from `lib/content.ts`

**Routes:**

- `/api/home` → `getAllBlocksData('home')`
- `/api/about` → `getAllBlocksData('about')`
- `/api/process` → `getAllBlocksData('process')`
- `/api/services` → `getAllBlocksData('services')`

**Response Format:**

```json
{
  "section-id": {
    "title": "Section Title",
    "blocks": {
      "block-id": {
        "title": "Block Title",
        "text": "Block content...",
        "linkText": "...",
        "linkUrl": "..."
      }
    }
  }
}
```

---

### Contact API (`app/api/contact/route.ts`)

**GET `/api/contact`**

- Returns contact links (email, phone, LinkedIn, etc.)
- Used by Footer and other components

**POST `/api/contact`**

- Processes contact form submissions
- Validates form data (name, email, message required)
- Sends email via Resend API
- Returns success/error response

**Environment Variables Required:**

- `RESEND_API_KEY` - Resend API key
- `EMAIL_FROM` - Sender email address
- `CONTACT_EMAIL_TO` - Recipient email address
- `CONTACT_EMAIL_SUBJECT` - Email subject (optional)

**File:** `app/api/contact/route.ts`

---

### Other API Routes

- `/api/tagline` - Returns main tagline text
- `/api/generic-texts` - Returns reusable text strings
- `/api/menu` - Returns menu items for navigation
- `/api/contact-form-texts` - Returns form labels/placeholders
- `/api/contact-section-texts` - Returns contact section texts
- `/api/privacy` - Returns privacy policy content

---

## Components

### LayoutWrapper (`app/components/LayoutWrapper.tsx`)

**Purpose:** Main layout component that wraps all pages.

**Features:**

- Authentication (password protection, bypasses on localhost)
- Header and Footer (shown on all pages)
- Contact modal (accessible from anywhere)
- Animation context provider
- Page-specific CSS classes on body element

**Authentication Logic:**

- Localhost: Automatically authenticated
- Production: Checks `sessionStorage` for authentication
- Shows `PasswordForm` if not authenticated

**File:** `app/components/LayoutWrapper.tsx`

---

### ContactForm (`app/components/ContactForm/index.tsx`)

**Purpose:** Reusable contact form component.

**Features:**

- Form validation (name, email, message required)
- Email format validation
- Loading states during submission
- Success/error message display
- Dynamic text content loaded from API
- Auto-clears form on successful submission

**Data Flow:**

1. Loads text content from `/api/contact-form-texts`
2. User fills out form
3. Validates data
4. Sends to `/api/contact` (POST)
5. Shows success/error message

**File:** `app/components/ContactForm/index.tsx`

---

### ContactSection (`app/components/ContactSection/index.tsx`)

**Purpose:** Reusable section component for contact CTAs.

**Features:**

- Displays title and text (supports markdown)
- Two default CTAs: "Contact Us" (opens modal) and "Book a meeting" (external link)
- Can accept custom CTAs via props
- Used at bottom of pages

**File:** `app/components/ContactSection/index.tsx`

---

### Other Components

- **Button** (`app/components/Button/index.tsx`) - Reusable button component
- **Logo** (`app/components/Logo.tsx`) - Company logo SVG component
- **Modal** (`app/components/Modal.tsx`) - Modal/dialog component
- **ProcessStepBox** (`app/components/ProcessStepBox.tsx`) - Process step display
- **ScrollDownButton** (`app/components/ScrollDownButton.tsx`) - Scroll indicator
- **Header** (`app/Header.tsx`) - Site header with navigation
- **Footer** (`app/Footer.tsx`) - Site footer with contact links

---

## Utilities

### Text Utilities (`app/utils/text.ts`)

**`renderMarkdown(markdownString, noParagraphs)`**

- Converts markdown to HTML for React rendering
- Uses `marked` library
- Custom renderer converts `<strong>` to `<b>` for styling consistency
- `noParagraphs` parameter: if true, uses inline parsing (no `<p>` tags)

**Usage:**

```typescript
<h1 dangerouslySetInnerHTML={renderMarkdown(block.title, true)}></h1>
<div dangerouslySetInnerHTML={renderMarkdown(block.text)}></div>
```

**`parseMarkdownListItems(markdownString)`**

- Extracts list items from markdown text
- Returns array of strings
- Useful for rendering structured lists

**File:** `app/utils/text.ts`

---

### Visibility Utilities (`app/utils/visibility.ts`)

**`isElementVisible(element, threshold)`**

- Checks if element is visible in viewport
- Used for scroll-based animations
- `threshold`: 0-1 (0.1 = 10% visible, 1.0 = 100% visible)

**Usage:**

```typescript
if (isElementVisible(element, 1.0)) {
  element.classList.add("visible");
}
```

**File:** `app/utils/visibility.ts`

---

## Design Decisions

### Why Markdown-Based CMS?

**Decision:** Use markdown files instead of a database or headless CMS.

**Reasons:**

1. **Version Control** - Content changes are tracked in git
2. **No Database** - Simpler deployment, no database setup needed
3. **Developer-Friendly** - Easy to review content changes in PRs
4. **Non-Developer Friendly** - Content editors can use markdown (familiar format)
5. **Performance** - Content is read at build time (fast, no API calls)
6. **Cost** - No CMS subscription fees

**Trade-offs:**

- ❌ Requires code deployment for content changes (but can be automated)
- ❌ No visual editor (but markdown is simple)
- ❌ Content changes require git access

---

### Why Next.js App Router?

**Decision:** Use Next.js 15+ App Router instead of Pages Router.

**Reasons:**

1. **Modern** - Latest Next.js features
2. **Server Components** - Better performance (though we use client components for interactivity)
3. **File-based Routing** - Easy to understand
4. **API Routes** - Built-in API endpoints

---

### Why TypeScript?

**Decision:** Use TypeScript instead of plain JavaScript.

**Reasons:**

1. **Type Safety** - Catches errors at compile time
2. **Better IDE Support** - Autocomplete, refactoring
3. **Documentation** - Types serve as documentation
4. **Maintainability** - Easier to understand codebase

---

### Why Resend for Email?

**Decision:** Use Resend API instead of SMTP or other services.

**Reasons:**

1. **Simple API** - Easy to integrate
2. **Reliable** - Good deliverability
3. **Developer-Friendly** - Clear documentation
4. **Cost-Effective** - Free tier available

**Alternative Considered:** SendGrid, Mailgun, SMTP

---

### Why Scroll-Based Animations?

**Decision:** Use Intersection Observer for scroll-triggered animations.

**Reasons:**

1. **Performance** - Only animates when elements are visible
2. **User Experience** - Animations don't play off-screen
3. **Modern** - Uses browser APIs efficiently
4. **Customizable** - Full control over animation timing

**Implementation:** Custom hooks (`useSimpleAnimation`, `useMultiAnimation`, etc.)

---

### Why Password Protection?

**Decision:** Add password protection to the site.

**Reasons:**

1. **Privacy** - Site may contain sensitive information
2. **Development** - Can show work-in-progress to clients
3. **Simple** - No complex authentication system needed

**Implementation:** `LayoutWrapper` component checks authentication, shows `PasswordForm` if needed.

---

## Future Improvements

### High Priority

1. **Content Editor UI**
   - Build a simple admin interface for editing markdown files
   - Could use a headless CMS like Strapi or Sanity
   - Or build a custom editor using GitHub API

2. **Image Optimization**
   - Implement Next.js Image optimization more consistently
   - Add lazy loading for below-the-fold images
   - Use WebP format where possible

3. **Error Handling**
   - Better error boundaries
   - User-friendly error messages
   - Error logging service (Sentry, etc.)

4. **Performance**
   - Code splitting for large pages
   - Optimize bundle size
   - Add loading states for all async operations

### Medium Priority

5. **Testing**
   - Add unit tests for utilities
   - Add integration tests for API routes
   - Add E2E tests for critical flows

6. **Accessibility**
   - Audit and fix accessibility issues
   - Add ARIA labels where needed
   - Keyboard navigation improvements

7. **SEO**
   - Add meta tags dynamically
   - Generate sitemap.xml
   - Add structured data (JSON-LD)

8. **Internationalization**
   - Add i18n support if needed
   - Multi-language content support

### Low Priority

9. **Analytics**
   - Add analytics (Google Analytics, Plausible, etc.)
   - Track form submissions
   - Track page views

10. **Blog/News Section**
    - Add blog functionality
    - RSS feed
    - Archive pages

11. **Search Functionality**
    - Add site search
    - Could use Algolia or similar

---

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git

### Installation

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
   Create `.env.local` file:

   ```env
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=noreply@yourdomain.com
   CONTACT_EMAIL_TO=contact@yourdomain.com
   CONTACT_EMAIL_SUBJECT=New Contact Form Submission
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

### Deployment

**Recommended:** Deploy to Vercel (Next.js creators)

1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Alternative:** Any Node.js hosting (requires `npm run build` and `npm start`)

---

## File Structure

```
upwego/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── about/
│   │   ├── contact/
│   │   ├── home/
│   │   └── ...
│   ├── components/        # React components
│   │   ├── ContactForm/
│   │   ├── ContactSection/
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # CSS files
│   ├── utils/            # Utility functions
│   ├── about/
│   │   └── page.tsx      # About page
│   ├── process/
│   │   └── page.tsx      # Process page
│   ├── services/
│   │   └── page.tsx      # Services page
│   ├── privacy/
│   │   └── page.tsx      # Privacy page
│   ├── page.tsx          # Home page
│   ├── not-found.tsx     # 404 page
│   ├── layout.tsx        # Root layout
│   ├── Header.tsx         # Site header
│   └── Footer.tsx         # Site footer
├── content/              # Content files (markdown)
│   ├── pages/           # Page definitions
│   ├── sections/        # Section definitions
│   └── blocks/          # Content blocks
├── lib/                 # Library functions
│   ├── content.ts       # Content loader
│   ├── email.ts         # Email service
│   └── ...
├── config/              # Configuration files
│   └── animations.js    # Animation definitions
├── public/              # Static files
│   └── img/            # Images
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.mjs  # Tailwind config
└── README.md            # Project readme
```

---

## Quick Reference

### Adding a New Page

1. Create page file: `app/{pageName}/page.tsx`
2. Create API route: `app/api/{pageName}/route.ts`
3. Create page definition: `content/pages/{pageName}.md`
4. Create sections: `content/sections/{sectionId}.md`
5. Create blocks: `content/blocks/{blockId}.md`

### Adding a New Component

1. Create component file: `app/components/{ComponentName}/index.tsx`
2. Add TypeScript interfaces for props
3. Export component
4. Import and use in pages

### Editing Content

1. Edit markdown files in `content/` directory
2. Files are organized: pages → sections → blocks
3. Use frontmatter (YAML) for metadata
4. Use markdown for text content

### Common Functions

- **Load content:** `getAllBlocksData(pageName)` from `lib/content.ts`
- **Render markdown:** `renderMarkdown(text, noParagraphs)` from `app/utils/text.ts`
- **Check visibility:** `isElementVisible(element, threshold)` from `app/utils/visibility.ts`
- **Send email:** `sendContactEmail(data)` from `lib/email.ts`

---

## Getting Help

- **Code Comments:** All important files have detailed comments
- **This Guide:** Reference this document for architecture and patterns
- **Next.js Docs:** https://nextjs.org/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs

---

## Contributing

When contributing:

1. **Follow existing patterns** - Look at similar files for structure
2. **Add comments** - Document complex logic
3. **Update this guide** - If you add new features
4. **Test changes** - Make sure everything works
5. **Keep it simple** - Prefer simple solutions over complex ones

---

**Last Updated:** [Current Date]
**Maintained By:** Upwego Development Team
