import React from "react";
import { motion } from "framer-motion";
import BatikOrnament from "../BatikOrnament";
import HeaderLogos from "../HeaderLogos";
import Logo from "../Logo";
import Image from "next/image";

interface StepProps {
  onNext: () => void;
}

export default function QuizIntroStep({ onNext }: StepProps) {
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
        {/* Logo */}
        <div className="mb-2">
          <Logo className="w-40 md:w-56" />
        </div>

        {/* Heading */}
        <h2 className="text-white text-2xl md:text-3xl font-bold font-serif text-center max-w-xl leading-snug mb-6">
          Yuk cari tahu apa kelebihan dan kekuranganmu!
        </h2>

        {/* Center Illustration with Rounded Card Container */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-[2rem] border-4 border-[#E29D29] overflow-hidden bg-white/5 shadow-2xl p-1 mb-4">
          <div className="w-full h-full relative rounded-[1.7rem] overflow-hidden">
            <Image
              src="/images/quiz_illus.png"
              alt="Quiz Illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Quiz Tag */}
        <span className="bg-[#E29D29] text-white text-xs font-extrabold tracking-widest px-6 py-1.5 rounded-full uppercase shadow-[0_2px_10px_rgba(226,157,41,0.3)] mb-4">
          Quiz
        </span>
      </div>

      {/* Button at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="z-10 mb-2"
      >
        <button
          onClick={onNext}
          className="bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-bold text-sm md:text-base px-10 py-3.5 rounded-full shadow-[0_4px_20px_rgba(226,157,41,0.4)] transition-all tracking-wider uppercase flex items-center gap-2 border border-yellow-500/20"
        >
          Selanjutnya
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
