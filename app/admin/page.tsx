import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Prevent static generation since this relies on fresh DB data
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch students, limit to 5 for dashboard
  const { data: students, error: studentsErr } = await supabase
    .from("students")
    .select("*, student_plans(id, total_xp, professions(name))")
    .order("created_at", { ascending: false })
    .limit(5);

  if (studentsErr) {
    console.error(studentsErr);
  }

  // Fetch basic stats (needs aggregate queries or fetching all)
  const { count: totalStudents } = await supabase
    .from("students")
    .select("*", { count: 'exact', head: true });

  const { count: totalProfessions } = await supabase
    .from("professions")
    .select("*", { count: 'exact', head: true });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#F9CA75]">Dashboard</h2>
          <p className="text-[#B6B2DA] text-sm mt-1">Overview data ViCore.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#242058]/60 backdrop-blur-sm border border-[#3B366E] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">👥</div>
          <p className="text-[#B6B2DA] text-xs font-semibold uppercase tracking-wider mb-1">Total Petualang</p>
          <p className="text-3xl font-bold text-white">{totalStudents || 0}</p>
        </div>
        <div className="bg-[#242058]/60 backdrop-blur-sm border border-[#3B366E] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">💼</div>
          <p className="text-[#B6B2DA] text-xs font-semibold uppercase tracking-wider mb-1">Total Profesi</p>
          <p className="text-3xl font-bold text-white">{totalProfessions || 0}</p>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl overflow-hidden shadow-lg mt-8">
        <div className="px-6 py-4 border-b border-[#3B366E] flex justify-between items-center bg-[#242058]/30">
          <h3 className="font-bold text-white">Petualang Terbaru</h3>
          <Link href="/admin/students" className="text-sm font-semibold text-[#F2A93B] hover:text-[#F9CA75] transition-colors">
            Lihat Semua &rarr;
          </Link>
        </div>
        
        {(!students || students.length === 0) ? (
          <div className="p-8 text-center text-[#B6B2DA]">
            Belum ada data petualang.
          </div>
        ) : (
          <div className="divide-y divide-[#3B366E]">
            {students.map((student) => {
              const planArray = Array.isArray(student.student_plans) ? student.student_plans : [student.student_plans];
              const plan = planArray.filter(Boolean)[0] || null;
              const profName = plan?.professions?.name || "Belum memilih";
              
              return (
                <div key={student.id} className="p-4 sm:px-6 hover:bg-[#242058]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0F0E24] border border-[#3B366E] overflow-hidden flex-shrink-0">
                      {student.avatar_url && (
                        <img src={student.avatar_url} alt={student.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#F9CA75] text-lg">{student.name}</h4>
                      <p className="text-sm text-[#B6B2DA]">{student.grade} • {student.age} tahun</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="text-sm">
                      <span className="text-[#B6B2DA]">Cita-cita: </span>
                      <span className="font-semibold text-white">{profName}</span>
                    </div>
                    {plan ? (
                      <Link 
                        href={`/admin/student/${student.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-[#F2A93B]/10 hover:bg-[#F2A93B]/20 border border-[#F2A93B]/30 text-[#F9CA75] text-xs font-bold rounded-lg transition-colors w-max"
                      >
                        Lihat Rencana
                      </Link>
                    ) : (
                      <span className="inline-flex items-center justify-center px-4 py-2 bg-[#0F0E24] border border-[#3B366E] text-[#B6B2DA] text-xs font-bold rounded-lg opacity-50 cursor-not-allowed w-max">
                        Belum Selesai
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
