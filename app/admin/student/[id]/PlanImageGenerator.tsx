"use client";

import React, { useState } from "react";

function getLevel(xp: number): string {
  if (xp >= 90) return "Ahli Muda 🏆";
  if (xp >= 40) return "Berkembang 🚀";
  return "Pemula 🌱";
}

interface PlanImageGeneratorProps {
  studentName: string;
  studentGrade: string | null;
  studentAge: string | null;
  studentAvatarUrl: string | null;
  professionName: string;
  professionIcon: string;
  totalXp: number;
  activities: {
    title: string;
    category: string;
    xp: number;
    icon: string;
  }[];
}

export default function PlanImageGenerator({
  studentName,
  studentGrade,
  studentAge,
  studentAvatarUrl,
  professionName,
  professionIcon,
  totalXp,
  activities,
}: PlanImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const drawPosterToCanvas = async (): Promise<HTMLCanvasElement> => {
    const SCALE = 2;
    const W = 375;
    const PADDING = 22;
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
    try { logoImg = await loadImage("/images/logo-removebg-preview.png"); } catch (_) {}
    
    let batikImg: HTMLImageElement | null = null;
    try { batikImg = await loadImage("/images/Elemen Frame Kanan Atas.png"); } catch (_) {}

    let avatarImg: HTMLImageElement | null = null;
    if (studentAvatarUrl) {
      try { avatarImg = await loadImage(studentAvatarUrl); } catch (_) {}
    }

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

    mCtx.font = "bold 12px Arial, sans-serif";
    const cardsData = activities.map((item, i) => {
      const isLeft = i % 2 === 0;
      const cardW = INNER_W * 0.88;
      const cardX = isLeft ? PADDING + 10 : W - PADDING - 10 - cardW;
      const titleLines = wrapText(mCtx, item.title, cardW - 74 - 12);
      const textBlockH = titleLines.length * 15 + 12;
      const cardH = Math.max(58, textBlockH + 20);
      return { item, isLeft, cardW, cardX, titleLines, textBlockH, cardH };
    });

    let y = 26;

    let actualLogoW = 80;
    let actualLogoH = 28;
    if (logoImg) {
      actualLogoH = 80 * (logoImg.height / logoImg.width);
    }
    
    const logoY = y;
    y += actualLogoH + 4;

    const subtitleY = y;
    y += 11 + 22;

    const profCardY = y;
    const profCardH = 80;
    y += profCardH + 24;

    const trackTop = y + 10;
    const cardsStartY = y;
    const totalCardsH = cardsData.reduce((sum, c) => sum + c.cardH + 14, 0);
    const lastCardY = totalCardsH > 0 ? y + totalCardsH - cardsData[cardsData.length - 1].cardH - 14 : y;
    const trackBottom = totalCardsH > 0 ? lastCardY + cardsData[cardsData.length - 1].cardH / 2 : y;
    y += totalCardsH + 10;

    const dividerY = y;
    y += 16;

    const xpLabelY = y;
    y += 18;
    const xpValueY = y;
    y += 40;

    mCtx.font = "italic 12px Georgia, serif";
    const quoteLines = wrapText(mCtx, `"Setiap langkah kecil membawamu lebih dekat ke cita-cita!"`, INNER_W);
    const quoteY = y;
    y += quoteLines.length * 18 + 26;
    
    const finalH = y;

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

    const roundRectFill = (c: CanvasRenderingContext2D, rx: number, ry: number, rw: number, rh: number, rr: number, color: string) => {
      roundRect(c, rx, ry, rw, rh, rr);
      c.fillStyle = color;
      c.fill();
    };

    ctx.beginPath();
    roundRect(ctx, 0, 0, W, finalH, 22);
    ctx.clip();

    const bg = ctx.createLinearGradient(0, 0, 0, finalH);
    bg.addColorStop(0, "#242058");
    bg.addColorStop(0.6, "#1B1A3E");
    bg.addColorStop(1, "#17153A");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, finalH);

    if (batikImg) {
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.drawImage(batikImg, W - 148, -12, 160, 160);
      ctx.translate(148, finalH - 148);
      ctx.scale(-1, -1);
      ctx.drawImage(batikImg, 0, 0, 160, 160);
      ctx.restore();
    }

    ctx.strokeStyle = "#3B366E";
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(ctx, 0.5, 0.5, W - 1, finalH - 1, 22);
    ctx.stroke();

    if (logoImg) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;
      ctx.drawImage(logoImg, (W - actualLogoW) / 2, logoY, actualLogoW, actualLogoH);
      ctx.restore();
    } else {
      ctx.fillStyle = "#F9CA75";
      ctx.font = "bold 16px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("VICORE", W / 2, logoY + 14);
    }

    ctx.fillStyle = "#B6B2DA";
    ctx.font = "bold 11px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("PETA RENCANA KARIER", W / 2, subtitleY + 11);

    roundRectFill(ctx, PADDING, profCardY, INNER_W, profCardH, 16, "rgba(242,169,59,0.08)");
    ctx.strokeStyle = "rgba(242,169,59,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(ctx, PADDING, profCardY, INNER_W, profCardH, 16);
    ctx.stroke();

    if (avatarImg) {
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, PADDING + 14, profCardY + 14, 52, 52, 14);
      ctx.clip();
      ctx.drawImage(avatarImg, PADDING + 14, profCardY + 14, 52, 52);
      ctx.restore();
    }
    
    const textX = PADDING + 14 + 52 + 12;
    ctx.fillStyle = "#B6B2DA";
    ctx.font = "600 11px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${studentName} · ${studentGrade || "-"}`, textX, profCardY + 22);
    ctx.fillText("Cita-citaku", textX, profCardY + 37);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 17px Georgia, serif";
    ctx.fillText(professionName, textX, profCardY + 56);

    if (totalCardsH > 0) {
      ctx.strokeStyle = "rgba(242,169,59,0.35)";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(W / 2, trackTop);
      ctx.lineTo(W / 2, trackBottom);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    let currCardY = cardsStartY;
    for (let i = 0; i < cardsData.length; i++) {
      const { item, isLeft, cardW, cardX, titleLines, textBlockH, cardH } = cardsData[i];

      roundRectFill(ctx, cardX, currCardY, cardW, cardH, 14, "#242058");
      ctx.strokeStyle = "#3B366E";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      roundRect(ctx, cardX, currCardY, cardW, cardH, 14);
      ctx.stroke();

      ctx.fillStyle = "rgba(242,169,59,0.35)";
      if (isLeft) {
        ctx.fillRect(cardX + cardW, currCardY + cardH / 2 - 1, 12, 2);
      } else {
        ctx.fillRect(cardX - 12, currCardY + cardH / 2 - 1, 12, 2);
      }

      const cx = cardX + 23;
      const cy = currCardY + cardH / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.fillStyle = "#0F0E24";
      ctx.fill();
      ctx.strokeStyle = "#F2A93B";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#F9CA75";
      ctx.font = "bold 11px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(i + 1), cx, cy + 1);

      ctx.font = "18px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.icon || "", cardX + 54, cy);

      const startY = cy - textBlockH / 2;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      titleLines.forEach((line, li) => {
        ctx.fillText(line, cardX + 74, startY + li * 15);
      });

      ctx.fillStyle = "#B6B2DA";
      ctx.font = "9.5px Arial, sans-serif";
      ctx.textBaseline = "top";
      ctx.fillText(`+${item.xp} XP`, cardX + 74, startY + titleLines.length * 15 + 2);

      currCardY += cardH + 14;
    }

    ctx.strokeStyle = "#3B366E";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING, dividerY);
    ctx.lineTo(W - PADDING, dividerY);
    ctx.stroke();

    ctx.fillStyle = "#B6B2DA";
    ctx.font = "bold 10.5px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("TOTAL XP", PADDING, xpLabelY);

    ctx.fillStyle = "#F9CA75";
    ctx.font = "bold 26px Georgia, serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(String(totalXp), PADDING, xpValueY + 26);

    const level = getLevel(totalXp);
    ctx.fillStyle = "rgba(242,169,59,0.08)";
    const badgeW = 110;
    const badgeH = 28;
    roundRectFill(ctx, W - PADDING - badgeW, xpValueY, badgeW, badgeH, 6, "rgba(242,169,59,0.08)");
    ctx.strokeStyle = "rgba(242,169,59,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(ctx, W - PADDING - badgeW, xpValueY, badgeW, badgeH, 6);
    ctx.stroke();
    
    ctx.fillStyle = "#F9CA75";
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(level, W - PADDING - badgeW / 2, xpValueY + badgeH / 2);

    ctx.fillStyle = "#B6B2DA";
    ctx.font = "italic 12px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    quoteLines.forEach((line, li) => {
      ctx.fillText(line, W / 2, quoteY + li * 18);
    });

    return canvas;
  };

  const handleDownloadOnly = async () => {
    setIsGenerating(true);
    try {
      const canvas = await drawPosterToCanvas();
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `VCORE_Rencana_Karier_${studentName.replace(/\s+/g, "_")}.png`;
      link.click();
    } catch (err) {
      console.error("Gagal mendownload:", err);
      alert("Gagal memproses gambar rencana karier.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownloadOnly}
      disabled={isGenerating}
      className="inline-flex items-center px-4 py-2 bg-[#F2A93B] hover:bg-[#F9CA75] text-[#0F0E24] font-bold rounded-lg transition-colors shadow-lg disabled:opacity-70 mt-4 md:mt-0"
    >
      {isGenerating ? "Memproses..." : "↓ Download Gambar"}
    </button>
  );
}
