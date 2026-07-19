import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import PlanImageGenerator from "./PlanImageGenerator";

export const dynamic = "force-dynamic";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch student data with plan
  const { data: student, error: studentErr } = await supabase
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
    .single();

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
        <Link 
          href="/admin" 
          className="inline-flex items-center text-[#B6B2DA] hover:text-[#F9CA75] transition-colors"
        >
          <span className="mr-2">←</span> Kembali ke Dashboard
        </Link>
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
          <div className="flex gap-4 mt-2 text-[#B6B2DA]">
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
              <p className="text-[#B6B2DA] text-center py-4">Belum ada aktivitas yang dipilih.</p>
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
    </div>
  );
}
