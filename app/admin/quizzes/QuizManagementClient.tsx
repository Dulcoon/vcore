"use client";

import React, { useState } from "react";
import Modal from "@/components/admin/Modal";
import { supabase } from "@/lib/supabase";

interface Profession {
  id: string;
  name: string;
  icon?: string;
}

interface ProblemSolvingQuestion {
  id: string;
  profession_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_option: string;
  score_value: number;
  professions?: { id: string; name: string; icon?: string };
}

interface SelfAppraisalQuestion {
  id: string;
  statement: string;
  category: string;
  order_index?: number;
}

interface ProblemSolvingResult {
  id: string;
  student_id: string;
  profession_id: string;
  score: number;
  max_score: number;
  created_at: string;
  students?: { id: string; name: string; age: string; grade: string };
  professions?: { id: string; name: string; icon?: string };
}

interface SelfAppraisalResult {
  id: string;
  student_id: string;
  yes_count: number;
  total_questions: number;
  answers_json?: any;
  created_at: string;
  students?: { id: string; name: string; age: string; grade: string };
}

interface QuizManagementClientProps {
  initialProfessions: Profession[];
  initialProblemSolvingQuestions: ProblemSolvingQuestion[];
  initialSelfAppraisalQuestions: SelfAppraisalQuestion[];
  initialProblemSolvingResults: ProblemSolvingResult[];
  initialSelfAppraisalResults: SelfAppraisalResult[];
}

