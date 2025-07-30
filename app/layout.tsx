import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Providers } from './provider'; 
import SpeedDialMenu from "@/components/SpeedDialMenu";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers> 
          <Navbar />
          {children}
          <SpeedDialMenu /> 
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


