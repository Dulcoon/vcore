import React from "react";
import { supabase } from "@/lib/supabase";
import StudentClient from "./StudentClient";

export const dynamic = "force-dynamic";

export default async function StudentsAdminPage() {
  const { data: students, error } = await supabase
    .from("students")
    .select("*, student_plans(id, total_xp, professions(name))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <StudentClient initialStudents={students || []} />
  );
}
