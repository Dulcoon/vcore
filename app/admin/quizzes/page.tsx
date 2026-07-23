import React from "react";
import { supabase } from "@/lib/supabase";
import QuizManagementClient from "./QuizManagementClient";

export const dynamic = "force-dynamic";

export default async function AdminQuizzesPage() {
  const [profRes, psqRes, saqRes, psResultsRes, saResultsRes] = await Promise.all([
    supabase.from("professions").select("id, name, icon").order("name"),
    supabase.from("problem_solving_questions").select("*, professions(id, name, icon)").order("created_at", { ascending: false }),
    supabase.from("self_appraisal_questions").select("*").order("order_index", { ascending: true }),
    supabase.from("student_quiz_results").select("*, students(id, name, age, grade), professions(id, name, icon)").order("created_at", { ascending: false }),
    supabase.from("student_self_appraisal_results").select("*, students(id, name, age, grade)").order("created_at", { ascending: false }),
  ]);

  const professions = profRes.data || [];
  const problemSolvingQuestions = psqRes.data || [];
  const selfAppraisalQuestions = saqRes.data || [];
  const problemSolvingResults = psResultsRes.data || [];
  const selfAppraisalResults = saResultsRes.data || [];

  return (
    <QuizManagementClient
      initialProfessions={professions}
      initialProblemSolvingQuestions={problemSolvingQuestions}
      initialSelfAppraisalQuestions={selfAppraisalQuestions}
      initialProblemSolvingResults={problemSolvingResults}
      initialSelfAppraisalResults={selfAppraisalResults}
    />
  );
}
