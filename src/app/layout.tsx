import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getSessionUser } from "@/lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoLoop — Circular Economy Exchange",
  description: "Connect reusable and waste materials with people who can use them.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getSessionUser();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        <Navbar user={session ? { name: session.name, role: session.role } : null} />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
