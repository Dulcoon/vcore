import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BatikOrnament from "../BatikOrnament";
import HeaderLogos from "../HeaderLogos";
import Logo from "../Logo";

interface Profile {
  name: string;
  age: string;
  grade: string;
  avatar?: string;
}

interface SelectProfileQuizProps {
  onSelect: (profile: Profile) => void;
  onBack: () => void;
}

const dummyProfiles: Profile[] = [
  { name: "Budi", age: "10", grade: "Kelas 4 SD", avatar: "/images/avatar_explorer.png" },
  { name: "Siti", age: "11", grade: "Kelas 5 SD", avatar: "/images/avatar_artist.png" },
  { name: "Ahmad", age: "12", grade: "Kelas 6 SD", avatar: "/images/avatar_tech.png" },
  { name: "Dewi", age: "9", grade: "Kelas 3 SD", avatar: "/images/avatar_chef.png" },
  { name: "Rian", age: "11", grade: "Kelas 5 SD", avatar: "/images/avatar_scientist.png" },
];

export default function SelectProfileQuiz({ onSelect, onBack }: SelectProfileQuizProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load profiles from history or fallback to dummies
  useEffect(() => {
    try {
      const stored = localStorage.getItem("student_profiles");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge stored profiles with dummies to ensure all options are always visible
          // or just load stored profiles if they exist, but append dummies for completeness
          const uniqueStored = parsed.filter(
            (sp: Profile) => !dummyProfiles.some((dp) => dp.name.toLowerCase() === sp.name.toLowerCase())
          );
          setProfiles([...uniqueStored, ...dummyProfiles]);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load profiles from localStorage", e);
    }
    setProfiles(dummyProfiles);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (selectedProfile) {
      onSelect(selectedProfile);
    }
  };

  // Generate a soft background color for initials (fallback)
  const getAvatarColor = (name: string) => {
    const colors = [
      "from-[#E29D29] to-[#996515]", // Gold
      "from-rose-500 to-rose-700", // Rose
      "from-sky-500 to-sky-700", // Sky
      "from-emerald-500 to-emerald-700", // Emerald
      "from-violet-500 to-violet-700", // Violet
    ];
    const code = name.charCodeAt(0) || 0;
    return colors[code % colors.length];
  };

  return (
    <div className="w-full h-screen relative flex flex-col justify-between items-center pt-8 pb-20 lg:py-10 px-6 overflow-hidden select-none bg-gradient-to-b from-[#101235] to-[#050616]">
      {/* Background glow */}
      <div className="absolute w-[350px] h-[350px] rounded-full blur-[130px] bg-[#E29D29]/10 top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

      {/* Batik Ornaments */}
      <BatikOrnament position="top-left" className="opacity-15" />
      <BatikOrnament position="top-right" className="opacity-15" />
      <BatikOrnament position="bottom-left" className="opacity-15" />
      <BatikOrnament position="bottom-right" className="opacity-15" />

      {/* Back button */}
      <button
        onClick={onBack}
        aria-label="Kembali"
        className="absolute top-8 left-6 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 transition-all active:scale-95"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {/* Logos */}
      <div className="z-10 w-full mt-2">
        <HeaderLogos />
      </div>

      {/* Main Container */}
      <div className="z-10 w-full max-w-md flex-1 flex flex-col items-center justify-center my-auto max-h-[85vh]">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="text-center z-10 mb-8"
        >
          <Logo className="w-28 lg:w-40 mx-auto mb-3" />
          <h2 className="text-white text-xl lg:text-3xl font-bold font-serif max-w-lg leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Pilih Profil Petualangmu
          </h2>
          <p className="text-white/50 text-xs mt-1">
            Pilih namamu untuk memulai eksplorasi pekerjaan
          </p>
        </motion.div>

        {/* Dropdown Container */}
        <div className="relative w-full z-20 px-2 mb-8">
          {/* Dropdown Trigger */}
          <button
            onClick={toggleDropdown}
            className={`w-full bg-[#1c1e4c]/80 hover:bg-[#22245b]/80 border transition-all duration-300 rounded-2xl py-3.5 px-5 flex items-center justify-between text-white shadow-lg focus:outline-none
              ${isOpen ? "border-[#E29D29]/80 shadow-[0_0_15px_rgba(226,157,41,0.15)]" : "border-white/10"}`}
          >
            {selectedProfile ? (
              <div className="flex items-center gap-3">
                {/* Avatar Rendering */}
                {selectedProfile.avatar ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/15 bg-black/10">
                    <Image
                      src={selectedProfile.avatar}
                      alt={selectedProfile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(selectedProfile.name)} flex items-center justify-center font-extrabold text-sm text-white shadow-md`}>
                    {selectedProfile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="font-bold text-sm text-white">{selectedProfile.name}</p>
                  <p className="text-white/40 text-xxs">{selectedProfile.grade} • Umur {selectedProfile.age}</p>
                </div>
              </div>
            ) : (
              <span className="text-white/40 font-medium text-sm">Pilih namamu disini...</span>
            )}

            {/* Chevron Icon */}
            <motion.svg
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-5 h-5 text-white/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>

          {/* Dropdown List */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 5, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute left-2 right-2 bg-[#161742]/95 border border-white/10 rounded-2xl shadow-2xl p-2 max-h-[220px] overflow-y-auto z-30 backdrop-blur-md"
              >
                {profiles.map((profile, index) => {
                  const isChosen = selectedProfile?.name === profile.name;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelect(profile)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all mb-1 last:mb-0 text-left
                        ${isChosen ? "bg-[#E29D29]/15 border border-[#E29D29]/30" : "hover:bg-white/5 border border-transparent"}`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar Rendering inside Dropdown */}
                        {profile.avatar ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/15 bg-black/10">
                            <Image
                              src={profile.avatar}
                              alt={profile.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(profile.name)} flex items-center justify-center font-extrabold text-sm text-white shadow-md`}>
                            {profile.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {/* Text Details */}
                        <div>
                          <p className="font-bold text-sm text-white">{profile.name}</p>
                          <p className="text-white/40 text-xxs">{profile.grade} • Umur {profile.age}</p>
                        </div>
                      </div>
                      
                      {isChosen && (
                        <svg className="w-5 h-5 text-[#E29D29]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Select Button */}
        <div className="h-14 flex items-center justify-center">
          <AnimatePresence>
            {selectedProfile && (
              <motion.button
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 150, damping: 11 }}
                onClick={handleSubmit}
                className="group relative bg-[#E29D29] hover:bg-[#F2AE3A] active:scale-95 text-white font-extrabold text-xs lg:text-sm px-10 py-3.5 rounded-full shadow-[0_5px_25px_rgba(226,157,41,0.35)] hover:shadow-[0_8px_30px_rgba(226,157,41,0.55)] transition-all tracking-widest uppercase flex items-center gap-2 border border-yellow-500/30 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                MULAI EKSPLORASI
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
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
