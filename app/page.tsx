"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroStep from "@/components/steps/HeroStep";
import CatchphraseStep from "@/components/steps/CatchphraseStep";
import AboutStep from "@/components/steps/AboutStep";
import QuizIntroStep from "@/components/steps/QuizIntroStep";
import VRInstructionStep from "@/components/steps/VRInstructionStep";

export default function Home() {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  return (
    <main className="w-full h-screen bg-[#07070a] text-white overflow-hidden relative flex flex-col justify-between">
      {/* Ambient backgrounds */}
      <div className="absolute top-[10%] left-[10%] w-[35%] h-[35%] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Shared Background for Steps 1-3 */}
      <div
        className={`absolute inset-0 z-0 bg-cover bg-no-repeat transition-all duration-1000 ease-in-out
          ${step <= 3 ? 'opacity-100' : 'opacity-0'}
          ${step === 1 ? 'bg-left md:bg-center' : ''}
          ${step === 2 ? 'bg-center md:bg-center' : ''}
          ${step === 3 ? 'bg-right md:bg-center' : ''}
        `}
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
        }}
      />

      {/* Fullscreen Presentation Container */}
      <div className="w-full h-full relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {step === 1 && <HeroStep onNext={handleNext} />}
            {step === 2 && <CatchphraseStep onNext={handleNext} />}
            {step === 3 && <AboutStep onNext={handleNext} />}
            {step === 4 && <QuizIntroStep onNext={handleNext} />}
            {step === 5 && <VRInstructionStep />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Navigator Indicators at the bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center bg-black/40 px-4 py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${i === step
              ? "bg-[#E29D29] scale-125 shadow-[0_0_12px_rgba(226,157,41,0.6)]"
              : "bg-white/20 hover:bg-white/40"
              }`}
            aria-label={`Slide ${i}`}
          />
        ))}
      </div>
    </main>
  );
}
