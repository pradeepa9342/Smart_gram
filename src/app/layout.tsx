import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ChatBot from "@/components/ai/ChatBot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMART-GRAM: Smart Village Digital Management System",
  description: "A digital management platform for smart villages, empowering municipal officers and farmers.",
};

import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body 
        className="min-h-full flex flex-col bg-slate-50 text-slate-900"
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <NotificationProvider>
                {children}
                <ChatBot />
              </NotificationProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
