"use client";

import React, { useState } from "react";
import Link from "next/link";
import Modal from "@/components/admin/Modal";
import { createActivity, updateActivity, deleteActivity } from "./actions";

type Activity = {
  id: string;
  profession_id: string;
  content: string;
  category: string;
  icon: string | null;
  score_value: number;
};

type Profession = {
  id: string;
  name: string;
};

export default function ActivityClient({ 
  initialActivities, 
  profession 
}: { 
  initialActivities: Activity[], 
  profession: Profession 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAct, setEditingAct] = useState<Activity | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAdd = () => {
    setEditingAct(null);
    setIsModalOpen(true);
  };

  const openEdit = (act: Activity) => {
    setEditingAct(act);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("profession_id", profession.id);
    
    let res;
    if (editingAct) {
      formData.append("id", editingAct.id);
      res = await updateActivity(formData);
    } else {
      res = await createActivity(formData);
    }

    setIsSaving(false);
    if (!res.success) {
      alert("Error: " + res.error);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const res = await deleteActivity(id, profession.id);
    setIsDeleting(false);
    if (!res.success) {
      alert("Error: " + res.error);
    } else {
      setShowDeleteConfirm(null);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/professions" className="text-sm font-semibold text-[#B6B2DA] hover:text-white transition-colors">
          &larr; Kembali ke Profesi
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#F9CA75]">
            Aktivitas: {profession.name}
          </h2>
          <p className="text-[#B6B2DA] text-sm mt-1">
            Kelola aktivitas persiapan karir khusus profesi ini.
          </p>
        </div>
        <button 
          onClick={openAdd}
          className="px-4 py-2 bg-[#F2A93B] hover:bg-[#F9CA75] text-[#0F0E24] font-bold rounded-lg shadow-lg transition-colors whitespace-nowrap"
        >
          + Tambah Aktivitas
        </button>
      </div>

      <div className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl overflow-hidden shadow-lg">
        {initialActivities.length === 0 ? (
          <div className="p-10 text-center text-[#B6B2DA]">
            Belum ada aktivitas untuk profesi ini.
          </div>
        ) : (
          <div className="divide-y divide-[#3B366E]">
            {initialActivities.map((act) => (
              <div key={act.id} className="p-4 sm:px-6 hover:bg-[#242058]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0F0E24] border border-[#3B366E] flex items-center justify-center text-2xl flex-shrink-0">
                    {act.icon || "📝"}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">{act.content}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-[#242058] border border-[#3B366E] text-xs font-semibold text-[#B6B2DA] rounded text-[10px] uppercase">
                        {act.category}
                      </span>
                      <span className="text-[#F2A93B] text-xs font-bold">
                        +{act.score_value} XP
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 self-start sm:self-center">
                  <button 
                    onClick={() => openEdit(act)}
                    className="px-3 py-1.5 bg-[#F2A93B]/10 hover:bg-[#F2A93B]/20 text-[#F9CA75] font-semibold rounded-lg transition-colors border border-[#F2A93B]/30 text-sm"
                  >
                    Edit
                  </button>
                  
                  {showDeleteConfirm === act.id ? (
                    <button 
                      onClick={() => handleDelete(act.id)}
                      disabled={isDeleting}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-semibold rounded-lg transition-colors text-sm"
                    >
                      {isDeleting ? "Hapus..." : "Yakin?"}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowDeleteConfirm(act.id)}
                      className="px-3 py-1.5 bg-[#1B1A3E] hover:bg-red-500/10 text-[#B6B2DA] hover:text-red-400 border border-[#3B366E] hover:border-red-500/30 font-semibold rounded-lg transition-colors text-sm"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingAct ? "Edit Aktivitas" : "Tambah Aktivitas Baru"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 text-white">
          <div>
            <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Isi Aktivitas (Contoh: Belajar Python Dasar)</label>
            <input 
              name="content" 
              defaultValue={editingAct?.content || ""} 
              required
              className="w-full px-4 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-lg focus:outline-none focus:border-[#F2A93B] transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Kategori Tipe (Cth: dasar, proyek, komunitas)</label>
            <input 
              name="category" 
              defaultValue={editingAct?.category || "dasar"} 
              required
              className="w-full px-4 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-lg focus:outline-none focus:border-[#F2A93B] transition-colors"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Icon (Emoji)</label>
              <input 
                name="icon" 
                defaultValue={editingAct?.icon || "📝"} 
                className="w-full px-4 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-lg focus:outline-none focus:border-[#F2A93B] transition-colors text-center text-xl"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Poin XP</label>
              <input 
                name="score_value" 
                type="number"
                defaultValue={editingAct?.score_value || 10} 
                required
                className="w-full px-4 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-lg focus:outline-none focus:border-[#F2A93B] transition-colors"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3 justify-end">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 bg-[#242058] text-[#B6B2DA] font-bold rounded-lg hover:bg-[#3B366E] transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-2 bg-[#F2A93B] text-[#0F0E24] font-bold rounded-lg hover:bg-[#F9CA75] transition-colors disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
