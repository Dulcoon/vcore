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
  
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, buffer);
  
  return `/images/${filename}`;
}

export async function createStudent(formData: FormData) {
  const name = formData.get("name") as string;
  const age = formData.get("age") as string;
  const grade = formData.get("grade") as string;
  
  const imageFile = formData.get("avatar_file") as File | null;
  let avatar_url = formData.get("avatar_url") as string;
  
  const uploadedUrl = await saveUploadedFile(imageFile);
  if (uploadedUrl) {
    avatar_url = uploadedUrl;
  }

  if (!name) return { success: false, error: "Nama wajib diisi." };

  const { error } = await supabase.from("students").insert({
    name,
    age: age || null,
    grade: grade || null,
    avatar_url: avatar_url || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/students");
  return { success: true };
}

export async function updateStudent(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const age = formData.get("age") as string;
  const grade = formData.get("grade") as string;
  
  const imageFile = formData.get("avatar_file") as File | null;
  let avatar_url = formData.get("avatar_url") as string;
  
  const uploadedUrl = await saveUploadedFile(imageFile);
  if (uploadedUrl) {
    avatar_url = uploadedUrl;
  }

  if (!id || !name) return { success: false, error: "Nama wajib diisi." };

  const { error } = await supabase.from("students").update({
    name,
    age: age || null,
    grade: grade || null,
    avatar_url: avatar_url || null,
  }).eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/students");
  return { success: true };
}

export async function deleteStudent(studentId: string) {
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/students");
  return { success: true };
}
