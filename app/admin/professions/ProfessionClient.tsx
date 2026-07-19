"use client";

import React, { useState } from "react";
import Link from "next/link";
import Modal from "@/components/admin/Modal";
import { createProfession, updateProfession, deleteProfession } from "./actions";

type Profession = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
};

export default function ProfessionClient({ 
  initialProfessions, 
  availableImages 
}: { 
  initialProfessions: Profession[],
  availableImages: string[]
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<Profession | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAdd = () => {
    setEditingProf(null);
    setSelectedImage("");
    setIsModalOpen(true);
  };

  const openEdit = (prof: Profession) => {
    setEditingProf(prof);
    setSelectedImage(prof.image_url || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    
    let res;
    if (editingProf) {
      formData.append("id", editingProf.id);
      res = await updateProfession(formData);
    } else {
      res = await createProfession(formData);
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
    const res = await deleteProfession(id);
    setIsDeleting(false);
    if (!res.success) {
      alert("Error: " + res.error);
    } else {
      setShowDeleteConfirm(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#F9CA75]">Data Profesi</h2>
          <p className="text-[#B6B2DA] text-sm mt-1">Kelola profesi yang dapat dipilih oleh petualang.</p>
        </div>
        <button 
          onClick={openAdd}
          className="px-4 py-2 bg-[#F2A93B] hover:bg-[#F9CA75] text-[#0F0E24] font-bold rounded-lg shadow-lg transition-colors"
        >
          + Tambah Profesi
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialProfessions.map((prof) => (
          <div key={prof.id} className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl overflow-hidden shadow-lg flex flex-col transition-transform hover:scale-[1.02]">
            <div className="h-32 bg-[#0F0E24] relative flex items-center justify-center">
              {prof.image_url ? (
                <img src={prof.image_url} alt={prof.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
              ) : (
                <div className="text-[#3B366E] text-4xl font-bold opacity-30">NO IMAGE</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B1A3E] to-transparent" />
              <div className="z-10 text-4xl">{prof.icon || "🎓"}</div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-[#F9CA75] text-xl mb-1">{prof.name}</h3>
              <p className="text-sm text-[#B6B2DA] mb-4 font-mono">{prof.slug}</p>
              
              <div className="mt-auto flex flex-col gap-2">
                <Link 
                  href={`/admin/professions/${prof.id}/activities`}
                  className="w-full text-center px-4 py-2 bg-[#242058] hover:bg-[#3B366E] text-white font-semibold rounded-lg transition-colors border border-[#3B366E]"
                >
                  Atur Aktivitas
                </Link>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEdit(prof)}
                    className="flex-1 px-4 py-2 bg-[#F2A93B]/10 hover:bg-[#F2A93B]/20 text-[#F9CA75] font-semibold rounded-lg transition-colors border border-[#F2A93B]/30"
                  >
                    Edit
                  </button>
                  
                  {showDeleteConfirm === prof.id ? (
                    <button 
                      onClick={() => handleDelete(prof.id)}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-semibold rounded-lg transition-colors text-sm"
                    >
                      {isDeleting ? "Hapus..." : "Yakin?"}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowDeleteConfirm(prof.id)}
                      className="flex-1 px-4 py-2 bg-[#1B1A3E] hover:bg-red-500/10 text-[#B6B2DA] hover:text-red-400 border border-[#3B366E] hover:border-red-500/30 font-semibold rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {initialProfessions.length === 0 && (
          <div className="col-span-full p-10 text-center text-[#B6B2DA] border border-dashed border-[#3B366E] rounded-2xl">
            Belum ada profesi.
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingProf ? "Edit Profesi" : "Tambah Profesi Baru"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 text-white">
          <div>
            <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Nama Profesi</label>
            <input 
              name="name" 
              defaultValue={editingProf?.name || ""} 
              required
              className="w-full px-4 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-lg focus:outline-none focus:border-[#F2A93B] transition-colors"
              placeholder="Cth: Full Stack Developer"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Slug (Huruf kecil, tanpa spasi)</label>
              <input 
                name="slug" 
                defaultValue={editingProf?.slug || ""} 
                required
                className="w-full px-4 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-lg focus:outline-none focus:border-[#F2A93B] transition-colors"
                placeholder="Cth: developer"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Icon (Emoji)</label>
              <input 
                name="icon" 
                defaultValue={editingProf?.icon || ""} 
                className="w-full px-4 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-lg focus:outline-none focus:border-[#F2A93B] transition-colors text-center text-xl"
                placeholder="💻"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#B6B2DA] mb-2">Pilih Gambar Latar</label>
            <input type="hidden" name="image_url" value={selectedImage} />
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer bg-[#0F0E24] border border-dashed border-[#3B366E] hover:border-[#F2A93B] rounded-xl p-4 transition-colors flex flex-col items-center justify-center">
                <span className="text-[#B6B2DA] text-sm mb-2">Pilih file gambar dari perangkat Anda</span>
                <span className="px-4 py-2 bg-[#242058] text-[#F9CA75] text-xs font-bold rounded-lg">Browse File...</span>
                <input 
                  type="file" 
                  name="image_file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
              
              <div className="w-24 h-24 rounded-xl border-2 border-[#3B366E] overflow-hidden bg-black/40 flex items-center justify-center shrink-0">
                {selectedImage && !selectedImage.startsWith("blob:") ? (
                  // Jika existing image_url dari db
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                ) : selectedImage.startsWith("blob:") ? (
                  // Jika gambar baru dari file picker
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[#3B366E] font-bold">NO IMAGE</span>
                )}
              </div>
            </div>
            {selectedImage && (
              <button 
                type="button" 
                onClick={() => setSelectedImage("")}
                className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Hapus Gambar
              </button>
            )}
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
