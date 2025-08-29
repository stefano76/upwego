import type { Metadata } from "next";
import { Nunito, Merriweather } from "next/font/google";
import "./globals.css";
import GetHeader from "./server/GetHeader";

const fontBody = Nunito({
  subsets: ["latin"],
  weight: ["300"], // 300 is Light weight
  variable: "--font-body",
});

const fontHeading = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"], // Light, Regular, and Bold
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Upwego Digital",
  description: "The agency for a new digital era",
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
