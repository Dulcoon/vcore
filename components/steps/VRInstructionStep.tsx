import React from "react";
import { motion } from "framer-motion";
import BatikOrnament from "../BatikOrnament";
import HeaderLogos from "../HeaderLogos";
import Logo from "../Logo";
import Link from "next/link";

export default function VRInstructionStep() {
  return (
    <div className="w-full h-full relative flex flex-col justify-between items-center pt-10 pb-24 px-8 bg-gradient-to-b from-[#1E2258] to-[#121438] select-none">
      {/* Batik Ornaments in corners */}
      <BatikOrnament position="top-left" />
      <BatikOrnament position="top-right" />
      <BatikOrnament position="bottom-left" />
      <BatikOrnament position="bottom-right" />

      {/* Institution logos bar at the top */}
      <div className="z-10 w-full mt-2">
        <HeaderLogos />
      </div>

      {/* Content Area */}
      <div className="z-10 w-full max-w-3xl my-auto px-4 flex flex-col items-center">
        {/* Large Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Logo className="w-40 md:w-56" />
        </motion.div>

        {/* Catchphrase text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-white text-2xl md:text-4xl font-bold font-serif text-center leading-relaxed max-w-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
        >
          Sebelum lanjut silahkan gunakan <br />
          <span className="text-[#FBBF24]">Virtual Reality</span> terlebih dahulu
        </motion.h2>
      </div>

      {/* Link Button at the bottom routing to /quiz */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="z-10 mb-2"
      >
        <Link
          href="/quiz"
          className="bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-bold text-sm md:text-base px-10 py-3.5 rounded-full shadow-[0_4px_20px_rgba(226,157,41,0.4)] transition-all tracking-wider uppercase flex items-center gap-2 border border-yellow-500/20 inline-block"
        >
          Selanjutnya
          <svg
            className="w-4 h-4 fill-current stroke-current inline"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}
