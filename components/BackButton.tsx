"use client";

import React from "react";
import Link from "next/link";

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
}

export default function BackButton({ href, onClick, label = "Kembali", className = "" }: BackButtonProps) {
  const innerContent = (
    <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#242058]/80 hover:bg-[#E29D29] text-[#B6B2DA] hover:text-white border border-[#3B366E] hover:border-[#E29D29]/50 text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-sm">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>{label}</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={`inline-block ${className}`}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`inline-block ${className}`}>
      {innerContent}
    </button>
  );
}
