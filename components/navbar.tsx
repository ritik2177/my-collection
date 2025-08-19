"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import RegisterModal from "@/components/modal";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { data: session } = useSession();
  const handleLogout = () => signOut();

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 bg-white/10 backdrop-blur border border-gray-200 rounded-lg shadow-md mx-0 md:mx-28">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Company name */}
        <div className="text-2xl font-bold text-gray-800">MyCompany</div>

        {/* Center: Desktop nav links */}
        <div className="hidden md:flex space-x-4">
          <a href="#hotel" className="px-4 py-2 rounded-md hover:bg-white/30 transition-colors duration-200">Hotel</a>
          <a href="#contact" className="px-4 py-2 rounded-md hover:bg-white/30 transition-colors duration-200">Contact</a>
          <a href="#dashboard" className="px-4 py-2 rounded-md hover:bg-white/30 transition-colors duration-200">Dashboard</a>
        </div>

        {/* Right: Desktop buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {!session ? (
            <>
              <button onClick={() => setOpenModal(true)} className="rounded transition">
                <img className="w-14 h-12" src="/image/login.png" alt="Login" />
              </button>
              <RegisterModal open={openModal} handleClose={() => setOpenModal(false)} />
            </>
          ) : (
            <PopupState variant="popover" popupId="user-menu">
              {(popupState) => (
                <>
                  <img
                    src="/image/user.png"
                    alt="User"
                    className="w-10 h-10 rounded-full border cursor-pointer"
                    {...bindTrigger(popupState)}
                  />
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem onClick={popupState.close}>
                      <Link href="/profile" className="w-full flex items-center gap-2 text-gray-800 px-6">
                        <User size={18} /> {session.user?.name}
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={popupState.close}>
                      <Link href={"/profile"} className="w-full flex items-center gap-2 text-gray-800 px-6">
                        <Settings size={18} /> Account
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        popupState.close();
                        handleLogout();
                      }}
                    >
                      <div className="w-full flex items-center gap-2 px-6 bg-orange-600 text-white rounded hover:bg-orange-700 transition">
                        <LogOut size={18} /> <span>Logout</span>
                      </div>
                    </MenuItem>

                  </Menu>
                </>
              )}
            </PopupState>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            className="p-2 text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200 overflow-hidden">
          <div className="flex flex-col px-4 py-3 space-y-1">
            <a href="#hotel" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-blue-100 transition-colors">Hotel</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-blue-100 transition-colors">Contact</a>
            <a href="#dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md hover:bg-blue-100 transition-colors">Dashboard</a>

            {!session ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setOpenModal(true);
                }}
                className="mt-2 bg-purple-600 text-white rounded px-4 py-2 hover:bg-purple-700 transition"
              >
                Login
              </button>
            ) : (
              <>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="mt-2 bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700 transition">
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="mt-2 bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
