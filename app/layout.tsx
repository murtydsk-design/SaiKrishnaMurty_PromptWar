import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThinkLens — See What Your Thinking Might Be Missing",
  description:
    "An AI-powered critical-thinking assistant that helps you examine assumptions, overlooked factors, and reasoning patterns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#0D0D0C]">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#0D0D0C] text-[#F5F1E8] antialiased`}>
        {children}
      </body>
    </html>
  );
}
