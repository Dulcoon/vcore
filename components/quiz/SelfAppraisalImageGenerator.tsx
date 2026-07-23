"use client";

import React, { useState } from "react";

interface SelfAppraisalImageGeneratorProps {
  studentName: string;
  strengths: string[];
  growthAreas: string[];
}

export default function SelfAppraisalImageGenerator({
  studentName,
  strengths,
  growthAreas,
}: SelfAppraisalImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const drawReportToCanvas = async (): Promise<HTMLCanvasElement> => {
    const SCALE = 2;
    const W = 400;
    const PADDING = 24;
    const INNER_W = W - PADDING * 2;

    const measureCanvas = document.createElement("canvas");
    const mCtx = measureCanvas.getContext("2d")!;

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    let logoImg: HTMLImageElement | null = null;
    try {
      logoImg = await loadImage("/images/logo-removebg-preview.png");
    } catch (_) {}

    let batikImg: HTMLImageElement | null = null;
    try {
      batikImg = await loadImage("/images/Elemen Frame Kanan Atas.png");
    } catch (_) {}

    const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let current = "";
      for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      }
      if (current) lines.push(current);
      return lines;
    };

    // Calculate heights dynamically
    let y = 28;

    // Header logo height
    let actualLogoW = 85;
    let actualLogoH = 30;
    if (logoImg) {
      actualLogoH = 85 * (logoImg.height / logoImg.width);
    }

    const logoY = y;
    y += actualLogoH + 6;

    const titleY = y;
    y += 18;

    const nameY = y;
    y += 24;

    // Divider
    const div1Y = y;
    y += 16;

    // Strengths section
    mCtx.font = "12px Arial, sans-serif";
    const strengthsLines = strengths.map((s) => wrapText(mCtx, `• ${s}`, INNER_W - 16));
    const strengthsH = strengthsLines.reduce((acc, lines) => acc + lines.length * 16 + 6, 0);

    const strengthsHeaderY = y;
    y += 22;
    const strengthsBodyY = y;
    y += Math.max(strengthsH, 24) + 16;

    // Growth areas section
    const growthLines = growthAreas.map((g) => wrapText(mCtx, `• ${g}`, INNER_W - 16));
    const growthH = growthLines.reduce((acc, lines) => acc + lines.length * 16 + 6, 0);

    const growthHeaderY = y;
    y += 22;
    const growthBodyY = y;
    y += Math.max(growthH, 24) + 20;

    // Motivational Quote Card
    mCtx.font = "italic 11px Georgia, serif";
    const quoteText =
      '"Pertahankan kekuatanmu dan terus kembangkan potensimu! Jangan takut jika masih ada hal yang perlu diperbaiki, karena setiap langkah belajar akan membawamu semakin dekat dengan cita-cita"';
    const quoteLines = wrapText(mCtx, quoteText, INNER_W - 28);
    const quoteCardH = quoteLines.length * 17 + 22;

    const quoteCardY = y;
    y += quoteCardH + 28;

    const finalH = y;

    // Main Canvas Setup
    const canvas = document.createElement("canvas");
    canvas.width = W * SCALE;
    canvas.height = finalH * SCALE;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(SCALE, SCALE);

    const roundRect = (c: CanvasRenderingContext2D, rx: number, ry: number, rw: number, rh: number, rr: number) => {
      c.beginPath();
      c.moveTo(rx + rr, ry);
      c.lineTo(rx + rw - rr, ry);
      c.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rr);
      c.lineTo(rx + rw, ry + rh - rr);
      c.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rr, ry + rh);
      c.lineTo(rx + rr, ry + rh);
      c.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rr);
      c.lineTo(rx, ry + rr);
      c.quadraticCurveTo(rx, ry, rx + rr, ry);
      c.closePath();
    };

    const roundRectFill = (
      c: CanvasRenderingContext2D,
      rx: number,
      ry: number,
      rw: number,
      rh: number,
      rr: number,
      color: string
    ) => {
      roundRect(c, rx, ry, rw, rh, rr);
      c.fillStyle = color;
      c.fill();
    };

    // Clip outer boundary
    ctx.beginPath();
    roundRect(ctx, 0, 0, W, finalH, 22);
    ctx.clip();

    // Background Gradient
    const bg = ctx.createLinearGradient(0, 0, 0, finalH);
    bg.addColorStop(0, "#1A1C4B");
    bg.addColorStop(0.5, "#121338");
    bg.addColorStop(1, "#0A0B22");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, finalH);

    // Batik Ornaments
    if (batikImg) {
      ctx.save();
      ctx.globalAlpha = 0.09;
      ctx.drawImage(batikImg, W - 140, -10, 150, 150);
      ctx.translate(140, finalH - 140);
      ctx.scale(-1, -1);
      ctx.drawImage(batikImg, 0, 0, 150, 150);
      ctx.restore();
    }

    // Border Frame
    ctx.strokeStyle = "rgba(226,157,41,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    roundRect(ctx, 0.75, 0.75, W - 1.5, finalH - 1.5, 22);
    ctx.stroke();

    // Header Logo
    if (logoImg) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.drawImage(logoImg, (W - actualLogoW) / 2, logoY, actualLogoW, actualLogoH);
      ctx.restore();
    }

    // Title
    ctx.fillStyle = "#E29D29";
    ctx.font = "bold 13px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("RAPOR EVALUASI DIRI SISWA", W / 2, titleY + 12);

    // Student Name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.fillText(studentName, W / 2, nameY + 14);

    // Divider Line
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING, div1Y);
    ctx.lineTo(W - PADDING, div1Y);
    ctx.stroke();

    // Section 1: Strengths Header
    ctx.fillStyle = "#F9CA75";
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("💪 Kelebihan Utama Kamu:", PADDING, strengthsHeaderY + 14);

    let currSY = strengthsBodyY;
    if (strengthsLines.length === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "12px Arial, sans-serif";
      ctx.fillText("- Belum ada data kelebihan", PADDING + 8, currSY + 12);
    } else {
      strengthsLines.forEach((lines) => {
        ctx.fillStyle = "#E2E8F0";
        ctx.font = "12px Arial, sans-serif";
        lines.forEach((line, li) => {
          ctx.fillText(line, PADDING + 8, currSY + li * 16 + 12);
        });
        currSY += lines.length * 16 + 6;
      });
    }

    // Section 2: Growth Areas Header
    ctx.fillStyle = "#F9CA75";
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🌱 Area Yang Bisa Ditingkatkan:", PADDING, growthHeaderY + 14);

    let currGY = growthBodyY;
    if (growthLines.length === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "12px Arial, sans-serif";
      ctx.fillText("• Semua potensi telah teridentifikasi dengan sangat baik!", PADDING + 8, currGY + 12);
    } else {
      growthLines.forEach((lines) => {
        ctx.fillStyle = "#CBD5E1";
        ctx.font = "12px Arial, sans-serif";
        lines.forEach((line, li) => {
          ctx.fillText(line, PADDING + 8, currGY + li * 16 + 12);
        });
        currGY += lines.length * 16 + 6;
      });
    }

    // Quote Card
    roundRectFill(ctx, PADDING, quoteCardY, INNER_W, quoteCardH, 14, "rgba(226,157,41,0.1)");
    ctx.strokeStyle = "rgba(226,157,41,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(ctx, PADDING, quoteCardY, INNER_W, quoteCardH, 14);
    ctx.stroke();

    ctx.fillStyle = "#F9CA75";
    ctx.font = "italic 11px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    quoteLines.forEach((line, li) => {
      ctx.fillText(line, W / 2, quoteCardY + 11 + li * 17);
    });

    return canvas;
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const canvas = await drawReportToCanvas();
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `VCORE_Evaluasi_Diri_${studentName.replace(/\s+/g, "_")}.png`;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh rapor evaluasi diri:", err);
      alert("Gagal memproses gambar rapor.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="w-full bg-[#E29D29]/20 hover:bg-[#E29D29]/30 text-[#F9CA75] font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-full border border-[#E29D29]/40 shadow-lg transition-all tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
    >
      <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>{isGenerating ? "Memproses Rapor..." : "Unduh Rapor Evaluasi Diri (PNG)"}</span>
    </button>
  );
}
