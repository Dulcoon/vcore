import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import PlanImageGenerator from "./PlanImageGenerator";
import BackButton from "@/components/BackButton";

export const dynamic = "force-dynamic";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch student data with plan and all quiz results
  const [studentRes, quizRes, saRes] = await Promise.all([
    supabase
      .from("students")
      .select(`
        *,
        student_plans(
          id, 
          total_xp,
          professions(name, icon),
          student_plan_activities(
            id,
            slot_index,
            activities(title, category, xp, icon)
          )
        )
      `)
      .eq("id", id)
      .single(),
    supabase
      .from("student_quiz_results")
      .select("*, professions(name, icon)")
      .eq("student_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("student_self_appraisal_results")
      .select("*")
      .eq("student_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const student = studentRes.data;
  const studentErr = studentRes.error;
  const quizResults = quizRes.data || [];
  const selfAppraisalResults = saRes.data || [];

  if (studentErr || !student) {
    console.error("Student detail fetch error:", studentErr);
    return notFound();
  }

  const planArray = Array.isArray(student.student_plans) ? student.student_plans : [student.student_plans];
  const plan = planArray.filter(Boolean)[0] || null;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <BackButton href="/admin" label="Kembali ke Dashboard" />
        {plan && (
          <PlanImageGenerator
            studentName={student.name}
            studentAge={student.age}
            studentGrade={student.grade}
            studentAvatarUrl={student.avatar_url}
            professionName={plan.professions?.name || "Petualang"}
            professionIcon={plan.professions?.icon || "🌟"}
            totalXp={plan.total_xp}
            activities={(plan.student_plan_activities || []).map((a: any) => ({
              title: a.activities?.title || "",
              category: a.activities?.category || "",
              xp: a.activities?.xp || 0,
              icon: a.activities?.icon || ""
            }))}
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl p-6 shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 rounded-2xl bg-[#0F0E24] border-2 border-[#3B366E] overflow-hidden flex-shrink-0">
          {student.avatar_url ? (
            <img src={student.avatar_url} alt={student.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold font-serif text-[#F9CA75]">{student.name}</h2>
          <div className="flex gap-4 mt-2 text-[#B6B2DA] text-sm">
            <p>Usia: <span className="text-white font-semibold">{student.age}</span></p>
            <p>Kelas: <span className="text-white font-semibold">{student.grade}</span></p>
          </div>
        </div>
        
        {plan && (
          <div className="bg-[#242058]/80 border border-[#F2A93B]/30 rounded-xl p-4 flex items-center gap-4">
            <div className="text-4xl">{plan.professions?.icon}</div>
            <div>
              <p className="text-xs text-[#B6B2DA] uppercase tracking-wider font-semibold">Bercita-cita menjadi</p>
              <p className="text-xl font-bold text-white">{plan.professions?.name}</p>
            </div>
            <div className="ml-4 pl-4 border-l border-[#3B366E]">
              <p className="text-xs text-[#B6B2DA] uppercase tracking-wider font-semibold">Total XP</p>
              <p className="text-xl font-bold text-[#F9CA75]">{plan.total_xp} ⭐</p>
            </div>
          </div>
        )}
      </div>

      {/* Plan Activities */}
      {!plan ? (
        <div className="bg-[#1B1A3E]/80 border border-[#3B366E] rounded-2xl p-10 text-center">
          <p className="text-[#B6B2DA] text-lg">Siswa ini belum membuat Rencana Karier.</p>
        </div>
      ) : (
        <div className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-[#3B366E] bg-[#242058]/30">
            <h3 className="font-bold text-white text-lg">Aktivitas yang Dipilih</h3>
          </div>
          
          <div className="p-6">
            {!plan.student_plan_activities || plan.student_plan_activities.length === 0 ? (
              <p className="text-[#B6B2DA] text-center py-4 text-sm">Belum ada aktivitas yang dipilih.</p>
            ) : (
              <div className="space-y-3">
                {plan.student_plan_activities.map((item: any) => {
                  const act = item.activities;
                  if (!act) return null;
                  
                  return (
                    <div key={item.id} className="bg-[#242058]/40 border border-[#3B366E] rounded-xl p-4 flex items-center gap-4">
                      <div className="text-2xl w-10 h-10 rounded-full bg-[#0F0E24] flex items-center justify-center border border-[#3B366E]">
                        {act.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{act.title}</h4>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#1B1A3E] text-[#B6B2DA] text-xs border border-[#3B366E] mt-1">
                          {act.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-[#F9CA75] font-bold">+{act.xp} XP</div>
                        <div className="text-xs text-[#B6B2DA]">Langkah ke-{item.slot_index + 1}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid: Self Appraisal Results & Problem Solving Quiz Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Self Appraisal Results */}
        <div className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-[#3B366E] bg-[#242058]/30 flex justify-between items-center">
            <h3 className="font-bold text-white text-base sm:text-lg">Hasil Evaluasi Diri (Self-Appraisal)</h3>
            <span className="text-xs text-[#B6B2DA]">Total: {selfAppraisalResults.length}</span>
          </div>

          <div className="p-6">
            {selfAppraisalResults.length === 0 ? (
              <p className="text-[#B6B2DA] text-center py-4 text-sm">Siswa ini belum mengerjakan Evaluasi Diri.</p>
            ) : (
              <div className="space-y-3">
                {selfAppraisalResults.map((sa: any) => (
                  <div key={sa.id} className="bg-[#242058]/40 border border-[#3B366E] rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-white text-sm">Respon Positif (&lsquo;Iya&rsquo;)</h4>
                      <p className="text-xs text-[#B6B2DA] mt-0.5">
                        Dikerjakan: {new Date(sa.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-[#F9CA75] font-extrabold text-base sm:text-lg">
                        {sa.yes_count} / {sa.total_questions} <span className="text-xs font-normal text-[#B6B2DA]">Pertanyaan</span>
                      </div>
                      <div className="text-xs text-green-400 font-semibold">Tersimpan</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Problem Solving Quiz Results */}
        <div className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-[#3B366E] bg-[#242058]/30 flex justify-between items-center">
            <h3 className="font-bold text-white text-base sm:text-lg">Hasil Kuis Problem-Solving</h3>
            <span className="text-xs text-[#B6B2DA]">Total: {quizResults.length}</span>
          </div>

          <div className="p-6">
            {quizResults.length === 0 ? (
              <p className="text-[#B6B2DA] text-center py-4 text-sm">Siswa ini belum mengerjakan Kuis Problem-Solving.</p>
            ) : (
              <div className="space-y-3">
                {quizResults.map((qr: any) => {
                  const pName = qr.professions?.name || "Profesi Pilihan";
                  const pIcon = qr.professions?.icon || "🎯";
                  const scorePercent = qr.max_score > 0 ? Math.round((qr.score / qr.max_score) * 100) : 0;

                  return (
                    <div key={qr.id} className="bg-[#242058]/40 border border-[#3B366E] rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl w-10 h-10 rounded-full bg-[#0F0E24] flex items-center justify-center border border-[#3B366E]">
                          {pIcon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{pName}</h4>
                          <p className="text-xs text-[#B6B2DA]">
                            Dikerjakan: {new Date(qr.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[#F9CA75] font-extrabold text-base sm:text-lg">
                          {qr.score} / {qr.max_score} <span className="text-xs font-normal text-[#B6B2DA]">({scorePercent}%)</span>
                        </div>
                        <div className="text-xs text-green-400 font-semibold">Tersimpan</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
