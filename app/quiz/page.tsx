"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JobSelectQuiz from "@/components/quiz/JobSelectQuiz";
import SelectProfileQuiz from "@/components/quiz/SelectProfileQuiz";
import PlanBuilderQuiz from "@/components/quiz/PlanBuilderQuiz";

interface Profile {
  name: string;
  age: string;
  grade: string;
  avatar?: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"select-profile" | "select-job" | "quiz">("select-profile");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);

  // Read active_student_profile on mount to verify if they came from the onboarding form
  useEffect(() => {
    try {
      const active = localStorage.getItem("active_student_profile");
      if (active) {
        const parsed = JSON.parse(active);
        setActiveProfile(parsed);
        setPhase("select-job"); // Auto-skip profile selection since they just created it
        // Remove it so returning visits can choose a profile manually
        localStorage.removeItem("active_student_profile");
      } else {
        setPhase("select-profile");
      }
    } catch (error) {
      console.error("Failed to load active student profile from localStorage:", error);
      setPhase("select-profile");
    }
  }, []);

  const handleSelectProfile = (profile: Profile) => {
    setActiveProfile(profile);
    setPhase("select-job");
  };

  const handleSelectJob = (jobName: string) => {
    setSelectedJob(jobName);
    setPhase("quiz");
  };

  const handleFinish = () => {
    // Go back to home (the VR instruction step)
    router.push("/");
  };

  if (phase === "select-profile") {
    return <SelectProfileQuiz onSelect={handleSelectProfile} onBack={() => router.push("/?step=5")} />;
  }

  if (phase === "select-job") {
    return <JobSelectQuiz onSelect={handleSelectJob} />;
  }

  const handleBack = () => {
    setPhase("select-job");
  };

  // Quiz / plan builder phase
  return (
    <PlanBuilderQuiz
      job={selectedJob}
      profile={activeProfile}
      onFinish={handleFinish}
      onBack={handleBack}
    />
  );
}
