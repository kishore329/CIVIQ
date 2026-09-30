import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CIVIQ — AI-Powered Civic Intelligence",
  description:
    "From Citizen Voice to Smarter Development. AI-powered civic intelligence platform that transforms fragmented citizen feedback into structured infrastructure intelligence.",
  keywords: [
    "Civic Intelligence",
    "Smart Cities",
    "Infrastructure Planning",
    "Citizen Feedback",
    "GovTech",
    "Urban Development",
    "Public Works",
  ],
  authors: [{ name: "CIVIQ Civic Intelligence Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('civiq-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark) || (saved === 'system' && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col font-sans bg-[var(--background)] text-[var(--text)] transition-colors duration-150`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
