"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BatikOrnament from "../BatikOrnament";

/* ─── Types ─────────────────────────────────────────────── */
interface Profile {
  name: string;
  age: string;
  grade: string;
  avatar?: string;
}

interface PlanItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;        // tailwind bg class for selected state
  glow: string;         // box-shadow color string
}

interface Props {
  job: string;
  profile: Profile | null;
  onFinish: () => void;
}

/* ─── SVG Icon helpers ───────────────────────────────────── */
const Icon = ({ children, ...rest }: { children: React.ReactNode; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" {...rest}>
    {children}
  </svg>
);

/* ─── Job color themes ───────────────────────────────────── */
const jobTheme: Record<string, { primary: string; glow: string; dot: string }> = {
  "Pelayan":            { primary: "#E29D29", glow: "rgba(226,157,41,0.35)",   dot: "#E29D29" },
  "Photo Studio":       { primary: "#38bdf8", glow: "rgba(56,189,248,0.35)",   dot: "#38bdf8" },
  "Konten Kreator":     { primary: "#f472b6", glow: "rgba(244,114,182,0.35)",  dot: "#f472b6" },
  "Chef":               { primary: "#fb923c", glow: "rgba(251,146,60,0.35)",   dot: "#fb923c" },
  "Guru Bahasa Isyarat":{ primary: "#34d399", glow: "rgba(52,211,153,0.35)",   dot: "#34d399" },
  "Desain Grafis":      { primary: "#a78bfa", glow: "rgba(167,139,250,0.35)",  dot: "#a78bfa" },
};
const defaultTheme = { primary: "#E29D29", glow: "rgba(226,157,41,0.35)", dot: "#E29D29" };

/* ─── Plan items per job ─────────────────────────────────── */
const planItemsMap: Record<string, PlanItem[]> = {
  "Pelayan": [
    { id:"w1", label:"Ikut pelatihan pelayan",   color:"#E29D29", glow:"rgba(226,157,41,0.4)", icon:<Icon><path d="M12 6v6l4 2M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/></Icon> },
    { id:"w2", label:"Pakai seragam & rapi",     color:"#E29D29", glow:"rgba(226,157,41,0.4)", icon:<Icon><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/></Icon> },
    { id:"w3", label:"Belajar menyapa ramah",    color:"#fbbf24", glow:"rgba(251,191,36,0.4)",  icon:<Icon><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></Icon> },
    { id:"w4", label:"Hafal menu makanan",       color:"#f59e0b", glow:"rgba(245,158,11,0.4)",  icon:<Icon><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></Icon> },
    { id:"w5", label:"Latihan melayani tamu",    color:"#d97706", glow:"rgba(217,119,6,0.4)",   icon:<Icon><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></Icon> },
    { id:"w6", label:"Raih penilaian bintang",  color:"#b45309", glow:"rgba(180,83,9,0.4)",    icon:<Icon><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></Icon> },
  ],
  "Photo Studio": [
    { id:"p1", label:"Pelajari dasar kamera",    color:"#38bdf8", glow:"rgba(56,189,248,0.4)",  icon:<Icon><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></Icon> },
    { id:"p2", label:"Belajar pencahayaan",      color:"#0ea5e9", glow:"rgba(14,165,233,0.4)",  icon:<Icon><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></Icon> },
    { id:"p3", label:"Latihan komposisi foto",   color:"#0284c7", glow:"rgba(2,132,199,0.4)",   icon:<Icon><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18M9 21V9"/></Icon> },
    { id:"p4", label:"Edit foto di komputer",   color:"#0369a1", glow:"rgba(3,105,161,0.4)",   icon:<Icon><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8M12 17v4"/></Icon> },
    { id:"p5", label:"Buat portfolio foto",     color:"#075985", glow:"rgba(7,89,133,0.4)",    icon:<Icon><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></Icon> },
    { id:"p6", label:"Ikuti lomba foto",        color:"#0c4a6e", glow:"rgba(12,74,110,0.4)",   icon:<Icon><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></Icon> },
  ],
  "Konten Kreator": [
    { id:"k1", label:"Rencanakan ide konten",    color:"#f472b6", glow:"rgba(244,114,182,0.4)", icon:<Icon><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></Icon> },
    { id:"k2", label:"Rekam video perdana",      color:"#ec4899", glow:"rgba(236,72,153,0.4)",  icon:<Icon><path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></Icon> },
    { id:"k3", label:"Edit video & tambah musik",color:"#db2777", glow:"rgba(219,39,119,0.4)",  icon:<Icon><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></Icon> },
    { id:"k4", label:"Upload ke platform",       color:"#be185d", glow:"rgba(190,24,93,0.4)",   icon:<Icon><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></Icon> },
    { id:"k5", label:"Balas komentar penggemar", color:"#9d174d", glow:"rgba(157,23,77,0.4)",   icon:<Icon><path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></Icon> },
    { id:"k6", label:"Tingkatkan jumlah penonton",color:"#831843",glow:"rgba(131,24,67,0.4)",   icon:<Icon><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></Icon> },
  ],
  "Chef": [
    { id:"c1", label:"Ikut kelas memasak",       color:"#fb923c", glow:"rgba(251,146,60,0.4)",  icon:<Icon><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></Icon> },
    { id:"c2", label:"Pilih bahan berkualitas",  color:"#f97316", glow:"rgba(249,115,22,0.4)",  icon:<Icon><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></Icon> },
    { id:"c3", label:"Kuasai teknik memasak",    color:"#ea580c", glow:"rgba(234,88,12,0.4)",   icon:<Icon><path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/><path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/></Icon> },
    { id:"c4", label:"Ciptakan resep sendiri",   color:"#c2410c", glow:"rgba(194,65,12,0.4)",   icon:<Icon><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></Icon> },
    { id:"c5", label:"Sajikan ke keluarga",      color:"#9a3412", glow:"rgba(154,52,18,0.4)",   icon:<Icon><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></Icon> },
    { id:"c6", label:"Ikuti lomba memasak",      color:"#7c2d12", glow:"rgba(124,45,18,0.4)",   icon:<Icon><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></Icon> },
  ],
  "Guru Bahasa Isyarat": [
    { id:"g1", label:"Pelajari alfabet isyarat", color:"#34d399", glow:"rgba(52,211,153,0.4)",  icon:<Icon><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></Icon> },
    { id:"g2", label:"Pelajari kosakata isyarat",color:"#10b981", glow:"rgba(16,185,129,0.4)",  icon:<Icon><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></Icon> },
    { id:"g3", label:"Latihan setiap hari",      color:"#059669", glow:"rgba(5,150,105,0.4)",   icon:<Icon><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></Icon> },
    { id:"g4", label:"Bergabung komunitas",      color:"#047857", glow:"rgba(4,120,87,0.4)",    icon:<Icon><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/></Icon> },
    { id:"g5", label:"Magang sekolah inklusif",  color:"#065f46", glow:"rgba(6,95,70,0.4)",     icon:<Icon><path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></Icon> },
    { id:"g6", label:"Ajarkan bahasa isyarat",   color:"#064e3b", glow:"rgba(6,78,59,0.4)",     icon:<Icon><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></Icon> },
  ],
  "Desain Grafis": [
    { id:"d1", label:"Install aplikasi desain",  color:"#a78bfa", glow:"rgba(167,139,250,0.4)", icon:<Icon><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></Icon> },
    { id:"d2", label:"Pelajari teori warna",     color:"#8b5cf6", glow:"rgba(139,92,246,0.4)",  icon:<Icon><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></Icon> },
    { id:"d3", label:"Buat desain pertamamu",    color:"#7c3aed", glow:"rgba(124,58,237,0.4)",  icon:<Icon><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></Icon> },
    { id:"d4", label:"Kumpulkan portofolio",     color:"#6d28d9", glow:"rgba(109,40,217,0.4)",  icon:<Icon><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></Icon> },
    { id:"d5", label:"Cari proyek pertama",      color:"#5b21b6", glow:"rgba(91,33,182,0.4)",   icon:<Icon><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></Icon> },
    { id:"d6", label:"Ikut kompetisi desain",    color:"#4c1d95", glow:"rgba(76,29,149,0.4)",   icon:<Icon><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></Icon> },
  ],
};

/* ─── Analysis template generator ───────────────────────── */
function generateAnalysis(job: string, slots: (PlanItem | null)[], name: string): string {
  const filled = slots.filter(Boolean) as PlanItem[];
  if (filled.length < 3) return "";
  const [s1, s2, s3] = filled.map((s) => s.label.toLowerCase());
  return `Rencana yang solid, ${name || "kamu"}! Kamu memulai dengan *${s1}*, kemudian mengembangkan diri melalui *${s2}*, dan siap melangkah sebagai ${job} hebat dengan *${s3}*. Tetap semangat dan jangan berhenti belajar!`;
}

/* ─── Slot numbers label ─────────────────────────────────── */
const stepLabels = ["Langkah Pertama", "Langkah Kedua", "Langkah Ketiga"];

/* ─── Main Component ─────────────────────────────────────── */
export default function PlanBuilderQuiz({ job, profile, onFinish }: Props) {
  const theme = jobTheme[job] ?? defaultTheme;
  const items = planItemsMap[job] ?? planItemsMap["Pelayan"];

  type Phase = "intro" | "builder" | "result";
  const [phase, setPhase] = useState<Phase>("intro");
  // 3 plan slots — null means empty
  const [slots, setSlots] = useState<(PlanItem | null)[]>([null, null, null]);
  // track which item ids have been placed
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  // which slot index is currently highlighted (for tap feedback)
  const [highlightSlot, setHighlightSlot] = useState<number | null>(null);
  // intro phase done timer
  const [introReady, setIntroReady] = useState(false);

  /* Auto-advance intro */
  useEffect(() => {
    if (phase !== "intro") return;
    const t1 = setTimeout(() => setIntroReady(true), 300);
    const t2 = setTimeout(() => setPhase("builder"), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  /* Auto-advance to result when all 3 slots filled */
  useEffect(() => {
    if (slots.every(Boolean)) {
      const t = setTimeout(() => setPhase("result"), 650);
      return () => clearTimeout(t);
    }
  }, [slots]);

  /* Tap item → place in next empty slot */
  const handleTapItem = (item: PlanItem) => {
    if (usedIds.has(item.id)) return;
    const nextEmptyIdx = slots.findIndex((s) => s === null);
    if (nextEmptyIdx === -1) return; // all slots full

    // Highlight the slot being filled
    setHighlightSlot(nextEmptyIdx);
    setTimeout(() => setHighlightSlot(null), 700);

    setSlots((prev) => {
      const next = [...prev];
      next[nextEmptyIdx] = item;
      return next;
    });
    setUsedIds((prev) => new Set([...prev, item.id]));
  };

  /* Remove item from slot (tap slot to undo) */
  const handleRemoveSlot = (idx: number) => {
    const removed = slots[idx];
    if (!removed) return;
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
    setUsedIds((prev) => {
      const next = new Set(prev);
      next.delete(removed.id);
      return next;
    });
  };

  const analysis = generateAnalysis(job, slots, profile?.name ?? "");
  const filledCount = slots.filter(Boolean).length;

  /* ─── INTRO PHASE ──────────────────────────────────────── */
  if (phase === "intro") {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#101235] to-[#050616] relative overflow-hidden">
        <BatikOrnament position="top-left" className="opacity-10" />
        <BatikOrnament position="top-right" className="opacity-10" />
        <BatikOrnament position="bottom-left" className="opacity-10" />
        <BatikOrnament position="bottom-right" className="opacity-10" />
        {/* ambient glow */}
        <div className="absolute w-72 h-72 rounded-full blur-[100px] pointer-events-none" style={{ background: theme.glow, top: "45%", left: "50%", transform: "translate(-50%,-50%)" }} />

        <AnimatePresence>
          {introReady && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 130, damping: 12 }}
              className="flex flex-col items-center text-center px-8 z-10"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: 2, duration: 0.6, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5 border-2"
                style={{ background: `${theme.primary}22`, borderColor: theme.primary, boxShadow: `0 0 24px ${theme.glow}` }}
              >
                {/* Compass icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth={1.8} className="w-8 h-8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </motion.div>
              <h1 className="text-white text-2xl sm:text-3xl font-bold font-serif leading-tight mb-2">
                Sekarang, susun<br />
                <span style={{ color: theme.primary }}>rencana kariermu!</span>
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Pilih 3 langkah terbaikmu menjadi <strong className="text-white/80">{job}</strong>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ─── RESULT PHASE ─────────────────────────────────────── */
  if (phase === "result") {
    const parts = analysis.split(/\*(.+?)\*/g);
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-[#101235] to-[#050616] relative overflow-hidden pb-12">
        <BatikOrnament position="top-left" className="opacity-10" />
        <BatikOrnament position="top-right" className="opacity-10" />
        <BatikOrnament position="bottom-left" className="opacity-10" />
        <BatikOrnament position="bottom-right" className="opacity-10" />
        <div className="absolute w-80 h-80 rounded-full blur-[110px] pointer-events-none top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: theme.glow }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 12 }}
          className="z-10 w-full max-w-md px-5 pt-14 flex flex-col items-center"
        >
          {/* Trophy header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.15 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2"
            style={{ background: `${theme.primary}22`, borderColor: theme.primary, boxShadow: `0 0 28px ${theme.glow}` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth={1.8} className="w-8 h-8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 21h8M12 17v4M5 3H3v5a5 5 0 0010 0V3H5zM19 3h-2v5a5 5 0 01-10 0" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-white text-2xl font-bold font-serif text-center mb-1"
          >
            Peta Kariermu Sudah Siap!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-white/40 text-xs text-center mb-8"
          >
            {profile?.name} · {job}
          </motion.p>

          {/* Output Card — the visual plan bagan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 14 }}
            className="w-full bg-[#0d0f2d]/90 border rounded-[2rem] p-6 mb-6 shadow-2xl backdrop-blur-md relative overflow-hidden"
            style={{ borderColor: `${theme.primary}40` }}
          >
            {/* Corner micro-accent */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[2rem] opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${theme.primary}, transparent)` }} />

            {/* Profile row */}
            <div className="flex items-center gap-3 mb-6">
              {profile?.avatar ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: theme.primary }}>
                  <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm text-white" style={{ background: theme.primary }}>
                  {(profile?.name ?? "?").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-white font-bold text-sm">{profile?.name ?? "Petualang"}</p>
                <p className="text-white/40 text-xs">Cita-cita: {job}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-5">
              {/* Vertical connecting line */}
              <div className="absolute left-[9px] top-3 bottom-3 w-[2px] rounded-full" style={{ background: `linear-gradient(to bottom, ${theme.primary}, ${theme.primary}33)` }} />

              {slots.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + idx * 0.18, type: "spring", stiffness: 160, damping: 14 }}
                  className="relative flex items-start gap-3 mb-5 last:mb-0"
                >
                  {/* Node dot */}
                  <div className="absolute left-[-13px] top-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 text-[9px] font-extrabold z-10 text-white"
                    style={{ background: item?.color ?? "#1c1e4c", borderColor: item?.color ?? theme.primary, boxShadow: item ? `0 0 10px ${item.glow}` : "none" }}>
                    {idx + 1}
                  </div>

                  {/* Step card */}
                  <div className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 flex items-center gap-3">
                    <div className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: `${item?.color ?? theme.primary}22` }}>
                      <div className="w-4 h-4" style={{ color: item?.color ?? theme.primary }}>
                        {item?.icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-wider font-bold">{stepLabels[idx]}</p>
                      <p className="text-white text-xs font-semibold leading-tight mt-0.5">{item?.label ?? "—"}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Analysis text box */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15 }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 mb-8 relative overflow-hidden"
          >
            {/* Quote accent bar */}
            <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full" style={{ background: theme.primary }} />
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2 pl-3">Analisa Rencanamu</p>
            <p className="text-white/80 text-xs leading-relaxed font-medium pl-3">
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i} style={{ color: theme.primary }}>{part}</strong>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, type: "spring", stiffness: 160, damping: 12 }}
            whileTap={{ scale: 0.96 }}
            onClick={onFinish}
            className="group relative text-white font-extrabold text-sm px-10 py-3.5 rounded-full tracking-widest uppercase flex items-center gap-2 border overflow-hidden shadow-lg transition-all"
            style={{ background: theme.primary, borderColor: `${theme.primary}60`, boxShadow: `0 6px 28px ${theme.glow}` }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            Mulai VR Sekarang!
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ─── BUILDER PHASE ────────────────────────────────────── */
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-[#101235] to-[#050616] relative overflow-hidden select-none">
      <BatikOrnament position="top-left" className="opacity-10" />
      <BatikOrnament position="top-right" className="opacity-10" />
      <BatikOrnament position="bottom-left" className="opacity-10" />
      <BatikOrnament position="bottom-right" className="opacity-10" />
      {/* ambient glow */}
      <div className="absolute w-64 h-64 rounded-full blur-[90px] pointer-events-none top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700" style={{ background: theme.glow }} />

      {/* ── HEADER ── */}
      <div className="z-10 pt-10 pb-3 px-6 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 130, damping: 12 }}
          className="text-white text-lg sm:text-xl font-bold font-serif"
        >
          Susun <span style={{ color: theme.primary }}>Rencana Kariermu</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-white/40 text-xs mt-1"
        >
          Ketuk langkah di bawah untuk menempatkannya
        </motion.p>

        {/* Progress bar */}
        <div className="flex gap-1.5 mt-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1 w-8 rounded-full overflow-hidden bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: theme.primary }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: slots[i] ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── PLAN SLOTS ── */}
      <div className="z-10 px-5 flex flex-col gap-2.5 mb-5">
        {slots.map((slot, idx) => {
          const isHighlighted = highlightSlot === idx;
          const isEmpty = slot === null;
          return (
            <motion.div
              key={idx}
              layout
              animate={{
                borderColor: isHighlighted ? theme.primary : isEmpty ? "rgba(255,255,255,0.07)" : `${slot?.color ?? theme.primary}60`,
                boxShadow: isHighlighted ? `0 0 20px ${theme.glow}` : "none",
              }}
              transition={{ duration: 0.3 }}
              onClick={() => !isEmpty && handleRemoveSlot(idx)}
              className="relative flex items-center gap-3 rounded-2xl px-4 py-3 border cursor-pointer transition-colors"
              style={{
                background: isEmpty ? "rgba(255,255,255,0.03)" : `${slot?.color ?? theme.primary}18`,
                borderColor: isEmpty ? "rgba(255,255,255,0.07)" : `${slot?.color ?? theme.primary}50`,
              }}
            >
              {/* Step badge */}
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold border"
                style={{
                  background: isEmpty ? "rgba(255,255,255,0.05)" : `${slot?.color ?? theme.primary}33`,
                  borderColor: isEmpty ? "rgba(255,255,255,0.1)" : slot?.color ?? theme.primary,
                  color: isEmpty ? "rgba(255,255,255,0.3)" : slot?.color ?? theme.primary,
                }}
              >
                {idx + 1}
              </div>

              <AnimatePresence mode="wait">
                {isEmpty ? (
                  <motion.span
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-white/20 text-xs font-medium"
                  >
                    {stepLabels[idx]} — belum dipilih
                  </motion.span>
                ) : (
                  <motion.div
                    key={slot!.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ type: "spring", stiffness: 200, damping: 16 }}
                    className="flex items-center gap-2.5 flex-1"
                  >
                    <div className="w-6 h-6 flex-shrink-0 rounded-lg flex items-center justify-center" style={{ background: `${slot!.color}22`, color: slot!.color }}>
                      <div className="w-4 h-4">{slot!.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/30 text-[9px] uppercase tracking-wider font-bold">{stepLabels[idx]}</p>
                      <p className="text-white text-xs font-semibold truncate">{slot!.label}</p>
                    </div>
                    {/* Remove hint */}
                    <div className="opacity-25 flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ── Divider label ── */}
      <div className="z-10 flex items-center gap-3 px-5 mb-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-white/30 text-[10px] uppercase tracking-[0.15em] font-bold">Pilih Langkahmu</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* ── ITEM BANK ── */}
      <div className="z-10 px-4 pb-8 flex flex-col gap-2 overflow-y-auto flex-1">
        {items.map((item, i) => {
          const used = usedIds.has(item.id);
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: used ? 0.28 : 1, y: 0 }}
              transition={{ delay: 0.05 * i, type: "spring", stiffness: 200, damping: 18 }}
              whileHover={!used ? { scale: 1.015, x: 3 } : {}}
              whileTap={!used ? { scale: 0.97 } : {}}
              onClick={() => handleTapItem(item)}
              disabled={used || filledCount >= 3}
              className="relative w-full flex items-center gap-3 text-left rounded-xl px-4 py-3 border transition-all cursor-pointer"
              style={{
                background: used ? "rgba(255,255,255,0.02)" : `${item.color}12`,
                borderColor: used ? "rgba(255,255,255,0.05)" : `${item.color}35`,
                boxShadow: used ? "none" : `0 2px 12px ${item.glow}`,
              }}
            >
              {/* Icon bubble */}
              <div
                className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: used ? "rgba(255,255,255,0.04)" : `${item.color}25`,
                  color: used ? "rgba(255,255,255,0.2)" : item.color,
                }}
              >
                <div className="w-4 h-4">{item.icon}</div>
              </div>
              <span className={`text-xs font-semibold transition-colors ${used ? "text-white/20" : "text-white/85"}`}>
                {item.label}
              </span>

              {/* Placed indicator */}
              {used && (
                <div className="ml-auto flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/20">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Tap ripple indicator (available items only) */}
              {!used && (
                <div className="ml-auto flex-shrink-0 opacity-40">
                  <svg viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
