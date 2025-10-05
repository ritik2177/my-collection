"use client";

import "./globals.css";
import Navbar from "@/components/navbar";
import { Providers } from "./provider";
import SpeedDialMenu from "@/components/SpeedDialMenu";
import { Toaster } from "@/components/ui/sonner";
import AOSProvider from "@/components/AOSProvider";
import AppThemeProvider from "@/components/ThemeProvider";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en" className="dark">
      <body>
        <div className="relative w-full min-h-screen">
          <AppThemeProvider>
          <Providers>
            <Navbar />
            <AOSProvider /> 
            {children}
            <SpeedDialMenu />
            <Toaster richColors theme="dark"/>
          </Providers>
          </AppThemeProvider>
        </div>
      </body>
    </html>
  );
}
