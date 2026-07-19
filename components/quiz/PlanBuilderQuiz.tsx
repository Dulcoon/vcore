"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Logo from "../Logo";

/* ─── Types ──────────────────────────────────────────────── */
interface Profile {
  name: string;
  age: string;
  grade: string;
  avatar?: string;
}

interface Activity {
  id: string;
  title: string;
  cat: string;
  icon: string;
  xp: number;
}

interface ProfessionData {
  name: string;
  icon: string;
  image: string;
  activities: Activity[];
}

interface Props {
  job: string;
  profile: Profile | null;
  onFinish: () => void;
  onBack: () => void;
}

/* ─── Constants ──────────────────────────────────────────── */
const TARGET_XP = 120;
const SLOT_COUNT = 6;

/* ─── Job key mapper ─────────────────────────────────────── */
// Maps job names from JobSelectQuiz to DATA keys
const JOB_KEY_MAP: Record<string, string> = {
  "Pelayan": "pelayan",
  "Photo Studio": "fotostudio",
  "Chef": "chef",
  "Konten Kreator": "contentcreator",
  "Guru Bahasa Isyarat": "guruisyarat",
  "Desain Grafis": "desaingrafis",
};

const PROFESSION_AVATARS: Record<string, string> = {
  pelayan: "/images/avatar_waiter.png",
  fotostudio: "/images/avatar_photographer.png",
  chef: "/images/avatar_chef.png",
  contentcreator: "/images/avatar_creator.png",
  guruisyarat: "/images/avatar_teacher.png",
  desaingrafis: "/images/avatar_designer.png",
};

