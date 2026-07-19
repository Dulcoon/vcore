"use client";

import { useState } from "react";
import { deleteStudent } from "./actions";

export default function StudentDeleteButton({ studentId }: { studentId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteStudent(studentId);
    if (!res.success) {
      alert("Gagal menghapus: " + res.error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
    // Jika sukses, list akan ter-update via revalidatePath
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#B6B2DA]">Yakin?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 text-xs font-bold rounded"
        >
          {isDeleting ? "Hapus..." : "Ya"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="px-3 py-1 bg-[#3B366E] text-white hover:bg-[#242058] text-xs font-bold rounded"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1 bg-[#1B1A3E] text-red-400 border border-red-500/30 hover:bg-red-500/10 text-xs font-bold rounded"
    >
      Hapus
    </button>
  );
}
