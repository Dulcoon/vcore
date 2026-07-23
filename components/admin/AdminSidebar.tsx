"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

interface AdminSidebarProps {
  userEmail?: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      href: "/admin/students",
      label: "Data Siswa",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      href: "/admin/professions",
      label: "Data Profesi",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: "/admin/quizzes",
      label: "Kelola Quiz",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-[#1B1A3E]/95 backdrop-blur-md border-b border-[#3B366E] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-removebg-preview.png"
            alt="ViCore Logo"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="text-[#F9CA75] font-bold text-base font-serif">ViCore Admin</span>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-[#242058] border border-[#3B366E] text-white focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMobileOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container (Desktop fixed left sidebar + Mobile slide-in right drawer) */}
      <aside
        className={`fixed top-0 bottom-0 z-50 w-64 bg-[#1B1A3E] flex flex-col justify-between transition-transform duration-300 ease-in-out
          right-0 border-l border-[#3B366E] lg:right-auto lg:left-0 lg:border-r lg:border-l-0 lg:translate-x-0
          ${isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Header Logo Branding */}
        <div>
          <div className="p-5 border-b border-[#3B366E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-removebg-preview.png"
                alt="ViCore Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <div>
                <h1 className="text-[#F9CA75] font-bold text-lg font-serif leading-tight">ViCore Admin</h1>
                <p className="text-[#B6B2DA] text-[10px] uppercase tracking-wider font-semibold">Portal Kelola</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 text-[#B6B2DA] hover:text-white cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {links.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-[#E29D29] text-white font-extrabold shadow-lg shadow-[#E29D29]/20"
                      : "text-[#B6B2DA] hover:text-white hover:bg-[#242058]/50 font-semibold"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-[#B6B2DA]"}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Info & Logout */}
        <div className="p-4 border-t border-[#3B366E] bg-[#17153A]/60">
          {userEmail && (
            <div className="mb-3 px-1">
              <p className="text-[10px] uppercase font-bold text-[#B6B2DA] tracking-wider">Login Sebagai</p>
              <p className="text-xs font-medium text-white truncate">{userEmail}</p>
            </div>
          )}
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
