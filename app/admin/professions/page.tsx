import React from "react";
import { supabase } from "@/lib/supabase";
import ProfessionClient from "./ProfessionClient";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export default async function ProfessionsAdminPage() {
  const { data: professions, error } = await supabase
    .from("professions")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
  }

  // Fetch images from public/images
  let imageFiles: string[] = [];
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    imageFiles = fs.readdirSync(imagesDir)
      .filter(file => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".svg"))
      .map(file => `/images/${file}`);
  } catch (e) {
    console.error("Failed to load images", e);
  }

  return (
    <div>
      <ProfessionClient 
        initialProfessions={professions || []} 
        availableImages={imageFiles}
      />
    </div>
  );
}
