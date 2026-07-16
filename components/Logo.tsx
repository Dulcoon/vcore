import React from "react";

export default function Logo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img
        src="/images/logo-removebg-preview.png"
        alt="ViCore Logo"
        className="w-full h-auto object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}
