import React from "react";
import { motion } from "framer-motion";
import BatikOrnament from "../BatikOrnament";
import HeaderLogos from "../HeaderLogos";
import Logo from "../Logo";

interface StepProps {
  onNext: () => void;
}

export default function CatchphraseStep({ onNext }: StepProps) {
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

      {/* Institution logos bar at the top */}
      <div className="z-10 w-full mt-2">
        <HeaderLogos />
      </div>

      {/* Content in the center (Big Logo and Catchphrase) */}
      <div className="z-10 text-center flex flex-col justify-center items-center my-auto px-4 max-w-4xl">
        {/* Large Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Logo className="w-56 md:w-80" />
        </motion.div>

        {/* Catchphrase text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-white text-3xl md:text-5xl font-bold font-serif leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
        >
          Tentukan pekerjaan mu <br />
          di masa depan !
        </motion.h2>
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
