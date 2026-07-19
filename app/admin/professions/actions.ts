"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

async function saveUploadedFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const uploadDir = path.join(process.cwd(), "public", "images");
  
  // Pastikan folder exist
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, buffer);
  
  return `/images/${filename}`;
}

export async function createProfession(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const icon = formData.get("icon") as string;
  
  const imageFile = formData.get("image_file") as File | null;
  let image_url = formData.get("image_url") as string;
  
  const uploadedUrl = await saveUploadedFile(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  if (!name || !slug) return { success: false, error: "Nama dan Slug wajib diisi." };

  const { error } = await supabase.from("professions").insert({
    name,
    slug,
    icon: icon || null,
    image_url: image_url || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/professions");
  return { success: true };
}

export async function updateProfession(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const icon = formData.get("icon") as string;
  
  const imageFile = formData.get("image_file") as File | null;
  let image_url = formData.get("image_url") as string;
  
  const uploadedUrl = await saveUploadedFile(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  if (!id || !name || !slug) return { success: false, error: "Data tidak lengkap." };

  const { error } = await supabase.from("professions").update({
    name,
    slug,
    icon: icon || null,
    image_url: image_url || null,
  }).eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/professions");
  return { success: true };
}

export async function deleteProfession(id: string) {
  const { error } = await supabase.from("professions").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/professions");
  return { success: true };
}
