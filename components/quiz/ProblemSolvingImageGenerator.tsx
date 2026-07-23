"use client";

import React, { useState } from "react";

interface ProblemSolvingImageGeneratorProps {
  studentName: string;
  professionName: string;
  score: number;
  maxScore: number;
}

export default function ProblemSolvingImageGenerator({
  studentName,
  professionName,
  score,
  maxScore,
}: ProblemSolvingImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const drawReportToCanvas = async (): Promise<HTMLCanvasElement> => {
    const SCALE = 2;
    const W = 380;
    const H = 460;
    const PADDING = 24;
    const INNER_W = W - PADDING * 2;

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

    const canvas = document.createElement("canvas");
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
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
    roundRect(ctx, 0, 0, W, H, 22);
    ctx.clip();

    // Background Gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1A1C4B");
    bg.addColorStop(0.5, "#121338");
    bg.addColorStop(1, "#0A0B22");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Batik Ornaments
    if (batikImg) {
      ctx.save();
      ctx.globalAlpha = 0.09;
      ctx.drawImage(batikImg, W - 140, -10, 150, 150);
      ctx.translate(140, H - 140);
      ctx.scale(-1, -1);
      ctx.drawImage(batikImg, 0, 0, 150, 150);
      ctx.restore();
    }

    // Border Frame
    ctx.strokeStyle = "rgba(226,157,41,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    roundRect(ctx, 0.75, 0.75, W - 1.5, H - 1.5, 22);
    ctx.stroke();

    let y = 28;

    // Header Logo
    let actualLogoW = 85;
    let actualLogoH = 30;
    if (logoImg) {
      actualLogoH = 85 * (logoImg.height / logoImg.width);
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.drawImage(logoImg, (W - actualLogoW) / 2, y, actualLogoW, actualLogoH);
      ctx.restore();
    }
    y += actualLogoH + 10;

    // Title
    ctx.fillStyle = "#E29D29";
    ctx.font = "bold 13px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("HASIL KUIS PROBLEM SOLVING", W / 2, y + 10);
    y += 24;

    // Student Name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.fillText(studentName, W / 2, y + 10);
    y += 26;

    // Profession Badge Card
    const profCardH = 50;
    roundRectFill(ctx, PADDING, y, INNER_W, profCardH, 14, "rgba(242,169,59,0.08)");
    ctx.strokeStyle = "rgba(242,169,59,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(ctx, PADDING, y, INNER_W, profCardH, 14);
    ctx.stroke();

    ctx.fillStyle = "#B6B2DA";
    ctx.font = "11px Arial, sans-serif";
    ctx.fillText("Studi Kasus Profesi:", W / 2, y + 18);
    ctx.fillStyle = "#F9CA75";
    ctx.font = "bold 15px Georgia, serif";
    ctx.fillText(professionName, W / 2, y + 36);
    y += profCardH + 18;

    // Score Card Box
    const scoreBoxH = 110;
    roundRectFill(ctx, PADDING, y, INNER_W, scoreBoxH, 16, "#121338");
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(ctx, PADDING, y, INNER_W, scoreBoxH, 16);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "bold 11px Arial, sans-serif";
    ctx.fillText("SKOR AKHIR KAMU", W / 2, y + 26);

    ctx.fillStyle = "#F9CA75";
    ctx.font = "bold 38px Georgia, serif";
    ctx.fillText(`${score}`, W / 2 - 20, y + 74);

    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "18px Arial, sans-serif";
    ctx.fillText(`/ ${maxScore}`, W / 2 + 25, y + 70);

    y += scoreBoxH + 20;

    // Quote Box
    const quoteH = 64;
    roundRectFill(ctx, PADDING, y, INNER_W, quoteH, 12, "rgba(226,157,41,0.1)");
    ctx.strokeStyle = "rgba(226,157,41,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(ctx, PADDING, y, INNER_W, quoteH, 12);
    ctx.stroke();

    ctx.fillStyle = "#F9CA75";
    ctx.font = "italic 10.5px Georgia, serif";
    ctx.fillText('"Setiap tantangan adalah kesempatan untuk mengasah', W / 2, y + 24);
    ctx.fillText('kemampuan pemecahan masalahmu!"', W / 2, y + 42);

    return canvas;
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const canvas = await drawReportToCanvas();
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `VCORE_Problem_Solving_${studentName.replace(/\s+/g, "_")}.png`;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh rapor problem solving:", err);
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
      <span>{isGenerating ? "Memproses Rapor..." : "Unduh Hasil Problem Solving (PNG)"}</span>
    </button>
  );
}
