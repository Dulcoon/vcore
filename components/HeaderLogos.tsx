import React from "react";

export default function HeaderLogos() {
  const logos = [
    { name: "KEMENDIKBUD", color: "from-blue-500 to-cyan-400" },
    { name: "DIKTISAINTEK", color: "from-teal-500 to-emerald-400" },
    { name: "BELMAWA", color: "from-blue-600 to-indigo-500" },
    { name: "SIMBELMAWA", color: "from-indigo-600 to-purple-500" },
    { name: "PKM", color: "from-amber-500 to-orange-400" },
    { name: "UTY", color: "from-red-600 to-orange-500" },
    { name: "VICORE", color: "from-amber-400 to-yellow-500" }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex items-center justify-center bg-white/95 backdrop-blur-md rounded-full py-1.5 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/20 select-none">
      <div className="flex flex-wrap gap-x-4 gap-y-1 items-center justify-center">
        {logos.map((logo, idx) => (
          <div key={idx} className="flex items-center gap-1.5 py-0.5 px-2">
            <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${logo.color} shadow-sm shrink-0`} />
            <span className="text-[10px] font-black text-slate-800 tracking-wider font-sans">
              {logo.name}
            </span>
            {idx < logos.length - 1 && (
              <span className="text-slate-300 font-light text-xs ml-3 hidden sm:inline">|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
