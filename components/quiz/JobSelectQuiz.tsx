import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BatikOrnament from "../BatikOrnament";
import HeaderLogos from "../HeaderLogos";
import Logo from "../Logo";

interface StepProps {
  onSelect: (jobName: string) => void;
  onBack?: () => void;
}

const jobs = [
  {
    id: 1,
    name: "Pelayan",
    image: "/images/Waiter.png",
    glow: "rgba(226, 157, 41, 0.3)",
    desc: "Simulasikan peran sebagai pelayan restoran profesional, layani pelanggan dengan ramah dan cekatan.",
  },
  {
    id: 2,
    name: "Photo Studio",
    image: "/images/Photo Studio.png",
    glow: "rgba(14, 165, 233, 0.3)",
    desc: "Ekspresikan kemampuan fotografimu di dalam studio, tangkap momen terbaik dengan pencahayaan dan komposisi yang pas.",
  },
  {
    id: 3,
    name: "Konten Kreator",
    image: "/images/Konten kreator.png",
    glow: "rgba(244, 63, 94, 0.3)",
    desc: "Buat konten kreatif, edit video menarik, dan bangun interaksi seru dengan audiens digitalmu.",
  },
  {
    id: 4,
    name: "Chef",
    image: "/images/Chef.png",
    glow: "rgba(217, 119, 6, 0.3)",
    desc: "Racik bahan-bahan masakan berkualitas di dapur, ciptakan hidangan lezat dengan cita rasa tinggi.",
  },
  {
    id: 5,
    name: "Guru Bahasa Isyarat",
    image: "/images/Guru Bahasa Isyarat4.png",
    glow: "rgba(16, 185, 129, 0.3)",
    desc: "Jadilah jembatan komunikasi yang inklusif, ajarkan bahasa isyarat untuk interaksi sosial tanpa batas.",
  },
  {
    id: 6,
    name: "Desain Grafis",
    image: "/images/Desain grafis.png",
    glow: "rgba(139, 92, 246, 0.3)",
    desc: "Visualisasikan ide kreatifmu menjadi desain grafis digital yang modern, estetik, dan komunikatif.",
  },
];

