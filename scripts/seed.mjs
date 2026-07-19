import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

global.WebSocket = WebSocket;

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or anon key) are set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA = {
  pelayan: {
    name: "Pelayan Restoran", icon: "🍽️", image: "/images/Waiter.png",
    activities: [
      { id: "p1", title: "Belajar Komunikasi dengan Tamu", cat: "Belajar", icon: "🗣️", xp: 10 },
      { id: "p2", title: "Belajar Tata Cara Penyajian", cat: "Belajar", icon: "🍽️", xp: 10 },
      { id: "p3", title: "Latihan Melayani Tamu", cat: "Latihan", icon: "🙋", xp: 15 },
      { id: "p4", title: "Ikut Pelatihan Hospitality", cat: "Belajar", icon: "📘", xp: 10 },
      { id: "p5", title: "Magang di Restoran/Kafe", cat: "Magang", icon: "🏨", xp: 20 },
      { id: "p6", title: "Ikut Lomba Pelayanan Terbaik", cat: "Lomba", icon: "🏆", xp: 25 },
      { id: "p7", title: "Latihan Mencatat Pesanan Cepat", cat: "Latihan", icon: "📝", xp: 10 },
    ],
  },
  fotostudio: {
    name: "Fotografer Studio", icon: "📷", image: "/images/Photo Studio.png",
    activities: [
      { id: "fs1", title: "Belajar Dasar Fotografi", cat: "Belajar", icon: "📷", xp: 10 },
      { id: "fs2", title: "Belajar Pencahayaan Studio", cat: "Belajar", icon: "💡", xp: 10 },
      { id: "fs3", title: "Latihan Memotret Model", cat: "Latihan", icon: "🧍", xp: 15 },
      { id: "fs4", title: "Belajar Mengedit Foto", cat: "Belajar", icon: "🖥️", xp: 10 },
      { id: "fs5", title: "Magang di Studio Foto", cat: "Magang", icon: "🏢", xp: 20 },
      { id: "fs6", title: "Ikut Lomba Fotografi", cat: "Lomba", icon: "🏆", xp: 25 },
      { id: "fs7", title: "Membuat Portofolio Online", cat: "Kreatif", icon: "💼", xp: 15 },
    ],
  },
  chef: {
    name: "Chef Profesional", icon: "🍳", image: "/images/Chef.png",
    activities: [
      { id: "c1", title: "Belajar Dasar Memasak", cat: "Belajar", icon: "🔪", xp: 10 },
      { id: "c2", title: "Belajar Mengenal Bahan Makanan", cat: "Belajar", icon: "🥕", xp: 10 },
      { id: "c3", title: "Latihan Membuat Menu Sederhana", cat: "Latihan", icon: "🍳", xp: 15 },
      { id: "c4", title: "Ikut Kelas Memasak Online", cat: "Belajar", icon: "💻", xp: 10 },
      { id: "c5", title: "Magang di Dapur Restoran", cat: "Magang", icon: "👨‍🍳", xp: 20 },
      { id: "c6", title: "Mengikuti Lomba Memasak", cat: "Lomba", icon: "🏆", xp: 25 },
      { id: "c7", title: "Belajar Plating & Penyajian", cat: "Belajar", icon: "🍱", xp: 10 },
      { id: "c8", title: "Membuat Konten Resep", cat: "Kreatif", icon: "📱", xp: 15 },
    ],
  },
  contentcreator: {
    name: "Content Creator", icon: "🎬", image: "/images/Konten kreator.png",
    activities: [
      { id: "cc1", title: "Belajar Riset & Ide Konten", cat: "Belajar", icon: "💡", xp: 10 },
      { id: "cc2", title: "Belajar Syuting dengan HP", cat: "Belajar", icon: "🎥", xp: 10 },
      { id: "cc3", title: "Latihan Mengedit Video", cat: "Latihan", icon: "✂️", xp: 15 },
      { id: "cc4", title: "Belajar Membuat Naskah & Caption", cat: "Belajar", icon: "✍️", xp: 10 },
      { id: "cc5", title: "Konsisten Upload Konten", cat: "Latihan", icon: "📅", xp: 15 },
      { id: "cc6", title: "Kolaborasi dengan Kreator Lain", cat: "Kolaborasi", icon: "🤝", xp: 20 },
      { id: "cc7", title: "Ikut Kompetisi Konten Kreatif", cat: "Lomba", icon: "🏆", xp: 25 },
      { id: "cc8", title: "Membangun Portofolio Media Sosial", cat: "Kreatif", icon: "📱", xp: 15 },
    ],
  },
  guruisyarat: {
    name: "Guru Bahasa Isyarat", icon: "🤟", image: "/images/Guru Bahasa Isyarat4.png",
    activities: [
      { id: "g1", title: "Belajar BISINDO/SIBI Dasar", cat: "Belajar", icon: "🤟", xp: 10 },
      { id: "g2", title: "Belajar Teknik Mengajar", cat: "Belajar", icon: "📘", xp: 10 },
      { id: "g3", title: "Latihan Mengajar Teman Sebaya", cat: "Latihan", icon: "🧑‍🏫", xp: 15 },
      { id: "g4", title: "Ikut Pelatihan Kebahasaan", cat: "Belajar", icon: "📚", xp: 10 },
      { id: "g5", title: "Magang Mengajar di Komunitas Tuli", cat: "Magang", icon: "🏫", xp: 20 },
      { id: "g6", title: "Ikut Festival Bahasa Isyarat", cat: "Lomba", icon: "🏆", xp: 25 },
    ],
  },
  desaingrafis: {
    name: "Desainer Grafis", icon: "🎨", image: "/images/Desain grafis.png",
    activities: [
      { id: "d1", title: "Belajar Dasar Desain", cat: "Belajar", icon: "🎨", xp: 10 },
      { id: "d2", title: "Belajar Aplikasi Desain (Canva/CorelDraw)", cat: "Belajar", icon: "🖥️", xp: 10 },
      { id: "d3", title: "Latihan Membuat Poster", cat: "Latihan", icon: "🖼️", xp: 15 },
      { id: "d4", title: "Belajar Teori Warna & Tipografi", cat: "Belajar", icon: "🔤", xp: 10 },
      { id: "d5", title: "Magang di Studio Desain", cat: "Magang", icon: "🏢", xp: 20 },
      { id: "d6", title: "Ikut Lomba Desain Grafis", cat: "Lomba", icon: "🏆", xp: 25 },
      { id: "d7", title: "Membuat Portofolio Desain", cat: "Kreatif", icon: "💼", xp: 15 },
      { id: "d8", title: "Ikut Kelas Desain Online", cat: "Belajar", icon: "💻", xp: 10 },
    ],
  },
};

