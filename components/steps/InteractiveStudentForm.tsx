import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface InteractiveFormProps {
  onComplete: () => void;
  onBack?: () => void;
}

const ages = ["15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"];
const grades = [
  { id: "10_sma", label: "Kelas 10 SMA" },
  { id: "11_sma", label: "Kelas 11 SMA" },
  { id: "12_sma", label: "Kelas 12 SMA" },
];

const avatars = [
  { 
    id: "waiter", 
    label: "Pelayan Cafe", 
    path: "/images/avatar_waiter.png",
    quote: "Halo! Aku Si Pelayan Cafe. Aku suka menyajikan senyuman dan minuman lezat!"
  },
  { 
    id: "photographer", 
    label: "Fotografer", 
    path: "/images/avatar_photographer.png",
    quote: "Halo! Aku Si Fotografer. Aku suka membidik momen indah dan bercerita lewat foto!"
  },
  { 
    id: "creator", 
    label: "Konten Kreator", 
    path: "/images/avatar_creator.png",
    quote: "Halo! Aku Si Konten Kreator. Aku suka merekam petualangan seru dan mengedit video!"
  },
  { 
    id: "chef", 
    label: "Koki", 
    path: "/images/avatar_chef.png",
    quote: "Halo! Aku Si Koki. Aku suka meracik resep baru dan membuat hidangan lezat!"
  },
  { 
    id: "teacher", 
    label: "Guru Isyarat", 
    path: "/images/avatar_teacher.png",
    quote: "Halo! Aku Si Guru Bahasa Isyarat. Aku senang mengajar komunikasi ramah lewat isyarat!"
  },
  { 
    id: "designer", 
    label: "Desainer Grafis", 
    path: "/images/avatar_designer.png",
    quote: "Halo! Aku Si Desainer Grafis. Aku suka menggambar ilustrasi dan mewarnai dunia digital!"
  },
];

