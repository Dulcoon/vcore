import React from "react";
import { motion } from "framer-motion";
import BatikOrnament from "../BatikOrnament";
import HeaderLogos from "../HeaderLogos";
import Logo from "../Logo";

interface StepProps {
  onNext: () => void;
}

export default function AboutStep({ onNext }: StepProps) {
  const benefits = [
    "Menjelajahi berbagai jenis pekerjaan",
    "Mengenal tugas dan aktivitas berbagai pekerjaan",
    "Menemukan pekerjaan yang sesuai dengan minat dan kemampuanmu",
    "Membangun rasa percaya diri untuk merencanakan karier di masa depan",
  ];

  return (
    <div className="w-full h-full relative flex flex-col justify-between items-center pt-10 pb-24 px-8 bg-transparent select-none">
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

      {/* Content Area */}
      <div className="z-10 w-full max-w-3xl my-auto px-4 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-4">
          <Logo className="w-40 md:w-56" />
        </div>

        {/* Heading */}
        <h2 className="text-white text-3xl font-bold font-serif mb-6 text-center self-start md:self-center">
          Tentang ViCore
        </h2>

        {/* Main description paragraph */}
        <p className="text-gray-200 text-sm md:text-base font-light leading-relaxed mb-8 text-center md:text-left">
          ViCore adalah media Virtual Reality (VR) yang membantu teman tuli mengeksplorasi dunia karier secara imersif, sehingga lebih percaya diri dalam menentukan pilihan karier di masa depan.
        </p>

        {/* Benefits list with yellow arrows */}
        <div className="w-full space-y-3.5 max-w-2xl">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              className="flex items-start gap-3"
            >
              {/* Custom Yellow Arrow */}
              <span className="shrink-0 text-amber-500 mt-1">
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-white text-sm md:text-base font-light">
                {benefit}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Button at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
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
