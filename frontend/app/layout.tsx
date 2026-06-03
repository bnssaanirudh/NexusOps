import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalCommandBar } from "@/components/GlobalCommandBar";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SentinelAI | Industrial Reliability Intelligence",
  description: "Enterprise-grade autonomous industrial reliability intelligence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[#F8FAFC] text-slate-800 antialiased min-h-screen flex flex-col`}>
        <GlobalCommandBar />
        <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
