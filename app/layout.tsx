import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GetHeader from "./server/GetHeader";

const fontBody = Inter({
  subsets: ["latin"],
  weight: ["300", "400"], // Light, Regular
  variable: "--font-body",
});

const fontHeading = Inter({
  subsets: ["latin"],
  weight: ["700"], // Bold
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Upwego Digital",
  description: "Designing momentum. Together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontBody.variable} ${fontHeading.variable} antialiased`}>
        {/* Global Header */}
        <GetHeader />
        {children}
      </body>
    </html>
  );
}