async function seed() {
  console.log("Starting seed process...");

  for (const [slug, profData] of Object.entries(DATA)) {
    // Check if profession exists
    let { data: profs, error: profErr } = await supabase
      .from('professions')
      .select('*')
      .eq('slug', slug);
      
    if (profErr) {
      console.error("Error checking profession:", profErr);
      continue;
    }

    let professionId;
    
    if (!profs || profs.length === 0) {
      console.log(`Inserting profession: ${profData.name}`);
      const { data: newProf, error: insErr } = await supabase
        .from('professions')
        .insert([{
          slug,
          name: profData.name,
          icon: profData.icon,
          image_url: profData.image
        }])
        .select()
        .single();
        
      if (insErr) {
        console.error("Error inserting profession:", insErr);
        continue;
      }
      professionId = newProf.id;
    } else {
      professionId = profs[0].id;
      console.log(`Profession already exists: ${profData.name}`);
    }

    // Insert activities
    for (const act of profData.activities) {
      const { data: existingAct } = await supabase
        .from('activities')
        .select('*')
        .eq('title', act.title)
        .eq('profession_id', professionId);
        
      if (!existingAct || existingAct.length === 0) {
        console.log(`  Inserting activity: ${act.title}`);
        await supabase
          .from('activities')
          .insert([{
            profession_id: professionId,
            title: act.title,
            category: act.cat,
            icon: act.icon,
            xp: act.xp
          }]);
      }
    }
  }

  // Insert a dummy student for testing
  const { data: students } = await supabase.from('students').select('*').limit(1);
  if (!students || students.length === 0) {
    console.log("Inserting dummy student 'Rian'...");
    await supabase.from('students').insert([{
      name: "Rian",
      age: "11",
      grade: "Kelas 5 SD",
      avatar_url: "/images/avatar_waiter.png"
    }]);
  }

  console.log("Seed process completed!");
}

seed();
