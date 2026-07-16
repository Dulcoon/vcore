import React from "react";
import { motion } from "framer-motion";
import Logo from "../Logo";
import BatikOrnament from "../BatikOrnament";

interface StepProps {
  onNext: () => void;
}

export default function HeroStep({ onNext }: StepProps) {
  return (
    <div
      className="w-full h-full relative flex flex-col justify-between items-center pt-10 pb-24 px-8 bg-transparent select-none"
    >
      {/* Translucent Overlay */}
      <div className="absolute inset-0 bg-[#161a3f]/75 backdrop-blur-[2px] z-0" />

      {/* Batik Ornaments in corners */}
      <BatikOrnament position="top-left" />
      <BatikOrnament position="top-right" />
      <BatikOrnament position="bottom-left" />
      <BatikOrnament position="bottom-right" />

      {/* Logo at the top */}
      <div className="z-10 mt-2">
        <Logo className="w-40 md:w-56" />
      </div>

      {/* Title / Content */}
      <div className="z-10 text-center flex flex-col justify-center items-center my-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight font-serif text-[#FBBF24] leading-[1.1] mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            Virtual Reality
          </h1>
          <h2 className="text-3xl md:text-5xl font-medium font-serif text-[#FBBF24]/90 tracking-wide mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Career
          </h2>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight font-serif text-[#FBBF24] leading-[1.1] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            Exploration
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white text-sm md:text-lg max-w-2xl mt-8 font-light leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
        >
          ViCore menghadirkan pengalaman eksplorasi karier berbasis Virtual Reality yang inklusif bagi teman tuli. Kenali pekerjaan, pahami lingkungan kerja dan persiapkan masa depanmu dengan lebih percaya diri!
        </motion.p>
      </div>

      {/* CTA Button at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="z-10 mb-2"
      >
        <button
          onClick={onNext}
          className="bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-bold text-sm md:text-base px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(226,157,41,0.4)] transition-all tracking-wider uppercase flex items-center gap-2 border border-yellow-500/20"
        >
          Eksplorasi Sekarang
          <svg
            className="w-4 h-4 fill-current stroke-current"
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
        </button>
      </motion.div>
    </div>
  );
}