export default function InteractiveStudentForm({ onComplete, onBack }: InteractiveFormProps) {
  const [formStep, setFormStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("waiter"); // Default to pre-select 'waiter'
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNextStep = async () => {
    if (formStep < 3) {
      setFormStep(formStep + 1);
    } else {
      // Save data & show completion screen
      const humanGrade = grades.find((g) => g.id === selectedGrade)?.label || selectedGrade;
      const avatarPath = avatars.find((a) => a.id === selectedAvatar)?.path || "";
      
      // Save to Supabase database
      let studentId: string | undefined;
      try {
        const { data, error } = await supabase
          .from("students")
          .insert({
            name,
            age: selectedAge || null,
            grade: humanGrade || null,
            avatar_url: avatarPath || null,
          })
          .select("id")
          .single();

        if (error) throw error;
        if (data) {
          studentId = data.id;
        }
      } catch (error) {
        console.error("Failed to save student to database:", error);
      }

      const studentProfile = { id: studentId, name, age: selectedAge, grade: humanGrade, avatar: avatarPath };
      
      // Save active student profile for auto-skip
      try {
        localStorage.setItem("active_student_profile", JSON.stringify(studentProfile));
      } catch (error) {
        console.error("Failed to save active student profile to localStorage:", error);
      }
      
      // Save to profile history list
      try {
        const existingProfilesRaw = localStorage.getItem("student_profiles");
        let existingProfiles = existingProfilesRaw ? JSON.parse(existingProfilesRaw) : [];
        if (!Array.isArray(existingProfiles)) {
          existingProfiles = [];
        }
        
        // Avoid duplicates by name (case-insensitive)
        if (!existingProfiles.some((p: any) => p && p.name && p.name.toLowerCase() === name.toLowerCase())) {
          existingProfiles.push(studentProfile);
          localStorage.setItem("student_profiles", JSON.stringify(existingProfiles));
        }
      } catch (error) {
        console.error("Failed to update student profile history in localStorage:", error);
      }

      setIsSuccess(true);
    }
  };

  const handlePrevStep = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const selectAge = (age: string) => {
    setSelectedAge(age);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#1c1e4c]/70 border border-[#E29D29]/30 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden min-h-[440px] flex flex-col justify-between">
      {/* Dynamic Glow inside card */}
      <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] rounded-full blur-[60px] bg-[#E29D29]/15 pointer-events-none z-0" />
      
      {isSuccess ? (
        /* Success Screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center z-10 py-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 bg-[#E29D29] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(226,157,41,0.5)] mb-4"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h3 className="text-white text-xl sm:text-2xl font-bold font-serif mb-2">Profil Berhasil Dibuat!</h3>
          <p className="text-white/70 text-xs sm:text-sm max-w-xs mb-6">Halo Petualang! Profilmu sudah tersimpan. Siap mengikuti kuis pertama?</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="bg-[#E29D29] hover:bg-[#F2AE3A] text-white font-extrabold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-[0_4px_20px_rgba(226,157,41,0.5)] tracking-wider uppercase transition-all flex items-center gap-2 border border-yellow-500/30 cursor-pointer"
          >
            Mulai Quiz
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        </motion.div>
      ) : (
        /* Form Wizard */
        <div className="flex-1 flex flex-col justify-between z-10">
          
          {/* Top Header Navigation & Progress Tracker */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevStep}
              className={`p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/5 active:scale-95 transition-all ${
                formStep === 0 && !onBack ? "opacity-0 pointer-events-none" : "opacity-100 cursor-pointer"
              }`}
              aria-label="Back"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Stars Progress Indicators (4 steps now) */}
            <div className="flex gap-2.5">
              {[0, 1, 2, 3].map((step) => {
                const isActive = formStep >= step;
                return (
                  <motion.div
                    key={step}
                    animate={{
                      scale: formStep === step ? 1.25 : 1,
                      color: isActive ? "#E29D29" : "rgba(255,255,255,0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="w-5 h-5 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Invisible placeholder for symmetry */}
            <div className="w-8 h-8 opacity-0 pointer-events-none" />
          </div>

          {/* Form Wizard Slider */}
          <div className="flex-1 flex flex-col justify-center min-h-[270px]">
            <AnimatePresence mode="wait">
              {formStep === 0 && (
                /* Step 1: Name */
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex flex-col items-center"
                >
                  <div className="flex flex-col items-center mb-4">
                    <span className="bg-[#E29D29]/20 text-[#F9CA75] border border-[#E29D29]/40 text-[10px] sm:text-xs font-extrabold tracking-widest px-3.5 py-1 rounded-full uppercase mb-2">
                      Ayo Kenalan! 👋
                    </span>
                    <h4 className="text-white text-lg sm:text-xl font-bold font-serif text-center">
                      Siapa namamu?
                    </h4>
                  </div>
                  <p className="text-white/50 text-xs mb-6 text-center max-w-xs">
                    Tulis nama panggilan atau nama lengkapmu di sini
                  </p>
                  
                  <div className="w-full relative px-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ketik namamu..."
                      className="w-full bg-[#121338]/80 text-white placeholder-white/20 border-2 border-white/10 focus:border-[#E29D29]/60 rounded-2xl py-3 px-4 text-center font-semibold text-lg focus:outline-none focus:shadow-[0_0_15px_rgba(226,157,41,0.2)] transition-all"
                      maxLength={24}
                    />
                  </div>
                </motion.div>
              )}

              {formStep === 1 && (
                /* Step 2: Age Bubble Picker */
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex flex-col items-center w-full"
                >
                  <h4 className="text-white text-lg sm:text-xl font-bold font-serif mb-1 text-center">
                    Berapa umurmu sekarang?
                  </h4>
                  <p className="text-white/40 text-xxs sm:text-xs mb-5 text-center">
                    Pilih lingkaran umurmu di bawah ini
                  </p>
                  
                  {/* Bubble Grid */}
                  <div className="grid grid-cols-5 gap-3 w-full px-2 max-w-[280px]">
                    {ages.map((age) => {
                      const isSelected = selectedAge === age;
                      return (
                        <motion.button
                          key={age}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => selectAge(age)}
                          className={`aspect-square w-full rounded-full flex items-center justify-center font-extrabold text-sm sm:text-base border transition-all duration-300
                            ${isSelected
                              ? "bg-gradient-to-br from-[#E29D29] to-[#996515] border-transparent text-white shadow-[0_4px_15px_rgba(226,157,41,0.4)]"
                              : "bg-[#121338]/80 hover:bg-white/5 border-white/10 text-white/70"
                            }`}
                        >
                          {age}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {formStep === 2 && (
                /* Step 3: Class SD/SMP/SMA Cards */
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex flex-col items-center w-full"
                >
                  <h4 className="text-white text-lg sm:text-xl font-bold font-serif mb-1 text-center">
                    Kamu sekarang kelas berapa?
                  </h4>
                  <p className="text-white/40 text-xxs sm:text-xs mb-4 text-center">
                    Pilih tingkat sekolahmu saat ini
                  </p>
                  
                  {/* Grid layout for classes */}
                  <div className="grid grid-cols-2 gap-2 w-full max-h-[160px] overflow-y-auto pr-1">
                    {grades.map((grade) => {
                      const isSelected = selectedGrade === grade.id;
                      return (
                        <motion.button
                          key={grade.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedGrade(grade.id)}
                          className={`py-2 px-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all duration-300
                            ${isSelected
                              ? "bg-[#E29D29] border-transparent text-white shadow-[0_3px_10px_rgba(226,157,41,0.3)]"
                              : "bg-[#121338]/80 hover:bg-white/5 border-white/5 text-white/60"
                            }`}
                        >
                          {grade.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {formStep === 3 && (
                /* Step 4: Gamified Interactive Avatar Picker with 6 job characters */
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex flex-col items-center w-full px-2"
                >
                  <h4 className="text-white text-base sm:text-lg font-bold font-serif mb-1.5 text-center">
                    Pilih Karakter Avatarmu!
                  </h4>
                  
                  {/* Large Active Character Preview Card */}
                  <div className="relative w-full max-w-[290px] bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center mb-4 min-h-[160px] justify-center text-center shadow-inner overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[80px] h-[80px] rounded-full blur-[35px] bg-[#E29D29]/10 pointer-events-none" />
                    
                    <AnimatePresence mode="wait">
                      {selectedAvatar ? (
                        <motion.div
                          key={selectedAvatar}
                          initial={{ opacity: 0, scale: 0.8, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -15 }}
                          transition={{ type: "spring", stiffness: 180, damping: 13 }}
                          className="flex flex-col items-center"
                        >
                          {/* Large Interactive Character Image */}
                          <motion.div 
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#E29D29] bg-[#121338] shadow-[0_4px_15px_rgba(226,157,41,0.25)] mb-2"
                          >
                            <Image
                              src={avatars.find((a) => a.id === selectedAvatar)?.path || ""}
                              alt={selectedAvatar}
                              fill
                              className="object-cover"
                            />
                          </motion.div>
                          
                          {/* Active Character Label */}
                          <p className="text-xs sm:text-sm font-extrabold text-[#E29D29] tracking-wider uppercase mb-1">
                            {avatars.find((a) => a.id === selectedAvatar)?.label}
                          </p>
                          
                          {/* Dialogue quote bubble */}
                          <p className="text-[10px] sm:text-xs text-white/80 italic leading-relaxed px-2 font-medium">
                            &ldquo;{avatars.find((a) => a.id === selectedAvatar)?.quote}&rdquo;
                          </p>
                        </motion.div>
                      ) : (
                        <div className="text-white/30 text-xs">Pilih salah satu karakter di bawah</div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Row of Small Selection Avatars (6 items) */}
                  <div className="grid grid-cols-6 gap-2 w-full px-2 max-w-[340px] justify-center justify-items-center">
                    {avatars.map((avatar) => {
                      const isSelected = selectedAvatar === avatar.id;
                      return (
                        <motion.button
                          key={avatar.id}
                          whileHover={{ scale: 1.2, y: -4 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => setSelectedAvatar(avatar.id)}
                          className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border transition-all duration-300 bg-[#121338]
                            ${isSelected
                              ? "border-[#E29D29] shadow-[0_0_15px_rgba(226,157,41,0.45)] scale-110"
                              : "border-white/10 hover:border-white/30"
                            }`}
                          aria-label={avatar.label}
                        >
                          <Image
                            src={avatar.path}
                            alt={avatar.label}
                            fill
                            className="object-cover"
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Button Footer */}
          <div className="mt-6 flex justify-center">
            {formStep === 0 && (
              <AnimatePresence>
                {name.trim().length >= 2 && (
                  <motion.button
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.9 }}
                    onClick={handleNextStep}
                    className="bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-extrabold text-xs px-8 py-3 rounded-full shadow-[0_4px_15px_rgba(226,157,41,0.3)] tracking-widest uppercase transition-all flex items-center gap-1 border border-yellow-500/20"
                  >
                    LANJUT
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            )}

            {formStep === 1 && (
              <AnimatePresence>
                {selectedAge && (
                  <motion.button
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.9 }}
                    onClick={handleNextStep}
                    className="bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-extrabold text-xs px-8 py-3 rounded-full shadow-[0_4px_15px_rgba(226,157,41,0.3)] tracking-widest uppercase transition-all flex items-center gap-1 border border-yellow-500/20"
                  >
                    LANJUT
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            )}

            {formStep === 2 && (
              <AnimatePresence>
                {selectedGrade && (
                  <motion.button
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.9 }}
                    onClick={handleNextStep}
                    className="bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-extrabold text-xs px-8 py-3 rounded-full shadow-[0_4px_15px_rgba(226,157,41,0.3)] tracking-widest uppercase transition-all flex items-center gap-1 border border-yellow-500/20"
                  >
                    LANJUT
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            )}

            {formStep === 3 && (
              <AnimatePresence>
                {selectedAvatar && (
                  <motion.button
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.9 }}
                    onClick={handleNextStep}
                    className="bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-extrabold text-xs px-8 py-3 rounded-full shadow-[0_4px_15px_rgba(226,157,41,0.35)] tracking-widest uppercase transition-all flex items-center gap-1 border border-yellow-500/20"
                  >
                    SIMPAN & LANJUT
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