export default function QuizManagementClient({
  initialProfessions,
  initialProblemSolvingQuestions,
  initialSelfAppraisalQuestions,
  initialProblemSolvingResults,
  initialSelfAppraisalResults,
}: QuizManagementClientProps) {
  const [activeTab, setActiveTab] = useState<"problem-solving" | "self-appraisal" | "recap">("problem-solving");

  // Problem Solving state
  const [psQuestions, setPsQuestions] = useState<ProblemSolvingQuestion[]>(initialProblemSolvingQuestions);
  const [selectedProfFilter, setSelectedProfFilter] = useState<string>("ALL");
  const [psSearch, setPsSearch] = useState("");

  // Self Appraisal state
  const [saQuestions, setSaQuestions] = useState<SelfAppraisalQuestion[]>(initialSelfAppraisalQuestions);
  const [saSearch, setSaSearch] = useState("");

  // Recaps state
  const [psResults] = useState<ProblemSolvingResult[]>(initialProblemSolvingResults);
  const [saResults] = useState<SelfAppraisalResult[]>(initialSelfAppraisalResults);
  const [recapSearch, setRecapSearch] = useState("");

  // Modals & Forms
  const [isPsModalOpen, setIsPsModalOpen] = useState(false);
  const [editingPsQ, setEditingPsQ] = useState<ProblemSolvingQuestion | null>(null);

  const [isSaModalOpen, setIsSaModalOpen] = useState(false);
  const [editingSaQ, setEditingSaQ] = useState<SelfAppraisalQuestion | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form States: Problem Solving
  const [professionId, setProfessionId] = useState<string>(initialProfessions[0]?.id || "");
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [correctOption, setCorrectOption] = useState("A");
  const [scoreValue, setScoreValue] = useState(10);

  // Form States: Self Appraisal
  const [statement, setStatement] = useState("");
  const [category, setCategory] = useState("Eksplorasi & Inovasi");
  const [orderIndex, setOrderIndex] = useState(1);

  // Open Create/Edit PS Modal
  const openPsModal = (q?: ProblemSolvingQuestion) => {
    if (q) {
      setEditingPsQ(q);
      setProfessionId(q.profession_id);
      setQuestionText(q.question_text);
      setOptionA(q.option_a);
      setOptionB(q.option_b);
      setOptionC(q.option_c);
      setCorrectOption(q.correct_option);
      setScoreValue(q.score_value);
    } else {
      setEditingPsQ(null);
      setProfessionId(initialProfessions[0]?.id || "");
      setQuestionText("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setCorrectOption("A");
      setScoreValue(10);
    }
    setIsPsModalOpen(true);
  };

  // Open Create/Edit SA Modal
  const openSaModal = (q?: SelfAppraisalQuestion) => {
    if (q) {
      setEditingSaQ(q);
      setStatement(q.statement);
      setCategory(q.category);
      setOrderIndex(q.order_index || 1);
    } else {
      setEditingSaQ(null);
      setStatement("");
      setCategory("Eksplorasi & Inovasi");
      setOrderIndex(saQuestions.length + 1);
    }
    setIsSaModalOpen(true);
  };

  // Primary action button handler based on current tab
  const handleAddNew = () => {
    if (activeTab === "problem-solving") {
      openPsModal();
    } else if (activeTab === "self-appraisal") {
      openSaModal();
    }
  };

  // Save Problem Solving Question
  const handleSavePsQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText || !optionA || !optionB || !optionC || !professionId) {
      alert("Mohon lengkapi seluruh field kuis!");
      return;
    }

    setIsSaving(true);

    try {
      if (editingPsQ) {
        const { data, error } = await supabase
          .from("problem_solving_questions")
          .update({
            profession_id: professionId,
            question_text: questionText,
            option_a: optionA,
            option_b: optionB,
            option_c: optionC,
            correct_option: correctOption,
            score_value: Number(scoreValue) || 10,
          })
          .eq("id", editingPsQ.id)
          .select("*, professions(id, name, icon)")
          .single();

        setIsSaving(false);
        if (error) {
          alert("Gagal memperbarui soal: " + error.message);
        } else if (data) {
          setPsQuestions(psQuestions.map((q) => (q.id === editingPsQ.id ? data : q)));
          setIsPsModalOpen(false);
        }
      } else {
        const { data, error } = await supabase
          .from("problem_solving_questions")
          .insert([
            {
              profession_id: professionId,
              question_text: questionText,
              option_a: optionA,
              option_b: optionB,
              option_c: optionC,
              correct_option: correctOption,
              score_value: Number(scoreValue) || 10,
            },
          ])
          .select("*, professions(id, name, icon)")
          .single();

        setIsSaving(false);
        if (error) {
          alert("Gagal menambahkan soal: " + error.message);
        } else if (data) {
          setPsQuestions([data, ...psQuestions]);
          setIsPsModalOpen(false);
        }
      }
    } catch (err: any) {
      setIsSaving(false);
      alert("Gagal terhubung ke server (Failed to fetch). Silakan refresh halaman jika Anda baru saja mengeksekusi SQL di Supabase.");
    }
  };

  // Delete Problem Solving Question
  const handleDeletePsQuestion = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus soal ini?")) return;
    setIsDeleting(id);
    try {
      const { error } = await supabase.from("problem_solving_questions").delete().eq("id", id);
      setIsDeleting(null);

      if (error) {
        alert("Gagal menghapus soal: " + error.message);
      } else {
        setPsQuestions(psQuestions.filter((q) => q.id !== id));
      }
    } catch (err: any) {
      setIsDeleting(null);
      alert("Gagal terhubung ke server. Silakan coba beberapa saat lagi.");
    }
  };

  // Save Self Appraisal Question
  const handleSaveSaQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement || !category) {
      alert("Mohon lengkapi pernyataan dan kategori!");
      return;
    }

    setIsSaving(true);

    try {
      if (editingSaQ) {
        const { data, error } = await supabase
          .from("self_appraisal_questions")
          .update({
            statement,
            category,
            order_index: Number(orderIndex) || 1,
          })
          .eq("id", editingSaQ.id)
          .select("*")
          .single();

        setIsSaving(false);
        if (error) {
          alert("Gagal memperbarui evaluasi diri: " + error.message);
        } else if (data) {
          setSaQuestions(saQuestions.map((item) => (item.id === editingSaQ.id ? data : item)));
          setIsSaModalOpen(false);
        }
      } else {
        const { data, error } = await supabase
          .from("self_appraisal_questions")
          .insert([
            {
              statement,
              category,
              order_index: Number(orderIndex) || 1,
            },
          ])
          .select("*")
          .single();

        setIsSaving(false);
        if (error) {
          alert("Gagal menambahkan evaluasi diri: " + error.message);
        } else if (data) {
          setSaQuestions([...saQuestions, data]);
          setIsSaModalOpen(false);
        }
      }
    } catch (err: any) {
      setIsSaving(false);
      alert("Gagal terhubung ke server (Failed to fetch). Silakan refresh halaman jika Anda baru saja mengeksekusi SQL di Supabase.");
    }
  };

  // Delete Self Appraisal Question
  const handleDeleteSaQuestion = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pernyataan evaluasi ini?")) return;
    setIsDeleting(id);
    const { error } = await supabase.from("self_appraisal_questions").delete().eq("id", id);
    setIsDeleting(null);

    if (error) {
      alert("Gagal menghapus: " + error.message);
    } else {
      setSaQuestions(saQuestions.filter((q) => q.id !== id));
    }
  };

  // Filtered lists
  const filteredPsQuestions = psQuestions
    .filter((q) => selectedProfFilter === "ALL" || q.profession_id === selectedProfFilter)
    .filter((q) => q.question_text.toLowerCase().includes(psSearch.toLowerCase()));

  const filteredSaQuestions = saQuestions.filter(
    (q) =>
      q.statement.toLowerCase().includes(saSearch.toLowerCase()) ||
      q.category.toLowerCase().includes(saSearch.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* ── Top Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#1B1A3E]/80 backdrop-blur-md p-4 sm:p-5 border border-[#3B366E] rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#F9CA75]">Kelola Quiz</h2>
          <p className="text-[#B6B2DA] text-xs sm:text-sm mt-0.5">
            Kelola bank soal problem solving, evaluasi diri, dan rekap hasil siswa.
          </p>
        </div>

        {activeTab !== "recap" && (
          <button
            onClick={handleAddNew}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#F2A93B] hover:bg-[#F9CA75] text-[#0F0E24] font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>{activeTab === "problem-solving" ? "Tambah Soal" : "Tambah Evaluasi"}</span>
          </button>
        )}
      </div>

      {/* ── Segmented Tab Bar ─────────────────────────────────── */}
      <div className="bg-[#0F0E24] p-1.5 rounded-2xl border border-[#3B366E] flex gap-1 shadow-inner">
        <button
          onClick={() => setActiveTab("problem-solving")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all text-center cursor-pointer ${
            activeTab === "problem-solving"
              ? "bg-[#E29D29] text-white shadow-md"
              : "text-[#B6B2DA] hover:text-white hover:bg-white/5"
          }`}
        >
          Problem Solving <span className="opacity-70">({psQuestions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("self-appraisal")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all text-center cursor-pointer ${
            activeTab === "self-appraisal"
              ? "bg-[#E29D29] text-white shadow-md"
              : "text-[#B6B2DA] hover:text-white hover:bg-white/5"
          }`}
        >
          Evaluasi Diri <span className="opacity-70">({saQuestions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("recap")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all text-center cursor-pointer ${
            activeTab === "recap"
              ? "bg-[#E29D29] text-white shadow-md"
              : "text-[#B6B2DA] hover:text-white hover:bg-white/5"
          }`}
        >
          Hasil Siswa <span className="opacity-70">({psResults.length + saResults.length})</span>
        </button>
      </div>

      {/* ── TAB 1: PROBLEM SOLVING QUIZ ───────────────────────── */}
      {activeTab === "problem-solving" && (
        <div className="space-y-4">
          {/* Combined Filter Toolbar (Search + Profession Dropdown) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2 relative">
              <input
                type="text"
                placeholder="Cari kata kunci soal..."
                value={psSearch}
                onChange={(e) => setPsSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#1B1A3E] border border-[#3B366E] rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F2A93B]"
              />
              <svg className="w-4 h-4 text-[#B6B2DA] absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Compact Dropdown Filter with styled chevron */}
            <div className="relative">
              <select
                value={selectedProfFilter}
                onChange={(e) => setSelectedProfFilter(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-[#1B1A3E] border border-[#3B366E] rounded-xl text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#F2A93B] appearance-none cursor-pointer"
              >
                <option value="ALL">Semua Profesi ({psQuestions.length})</option>
                {initialProfessions.map((prof) => {
                  const count = psQuestions.filter((q) => q.profession_id === prof.id).length;
                  return (
                    <option key={prof.id} value={prof.id}>
                      {prof.icon} {prof.name} ({count})
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#B6B2DA]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-3">
            {filteredPsQuestions.length === 0 ? (
              <div className="bg-[#1B1A3E]/60 border border-[#3B366E] rounded-2xl p-8 text-center text-[#B6B2DA] space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#0F0E24] border border-[#3B366E] flex items-center justify-center mx-auto text-lg text-[#F9CA75]">
                  💡
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white/90">Belum ada soal kuis untuk kriteria ini.</p>
                <p className="text-[11px] text-[#B6B2DA]/70">Klik tombol <span className="text-[#F9CA75] font-bold">+ Tambah Soal</span> di atas untuk menambahkan.</p>
              </div>
            ) : (
              filteredPsQuestions.map((q, idx) => {
                const prof = q.professions;
                return (
                  <div
                    key={q.id}
                    className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl p-4 sm:p-5 shadow-md hover:border-[#F2A93B]/40 transition-all space-y-3"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-[#0F0E24] text-[#F9CA75] text-xs font-bold border border-[#3B366E]">
                          {prof?.icon} {prof?.name || "Umum"}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#E29D29]/15 text-[#F9CA75] border border-[#E29D29]/30 text-[10px] font-extrabold">
                          Skala Nilai: 100 Poin
                        </span>
                      </div>

                      {/* Action Icons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openPsModal(q)}
                          className="p-1.5 bg-[#242058] hover:bg-[#3B366E] text-[#F9CA75] rounded-lg border border-[#3B366E] transition-colors cursor-pointer"
                          title="Edit Soal"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletePsQuestion(q.id)}
                          disabled={isDeleting === q.id}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg border border-red-500/30 transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Soal"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                      {idx + 1}. {q.question_text}
                    </h4>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {[
                        { key: "A", text: q.option_a },
                        { key: "B", text: q.option_b },
                        { key: "C", text: q.option_c },
                      ].map((opt) => {
                        const isCorrect = q.correct_option === opt.key;
                        return (
                          <div
                            key={opt.key}
                            className={`p-2.5 rounded-xl border text-xs leading-snug flex items-start gap-2 ${
                              isCorrect
                                ? "bg-green-500/20 border-green-500/50 text-green-200 font-bold"
                                : "bg-[#0F0E24]/60 border-[#3B366E] text-[#B6B2DA]"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${isCorrect ? "bg-green-400 text-black font-extrabold" : "bg-white/10 text-white/60"}`}>
                              {opt.key}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: SELF APPRAISAL QUIZ ────────────────────────── */}
      {activeTab === "self-appraisal" && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari kata kunci evaluasi diri..."
              value={saSearch}
              onChange={(e) => setSaSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#1B1A3E] border border-[#3B366E] rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F2A93B]"
            />
            <svg className="w-4 h-4 text-[#B6B2DA] absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="space-y-3">
            {filteredSaQuestions.length === 0 ? (
              <div className="bg-[#1B1A3E]/60 border border-[#3B366E] rounded-2xl p-8 text-center text-[#B6B2DA] space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#0F0E24] border border-[#3B366E] flex items-center justify-center mx-auto text-lg text-[#F9CA75]">
                  📝
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white/90">Belum ada pertanyaan evaluasi diri.</p>
                <p className="text-[11px] text-[#B6B2DA]/70">Klik tombol <span className="text-[#F9CA75] font-bold">+ Tambah Evaluasi</span> di atas untuk menambahkan.</p>
              </div>
            ) : (
              filteredSaQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl p-4 sm:p-5 shadow-md flex justify-between items-start gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E29D29]/20 text-[#F9CA75] border border-[#E29D29]/40 text-[10px] font-extrabold uppercase tracking-wider">
                        {q.category}
                      </span>
                      <span className="text-[#B6B2DA] text-xs font-semibold">
                        Urutan #{q.order_index || idx + 1}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-base leading-relaxed">
                      &ldquo;{q.statement}&rdquo;
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openSaModal(q)}
                      className="p-1.5 bg-[#242058] hover:bg-[#3B366E] text-[#F9CA75] rounded-lg border border-[#3B366E] transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteSaQuestion(q.id)}
                      disabled={isDeleting === q.id}
                      className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg border border-red-500/30 transition-colors cursor-pointer disabled:opacity-50"
                      title="Hapus"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: REKAP HASIL KUIS SISWA ─────────────────────── */}
      {activeTab === "recap" && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={recapSearch}
              onChange={(e) => setRecapSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#1B1A3E] border border-[#3B366E] rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#F2A93B]"
            />
            <svg className="w-4 h-4 text-[#B6B2DA] absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Problem Solving Results */}
            <div className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl overflow-hidden shadow-lg">
              <div className="px-4 py-3 border-b border-[#3B366E] bg-[#242058]/40 flex justify-between items-center">
                <h3 className="font-bold text-[#F9CA75] text-xs sm:text-sm">Hasil Kuis Problem-Solving</h3>
                <span className="text-[11px] text-[#B6B2DA]">Total: {psResults.length}</span>
              </div>
              <div className="p-3.5 space-y-2.5 max-h-[450px] overflow-y-auto divide-y divide-[#3B366E]/40">
                {psResults.length === 0 ? (
                  <p className="text-center text-[#B6B2DA] text-xs py-6">Belum ada riwayat Kuis Problem-Solving.</p>
                ) : (
                  psResults
                    .filter((r) => !recapSearch || r.students?.name.toLowerCase().includes(recapSearch.toLowerCase()))
                    .map((r) => (
                      <div key={r.id} className="pt-2.5 first:pt-0 flex justify-between items-center gap-3">
                        <div>
                          <h4 className="font-bold text-white text-xs sm:text-sm">{r.students?.name || "Siswa Selesai"}</h4>
                          <p className="text-[11px] text-[#B6B2DA]">
                            Profesi: <span className="text-white font-semibold">{r.professions?.name || "Umum"}</span>
                          </p>
                          <p className="text-[10px] text-white/40">
                            {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[#F9CA75] font-extrabold text-sm block">
                            {r.score} / {r.max_score}
                          </span>
                          <span className="text-[10px] text-green-400 font-semibold">Tersimpan</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Self Appraisal Results */}
            <div className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl overflow-hidden shadow-lg">
              <div className="px-4 py-3 border-b border-[#3B366E] bg-[#242058]/40 flex justify-between items-center">
                <h3 className="font-bold text-[#F9CA75] text-xs sm:text-sm">Hasil Evaluasi Diri</h3>
                <span className="text-[11px] text-[#B6B2DA]">Total: {saResults.length}</span>
              </div>
              <div className="p-3.5 space-y-2.5 max-h-[450px] overflow-y-auto divide-y divide-[#3B366E]/40">
                {saResults.length === 0 ? (
                  <p className="text-center text-[#B6B2DA] text-xs py-6">Belum ada riwayat Evaluasi Diri tersimpan.</p>
                ) : (
                  saResults
                    .filter((r) => !recapSearch || r.students?.name.toLowerCase().includes(recapSearch.toLowerCase()))
                    .map((r) => (
                      <div key={r.id} className="pt-2.5 first:pt-0 flex justify-between items-center gap-3">
                        <div>
                          <h4 className="font-bold text-white text-xs sm:text-sm">{r.students?.name || "Siswa Selesai"}</h4>
                          <p className="text-[11px] text-[#B6B2DA]">
                            Respon Positif (&lsquo;Iya&rsquo;): <span className="text-[#F9CA75] font-bold">{r.yes_count} dari {r.total_questions}</span>
                          </p>
                          <p className="text-[10px] text-white/40">
                            {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-green-400 font-bold text-xs">Evaluasi Selesai</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Add/Edit Problem Solving Question ──────────── */}
      <Modal
        isOpen={isPsModalOpen}
        onClose={() => setIsPsModalOpen(false)}
        title={editingPsQ ? "Edit Soal Problem Solving" : "Tambah Soal Problem Solving Baru"}
      >
        <form onSubmit={handleSavePsQuestion} className="flex flex-col gap-3.5 text-white">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#B6B2DA] mb-1">
              Kategori Profesi
            </label>
            <div className="relative">
              <select
                value={professionId}
                onChange={(e) => setProfessionId(e.target.value)}
                required
                className="w-full pl-3.5 pr-10 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] text-white text-xs sm:text-sm appearance-none cursor-pointer"
              >
                {initialProfessions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#B6B2DA]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#B6B2DA] mb-1">
              Pertanyaan / Studi Kasus
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
              rows={3}
              placeholder="Isi pertanyaan studi kasus..."
              className="w-full px-3.5 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] text-white text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-bold text-[#F9CA75] mb-1">Pilihan A</label>
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] text-white text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#F9CA75] mb-1">Pilihan B</label>
              <input
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] text-white text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#F9CA75] mb-1">Pilihan C</label>
              <input
                type="text"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                required
                className="w-full px-3.5 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] text-white text-xs sm:text-sm"
              />
            </div>
          </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#B6B2DA] mb-1">
                Kunci Jawaban Benar
              </label>
              <div className="relative">
                <select
                  value={correctOption}
                  onChange={(e) => setCorrectOption(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] text-white font-bold text-xs sm:text-sm appearance-none cursor-pointer"
                >
                  <option value="A">Pilihan A (Benar)</option>
                  <option value="B">Pilihan B (Benar)</option>
                  <option value="C">Pilihan C (Benar)</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#B6B2DA]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

          <div className="text-[11px] text-[#B6B2DA] bg-[#0F0E24]/80 p-3 rounded-xl border border-[#3B366E] space-y-1">
            <div className="flex items-center gap-1.5 text-[#F9CA75] font-bold">
              <span>💡</span>
              <span>Penilaian Otomatis (Skala Maksimal 100 Poin)</span>
            </div>
            <p className="leading-relaxed opacity-90">
              Anda tidak perlu mengisi skor per soal. Nilai kuis siswa akan otomatis dikalkulasi merata hingga total <strong>100 Poin</strong> berdasarkan berapa pun jumlah soal yang tersedia untuk profesi ini.
            </p>
          </div>

          <div className="mt-3 flex gap-2.5 justify-end">
            <button
              type="button"
              onClick={() => setIsPsModalOpen(false)}
              className="px-4 py-2 bg-[#242058] text-[#B6B2DA] font-bold text-xs rounded-xl hover:bg-[#3B366E] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#F2A93B] text-[#0F0E24] font-extrabold text-xs rounded-xl hover:bg-[#F9CA75] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Menyimpan..." : "Simpan Soal"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: Add/Edit Self Appraisal Question ──────────── */}
      <Modal
        isOpen={isSaModalOpen}
        onClose={() => setIsSaModalOpen(false)}
        title={editingSaQ ? "Edit Pertanyaan Evaluasi Diri" : "Tambah Pertanyaan Evaluasi Diri Baru"}
      >
        <form onSubmit={handleSaveSaQuestion} className="flex flex-col gap-3.5 text-white">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#B6B2DA] mb-1">
              Kategori Evaluasi Diri
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="Cth: Eksplorasi & Inovasi, Kepedulian & Sosial"
              className="w-full px-3.5 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] text-white text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#B6B2DA] mb-1">
              Pernyataan Evaluasi Diri
            </label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              required
              rows={3}
              placeholder="Cth: Apakah kamu merasa senang ketika membantu orang lain?"
              className="w-full px-3.5 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] text-white text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#B6B2DA] mb-1">
              Urutan (Index)
            </label>
            <input
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
              min={1}
              className="w-full px-3.5 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-xl focus:outline-none focus:border-[#F2A93B] text-white text-xs sm:text-sm font-bold"
            />
          </div>

          <div className="mt-3 flex gap-2.5 justify-end">
            <button
              type="button"
              onClick={() => setIsSaModalOpen(false)}
              className="px-4 py-2 bg-[#242058] text-[#B6B2DA] font-bold text-xs rounded-xl hover:bg-[#3B366E] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#F2A93B] text-[#0F0E24] font-extrabold text-xs rounded-xl hover:bg-[#F9CA75] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Menyimpan..." : "Simpan Evaluasi"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
