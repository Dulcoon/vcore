import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import BatikOrnament from "../BatikOrnament";
import HeaderLogos from "../HeaderLogos";
import Logo from "../Logo";
import Image from "next/image";
import InteractiveStudentForm from "./InteractiveStudentForm";

interface StepProps {
  onNext?: () => void;
}

export default function QuizIntroStep({ onNext }: StepProps) {
  const [phase, setPhase] = useState<"form" | "quiz-intro">("form");
  const router = useRouter();

  return (
    <div className="w-full h-full relative flex flex-col justify-between items-center pt-8 pb-20 px-4 sm:px-8 bg-gradient-to-b from-[#1E2258] to-[#121438] select-none">
      {/* Batik Ornaments in corners */}
      <BatikOrnament position="top-left" />
      <BatikOrnament position="top-right" />
      <BatikOrnament position="bottom-left" />
      <BatikOrnament position="bottom-right" />

      {/* Institution logos bar at top */}
      <div className="z-10 w-full max-w-4xl mt-2">
        <HeaderLogos />
      </div>

      {/* Content Area */}
      <div className="z-10 w-full flex-1 flex flex-col items-center justify-center max-w-4xl px-2 py-4">
        <AnimatePresence mode="wait">
          {phase === "form" ? (
            /* Phase 1: Interactive Data Collection Form ("Ayo Kenalan!") */
            <motion.div
              key="form-phase"
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -15 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-full flex flex-col items-center justify-center"
            >
              <Logo className="w-28 sm:w-36 mb-3" />
              <InteractiveStudentForm
                onComplete={() => setPhase("quiz-intro")}
                onBack={onNext}
              />
            </motion.div>
          ) : (
            /* Phase 2: Quiz Intro Screen ("Yuk cari tahu apa kelebihan dan kekuranganmu!") */
            <motion.div
              key="quiz-intro-phase"
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full max-w-xl text-center relative"
            >
              {/* Back Button to return to Form */}
              <button
                onClick={() => setPhase("form")}
                className="self-start mb-3 px-4 py-2 bg-[#1C1E4C]/80 hover:bg-[#2A2D6C] text-[#B6B2DA] hover:text-white rounded-full border border-[#E29D29]/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Kembali ke Data Diri</span>
              </button>

              {/* Logo */}
              <div className="mb-2">
                <Logo className="w-36 md:w-48" />
              </div>

              {/* Heading */}
              <h2 className="text-white text-2xl md:text-3xl font-bold font-serif text-center max-w-xl leading-snug mb-5">
                Yuk cari tahu apa kelebihan dan kekuranganmu!
              </h2>

              {/* Center Illustration with Rounded Card Container */}
              <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-[2rem] border-4 border-[#E29D29] overflow-hidden bg-white/5 shadow-2xl p-1 mb-4">
                <div className="w-full h-full relative rounded-[1.7rem] overflow-hidden">
                  <Image
                    src="/images/quiz_illus.png"
                    alt="Quiz Illustration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Action Button: "Mulai Quiz Evaluasi Diri →" */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center w-full max-w-md mt-4"
              >
                <button
                  onClick={() => router.push("/self-appraisal-quiz")}
                  className="w-full sm:w-auto bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-extrabold text-sm sm:text-base px-10 py-4 rounded-full shadow-[0_4px_25px_rgba(226,157,41,0.5)] hover:shadow-[0_6px_30px_rgba(226,157,41,0.7)] transition-all tracking-wider uppercase flex items-center justify-center gap-3 border border-yellow-500/30 cursor-pointer"
                >
                  Mulai Quiz Evaluasi Diri
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
