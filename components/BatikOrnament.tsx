import React from "react";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function BatikOrnament({ position, className = "" }: { position: Position; className?: string }) {
  // Base image is Top Right. We mirror it using negative scales for other corners.
  const positioning = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0 -scale-x-100",
    "bottom-right": "bottom-0 right-0 -scale-y-100",
    "bottom-left": "bottom-0 left-0 -scale-x-100 -scale-y-100",
  };

  return (
    <div className={`absolute w-32 h-32 md:w-48 md:h-48 pointer-events-none z-10 ${positioning[position]} ${className}`}>
      <img
        src="/images/Elemen Frame Kanan Atas.png"
        alt="Ornament Frame"
        className="w-full h-full object-contain object-right-top opacity-15"
      />
    </div>
  );
}
