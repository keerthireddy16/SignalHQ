import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import DashboardShell from "@/components/layout/DashboardShell";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SignalHQ | Intelligence Interface",
  description: "Advanced venture capital discovery and enrichment engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#27272a', color: '#fff', border: '1px solid #3f3f46' } }} />
        <DashboardShell>
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
