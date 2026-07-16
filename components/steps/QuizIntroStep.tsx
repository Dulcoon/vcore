import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import BatikOrnament from "../BatikOrnament";
import HeaderLogos from "../HeaderLogos";
import Logo from "../Logo";
import Image from "next/image";
import InteractiveStudentForm from "./InteractiveStudentForm";

interface StepProps {
  onNext: () => void;
}

export default function QuizIntroStep({ onNext }: StepProps) {
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

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
      <div className="z-10 w-full flex-1 flex flex-col items-center justify-center max-w-4xl px-4 py-4">
        <AnimatePresence mode="wait">
          {!showForm ? (
            /* VR Decision Screen */
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full"
            >
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
              <span className="bg-[#E29D29] text-white text-xs font-extrabold tracking-widest px-6 py-1.5 rounded-full uppercase shadow-[0_2px_10px_rgba(226,157,41,0.3)] mb-8">
                Quiz
              </span>

              {/* Decision Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-lg mt-2"
              >
                {/* Option 1: Already used VR -> Redirect direct to quiz selection */}
                <button
                  onClick={() => router.push("/quiz")}
                  className="w-full sm:w-auto bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-[0_4px_20px_rgba(226,157,41,0.45)] hover:shadow-[0_6px_24px_rgba(226,157,41,0.6)] transition-all tracking-wider uppercase flex items-center justify-center gap-2 border border-yellow-500/20"
                >
                  Saya sudah menggunakan VR
                  <svg className="w-4 h-4 fill-current stroke-current" viewBox="0 0 24 24" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12H19M19 12L12 5M19 12L12 19" />
                  </svg>
                </button>

                {/* Option 2: Haven't used VR -> Load Interactive Form */}
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full sm:w-auto bg-transparent hover:bg-white/5 active:scale-95 text-white/90 hover:text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full border border-white/20 hover:border-[#E29D29]/40 shadow-lg transition-all tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  Saya belum menggunakan VR
                </button>
              </motion.div>
            </motion.div>
          ) : (
            /* Interactive Data Collection Form */
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-full flex items-center justify-center"
            >
              <InteractiveStudentForm onComplete={onNext} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