/* ─── Data ───────────────────────────────────────────────── */
const DATA: Record<string, ProfessionData> = {
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

/* ─── Onboarding Guide ───────────────────────────────────── */
const GUIDE_STEPS = [
  {
    key: "xp",
    title: "Pantau XP-mu",
    desc: "Setiap kegiatan yang kamu tempatkan akan menambah poin XP. Kumpulkan XP sebanyak mungkin!",
    emoji: "⭐",
  },
  {
    key: "scroll",
    title: "Geser Kartu Kegiatan",
    desc: "Geser ke kanan untuk melihat lebih banyak kegiatan yang bisa kamu pilih.",
    emoji: "👆",
  },
  {
    key: "drag",
    title: "Tahan & Seret",
    desc: "Tekan & tahan kartu sebentar sampai terangkat, lalu seret ke slot kosong di jalur kariermu.",
    emoji: "✋",
  },
  {
    key: "submit",
    title: "Lihat Hasilmu",
    desc: "Setelah menyusun rencana, ketuk tombol ini untuk melihat ringkasan kariermu!",
    emoji: "🚀",
  },
];

function OnboardingGuide({
  step,
  onNext,
  onSkip,
  xpRef,
  poolTitleRef,
  poolRef,
  timelineRef,
  ctaRef,
}: {
  step: number;
  onNext: () => void;
  onSkip: () => void;
  xpRef: React.RefObject<HTMLDivElement | null>;
  poolTitleRef: React.RefObject<HTMLParagraphElement | null>;
  poolRef: React.RefObject<HTMLDivElement | null>;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  ctaRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [scrollDemo, setScrollDemo] = useState(false);
  const [dragDemo, setDragDemo] = useState(false);
  const current = GUIDE_STEPS[step];

  // Measure target element with precise step-based bounding rects
  useEffect(() => {
    const updateRect = () => {
      if (step === 0 && xpRef.current) {
        setTargetRect(xpRef.current.getBoundingClientRect());
      } else if (step === 1 && poolTitleRef.current && poolRef.current) {
        const titleRect = poolTitleRef.current.getBoundingClientRect();
        const pRect = poolRef.current.getBoundingClientRect();
        setTargetRect(new DOMRect(
          pRect.left,
          titleRect.top - 6,
          pRect.width,
          pRect.bottom - (titleRect.top - 6)
        ));
      } else if (step === 2 && poolTitleRef.current && timelineRef.current) {
        const titleRect = poolTitleRef.current.getBoundingClientRect();
        const tRect = timelineRef.current.getBoundingClientRect();
        setTargetRect(new DOMRect(
          tRect.left,
          titleRect.top - 6,
          tRect.width,
          tRect.bottom - (titleRect.top - 6)
        ));
      } else if (step === 3 && ctaRef.current) {
        setTargetRect(ctaRef.current.getBoundingClientRect());
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [step, xpRef, poolTitleRef, poolRef, timelineRef, ctaRef]);

  // Scroll demo animation for step 1
  useEffect(() => {
    if (step !== 1) { setScrollDemo(false); return; }
    setScrollDemo(true);
    const el = poolRef.current;
    if (!el) return;
    const timer = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft < maxScroll * 0.6) {
        el.scrollBy({ left: 60, behavior: "smooth" });
      } else {
        el.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 800);
    return () => clearInterval(timer);
  }, [step, poolRef]);

  // Measure exact first card and first slot positions for step 2 ("drag")
  const [dragCoords, setDragCoords] = useState<{
    startLeft: number;
    startTop: number;
    width: number;
    height: number;
    deltaX: number;
    deltaY: number;
  } | null>(null);

  useEffect(() => {
    if (step !== 2) {
      setDragDemo(false);
      setDragCoords(null);
      return;
    }
    setDragDemo(true);

    if (poolRef.current) {
      poolRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }

    const updateCoords = () => {
      const poolEl = poolRef.current;
      const timelineEl = timelineRef.current;
      if (!poolEl || !timelineEl) return;

      const firstCard = poolEl.querySelector("[data-card-id]") as HTMLElement | null;
      const firstSlot = timelineEl.querySelector("[data-slot-idx]") as HTMLElement | null;

      if (firstCard && firstSlot) {
        const cardRect = firstCard.getBoundingClientRect();
        const slotRect = firstSlot.getBoundingClientRect();
        setDragCoords({
          startLeft: cardRect.left,
          startTop: cardRect.top,
          width: cardRect.width,
          height: cardRect.height,
          deltaX: (slotRect.left + slotRect.width / 2) - (cardRect.left + cardRect.width / 2),
          deltaY: (slotRect.top + slotRect.height / 2) - (cardRect.top + cardRect.height / 2),
        });
      }
    };

    const timer = setTimeout(updateCoords, 180);
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [step, poolRef, timelineRef]);

  if (!targetRect) return null;

  const isBottom = step === 3;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;

  // Highlight box maps directly to targetRect fields without viewport clamping,
  // preventing the highlight box from shifting upwards when taller than the viewport.
  const highlightLeft = targetRect.left;
  const highlightTop = targetRect.top;
  const highlightWidth = targetRect.width;
  const highlightHeight = targetRect.height;

  const highlightStyle: React.CSSProperties = {
    position: "fixed",
    left: highlightLeft,
    top: highlightTop,
    width: highlightWidth,
    height: highlightHeight,
    borderRadius: 16,
    border: "2px dashed rgba(242,169,59,0.85)",
    boxShadow: "0 0 0 4000px rgba(10,9,30,0.85)",
    zIndex: 9998,
    pointerEvents: "none" as const,
    transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
  };

  // Tooltip position
  const rawTooltipTop = isBottom
    ? targetRect.top - 195
    : targetRect.bottom + 18;
  const tooltipTop = Math.max(16, Math.min(vh - 210, rawTooltipTop));

  // Dotted line
  const lineX = Math.max(20, Math.min(vw - 20, targetRect.left + targetRect.width / 2));
  const lineY1 = isBottom ? targetRect.top : targetRect.bottom;
  const lineY2 = isBottom ? tooltipTop + 180 : tooltipTop;

  // Keyframe translations for drag card
  const dx = dragCoords ? dragCoords.deltaX : 0;
  const dy = dragCoords ? dragCoords.deltaY : 120;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9997 }}
      onClick={(e) => { e.stopPropagation(); onNext(); }}
    >
      {/* Global guide CSS */}
      <style>{`
        @keyframes guide-pulse {
          0%, 100% { opacity: 0.65; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        @keyframes guide-finger-scroll {
          0% { transform: translateX(0); opacity: 1; }
          60% { transform: translateX(45px); opacity: 1; }
          80% { transform: translateX(45px); opacity: 0; }
          100% { transform: translateX(0); opacity: 0; }
        }
        @keyframes guide-card-drag {
          0%   { transform: translate(0px, 0px) rotate(0deg) scale(1); opacity: 0; }
          10%  { transform: translate(0px, 0px) rotate(0deg) scale(1); opacity: 1; }
          25%  { transform: translate(0px, 0px) rotate(0deg) scale(1.04); opacity: 1; box-shadow: 0 0 0 3px #F2A93B, 0 8px 24px rgba(0,0,0,.5); }
          42%  { transform: translate(0px, -6px) rotate(-3deg) scale(1.07); opacity: 1; box-shadow: 0 16px 36px rgba(0,0,0,.6); }
          75%  { transform: translate(${dx}px, ${dy}px) rotate(-1deg) scale(1.02); opacity: 1; }
          88%  { transform: translate(${dx}px, ${dy}px) rotate(0deg) scale(1); opacity: 0.8; }
          100% { transform: translate(${dx}px, ${dy}px) rotate(0deg) scale(1); opacity: 0; }
        }
        @keyframes guide-finger-drag {
          0%   { transform: translate(0px, 0px) scale(1); opacity: 0; }
          10%  { transform: translate(0px, 0px) scale(1); opacity: 1; }
          25%  { transform: translate(0px, 0px) scale(0.88); opacity: 1; }
          42%  { transform: translate(0px, -6px) scale(1.05); opacity: 1; }
          75%  { transform: translate(${dx}px, ${dy}px) scale(1); opacity: 1; }
          88%  { transform: translate(${dx}px, ${dy}px) scale(1); opacity: 0.8; }
          100% { transform: translate(${dx}px, ${dy}px) scale(1); opacity: 0; }
        }
        @keyframes guide-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes guide-dotted-draw {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Highlight border + dimmed backdrop */}
      <div style={highlightStyle} />

      {/* Dotted line connector */}
      <svg style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", zIndex: 9999, pointerEvents: "none" }}>
        <line
          x1={lineX} y1={lineY1} x2={lineX} y2={lineY2}
          stroke="#F2A93B" strokeWidth="2" strokeDasharray="5,5"
          style={{ animation: "guide-dotted-draw 0.5s ease forwards" }}
        />
      </svg>

      {/* Animated finger icon for scroll step */}
      {step === 1 && scrollDemo && (
        <div style={{
          position: "fixed",
          left: Math.min(vw - 60, Math.max(20, targetRect.left + 40)),
          top: targetRect.top + targetRect.height / 2 - 16,
          fontSize: 26, zIndex: 10001, pointerEvents: "none",
          animation: "guide-finger-scroll 1.8s ease-in-out infinite",
        }}>
          👆
        </div>
      )}

      {/* Drag demo: animated card clone starting EXACTLY at pool card, ending at slot #1 */}
      {step === 2 && dragDemo && dragCoords && (
        <>
          {/* Card clone */}
          <div style={{
            position: "fixed",
            left: dragCoords.startLeft,
            top: dragCoords.startTop,
            width: dragCoords.width,
            height: dragCoords.height,
            zIndex: 10001, pointerEvents: "none",
            animation: "guide-card-drag 2.5s ease-in-out infinite",
            borderRadius: 16,
            background: "#242058",
            border: "1.5px solid #F2A93B",
            padding: 12,
            boxSizing: "border-box",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>🗣️</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "#F9CA75", opacity: 0.85 }}>Belajar</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 700, lineHeight: 1.3, margin: "4px 0 8px", color: "#fff" }}>Komunikasi Tamu</div>
            <div style={{ alignSelf: "flex-start", background: "#F9CA75", color: "#2A1B02", fontWeight: 700, fontSize: 11, padding: "3px 8px", borderRadius: 999 }}>+10 XP</div>
          </div>
          {/* Finger icon right over center of card */}
          <div style={{
            position: "fixed",
            left: dragCoords.startLeft + dragCoords.width / 2 - 12,
            top: dragCoords.startTop + dragCoords.height / 2 - 12,
            fontSize: 28, zIndex: 10002, pointerEvents: "none",
            animation: "guide-finger-drag 2.5s ease-in-out infinite",
          }}>
            ✋
          </div>
        </>
      )}

      {/* Tooltip card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          left: 16,
          right: 16,
          margin: "0 auto",
          top: tooltipTop,
          maxWidth: 300,
          zIndex: 10000,
          boxSizing: "border-box",
          animation: "guide-fadein 0.4s ease forwards",
        }}
      >
        <div style={{
          background: "#1B1A3E",
          border: "1px solid #3B366E",
          borderRadius: 16,
          padding: "16px 18px 14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          boxSizing: "border-box",
          width: "100%",
        }}>
          {/* Step indicator */}
          <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
            {GUIDE_STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1, height: 3, borderRadius: 999,
                  background: i <= step ? "#F2A93B" : "rgba(255,255,255,0.1)",
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12, flexShrink: 0,
              background: "#242058", border: "1px solid #3B366E",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              animation: "guide-pulse 2s ease-in-out infinite",
            }}>
              {current.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-playfair)", fontWeight: 800, fontSize: 15.5,
                color: "#fff", marginBottom: 3, lineHeight: 1.3,
              }}>
                {current.title}
              </div>
              <p style={{
                fontFamily: "var(--font-plus-jakarta)", fontSize: 12, lineHeight: 1.5,
                color: "#B6B2DA", margin: 0,
              }}>
                {current.desc}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onSkip(); }}
              style={{
                background: "none", border: "none", color: "#B6B2DA",
                fontSize: 12, cursor: "pointer", fontFamily: "var(--font-plus-jakarta)",
                textDecoration: "underline", textUnderlineOffset: 3, opacity: 0.7,
              }}
            >
              Lewati
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              style={{
                background: "#F2A93B", color: "#1B1A3E", border: "none",
                fontWeight: 700, fontSize: 12.5, padding: "8px 18px",
                borderRadius: 999, cursor: "pointer",
                fontFamily: "var(--font-plus-jakarta)",
                boxShadow: "0 4px 16px rgba(242,169,59,0.35)",
              }}
            >
              {step < GUIDE_STEPS.length - 1 ? "Lanjut" : "Mulai!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────── */
function getLevel(xp: number): string {
  if (xp >= 90) return "Ahli Muda 🏆";
  if (xp >= 40) return "Berkembang 🚀";
  return "Pemula 🌱";
}

/* ─── Sub-components ─────────────────────────────────────── */

// Batik corner ornament via SVG pattern
// Batik corner ornament via custom image (consistent with homepage)
function BatikCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const transforms = {
    tl: "scaleX(-1)",
    tr: "none",
    bl: "scaleX(-1) scaleY(-1)",
    br: "scaleY(-1)",
  };

  const posStyle: React.CSSProperties = {
    position: "absolute",
    width: 160,
    height: 160,
    pointerEvents: "none",
    zIndex: 1,
    transform: transforms[position],
    ...(position === "tl" && { top: -12, left: -12 }),
    ...(position === "tr" && { top: -12, right: -12 }),
    ...(position === "bl" && { bottom: -12, left: -12 }),
    ...(position === "br" && { bottom: -12, right: -12 }),
  };

  return (
    <div style={posStyle}>
      <img
        src="/images/Elemen Frame Kanan Atas.png"
        alt="Batik Ornament"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "right top",
          opacity: 0.08,
        }}
      />
    </div>
  );
}

/* ─── Result Modal ───────────────────────────────────────── */
/* ─── Result Modal ───────────────────────────────────────── */
function ResultModal({
  profKey,
  placed,
  profile,
  totalXp,
  onClose,
  onFinish,
}: {
  profKey: string;
  placed: Record<number, string | null>;
  profile: Profile | null;
  totalXp: number;
  onClose: () => void;
  onFinish: () => void;
}) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isCelebrating, setIsCelebrating] = useState(true);
  const [celebrationProgress, setCelebrationProgress] = useState(0);

  const prof = DATA[profKey];
  const level = getLevel(totalXp);
  const filledItems = Array.from({ length: SLOT_COUNT }, (_, i) => placed[i])
    .filter(Boolean)
    .map((id) => prof.activities.find((a) => a.id === id))
    .filter((a): a is Activity => !!a);

  // Celebration loader animation
  useEffect(() => {
    if (!isCelebrating) return;
    const interval = setInterval(() => {
      setCelebrationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsCelebrating(false);
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isCelebrating]);

  const handleShare = async () => {
    if (!posterRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(posterRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: "#1B1A3E",
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Gagal memproses gambar untuk dibagikan.");
          return;
        }
        const file = new File([blob], `VCORE_Rencana_Karier_${profile?.name ?? "Petualang"}.png`, { type: "image/png" });

        // Web Share API File Share Support
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "Peta Rencana Karier VCORE",
              text: `Lihat rencana karier ku sebagai ${prof.name} di VCORE!`,
            });
          } catch (shareErr) {
            console.log("Share failed or cancelled:", shareErr);
          }
        } else {
          // Fallback to direct download
          const dataUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.download = `VCORE_Rencana_Karier_${profile?.name ?? "Petualang"}.png`;
          link.href = dataUrl;
          link.click();
          alert("Fitur bagikan gambar langsung tidak didukung di perangkat ini. Gambar rencana karier berhasil diunduh ke galeri Anda!");
        }
      }, "image/png");
    } catch (err) {
      console.error("Gagal membagikan poster:", err);
      alert("Gagal memproses gambar.");
    }
  };

  const handleDownloadOnly = async () => {
    if (!posterRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(posterRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: "#1B1A3E",
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `VCORE_Rencana_Karier_${profile?.name ?? "Petualang"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh poster:", err);
      alert("Gagal mengunduh gambar.");
    }
  };

  // Color tokens
  const goldLight = "#F9CA75";
  const goldDark = "#C97F1E";
  const gold = "#F2A93B";

  if (isCelebrating) {
    return (
      <div
        style={{
          position: "fixed", inset: 0,
          background: "radial-gradient(circle at center, #1B1A3E 0%, #0F0E24 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: "24px",
          fontFamily: "var(--font-plus-jakarta), sans-serif",
          color: "#fff",
          textAlign: "center"
        }}
      >
        <BatikCorner position="tl" />
        <BatikCorner position="br" />

        {/* Minimalist Premium Loader */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Rotating Thin Gold Ring and Pulsing Icon */}
          <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
            {/* Outer static ring */}
            <div className="absolute inset-0 rounded-full border border-yellow-500/10" />
            {/* Spinning element */}
            <div className="absolute inset-0 rounded-full border-t border-r border-[#F9CA75] animate-spin" style={{ animationDuration: "1s" }} />
            {/* Center icon */}
            <div className="w-8 h-8 rounded-full bg-[#F9CA75]/5 flex items-center justify-center animate-pulse">
              <span style={{ fontSize: 13 }}>✨</span>
            </div>
          </div>

          <h2 style={{
            fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700,
            fontStyle: "italic", margin: "0 0 6px 0", color: goldLight, letterSpacing: 0.5
          }}>
            Membuat peta rencana...
          </h2>

          <p style={{
            fontFamily: "var(--font-plus-jakarta)", fontSize: 12.5,
            color: "#B6B2DA", letterSpacing: 0.3, margin: 0, opacity: 0.8
          }}>
            Sedang merakit bagan petualangan {profile?.name ?? "kamu"}
          </p>
        </div>
      </div>
    );
  }

  const renderPosterContent = (isExport: boolean) => {
    const avatarUrl = profile?.avatar || PROFESSION_AVATARS[profKey] || null;

    return (
      <div
        style={{
          width: isExport ? 375 : "100%",
          background: "linear-gradient(180deg,#242058,#1B1A3E 60%,#17153A)",
          border: "1px solid #3B366E", borderRadius: 22, padding: "26px 22px",
          position: "relative", overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <BatikCorner position="tr" />
        <BatikCorner position="bl" />

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <Logo className="w-20" />
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#B6B2DA", margin: "2px 0 18px", letterSpacing: 0.5, fontWeight: 700 }}>
          PETA RENCANA KARIER
        </p>

        {/* Profile row */}
        <div style={{
          display: "flex", alignItems: "center",
          background: "rgba(242,169,59,0.08)", border: "1px solid rgba(242,169,59,0.3)",
          borderRadius: 16, padding: "14px 16px", marginBottom: 18,
        }}>
          {/* Avatar */}
          {avatarUrl ? (
            <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", flexShrink: 0, position: "relative", marginRight: 14 }}>
              <Image src={avatarUrl} alt={profile?.name ?? prof.name} fill style={{ objectFit: "cover" }} />
            </div>
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg,#F9CA75,#C97F1E)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, marginRight: 14,
            }}>
              {prof.icon}
            </div>
          )}
          <div>
            {profile && (
              <p style={{ fontSize: 11, color: "#B6B2DA", fontWeight: 600, margin: "0 0 2px" }}>
                {profile.name} · {profile.grade}
              </p>
            )}
            <p style={{ fontSize: 11, color: "#B6B2DA", fontWeight: 600, margin: 0 }}>Cita-citaku</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 800, fontSize: 17, margin: 0, color: "#fff" }}>
              {prof.name}
            </p>
          </div>
        </div>

        {/* Steps Bagan (Visual Roadmap Diagram) */}
        <div style={{ position: "relative", margin: "24px 0", minHeight: Math.max(120, filledItems.length * 68) }}>
          {/* Center Vertical dashed track line */}
          <div style={{
            position: "absolute", left: "calc(50% - 1.25px)", top: 10, bottom: 10,
            width: 2.5, borderLeft: "2.5px dashed rgba(242,169,59,0.35)", zIndex: 0
          }} />

          <div style={{ display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
            {filledItems.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: isLeft ? "flex-start" : "flex-end",
                    width: "100%",
                    padding: "0 10px",
                    boxSizing: "border-box",
                    marginBottom: 14,
                  }}
                >
                  {/* Node Card */}
                  <div style={{
                    width: "88%",
                    background: "#242058",
                    border: "1.5px solid #3B366E",
                    borderRadius: 14,
                    padding: "10px 12px",
                    position: "relative",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    boxSizing: "border-box",
                  }}>
                    {/* Connection indicator pin linking to center track */}
                    <div style={{
                      position: "absolute",
                      top: "calc(50% - 1px)",
                      right: isLeft ? -12 : "auto",
                      left: isLeft ? "auto" : -12,
                      width: 12,
                      height: 2,
                      background: "rgba(242,169,59,0.35)",
                    }} />

                    {/* Stable structure using CSS Table layout for robust html2canvas rendering */}
                    <div style={{ display: "table", width: "100%", tableLayout: "fixed", boxSizing: "border-box" }}>
                      {/* Step Number Circle cell */}
                      <div style={{ display: "table-cell", verticalAlign: "middle", width: 22, boxSizing: "border-box" }}>
                        <div style={{
                          position: "relative",
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "#0F0E24",
                          border: "2px solid #F2A93B",
                          boxSizing: "border-box",
                        }}>
                          <span style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: 11,
                            fontWeight: 800,
                            color: "#F9CA75",
                            lineHeight: 1,
                            whiteSpace: "nowrap",
                          }}>
                            {i + 1}
                          </span>
                        </div>
                      </div>

                      {/* Spacer cell */}
                      <div style={{ display: "table-cell", width: 8 }} />

                      {/* Icon cell */}
                      <div style={{
                        display: "table-cell",
                        verticalAlign: "middle",
                        width: 24,
                        fontSize: 20,
                        lineHeight: 1,
                        textAlign: "center",
                        boxSizing: "border-box",
                      }}>
                        {item.icon}
                      </div>

                      {/* Spacer cell */}
                      <div style={{ display: "table-cell", width: 8 }} />

                      {/* Content text cell */}
                      <div style={{ display: "table-cell", verticalAlign: "middle", boxSizing: "border-box" }}>
                        <p style={{
                          fontSize: 12,
                          fontWeight: 700,
                          margin: 0,
                          color: "#fff",
                          lineHeight: 1.3,
                          whiteSpace: "normal"
                        }}>
                          {item.title}
                        </p>
                        <p style={{ fontSize: 9.5, color: "#B6B2DA", margin: "2px 0 0" }}>
                          +{item.xp} XP
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid #3B366E", paddingTop: 16, marginBottom: 14,
        }}>
          <div>
            <span style={{ display: "block", fontSize: 10.5, color: "#B6B2DA", fontWeight: 700, textTransform: "uppercase" }}>Total XP</span>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 800, color: "#F9CA75" }}>{totalXp}</span>
          </div>
          {/* Level Badge - styled clean & premium matching design language */}
          <div style={{
            fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 6,
            background: "rgba(242,169,59,0.08)", border: "1px solid rgba(242,169,59,0.3)",
            color: "#F9CA75",
          }}>{level}</div>
        </div>

        <p style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12.5,
          textAlign: "center", color: "#B6B2DA", lineHeight: 1.5, margin: 0,
        }}>&ldquo;Setiap langkah kecil membawamu lebih dekat ke cita-cita!&rdquo;</p>
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(6,5,18,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, padding: "22px",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: "100%", maxWidth: 400, maxHeight: "92vh", overflowY: "auto", position: "relative" }}>

        {/* 1. Visible Poster Card (for UI rendering on modal) */}
        {renderPosterContent(false)}

        {/* 2. Hidden Poster Card (absolute off-screen with fixed width for html2canvas export) */}
        <div
          ref={posterRef}
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            width: 375,
            boxSizing: "border-box",
          }}
        >
          {renderPosterContent(true)}
        </div>

        {/* Share Button (Full Width) */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-bold text-sm px-4 py-3.5 rounded-full shadow-[0_4px_20px_rgba(226,157,41,0.4)] transition-all border border-yellow-500/20"
          style={{ fontFamily: "var(--font-plus-jakarta)", marginTop: 18, marginBottom: 12 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>Bagikan Rencana</span>
        </button>

        {/* Edit and Finish Buttons (Equal Width Side-by-Side) */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose} // Just closes the modal, returning to the quiz
            className="flex-1 text-center border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-sm px-3 py-3.5 rounded-full transition-all active:scale-95"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Ubah Jalur
          </button>

          <button
            onClick={onFinish} // Exits the quiz to homepage
            className="flex-1 text-center border border-white/15 bg-[#E29D29]/10 hover:bg-[#E29D29]/20 text-[#F9CA75] border-[#E29D29]/30 font-bold text-sm px-3 py-3.5 rounded-full transition-all active:scale-95"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Selesai
          </button>
        </div>

        {/* Subtle direct download trigger underneath */}
        <button
          onClick={handleDownloadOnly}
          style={{
            background: "none", border: "none", color: "#B6B2DA", fontSize: 11.5,
            display: "block", margin: "18px auto 0", textDecoration: "underline",
            cursor: "pointer", fontFamily: "var(--font-plus-jakarta)"
          }}
        >
          Unduh Gambar Saja
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function PlanBuilderQuiz({ job, profile, onFinish, onBack }: Props) {
  // Resolve profession key from job name passed by JobSelectQuiz
  const initialKey = JOB_KEY_MAP[job] ?? Object.keys(DATA)[0];
  const [currentProf, setCurrentProf] = useState<string>(initialKey);
  const [placed, setPlaced] = useState<Record<number, string | null>>(
    () => Object.fromEntries(Array.from({ length: SLOT_COUNT }, (_, i) => [i, null])) as Record<number, string | null>
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [guideStep, setGuideStep] = useState<number>(0);
  const [guideVisible, setGuideVisible] = useState(true);

  // Refs for guide targets
  const xpRef = useRef<HTMLDivElement>(null);
  const poolTitleRef = useRef<HTMLParagraphElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  // Drag state (pointer-based — works on touch + mouse with long-press support)
  const dragRef = useRef<{
    id: string;
    startX: number; startY: number;
    timer: NodeJS.Timeout | null;
    isActivated: boolean;
    moved: boolean;
    ghost: HTMLElement | null;
    card: HTMLElement;
    pointerId: number;
    offsetX: number; offsetY: number;
  } | null>(null);

  const prof = DATA[currentProf];
  const usedIds = Object.values(placed).filter(Boolean) as string[];
  const poolItems = prof.activities.filter((a) => !usedIds.includes(a.id));

  const totalXp = usedIds.reduce((sum, id) => {
    const a = prof.activities.find((x) => x.id === id);
    return sum + (a?.xp ?? 0);
  }, 0);
  const anyFilled = usedIds.length > 0;

  /* Switch profession — kept for future use but no longer exposed in UI */
  const switchProf = (_key: string) => {
    setCurrentProf(_key);
    setPlaced(Object.fromEntries(Array.from({ length: SLOT_COUNT }, (_, i) => [i, null])) as Record<number, string | null>);
    setSelectedId(null);
  };
  void switchProf; // suppress unused warning

  /* Place / remove */
  const placeItem = useCallback((id: string, slotIdx: number) => {
    setPlaced((prev) => {
      if (prev[slotIdx] !== null) return prev;
      return { ...prev, [slotIdx]: id };
    });
    setSelectedId(null);
  }, []);

  const removeItem = useCallback((slotIdx: number) => {
    setPlaced((prev) => ({ ...prev, [slotIdx]: null }));
  }, []);

  const handleSlotClick = (slotIdx: number) => {
    if (placed[slotIdx] !== null) { removeItem(slotIdx); return; }
    if (selectedId) placeItem(selectedId, slotIdx);
  };

  const toggleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  /* ── Pointer drag logic (Long-Press / Hold-to-drag UX) ── */

  /** Always-safe cleanup: removes ghost, resets card opacity, clears drag state */
  const cleanupDrag = useCallback((placeAtPoint?: { x: number; y: number }) => {
    const d = dragRef.current;
    if (!d) return;

    if (d.timer) clearTimeout(d.timer);
    d.card.style.opacity = "";

    if (d.isActivated && d.ghost) {
      if (placeAtPoint) {
        const el = document.elementFromPoint(placeAtPoint.x, placeAtPoint.y);
        const slot = el?.closest("[data-slot-empty]") as HTMLElement | null;
        if (slot) {
          const idx = parseInt(slot.getAttribute("data-slot-idx") ?? "-1", 10);
          if (idx >= 0) placeItem(d.id, idx);
        }
      }
      try { d.ghost.remove(); } catch (_) {}
      document.querySelectorAll("[data-drag-over]").forEach((el) => el.removeAttribute("data-drag-over"));
    }

    dragRef.current = null;
  }, [placeItem]);

  // Safety net: on unmount, clean up any leftover ghost
  useEffect(() => {
    return () => {
      const d = dragRef.current;
      if (d?.ghost) { try { d.ghost.remove(); } catch (_) {} }
      if (d?.timer) clearTimeout(d.timer);
    };
  }, []);

  // Global fallback: if the pointer is released or cancelled outside the pool area
  // (e.g. the user lifts their finger over a slot or outside the component),
  // the ghost must be removed. We attach to document on pointerup/pointercancel.
  useEffect(() => {
    const handleGlobalUp = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || !d.isActivated) return;
      cleanupDrag({ x: e.clientX, y: e.clientY });
    };
    const handleGlobalCancel = () => {
      const d = dragRef.current;
      if (!d) return;
      cleanupDrag();
    };
    document.addEventListener("pointerup", handleGlobalUp);
    document.addEventListener("pointercancel", handleGlobalCancel);
    return () => {
      document.removeEventListener("pointerup", handleGlobalUp);
      document.removeEventListener("pointercancel", handleGlobalCancel);
    };
  }, [cleanupDrag]);

  const onPoolPointerDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const startX = e.clientX;
    const startY = e.clientY;
    const pointerId = e.pointerId;

    // Start 400ms long-press timer to unlock drag-and-drop
    const timer = setTimeout(() => {
      const d = dragRef.current;
      if (!d || d.id !== id) return;

      d.isActivated = true;
      try {
        card.setPointerCapture(pointerId);
      } catch (_err) {}

      const rect = card.getBoundingClientRect();
      const ghost = card.cloneNode(true) as HTMLElement;
      ghost.style.cssText = `
        position: fixed; z-index: 9999; pointer-events: none;
        opacity: 1; background-color: #242058;
        border: 2px solid #F2A93B; border-radius: 16px;
        transform: scale(1.06) rotate(-2deg);
        box-shadow: 0 18px 40px rgba(0,0,0,0.8), 0 0 24px rgba(242,169,59,0.3);
        width: ${rect.width}px; height: ${rect.height}px;
        left: ${rect.left}px; top: ${rect.top}px;
        box-sizing: border-box;
      `;
      document.body.appendChild(ghost);
      d.ghost = ghost;
      d.offsetX = startX - rect.left;
      d.offsetY = startY - rect.top;
      card.style.opacity = "0.3";

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }, 400);

    dragRef.current = {
      id, startX, startY, timer,
      isActivated: false, moved: false,
      ghost: null, card: card as HTMLElement,
      pointerId, offsetX: 0, offsetY: 0,
    };
  };

  const onPoolPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    // If pointer moves before long-press timer fires, cancel timer so horizontal scroll works naturally.
    // Increased tolerance to 20px to prevent touch micro-movements from cancelling long-press drag.
    if (!d.isActivated) {
      if (Math.hypot(dx, dy) > 20) {
        if (d.timer) {
          clearTimeout(d.timer);
          d.timer = null;
        }
      }
      return;
    }

    // Drag activated! Update ghost position
    d.moved = true;
    if (d.ghost) {
      d.ghost.style.left = `${e.clientX - d.offsetX}px`;
      d.ghost.style.top = `${e.clientY - d.offsetY}px`;
      document.querySelectorAll("[data-drag-over]").forEach((el) => el.removeAttribute("data-drag-over"));
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const slot = el?.closest("[data-slot-empty]") as HTMLElement | null;
      if (slot) slot.dataset.dragOver = "true";
    }
  };

  const onPoolPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;

    // If drag was not yet activated (timer still pending) and no significant movement -> treat as tap
    if (!d.isActivated && !d.moved) {
      if (d.timer) clearTimeout(d.timer);
      d.card.style.opacity = "";
      toggleSelect(d.id);
      dragRef.current = null;
      return;
    }

    cleanupDrag({ x: e.clientX, y: e.clientY });
  };

  /* ── Sections ── */
  const stages = [
    { label: "🌱 Tahap Awal", slots: [0, 1] },
    { label: "🚀 Tahap Berkembang", slots: [2, 3] },
    { label: "🏆 Tahap Mahir", slots: [4, 5] },
  ];


  /* ── Shared style tokens ── */
  const navyDeep = "#0F0E24";
  const navy = "#1B1A3E";
  const navyCard = "#242058";
  const navyCard2 = "#2C2860";
  const line = "#3B366E";
  const gold = "#F2A93B";
  const goldLight = "#F9CA75";
  const goldDark = "#C97F1E";
  const muted = "#B6B2DA";

  return (
    <>
      {/* ── Shell ── */}
      <div style={{
        position: "relative", width: "100%", minHeight: "100vh",
        background: `radial-gradient(ellipse at top, #2A265C 0%, ${navy} 45%, ${navyDeep} 100%)`,
        overflowX: "hidden",
        fontFamily: "var(--font-plus-jakarta), sans-serif",
        color: "#fff",
        display: "flex", justifyContent: "center",
        paddingBottom: 110,
      }}>
        {/* Inner max-width shell */}
        <div style={{ position: "relative", width: "100%", maxWidth: 440 }}>
          <BatikCorner position="tl" />
          <BatikCorner position="tr" />
          <BatikCorner position="bl" />
          <BatikCorner position="br" />

          <div style={{ position: "relative", zIndex: 1 }}>

            {/* ── Top bar ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 8px" }}>
              <button
                onClick={onBack}
                aria-label="Kembali"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 transition-all active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <Logo className="w-16" />

              <div ref={xpRef} style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(242,169,59,0.12)", border: `1px solid rgba(242,169,59,0.5)`,
                color: goldLight, fontWeight: 700, fontSize: 13,
                padding: "7px 12px", borderRadius: 999,
              }}>
                ⭐ <span>{totalXp}</span> XP
              </div>
            </div>



            {/* ── Intro heading ── */}
            <div style={{ padding: "16px 18px 6px" }}>
              <h1 style={{
                fontFamily: "var(--font-playfair)", fontWeight: 800, fontSize: 24,
                margin: "0 0 8px", lineHeight: 1.35, color: "#fff",
              }}>
                Hallo, {profile?.name ?? "Kamu"}! 👋<br />
                Ayo Susun <span style={{ color: gold }}>Rencana</span> Kariermu
              </h1>
              <p style={{ margin: 0, fontSize: 13.5, color: muted, lineHeight: 1.55 }}>
                Seret kartu kegiatan, atau ketuk untuk memilih lalu ketuk tempat kosong di jalur — bangun langkahmu menuju cita-cita!
              </p>
            </div>

            {/* ── Activity pool ── */}
            <div style={{ padding: "14px 0 4px" }}>
              <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                  height: 15px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(255, 255, 255, 0.04);
                  border-radius: 999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(242, 169, 59, 0.45);
                  border-radius: 999px;
                  border: 2px solid #1B1A3E; /* Create a floaty tactile handle */
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(242, 169, 59, 0.7);
                }
              `}</style>
              <p
                ref={poolTitleRef}
                style={{ padding: "0 18px 10px", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: goldLight, margin: 0 }}
              >
                Kegiatan yang bisa kamu pilih
              </p>
              <div
                ref={poolRef}
                className="custom-scrollbar"
                style={{ display: "flex", gap: 12, padding: "0 18px 10px", overflowX: "auto", scrollSnapType: "x proximity" }}
              >
                {poolItems.length === 0 ? (
                  <div style={{
                    width: "100%", padding: 18, textAlign: "center", fontSize: 13, color: muted,
                    background: navyCard, border: `1px dashed ${line}`, borderRadius: 16,
                  }}>
                    Semua kegiatan sudah kamu tempatkan di jalur! 🎉
                  </div>
                ) : poolItems.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <div
                      key={item.id}
                      data-card-id={item.id}
                      onPointerDown={(e) => onPoolPointerDown(e, item.id)}
                      onPointerMove={onPoolPointerMove}
                      onPointerUp={onPoolPointerUp}
                      style={{
                        flexShrink: 0, scrollSnapAlign: "start",
                        background: navyCard,
                        border: `1px solid ${isSelected ? gold : line}`,
                        boxShadow: isSelected ? `0 0 0 3px rgba(242,169,59,0.25)` : "none",
                        transform: isSelected ? "translateY(-2px)" : "none",
                        borderRadius: 16, padding: 12, width: 148, minHeight: 164,
                        display: "flex", flexDirection: "column",
                        cursor: "grab", userSelect: "none", touchAction: "pan-x",
                        transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
                      }}
                    >
                      <div style={{ fontSize: 26, marginBottom: 6 }}>{item.icon}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: goldLight, opacity: 0.85 }}>{item.cat}</div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 700, lineHeight: 1.3, margin: "4px 0 8px", color: "#fff" }}>{item.title}</div>
                      <div style={{
                        alignSelf: "flex-start", display: "inline-block", fontSize: 11, fontWeight: 700, color: "#2A1B02",
                        background: goldLight, padding: "3px 8px", borderRadius: 999,
                      }}>+{item.xp} XP</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Timeline ── */}
            <div ref={timelineRef} style={{ padding: "22px 18px 4px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 18, margin: 0, fontWeight: 700, color: "#fff" }}>
                  Jalur Menuju Cita-cita
                </h2>
                <button
                  onClick={() => {
                    setPlaced(Object.fromEntries(Array.from({ length: SLOT_COUNT }, (_, i) => [i, null])) as Record<number, string | null>);
                    setSelectedId(null);
                  }}
                  style={{ fontSize: 12, color: muted, background: "none", border: "none", textDecoration: "underline", cursor: "pointer", fontFamily: "var(--font-plus-jakarta)" }}
                >
                  Atur ulang
                </button>
              </div>

              {/* Start node */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 2, marginBottom: 6 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  background: navyCard2, border: `2px solid ${gold}`, overflow: "hidden", position: "relative"
                }}>
                  {profile?.avatar || PROFESSION_AVATARS[currentProf] ? (
                    <Image src={profile?.avatar || PROFESSION_AVATARS[currentProf]} alt={profile?.name ?? ""} fill style={{ objectFit: "cover" }} />
                  ) : "🧑"}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: muted, fontWeight: 600 }}>Mulai dari</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{profile?.name ?? "Kamu"}, hari ini</div>
                </div>
              </div>

              {/* Timeline */}
              <div style={{ position: "relative", margin: "6px 0 6px 21px", paddingLeft: 22, borderLeft: `2px dashed rgba(242,169,59,.4)` }}>
                {stages.map(({ label, slots }) => (
                  <div key={label} style={{ marginBottom: 6 }}>
                    {/* Stage label */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: 0.4, color: goldLight,
                      margin: "14px 0 10px -22px",
                    }}>
                      <span style={{ flex: 1, height: 1, background: "rgba(242,169,59,.25)", display: "block" }} />
                      <span style={{ whiteSpace: "nowrap" }}>{label}</span>
                      <span style={{ flex: 1, height: 1, background: "rgba(242,169,59,.25)", display: "block" }} />
                    </div>

                    {slots.map((slotIdx) => {
                      const placedId = placed[slotIdx];
                      const item = placedId ? prof.activities.find((a) => a.id === placedId) : null;
                      return (
                        <div key={slotIdx} style={{ position: "relative", marginBottom: 12 }}>
                          {/* Dot */}
                          <div style={{
                            position: "absolute", left: -33, top: 8,
                            width: 22, height: 22, borderRadius: "50%",
                            background: navy, border: `2px solid ${gold}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 800, color: goldLight,
                          }}>{slotIdx + 1}</div>

                          {/* Slot card */}
                          <div
                            data-slot-empty={item ? undefined : "true"}
                            data-slot-idx={item ? undefined : slotIdx}
                            onClick={() => handleSlotClick(slotIdx)}
                            style={{
                              minHeight: 64, borderRadius: 14, padding: "12px 14px",
                              display: "flex", alignItems: "center", gap: 10,
                              border: item
                                ? `2px solid ${line}`
                                : "2px dashed rgba(242,169,59,.4)",
                              background: item ? navyCard : "rgba(255,255,255,0.02)",
                              cursor: "pointer",
                              transition: "all .15s ease",
                            }}
                          >
                            {item ? (
                              <>
                                <div style={{ fontSize: 22 }}>{item.icon}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, color: "#fff" }}>{item.title}</div>
                                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{item.cat} · +{item.xp} XP</div>
                                </div>
                                <div style={{ fontSize: 16, color: muted, padding: 4 }}>✕</div>
                              </>
                            ) : (
                              <>
                                <span style={{ fontSize: 16, color: gold, fontWeight: 700 }}>+</span>
                                <span style={{ fontSize: 12.5, color: muted }}>Tempatkan kegiatan</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Goal node */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 2 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  background: navyCard2, border: `2px solid ${gold}`, overflow: "hidden", position: "relative"
                }}>
                  <Image src={prof.image} alt={prof.name} fill style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: muted, fontWeight: 600 }}>Cita-citamu</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{prof.name}</div>
                </div>
              </div>
            </div>

          </div>{/* /content */}
        </div>{/* /inner shell */}
      </div>{/* /shell */}

      {/* ── CTA ── */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 20,
        display: "flex", justifyContent: "center",
        padding: "14px 18px",
        background: `linear-gradient(180deg, transparent, ${navyDeep} 35%)`,
      }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <button
            ref={ctaRef}
            disabled={!anyFilled}
            onClick={() => setShowModal(true)}
            className={`
              w-full flex items-center justify-center gap-2
              rounded-full transition-all uppercase tracking-wider font-bold text-[14.5px]
              border border-yellow-500/20
              ${anyFilled
                ? "bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-[0.98] text-white shadow-[0_4px_20px_rgba(226,157,41,0.4)] cursor-pointer"
                : "bg-[#E29D29] text-white opacity-40 cursor-not-allowed"}
            `}
            style={{ padding: "15px 20px", fontFamily: "var(--font-plus-jakarta)" }}
          >
            Lihat Hasil &amp; Lanjut
            <svg
              className="w-4 h-4 fill-current stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Result Modal ── */}
      {showModal && (
        <ResultModal
          profKey={currentProf}
          placed={placed}
          profile={profile}
          totalXp={totalXp}
          onClose={() => setShowModal(false)}
          onFinish={onFinish}
        />
      )}
      {/* ── Onboarding Guide ── */}
      {guideVisible && !showModal && (
        <OnboardingGuide
          step={guideStep}
          xpRef={xpRef}
          poolTitleRef={poolTitleRef}
          poolRef={poolRef}
          timelineRef={timelineRef}
          ctaRef={ctaRef}
          onNext={() => {
            if (guideStep < GUIDE_STEPS.length - 1) {
              setGuideStep((s) => s + 1);
            } else {
              setGuideVisible(false);
            }
          }}
          onSkip={() => setGuideVisible(false)}
        />
      )}
    </>
  );
}
