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

const DEFAULT_QUESTIONS = [
  {
    statement: "Apakah kamu suka mencoba hal-hal baru dan bereksperimen?",
    category: "Eksplorasi & Inovasi",
    order_index: 1,
  },
  {
    statement: "Apakah kamu merasa senang ketika membantu atau melayani orang lain?",
    category: "Kepedulian & Sosial",
    order_index: 2,
  },
  {
    statement: "Apakah kamu menikmati kegiatan yang membutuhkan ide kreatif dan seni?",
    category: "Kreativitas & Seni",
    order_index: 3,
  },
  {
    statement: "Apakah kamu merasa percaya diri saat berbicara dan menyampaikan ide?",
    category: "Komunikasi",
    order_index: 4,
  },
  {
    statement: "Apakah kamu suka bekerja secara terstruktur, rapi, dan terencana?",
    category: "Manajemen & Organisasi",
    order_index: 5,
  },
];

async function seedSelfAppraisal() {
  console.log("Checking self_appraisal_questions table...");

  const { data: existing, error } = await supabase.from('self_appraisal_questions').select('id');

  if (error) {
    console.error("Table self_appraisal_questions might not exist yet or error:", error.message);
    return;
  }

  if (existing && existing.length > 0) {
    console.log("self_appraisal_questions already has data. Skipping seed.");
    return;
  }

  console.log("Seeding default self appraisal questions...");
  for (const q of DEFAULT_QUESTIONS) {
    const { error: insErr } = await supabase.from('self_appraisal_questions').insert([q]);
    if (insErr) {
      console.error("Failed to insert question:", insErr.message);
    }
  }

  console.log("Self appraisal seeding completed successfully!");
}

seedSelfAppraisal();
