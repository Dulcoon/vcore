"use client";

import { useState, useEffect } from "react";
import JobSelectQuiz from "@/components/quiz/JobSelectQuiz";
import SelectProfileQuiz from "@/components/quiz/SelectProfileQuiz";

interface Profile {
  name: string;
  age: string;
  grade: string;
}

export default function QuizPage() {
  const [phase, setPhase] = useState<"select-profile" | "select-job" | "quiz">("select-profile");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);

  // Read active_student_profile on mount to verify if they came from the onboarding form
  useEffect(() => {
    const active = localStorage.getItem("active_student_profile");
    if (active) {
      try {
        const parsed = JSON.parse(active);
        setActiveProfile(parsed);
        setPhase("select-job"); // Auto-skip profile selection since they just created it
      } catch (error) {
        console.error("Failed to load active student profile from localStorage:", error);
      }
      // Remove it so returning visits can choose a profile manually
      localStorage.removeItem("active_student_profile");
    } else {
      setPhase("select-profile");
    }
  }, []);

  const handleSelectProfile = (profile: Profile) => {
    setActiveProfile(profile);
    setPhase("select-job");
  };

  const handleSelectJob = (jobName: string) => {
    setSelectedJob(jobName);
    setPhase("quiz");
  };

  if (phase === "select-profile") {
    return <SelectProfileQuiz onSelect={handleSelectProfile} />;
  }

  if (phase === "select-job") {
    return <JobSelectQuiz onSelect={handleSelectJob} />;
  }

  return (
    <main className="min-h-screen bg-[#07070a] text-white flex items-center justify-center p-4">
      <div className="text-center bg-[#1c1e4c]/70 border border-white/10 p-8 rounded-[2rem] max-w-md w-full backdrop-blur-md shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#E29D29] mb-4">Mulai Petualangan!</h1>
        <p className="text-white/60 text-sm mb-6 leading-relaxed">
          Kuis untuk pekerjaan <strong className="text-white font-bold">{selectedJob}</strong> siap dimulai untuk:
        </p>
        {activeProfile && (
          <div className="bg-[#121338] border border-white/5 py-3.5 px-4 rounded-xl mb-4">
            <p className="text-white font-bold text-base">{activeProfile.name}</p>
            <p className="text-white/40 text-xs mt-0.5">{activeProfile.grade} • Umur {activeProfile.age}</p>
          </div>
        )}
        <p className="text-white/30 text-xxs italic mt-8">Halaman pertanyaan utama akan diintegrasikan pada tahap selanjutnya.</p>
      </div>
    </main>
  );
}
