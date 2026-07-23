"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import HeaderLogos from "@/components/HeaderLogos";
import BatikOrnament from "@/components/BatikOrnament";
import Logo from "@/components/Logo";

import SelfAppraisalImageGenerator from "@/components/quiz/SelfAppraisalImageGenerator";

interface Question {
  id: string | number;
  statement: string;
  category: string;
}

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "1",
    statement: "Apakah kamu suka mencoba hal-hal baru dan bereksperimen?",
    category: "Eksplorasi & Inovasi",
  },
  {
    id: "2",
    statement: "Apakah kamu merasa senang ketika membantu atau melayani orang lain?",
    category: "Kepedulian & Sosial",
  },
  {
    id: "3",
    statement: "Apakah kamu menikmati kegiatan yang membutuhkan ide kreatif dan seni?",
    category: "Kreativitas & Seni",
  },
  {
    id: "4",
    statement: "Apakah kamu merasa percaya diri saat berbicara dan menyampaikan ide?",
    category: "Komunikasi",
  },
  {
    id: "5",
    statement: "Apakah kamu suka bekerja secara terstruktur, rapi, dan terencana?",
    category: "Manajemen & Organisasi",
  },
];

export default function SelfAppraisalQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("Petualang");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function initQuiz() {
      // 1. Get active student profile from localStorage
      let sid: string | null = null;
      let sname = "Petualang";

      try {
        const active = localStorage.getItem("active_student_profile");
        if (active) {
          const parsed = JSON.parse(active);
          if (parsed.id) sid = parsed.id;
          if (parsed.name) sname = parsed.name;
        }
      } catch (_) {}

      if (!sid) {
        const { data: latestStudent } = await supabase
          .from("students")
          .select("id, name")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (latestStudent) {
          sid = latestStudent.id;
          sname = latestStudent.name;
        }
      }

      setStudentId(sid);
      setStudentName(sname);

      // 2. Fetch questions from database
      try {
        const { data: dbQuestions, error } = await supabase
          .from("self_appraisal_questions")
          .select("*")
          .order("order_index", { ascending: true });

        if (!error && dbQuestions && dbQuestions.length > 0) {
          setQuestions(dbQuestions);
        }
      } catch (_) {}

      setLoading(false);
    }

    initQuiz();
  }, []);

  const handleAnswer = (answer: boolean) => {
    const nextAnswers = { ...answers, [currentIndex]: answer };
    setAnswers(nextAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz(nextAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: Record<number, boolean>) => {
    setIsFinished(true);
    const yesCount = Object.values(finalAnswers).filter(Boolean).length;

    if (studentId) {
      setIsSaving(true);
      try {
        await supabase.from("student_self_appraisal_results").insert([
          {
            student_id: studentId,
            yes_count: yesCount,
            total_questions: questions.length,
            answers_json: finalAnswers,
          },
        ]);
      } catch (err) {
        console.error("Failed to save self appraisal result:", err);
      }
      setIsSaving(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      router.push("/?step=4");
    }
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-[#050616] text-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#E29D29] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/60 text-xs font-semibold">Memuat Evaluasi Diri...</p>
      </main>
    );
  }

  const currentQ = questions[currentIndex];
  const yesCount = Object.values(answers).filter(Boolean).length;

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

      {/* Main Content Area */}
      <div className="z-10 w-full max-w-lg flex-1 flex flex-col items-center justify-center py-4 my-auto">
        <Logo className="w-28 sm:w-36 mx-auto mb-2" />
        <h2 className="text-white text-xl sm:text-2xl font-bold font-serif text-center leading-snug drop-shadow-md mb-1">
          Evaluasi Diri & Minat
        </h2>
        <p className="text-white/50 text-xs text-center mb-6">
          Kenali potensi dan minat bawaanmu sebelum menyusun rencana karier
        </p>

        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full bg-[#1c1e4c]/70 border border-[#E29D29]/30 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]"
            >
              {/* Card Glow */}
              <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] rounded-full blur-[60px] bg-[#E29D29]/15 pointer-events-none z-0" />

              <div className="z-10 flex-1 flex flex-col justify-between">
                {/* Header Navigation Bar */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/5 active:scale-95 transition-all opacity-100 cursor-pointer"
                    aria-label="Back"
                    title="Kembali"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Step Indicators */}
                  <div className="flex gap-2">
                    {questions.map((q, idx) => {
                      const isActive = currentIndex >= idx;
                      return (
                        <div
                          key={q.id || idx}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === currentIndex
                              ? "bg-[#E29D29] scale-125 shadow-[0_0_8px_rgba(226,157,41,0.6)]"
                              : isActive
                              ? "bg-[#E29D29]/60"
                              : "bg-white/15"
                          }`}
                        />
                      );
                    })}
                  </div>

                  <span className="text-white/40 text-xs font-semibold">
                    {currentIndex + 1}/{questions.length}
                  </span>
                </div>

                {/* Category & Question Statement */}
                <div className="flex-1 flex flex-col items-center justify-center my-4">
                  <span className="bg-[#E29D29]/20 border border-[#E29D29]/40 text-[#F9CA75] text-[10px] sm:text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
                    {currentQ.category}
                  </span>

                  <div className="w-full bg-[#121338]/80 border border-white/10 rounded-2xl p-5 sm:p-6 text-center shadow-inner">
                    <h3 className="text-white text-base sm:text-lg font-serif font-bold leading-relaxed">
                      &ldquo;{currentQ.statement}&rdquo;
                    </h3>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="w-full bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-full shadow-[0_4px_15px_rgba(226,157,41,0.35)] hover:shadow-[0_6px_20px_rgba(226,157,41,0.5)] transition-all tracking-widest uppercase flex items-center justify-center gap-2 border border-yellow-500/30 cursor-pointer"
                  >
                    <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Iya, Benar
                  </button>

                  <button
                    onClick={() => handleAnswer(false)}
                    className="w-full bg-transparent hover:bg-white/5 active:scale-95 text-white/80 hover:text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-full border border-white/20 hover:border-[#E29D29]/40 shadow-lg transition-all tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Tidak
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Results Screen */
            (() => {
              const strengths = questions.filter((_, idx) => answers[idx] === true).map((q) => q.statement);
              const growthAreas = questions.filter((_, idx) => answers[idx] === false).map((q) => q.statement);

              return (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full bg-[#1c1e4c]/70 border border-[#E29D29]/30 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col items-center text-center max-w-lg"
                >
                  <div className="w-16 h-16 bg-[#E29D29]/20 border border-[#E29D29]/40 rounded-full flex items-center justify-center mb-4 text-[#F9CA75] shadow-[0_0_20px_rgba(226,157,41,0.3)]">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <h3 className="text-white text-xl sm:text-2xl font-bold font-serif mb-1">
                    Hasil Evaluasi Diri
                  </h3>
                  <p className="text-white/60 text-xs mb-5">
                    Rapor Evaluasi untuk <span className="text-[#F9CA75] font-semibold">{studentName}</span>
                  </p>

                  {/* Strengths & Growth Areas Card */}
                  <div className="w-full bg-[#121338]/80 border border-white/10 rounded-2xl p-5 mb-4 text-left space-y-4 shadow-inner">
                    <div>
                      <h4 className="text-[#F9CA75] text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between border-b border-white/10 pb-2">
                        <span>💪 Kelebihan Utama Kamu</span>
                        <span className="text-xs bg-[#E29D29]/20 text-[#F9CA75] px-2 py-0.5 rounded-full font-mono">{strengths.length} Poin</span>
                      </h4>
                      {strengths.length > 0 ? (
                        <ul className="space-y-2 pt-1">
                          {strengths.map((s, idx) => (
                            <li key={idx} className="text-white/90 text-xs sm:text-sm flex items-start gap-2 leading-relaxed">
                              <span className="text-green-400 font-bold mt-0.5">✓</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-white/40 text-xs italic py-1">Belum ada data kelebihan.</p>
                      )}
                    </div>

                    <div className="pt-2">
                      <h4 className="text-[#E29D29] text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-between border-b border-white/10 pb-2">
                        <span>🌱 Area Yang Bisa Ditingkatkan</span>
                        <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-mono">{growthAreas.length} Poin</span>
                      </h4>
                      {growthAreas.length > 0 ? (
                        <ul className="space-y-2 pt-1">
                          {growthAreas.map((g, idx) => (
                            <li key={idx} className="text-white/80 text-xs sm:text-sm flex items-start gap-2 leading-relaxed">
                              <span className="text-amber-400 font-bold mt-0.5">•</span>
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-white/40 text-xs italic py-1">Semua indikator berhasil dijawab dengan sangat baik!</p>
                      )}
                    </div>
                  </div>

                  {/* Motivational Quote Box */}
                  <div className="w-full bg-[#E29D29]/10 border border-[#E29D29]/30 rounded-2xl p-4 mb-5 text-center shadow-md">
                    <p className="text-[#F9CA75] text-xs sm:text-sm font-serif italic leading-relaxed">
                      &ldquo;Pertahankan kekuatanmu dan terus kembangkan potensimu! Jangan takut jika masih ada hal yang perlu diperbaiki, karena setiap langkah belajar akan membawamu semakin dekat dengan cita-cita&rdquo;
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full flex flex-col gap-3">
                    <SelfAppraisalImageGenerator
                      studentName={studentName}
                      strengths={strengths}
                      growthAreas={growthAreas}
                    />

                    <button
                      onClick={() => router.push("/planning")}
                      className="w-full bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-full shadow-[0_4px_20px_rgba(226,157,41,0.4)] tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-yellow-500/30 cursor-pointer"
                    >
                      <span>Lanjut ke Perencanaan Karier</span>
                      <svg className="w-4 h-4 fill-current stroke-current" viewBox="0 0 24 24" fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12H19M19 12L12 5M19 12L12 19" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              );
            })()
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
