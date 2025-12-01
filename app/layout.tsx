import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./styles/globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { generatePageMetadata } from "@/lib/metadata";

const fontBody = Inter({
  subsets: ["latin"],
  weight: ["300", "400"], // Light, Regular
  variable: "--font-body",
});

const fontHeading = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700"], // Medium, Semibold, Bold
  variable: "--font-heading",
});

/**
 * Generate metadata dynamically based on the current pathname
 * This replaces the need for individual layout.tsx files in each route
 * Pathname is passed via middleware custom header 'x-pathname'
 */
export async function generateMetadata(): Promise<Metadata> {
  // Get the pathname from custom header set by middleware
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  
  // Generate page-specific metadata
  const pageMetadata = generatePageMetadata(pathname);
  
  return {
    ...pageMetadata,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontBody.variable} ${fontHeading.variable} antialiased`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
