"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createActivity(formData: FormData) {
  const profession_id = formData.get("profession_id") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const icon = formData.get("icon") as string;
  const score_value = parseInt(formData.get("score_value") as string) || 10;
  
  if (!profession_id || !content || !category) return { success: false, error: "Data tidak lengkap." };

  const { error } = await supabase.from("activities").insert({
    profession_id,
    content,
    category,
    icon: icon || null,
    score_value
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/professions/${profession_id}/activities`);
  return { success: true };
}

export async function updateActivity(formData: FormData) {
  const id = formData.get("id") as string;
  const profession_id = formData.get("profession_id") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const icon = formData.get("icon") as string;
  const score_value = parseInt(formData.get("score_value") as string) || 10;

  if (!id || !content || !category) return { success: false, error: "Data tidak lengkap." };

  const { error } = await supabase.from("activities").update({
    content,
    category,
    icon: icon || null,
    score_value
  }).eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/professions/${profession_id}/activities`);
  return { success: true };
}

export async function deleteActivity(id: string, profession_id: string) {
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/professions/${profession_id}/activities`);
  return { success: true };
}
