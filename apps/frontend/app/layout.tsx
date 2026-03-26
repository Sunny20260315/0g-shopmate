import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";

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
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <TopNav />
          <main className="flex-1 flex">
            <Sidebar />
            <div className="flex-1">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
