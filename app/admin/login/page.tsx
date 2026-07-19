"use client";

import { useState } from "react";
import Image from "next/image";
import { login } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    
    if (res?.error) {
      setError(res.error);
      setIsPending(false);
    }
    // If successful, it redirects automatically via server action
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="w-full max-w-md bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center mb-4">
            <Image 
              src="/images/logo-removebg-preview.png" 
              alt="ViCore Logo" 
              width={64} 
              height={64} 
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#F9CA75]">Admin Login</h2>
          <p className="text-[#B6B2DA] text-sm mt-2">Masuk untuk mengelola data ViCore</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full px-4 py-3 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] transition-colors text-white"
              placeholder="email@contoh.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full px-4 py-3 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] transition-colors text-white"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={isPending}
            className="w-full py-3 mt-4 bg-[#F2A93B] text-[#0F0E24] font-bold rounded-xl hover:bg-[#F9CA75] transition-colors disabled:opacity-50"
          >
            {isPending ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
