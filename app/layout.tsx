import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import AppShell from "@/components/AppShell";
import { createClient } from '@/lib/pocketbase';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Share",
  description: "Share your favorite music",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pb = await createClient();
  const user = pb.authStore.model ? JSON.parse(JSON.stringify(pb.authStore.model)) : null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppShell user={user}>
            {children}
        </AppShell>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}