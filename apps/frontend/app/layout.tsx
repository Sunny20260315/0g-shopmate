import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "0G-ShopMate - AI Concierge",
  description: "AI-powered Web3 shopping assistant with 0G storage verification",
  keywords: ["0G", "Sui", "Web3", "E-commerce", "AI", "Data Sovereignty"],
  authors: [{ name: "0G-ShopMate Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mesh-grid" />
        {children}
      </body>
    </html>
  );
}
