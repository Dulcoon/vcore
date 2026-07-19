import React from "react";
import { supabase } from "@/lib/supabase";
import ActivityClient from "./ActivityClient";

export const dynamic = "force-dynamic";

export default async function ActivitiesAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Use Promise.all to fetch both concurrently
  const [profRes, actRes] = await Promise.all([
    supabase.from("professions").select("id, name").eq("id", id).single(),
    supabase.from("activities").select("*").eq("profession_id", id).order("score_value", { ascending: true })
  ]);

  if (profRes.error) {
    return <div className="p-10 text-center text-red-400">Profesi tidak ditemukan atau terjadi kesalahan database.</div>;
  }

  return (
    <div>
      <ActivityClient 
        profession={profRes.data} 
        initialActivities={actRes.data || []} 
      />
    </div>
  );
}
