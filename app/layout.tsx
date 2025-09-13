"use client";

import "./globals.css";
import Navbar from "@/components/navbar";
import { Providers } from "./provider";
import SpeedDialMenu from "@/components/SpeedDialMenu";
// import { Toaster } from "react-hot-toast";
import { Toaster } from "@/components/ui/sonner";
import AOSProvider from "@/components/AOSProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <AOSProvider /> 
          {children}
          <SpeedDialMenu />
          {/* <Footer /> */}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
