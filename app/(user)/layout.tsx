"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
} from "lucide-react";
import Footer from "@/components/footer";

const sidebarItems = [
  { href: "/", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/user-profile", icon: ImageIcon, label: "User Profile" },
  { href: "/booked-room", icon: Share2Icon, label: "Booked Room" },
  { href: "/new-room", icon: UploadIcon, label: "New Room" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname);

  return (
    <div className="flex h-screen">
      {/* Sidebar (hidden on mobile, shown from md+) */}
      <aside className="hidden md:flex bg-purple-500 text-white h-screen flex-col w-20 md:w-64 transition-all duration-300 pt-20">
        <ul className="menu p-2 flex-grow">
          {sidebarItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                onClick={() => setActive(item.href)}
                className={`flex items-center space-x-4 px-3 py-2 rounded-lg ${
                  active === item.href
                    ? "bg-purple-600 text-white"
                    : "hover:bg-purple-700"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Page Content */}
      <main className="flex-grow overflow-y-auto p-0 bg-base-100">
        {children}
      </main>
    </div>
  );
}