export default function JobSelectQuiz({ onSelect, onBack }: StepProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Monitor screen width to adjust offsets responsively in JS
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mount timer to trigger Figma-like Smart Animate layout shift
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1400); // 1.4-second delay to let bounce animation settle first
    return () => clearTimeout(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : jobs.length - 1));
  };

  const handleNextCard = () => {
    setActiveIndex((prev) => (prev < jobs.length - 1 ? prev + 1 : 0));
  };

  const activeJob = jobs[activeIndex];

  return (
    <div className="w-full h-screen relative flex flex-col justify-between items-center pt-8 pb-20 lg:py-10 px-6 overflow-hidden select-none bg-gradient-to-b from-[#101235] to-[#050616]">
      {/* Dynamic ambient backdrop glow behind cards */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full blur-[130px] transition-all duration-700 ease-in-out pointer-events-none z-0"
        style={{
          background: activeJob.glow,
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      />

      {/* Batik Ornaments in corners */}
      <BatikOrnament position="top-left" />
      <BatikOrnament position="top-right" />
      <BatikOrnament position="bottom-left" />
      <BatikOrnament position="bottom-right" />

      {/* Optional Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 sm:top-6 sm:left-8 z-30 px-4 py-2 bg-[#1c1e4c]/80 hover:bg-[#2A2D6C] text-[#B6B2DA] hover:text-white rounded-full border border-[#E29D29]/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Kembali</span>
        </button>
      )}

      {/* Institution logos bar at the top */}
      <div className="z-10 w-full mt-2">
        <HeaderLogos />
      </div>

      {/* Main Container */}
      <div className="z-10 w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-auto max-h-[90vh]">
        {/* Title (Starts centered, then glides smoothly to the top) */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.88, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            layout: { duration: 0.85, ease: [0.16, 1, 0.3, 1] }, // Smooth layout shift
            default: { type: "spring", stiffness: 120, damping: 11 } // Bouncy entrance spring
          }}
          className="text-center z-10 mb-4 lg:mb-8"
        >
          <Logo className="w-28 lg:w-40 mx-auto mb-2" />
          <h2 className="text-white text-xl lg:text-3xl font-bold font-serif max-w-lg lg:max-w-2xl leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Ayo buat rencana pekerjaanmu!
          </h2>
          <p className="text-white/50 text-xs mt-1">
            Geser kartu untuk memilih jenis pekerjaan
          </p>
        </motion.div>

        {/* Remaining content elements reveal after title slides up */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="w-full flex flex-col items-center"
            >
              {/* Card Deck Area */}
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[350px] h-[300px] sm:h-[330px] lg:h-[380px] flex items-center justify-center mb-4 lg:mb-6">
                {/* Navigation Arrows (Positioned wider on desktop to prevent overlaps) */}
                <button
                  onClick={handlePrev}
                  className="absolute left-[-45px] lg:left-[-75px] z-30 p-2.5 rounded-full bg-black/40 hover:bg-[#E29D29] active:scale-90 text-white/80 border border-white/10 hover:border-transparent transition-all shadow-lg backdrop-blur-sm"
                  aria-label="Previous job"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={handleNextCard}
                  className="absolute right-[-45px] lg:right-[-75px] z-30 p-2.5 rounded-full bg-black/40 hover:bg-[#E29D29] active:scale-90 text-white/80 border border-white/10 hover:border-transparent transition-all shadow-lg backdrop-blur-sm"
                  aria-label="Next job"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Cards Render */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {jobs.map((job, index) => {
                    const relativeIndex = index - activeIndex;
                    const isSelected = index === activeIndex;

                    // Hide cards that are far away to optimize render
                    if (Math.abs(relativeIndex) > 1 && !(activeIndex === 0 && index === jobs.length - 1) && !(activeIndex === jobs.length - 1 && index === 0)) {
                      return null;
                    }

                    // Handle circular looping positions
                    let calculatedRelative = relativeIndex;
                    if (activeIndex === 0 && index === jobs.length - 1) {
                      calculatedRelative = -1;
                    } else if (activeIndex === jobs.length - 1 && index === 0) {
                      calculatedRelative = 1;
                    }

                    // Position properties based on relative index - Adjusted for Desktop widths
                    const rotateVal = calculatedRelative * (isDesktop ? 8 : 6);
                    const xVal = calculatedRelative * (isDesktop ? 150 : 110);
                    const scaleVal = 1 - Math.abs(calculatedRelative) * (isDesktop ? 0.14 : 0.12);
                    const opacityVal = 1 - Math.abs(calculatedRelative) * 0.55;
                    const zIndexVal = 20 - Math.abs(calculatedRelative);

                    return (
                      <motion.div
                        key={job.id}
                        style={{
                          zIndex: zIndexVal,
                        }}
                        animate={{
                          x: xVal,
                          scale: scaleVal,
                          rotate: rotateVal,
                          opacity: opacityVal,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        drag={isSelected ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.4}
                        onDragEnd={(_, info) => {
                          const threshold = 60;
                          if (info.offset.x < -threshold) {
                            handleNextCard();
                          } else if (info.offset.x > threshold) {
                            handlePrev();
                          }
                        }}
                        className={`absolute w-full h-full rounded-[2rem] p-4 cursor-grab active:cursor-grabbing select-none border transition-shadow duration-300
                          ${isSelected
                            ? "border-[#E29D29]/60 shadow-[0_10px_35px_-5px_rgba(226,157,41,0.25)] bg-gradient-to-br from-[#1c1e4c] to-[#0c0d29]"
                            : "border-white/5 bg-[#121338]/90"
                          }`}
                      >
                        <div className="w-full h-full flex flex-col justify-between">
                          {/* Job Illustration (Snug top margin) */}
                          <div className="relative flex-1 rounded-[1.5rem] overflow-hidden border border-white/10 mb-4 bg-black/10">
                            <Image
                              src={job.image}
                              alt={job.name}
                              fill
                              className="object-cover pointer-events-none"
                            />
                          </div>

                          {/* Job Title */}
                          <div className="text-center pb-2">
                            <h3 className="text-white text-base lg:text-xl font-bold tracking-wide">
                              {job.name}
                            </h3>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="flex gap-2 justify-center mb-4 lg:mb-6 z-10">
                {jobs.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-[#E29D29] scale-125 shadow-[0_0_8px_rgba(226,157,41,0.5)]" : "bg-white/20"
                      }`}
                  />
                ))}
              </div>

              {/* Selected Job Description Banner */}
              <div className="text-center px-6 max-w-md lg:max-w-xl h-12 lg:h-16 flex flex-col justify-center mb-4 lg:mb-8">
                <p className="text-white/80 text-xs lg:text-base font-sans italic leading-relaxed">
                  &ldquo;{activeJob.desc}&rdquo;
                </p>
              </div>

              {/* Global Select Button */}
              <button
                onClick={() => onSelect(activeJob.name)}
                className="group relative bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-extrabold text-xs lg:text-sm px-10 py-3.5 rounded-full shadow-[0_5px_25px_rgba(226,157,41,0.35)] hover:shadow-[0_8px_30px_rgba(226,157,41,0.55)] transition-all tracking-widest uppercase flex items-center gap-2 border border-yellow-500/30 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                {`MULAI KUIS ${activeJob.name}`}
                <svg
                  className="w-4 h-4 fill-current stroke-current transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
