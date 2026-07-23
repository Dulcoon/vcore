"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import HeaderLogos from "@/components/HeaderLogos";
import BatikOrnament from "@/components/BatikOrnament";
import Logo from "@/components/Logo";
import ProblemSolvingImageGenerator from "@/components/quiz/ProblemSolvingImageGenerator";

interface Question {
  id: string;
  profession_id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_option: string;
  score_value: number;
}

export default function ProblemSolvingQuizPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [studentInfo, setStudentInfo] = useState<{ id?: string; name: string }>({ name: "Petualang" });
  const [professionInfo, setProfessionInfo] = useState<{ id?: string; name: string }>({ name: "Profesi Pilihan" });

  useEffect(() => {
    async function loadQuizData() {
      setLoading(true);
      let studentId: string | undefined;
      let studentName = "Petualang";
      let profId: string | undefined;
      let profName = "Profesi Pilihan";

      // 1. Get active student profile from localStorage
      try {
        const rawProfile = localStorage.getItem("active_student_profile");
        if (rawProfile) {
          const parsed = JSON.parse(rawProfile);
          if (parsed.id) studentId = parsed.id;
          if (parsed.name) studentName = parsed.name;
        }
      } catch (_) {}

      // Fallback: latest student
      if (!studentId) {
        const { data: latestStudent } = await supabase
          .from("students")
          .select("id, name")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (latestStudent) {
          studentId = latestStudent.id;
          studentName = latestStudent.name;
        }
      }

      setStudentInfo({ id: studentId, name: studentName });

      // 2. Resolve Student Plan / Profession
      if (studentId) {
        const { data: plan } = await supabase
          .from("student_plans")
          .select("profession_id, professions(id, name)")
          .eq("student_id", studentId)
          .limit(1)
          .single();

        if (plan && plan.professions) {
          const p = Array.isArray(plan.professions) ? plan.professions[0] : plan.professions;
          if (p) {
            profId = p.id;
            profName = p.name;
          }
        }
      }

      // Fallback: selected_job_name from localStorage
      if (!profId) {
        try {
          const jobName = localStorage.getItem("selected_job_name");
          if (jobName) {
            const { data: profBySlug } = await supabase
              .from("professions")
              .select("id, name")
              .or(`slug.eq.${jobName},name.ilike.%${jobName}%`)
              .limit(1)
              .single();

            if (profBySlug) {
              profId = profBySlug.id;
              profName = profBySlug.name;
            }
          }
        } catch (_) {}
      }

      setProfessionInfo({ id: profId, name: profName });

      // 3. Fetch Questions for this profession
      let fetchedQuestions: Question[] = [];
      if (profId) {
        const { data: dbQuestions } = await supabase
          .from("problem_solving_questions")
          .select("*")
          .eq("profession_id", profId)
          .order("created_at", { ascending: true });

        if (dbQuestions && dbQuestions.length > 0) {
          fetchedQuestions = dbQuestions;
        }
      }

      if (fetchedQuestions.length === 0) {
        const { data: fallbackQuestions } = await supabase
          .from("problem_solving_questions")
          .select("*")
          .limit(5);

        if (fallbackQuestions && fallbackQuestions.length > 0) {
          fetchedQuestions = fallbackQuestions;
        } else {
          fetchedQuestions = [
            {
              id: "fallback-1",
              question_text: "Saat menghadapi kendala tidak terduga dalam pekerjaan, tindakan utama yang tepat adalah...",
              option_a: "Mengidentifikasi penyebab masalah dan mencari solusi terbaik dengan tenang",
              option_b: "Menunda pekerjaan sampai diberikan instruksi langsung",
              option_c: "Mengabaikan masalah dan lanjut ke tugas lainnya",
              correct_option: "A",
              score_value: 10,
            },
            {
              id: "fallback-2",
              question_text: "Bagaimana cara terbaik dalam menjaga komunikasi efektif dengan tim atau pelanggan?",
              option_a: "Mendengarkan dengan cermat, bersikap ramah, dan menyampaikan informasi yang jelas",
              option_b: "Berbicara sesedikit mungkin tanpa senyum",
              option_c: "Hanya menjawab jika ditanya berulang kali",
              correct_option: "A",
              score_value: 10,
            },
          ];
        }
      }

      setQuestions(fetchedQuestions);
      setMaxScore(100);
      setLoading(false);
    }

    loadQuizData();
  }, []);

  const handleNext = () => {
    if (!selectedOption) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correct_option;
    const newCorrectCount = score + (isCorrect ? 1 : 0);
    setScore(newCorrectCount);

    setSelectedOption(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz(newCorrectCount);
    }
  };

  const finishQuiz = async (finalCorrectCount: number) => {
    const calculatedScore = questions.length > 0
      ? Math.round((finalCorrectCount / questions.length) * 100)
      : 0;

    setScore(calculatedScore);
    setIsFinished(true);
    setIsSaving(true);

    if (studentInfo.id && professionInfo.id) {
      try {
        await supabase.from("student_quiz_results").insert([
          {
            student_id: studentInfo.id,
            profession_id: professionInfo.id,
            score: calculatedScore,
            max_score: 100,
          },
        ]);
      } catch (err) {
        console.error("Failed to save quiz results to database:", err);
      }
    }
    setIsSaving(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      router.push("/planning");
    }
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-[#050616] text-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#E29D29] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/60 text-xs font-semibold">Memuat Kuis Problem Solving...</p>
      </main>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-[#101235] to-[#050616] text-white flex flex-col justify-between items-center p-4 sm:p-8 relative overflow-hidden select-none">
      {/* Ambient Glow */}
      <div className="absolute w-[350px] h-[350px] rounded-full blur-[130px] bg-[#E29D29]/20 top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

      {/* Batik Ornaments */}
      <BatikOrnament position="top-left" />
      <BatikOrnament position="top-right" />
      <BatikOrnament position="bottom-left" />
      <BatikOrnament position="bottom-right" />

      {/* Institution Header Logos */}
      <div className="z-10 w-full max-w-4xl mt-2 mb-2">
        <HeaderLogos />
      </div>

      {/* Main Container */}
      <div className="z-10 w-full max-w-lg flex-1 flex flex-col items-center justify-center py-4 my-auto">
        <Logo className="w-28 sm:w-36 mx-auto mb-2" />
        <h2 className="text-white text-xl sm:text-2xl font-bold font-serif text-center leading-snug drop-shadow-md mb-1">
          Kuis Problem Solving
        </h2>
        <p className="text-white/50 text-xs text-center mb-6">
          Uji pemahaman dan kemampuan penyelesaian masalahmu untuk profesi ini
        </p>

        <AnimatePresence mode="wait">
          {!isFinished && currentQ ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full bg-[#1c1e4c]/70 border border-[#E29D29]/30 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px]"
            >
              {/* Card Glow */}
              <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] rounded-full blur-[60px] bg-[#E29D29]/15 pointer-events-none z-0" />

              <div className="z-10 flex-1 flex flex-col justify-between">
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                      aria-label="Kembali"
                      title="Kembali"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-[#E29D29] text-xs font-bold uppercase tracking-wider">
                      Soal {currentIndex + 1} dari {questions.length}
                    </span>
                  </div>

                  {/* Step dots */}
                  <div className="flex gap-1.5">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === currentIndex
                            ? "bg-[#E29D29] scale-125 shadow-[0_0_8px_rgba(226,157,41,0.6)]"
                            : idx < currentIndex
                            ? "bg-[#E29D29]/60"
                            : "bg-white/15"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question Card */}
                <div className="w-full bg-[#121338]/80 border border-white/10 rounded-2xl p-5 text-center shadow-inner mb-4">
                  <h3 className="text-white text-sm sm:text-base font-serif font-bold leading-relaxed">
                    {currentQ.question_text}
                  </h3>
                </div>

                {/* Options A, B, C */}
                <div className="flex flex-col gap-2.5 w-full mb-6">
                  {[
                    { key: "A", text: currentQ.option_a },
                    { key: "B", text: currentQ.option_b },
                    { key: "C", text: currentQ.option_c },
                  ].map((opt) => {
                    const isSelected = selectedOption === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => setSelectedOption(opt.key)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-[#E29D29] border-transparent text-white shadow-[0_4px_15px_rgba(226,157,41,0.35)] font-bold"
                            : "bg-[#121338]/80 hover:bg-white/5 border-white/10 text-white/80 hover:text-white"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                            isSelected
                              ? "bg-white text-[#E29D29]"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="text-xs sm:text-sm leading-snug">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Submit / Next Button */}
                <button
                  disabled={!selectedOption}
                  onClick={handleNext}
                  className="w-full bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-full shadow-[0_4px_15px_rgba(226,157,41,0.35)] tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-yellow-500/30 cursor-pointer"
                >
                  <span>{currentIndex < questions.length - 1 ? "LANJUT" : "SELESAIKAN KUIS"}</span>
                  <svg className="w-4 h-4 fill-current stroke-current" viewBox="0 0 24 24" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12H19M19 12L12 5M19 12L12 19" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ) : (
            /* Results Screen */
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-[#1c1e4c]/70 border border-[#E29D29]/30 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-[#E29D29]/20 border border-[#E29D29]/40 rounded-full flex items-center justify-center mb-4 text-[#F9CA75] shadow-[0_0_20px_rgba(226,157,41,0.3)]">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h3 className="text-white text-xl sm:text-2xl font-bold font-serif mb-1">
                Kuis Problem Solving Selesai!
              </h3>
              <p className="text-white/60 text-xs mb-6">
                Hasil Studi Kasus Profesi: <span className="text-[#F9CA75] font-semibold">{professionInfo.name}</span>
              </p>

              {/* Score Display Card */}
              <div className="w-full bg-[#121338]/80 border border-white/10 rounded-2xl p-5 mb-6 text-center space-y-1">
                <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider font-semibold">Skor Akhir Kamu</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F9CA75] font-serif">
                  {score} <span className="text-lg text-white/40 font-sans font-normal">/ {maxScore}</span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                <ProblemSolvingImageGenerator
                  studentName={studentInfo.name}
                  professionName={professionInfo.name}
                  score={score}
                  maxScore={maxScore}
                />

                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-full shadow-[0_4px_20px_rgba(226,157,41,0.4)] tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-yellow-500/30 cursor-pointer"
                >
                  <span>Kembali ke Beranda</span>
                  <svg className="w-4 h-4 fill-current stroke-current" viewBox="0 0 24 24" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
