"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import JobSelectQuiz from "@/components/quiz/JobSelectQuiz";
import SelectProfileQuiz from "@/components/quiz/SelectProfileQuiz";
import PlanBuilderQuiz from "@/components/quiz/PlanBuilderQuiz";
import HeaderLogos from "@/components/HeaderLogos";
import BatikOrnament from "@/components/BatikOrnament";
import Logo from "@/components/Logo";

interface Profile {
  id?: string;
  name: string;
  age: string;
  grade: string;
  avatar?: string;
}

export default function PlanningPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"select-profile" | "intro" | "select-job" | "quiz">("select-profile");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);

  // Read active_student_profile on mount
  useEffect(() => {
    try {
      const active = localStorage.getItem("active_student_profile");
      if (active) {
        const parsed = JSON.parse(active);
        setActiveProfile(parsed);
        setPhase("intro"); // Direct to intro screen after self-appraisal quiz
      } else {
        setPhase("select-profile");
      }
    } catch (error) {
      console.error("Failed to load active student profile from localStorage:", error);
      setPhase("select-profile");
    }
  }, []);

  const handleSelectProfile = (profile: Profile) => {
    setActiveProfile(profile);
    try {
      localStorage.setItem("active_student_profile", JSON.stringify(profile));
    } catch (_) {}
    setPhase("intro");
  };

  const handleSelectJob = (jobName: string) => {
    setSelectedJob(jobName);
    try {
      localStorage.setItem("selected_job_name", jobName);
    } catch (_) {}
    setPhase("quiz");
  };

  const handleFinish = () => {
    router.push("/problem-solving-quiz");
  };

  if (phase === "select-profile") {
    return <SelectProfileQuiz onSelect={handleSelectProfile} onBack={() => router.push("/")} />;
  }

  if (phase === "intro") {
    return (
      <main className="w-full min-h-screen bg-gradient-to-b from-[#101235] to-[#050616] text-white flex flex-col justify-center items-center p-4 sm:p-8 relative overflow-hidden select-none">
        {/* Ambient Glow */}
        <div className="absolute w-[350px] h-[350px] rounded-full blur-[130px] bg-[#E29D29]/20 top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

        {/* Batik Ornaments */}
        <BatikOrnament position="top-left" />
        <BatikOrnament position="top-right" />
        <BatikOrnament position="bottom-left" />
        <BatikOrnament position="bottom-right" />

        {/* Institution Header Logos (Positioned Top) */}
        <div className="absolute top-4 left-0 right-0 z-10 w-full max-w-4xl mx-auto px-4">
          <HeaderLogos />
        </div>

        {/* Main Centered Content Area (100% Vertically Centered) */}
        <div className="z-10 w-full max-w-lg my-auto pt-14 pb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full bg-[#1c1e4c]/75 border border-[#E29D29]/30 rounded-[2.5rem] p-6 sm:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
          >
            {/* Card Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[160px] h-[160px] rounded-full blur-[60px] bg-[#E29D29]/15 pointer-events-none z-0" />

            {/* Back Button */}
            <button
              onClick={() => router.push("/self-appraisal-quiz")}
              className="self-start mb-3 px-4 py-1.5 bg-[#121338]/80 hover:bg-white/10 text-[#B6B2DA] hover:text-white rounded-full border border-[#E29D29]/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Kembali</span>
            </button>

            {/* Target / Plan Icon */}
            <div className="w-16 h-16 bg-[#E29D29]/20 border border-[#E29D29]/40 rounded-full flex items-center justify-center mb-5 text-[#F9CA75] shadow-[0_0_20px_rgba(226,157,41,0.3)]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>

            <h2 className="text-white text-xl sm:text-2xl font-bold font-serif leading-snug mb-2">
              Saatnya Menyusun Rencana Cita-Citamu!
            </h2>

            <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6 max-w-xs">
              Halo <span className="text-[#F9CA75] font-semibold">{activeProfile?.name || "Petualang"}</span>! Berdasarkan hasil evaluasi diri kamu, yuk tentukan profesi impian dan susun langkah nyatamu!
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPhase("select-job")}
              className="w-full bg-[#E29D29] hover:bg-[#F2AE3A] text-white font-extrabold text-xs sm:text-sm py-4 px-6 rounded-full shadow-[0_5px_25px_rgba(226,157,41,0.4)] tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-yellow-500/30 cursor-pointer"
            >
              <span>Mulai Menyusun Rencana</span>
              <svg className="w-4 h-4 fill-current stroke-current" viewBox="0 0 24 24" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12H19M19 12L12 5M19 12L12 19" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </main>
    );
  }

  if (phase === "select-job") {
    return <JobSelectQuiz onSelect={handleSelectJob} onBack={() => setPhase("intro")} />;
  }

  const handleBack = () => {
    setPhase("select-job");
  };

  // Quiz / plan builder phase
  return (
    <PlanBuilderQuiz
      job={selectedJob}
      profile={activeProfile}
      onFinish={handleFinish}
      onBack={handleBack}
    />
  );
}
