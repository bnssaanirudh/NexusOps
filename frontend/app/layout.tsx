import type { Metadata } from "next";
import "./globals.css";
import { GlobalCommandBar } from "@/components/GlobalCommandBar";

export const metadata: Metadata = {
  title: "NexusOps | Industrial Intelligence Platform",
  description: "Enterprise-grade autonomous industrial reliability intelligence platform — predict failures before they happen.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          backgroundColor: '#F2EEE8',
          color: '#1C1A18',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="antialiased"
      >
        <GlobalCommandBar />
        <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 md:px-8 overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
