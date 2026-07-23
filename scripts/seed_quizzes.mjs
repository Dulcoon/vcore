import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

global.WebSocket = WebSocket;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SAMPLE_QUESTIONS = {
  pelayan: [
    {
      question_text: "Ada tamu yang menyampaikan bahwa minumannya terlalu manis. Langkah awal terbaik yang sebaiknya kamu lakukan adalah...",
      option_a: "Meminta maaf dengan ramah dan menawarkan untuk mengganti minuman",
      option_b: "Menyarankan tamu untuk menambahkan air dingin sendiri",
      option_c: "Mengabaikan masukan tamu karena resep sudah standar",
      correct_option: "A",
      score_value: 10
    },
    {
      question_text: "Saat suasana kafe sedang sangat ramai, bagaimana cara menjaga pelayanan tetap profesional?",
      option_a: "Tetap tenang, menyapa tamu dengan senyum, dan mencatat pesanan dengan teliti",
      option_b: "Melayani dengan terburu-buru hingga pesanan sering salah",
      option_c: "Menolak tamu baru yang datang ke toko",
      correct_option: "A",
      score_value: 10
    }
  ],
  chef: [
    {
      question_text: "Mengapa penting untuk memisahkan pisau potong daging mentah dan sayuran segar?",
      option_a: "Mencegah kontaminasi silang bakteri dan menjaga kebersihan makanan",
      option_b: "Agar pisau tidak cepat tumpul",
      option_c: "Supaya rasa sayuran menjadi gurih",
      correct_option: "A",
      score_value: 10
    },
    {
      question_text: "Saat masakan sup terasa kurang gurih saat dicicipi, hal apa yang perlu disesuaikan?",
      option_a: "Menambahkan sedikit bumbu penyeimbang atau garam secukupnya",
      option_b: "Menambahkan gula dalam jumlah banyak",
      option_c: "Membuang sup dan memasak ulang dari awal",
      correct_option: "A",
      score_value: 10
    }
  ],
  fotostudio: [
    {
      question_text: "Hasil foto di dalam studio terlihat sangat gelap. Solusi teknis yang paling tepat adalah...",
      option_a: "Menyesuaikan intensitas lampu studio atau pencahayaan kamera",
      option_b: "Mengubah warna pakaian model",
      option_c: "Mendekatkan posisi objek ke tembok",
      correct_option: "A",
      score_value: 10
    }
  ],
  contentcreator: [
    {
      question_text: "Tahap awal paling krusial sebelum melakukan proses pengambilan gambar/video adalah...",
      option_a: "Menentukan ide konten dan membuat kerangka naskah/konsep",
      option_b: "Membeli peralatan kamera termahal di pasaran",
      option_c: "Membuat akun di semua media sosial sekaligus",
      correct_option: "A",
      score_value: 10
    }
  ],
  guruisyarat: [
    {
      question_text: "Sikap utama yang dibutuhkan seorang pengajar Bahasa Isyarat saat berinteraksi dengan siswa adalah...",
      option_a: "Sabar, ramah, serta mengutamakan ekspresi wajah dan gerakan tangan yang jelas",
      option_b: "Berbicara sangat cepat tanpa gestur",
      option_c: "Hanya memakai buku petunjuk tulisan",
      correct_option: "A",
      score_value: 10
    }
  ],
  desaingrafis: [
    {
      question_text: "Prinsip utama dalam membuat desain poster agar informasi mudah terbaca adalah...",
      option_a: "Memilih kombinasi warna berani yang kontras dan hirarki tulisan yang jelas",
      option_b: "Menggunakan lebih dari 10 jenis font berlainan dalam satu poster",
      option_c: "Mengisi seluruh ruang kosong dengan gambar tanpa sisa",
      correct_option: "A",
      score_value: 10
    }
  ]
};

async function seedQuizzes() {
  console.log("Seeding problem solving quiz questions...");
  const { data: professions, error } = await supabase.from('professions').select('id, slug, name');
  
  if (error || !professions) {
    console.error("Error fetching professions:", error);
    return;
  }

  for (const prof of professions) {
    const questions = SAMPLE_QUESTIONS[prof.slug];
    if (!questions) continue;

    for (const q of questions) {
      const { data: existing } = await supabase
        .from('problem_solving_questions')
        .select('id')
        .eq('profession_id', prof.id)
        .eq('question_text', q.question_text);

      if (!existing || existing.length === 0) {
        console.log(`Inserting question for ${prof.name}...`);
        await supabase.from('problem_solving_questions').insert([{
          profession_id: prof.id,
          ...q
        }]);
      }
    }
  }

  console.log("Problem solving quiz seed completed!");
}

seedQuizzes();
