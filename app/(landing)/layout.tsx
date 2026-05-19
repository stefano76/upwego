import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.upwego.digital'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const fontBody = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-body',
});

const fontHeading = Inter({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
});

export default function LandingRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontBody.variable} ${fontHeading.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
