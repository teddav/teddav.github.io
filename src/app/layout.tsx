import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/lib/components/Navigation";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ColorSchemeProvider } from "@/lib/contexts/ColorSchemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | teddav's blog",
    default: "teddav's blog",
  },
  description: "Thoughts on security and cryptography",
  icons: "/img/logo.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <ColorSchemeProvider>
          <Navigation />
          <main className="min-h-screen overflow-x-hidden">{children}</main>
        </ColorSchemeProvider>
      </body>
      <GoogleAnalytics gaId="G-46SDB0ZKXC" />
    </html>
  );
}
