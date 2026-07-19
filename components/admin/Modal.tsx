"use client";

import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setShow(false), 200); // fade out duration
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0F0E24]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div
        className={`relative w-full max-w-lg bg-[#1B1A3E] border border-[#3B366E] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-200 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="px-6 py-4 border-b border-[#3B366E] flex justify-between items-center bg-[#242058]/30">
          <h3 className="font-bold text-[#F9CA75] text-lg">{title}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3B366E] text-[#B6B2DA] transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
