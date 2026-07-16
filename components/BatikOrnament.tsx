import React from "react";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function BatikOrnament({ position, className = "" }: { position: Position; className?: string }) {
  const rotation = {
    "top-left": "rotate-0 top-0 left-0",
    "top-right": "rotate-90 top-0 right-0",
    "bottom-left": "-rotate-90 bottom-0 left-0",
    "bottom-right": "rotate-180 bottom-0 right-0",
  };

  return (
    <div className={`absolute w-32 h-32 md:w-48 md:h-48 pointer-events-none z-10 ${rotation[position]} ${className}`}>
      {/* Golden Batik Kawung/Geometric pattern SVG */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-amber-500/20 stroke-current"
        strokeWidth="1.5"
      >
        {/* Outer Corner Frame */}
        <path d="M 0 0 L 100 0 L 100 10 L 10 10 L 10 100 L 0 100 Z" fill="currentColor" opacity="0.3" />
        
        {/* Kawung/Pattern Grid */}
        <g transform="translate(10, 10)">
          {/* Tile 1 */}
          <circle cx="20" cy="20" r="15" />
          <path d="M 5 20 C 15 5, 25 5, 35 20 C 25 35, 15 35, 5 20 Z" fill="currentColor" opacity="0.1" />
          <path d="M 20 5 C 35 15, 35 25, 20 35 C 5 25, 5 15, 20 5 Z" fill="currentColor" opacity="0.1" />
          
          {/* Tile 2 */}
          <circle cx="60" cy="20" r="15" />
          <path d="M 45 20 C 55 5, 65 5, 75 20 C 65 35, 55 35, 45 20 Z" fill="currentColor" opacity="0.1" />
          <path d="M 60 5 C 75 15, 75 25, 60 35 C 45 25, 45 15, 60 5 Z" fill="currentColor" opacity="0.1" />

          {/* Tile 3 */}
          <circle cx="20" cy="60" r="15" />
          <path d="M 5 60 C 15 45, 25 45, 35 60 C 25 75, 15 75, 5 60 Z" fill="currentColor" opacity="0.1" />
          <path d="M 20 45 C 35 55, 35 65, 20 75 C 5 65, 5 55, 20 45 Z" fill="currentColor" opacity="0.1" />

          {/* Tile 4 */}
          <circle cx="60" cy="60" r="15" />
          <path d="M 45 60 C 55 45, 65 45, 75 60 C 65 75, 55 75, 45 60 Z" fill="currentColor" opacity="0.1" />
          <path d="M 60 45 C 75 55, 75 65, 60 75 C 45 65, 45 55, 60 45 Z" fill="currentColor" opacity="0.1" />
        </g>
      </svg>
    </div>
  );
}
