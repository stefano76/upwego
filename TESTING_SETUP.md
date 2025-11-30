# Testing Setup Guide

This guide will help you set up automated testing for the Upwego website.

## Quick Start

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# Install E2E testing (Playwright)
npm install --save-dev @playwright/test

# Run tests
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:watch    # Watch mode
```

---

## 1. Unit Testing Setup (Jest + React Testing Library)

### Install Dependencies

```bash
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest-environment-jsdom \
  @types/jest
```

### Create `jest.config.js`

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### Create `jest.setup.js`

```javascript
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
```

### Update `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 2. E2E Testing Setup (Playwright)

### Install Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Create `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Update `package.json`

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## 3. Example Test Files

### Unit Test Example: `__tests__/utils/text.test.ts`

```typescript
import { renderMarkdown } from '@/app/utils/text';

describe('renderMarkdown', () => {
  it('should render markdown to HTML', () => {
    const result = renderMarkdown('# Hello World');
    expect(result).toContain('<h1>Hello World</h1>');
  });

  it('should handle empty string', () => {
    const result = renderMarkdown('');
    expect(result).toBe('');
  });
});
```

### Component Test Example: `__tests__/components/Button.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import Button from '@/app/components/Button';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Route Test Example: `__tests__/api/contact.test.ts`

```typescript
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

describe('/api/contact', () => {
  it('validates required fields', async () => {
    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: '', email: '', message: '' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('validates email format', async () => {
    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test',
        email: 'invalid-email',
        message: 'Test message',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

### E2E Test Example: `e2e/contact-form.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/');
    
    // Open contact modal/form
    await page.click('text=Contact');
    
    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('text=Message sent successfully')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Contact');
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=required')).toBeVisible();
  });
});
```

---

## 4. Running Tests

```bash
# Unit tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

---

## 5. CI/CD Integration

### GitHub Actions Example (`.github/workflows/test.yml`)

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      - run: npm test
      - run: npm run test:e2e
```

---

## 6. What to Test

### Priority 1: Critical Features
- ✅ Contact form submission
- ✅ API route responses
- ✅ Form validation

### Priority 2: Important Features
- ✅ Navigation
- ✅ Content loading
- ✅ Error handling

### Priority 3: Nice to Have
- ✅ Animations
- ✅ Responsive design
- ✅ Performance

---

## Next Steps

1. Install dependencies (see Quick Start)
2. Create test files for critical features
3. Run tests before each deployment
4. Add tests to CI/CD pipeline
5. Gradually increase test coverage

---

**Tip**: Start small! Write tests for your most critical features first (contact form, API routes), then gradually add more tests as you develop new features.
