"use client";

import React, { useState } from "react";
import Link from "next/link";
import Modal from "@/components/admin/Modal";
import { createStudent, updateStudent, deleteStudent } from "./actions";

type Student = {
  id: string;
  name: string;
  age: string | null;
  grade: string | null;
  avatar_url: string | null;
  student_plans: any;
};

export default function StudentClient({ initialStudents }: { initialStudents: Student[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAdd = () => {
    setEditingStudent(null);
    setSelectedImage("");
    setIsModalOpen(true);
  };

  const openEdit = (student: Student) => {
    setEditingStudent(student);
    setSelectedImage(student.avatar_url || "");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    
    let res;
    if (editingStudent) {
      formData.append("id", editingStudent.id);
      res = await updateStudent(formData);
    } else {
      res = await createStudent(formData);
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
    const res = await deleteStudent(id);
    setIsDeleting(false);
    if (!res.success) {
      alert("Error: " + res.error);
    } else {
      setShowDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#F9CA75]">Data Siswa</h2>
          <p className="text-[#B6B2DA] text-sm mt-1">Kelola data seluruh petualang yang telah mencoba ViCore.</p>
        </div>
        <button 
          onClick={openAdd}
          className="px-4 py-2 bg-[#F2A93B] hover:bg-[#F9CA75] text-[#0F0E24] font-bold rounded-lg shadow-lg transition-colors"
        >
          + Tambah Siswa
        </button>
      </div>

      <div className="bg-[#1B1A3E]/80 backdrop-blur-md border border-[#3B366E] rounded-2xl overflow-hidden shadow-lg mt-8">
        <div className="px-6 py-4 border-b border-[#3B366E] flex justify-between items-center bg-[#242058]/30">
          <h3 className="font-bold text-white">Daftar Lengkap ({initialStudents.length})</h3>
        </div>
        
        {initialStudents.length === 0 ? (
          <div className="p-8 text-center text-[#B6B2DA]">
            Belum ada data petualang.
          </div>
        ) : (
          <div className="divide-y divide-[#3B366E]">
            {initialStudents.map((student) => {
              const planArray = Array.isArray(student.student_plans) ? student.student_plans : [student.student_plans];
              const plan = planArray.filter(Boolean)[0] || null;
              const profName = plan?.professions?.name || "Belum memilih";
              
              return (
                <div key={student.id} className="p-4 sm:px-6 hover:bg-[#242058]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0F0E24] border border-[#3B366E] overflow-hidden flex-shrink-0">
                      {student.avatar_url && (
                        <img src={student.avatar_url} alt={student.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#F9CA75] text-lg">{student.name}</h4>
                      <p className="text-sm text-[#B6B2DA]">{student.grade || "-"} • {student.age || "-"} tahun</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-sm mr-4">
                      <span className="text-[#B6B2DA]">Cita-cita: </span>
                      <span className="font-semibold text-white">{profName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      {plan && (
                        <Link 
                          href={`/admin/student/${student.id}`}
                          className="px-3 py-1 bg-[#F2A93B]/10 hover:bg-[#F2A93B]/20 border border-[#F2A93B]/30 text-[#F9CA75] text-xs font-bold rounded transition-colors"
                        >
                          Lihat Rencana
                        </Link>
                      )}
                      
                      <button 
                        onClick={() => openEdit(student)}
                        className="px-3 py-1 bg-[#F2A93B]/10 hover:bg-[#F2A93B]/20 text-[#F9CA75] text-xs font-bold rounded transition-colors border border-[#F2A93B]/30"
                      >
                        Edit
                      </button>
                      
                      {showDeleteConfirm === student.id ? (
                        <button 
                          onClick={() => handleDelete(student.id)}
                          disabled={isDeleting}
                          className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs font-bold rounded transition-colors"
                        >
                          {isDeleting ? "Hapus..." : "Yakin?"}
                        </button>
                      ) : (
                        <button 
                          onClick={() => setShowDeleteConfirm(student.id)}
                          className="px-3 py-1 bg-[#1B1A3E] hover:bg-red-500/10 text-[#B6B2DA] hover:text-red-400 border border-[#3B366E] hover:border-red-500/30 text-xs font-bold rounded transition-colors"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? "Edit Siswa" : "Tambah Siswa Baru"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 text-white">
          <div>
            <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Nama Lengkap</label>
            <input 
              name="name" 
              defaultValue={editingStudent?.name || ""} 
              required
              className="w-full px-4 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-lg focus:outline-none focus:border-[#F2A93B] transition-colors"
              placeholder="Cth: Budi Santoso"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Usia</label>
              <input 
                name="age"
                type="number" 
                defaultValue={editingStudent?.age || ""} 
                className="w-full px-4 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-lg focus:outline-none focus:border-[#F2A93B] transition-colors"
                placeholder="Cth: 16"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-semibold text-[#B6B2DA] mb-1">Kelas</label>
              <input 
                name="grade" 
                defaultValue={editingStudent?.grade || ""} 
                className="w-full px-4 py-2 bg-[#0F0E24] border border-[#3B366E] rounded-lg focus:outline-none focus:border-[#F2A93B] transition-colors"
                placeholder="Cth: 10 IPA"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#B6B2DA] mb-2">Avatar / Foto Profil</label>
            <input type="hidden" name="avatar_url" value={selectedImage} />
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer bg-[#0F0E24] border border-dashed border-[#3B366E] hover:border-[#F2A93B] rounded-xl p-4 transition-colors flex flex-col items-center justify-center">
                <span className="text-[#B6B2DA] text-sm mb-2">Pilih file foto dari perangkat Anda</span>
                <span className="px-4 py-2 bg-[#242058] text-[#F9CA75] text-xs font-bold rounded-lg">Browse File...</span>
                <input 
                  type="file" 
                  name="avatar_file"
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
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                ) : selectedImage.startsWith("blob:") ? (
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[#3B366E] font-bold">NO AVA</span>
                )}
              </div>
            </div>
            {selectedImage && (
              <button 
                type="button" 
                onClick={() => setSelectedImage("")}
                className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Hapus Foto
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
    </div>
  );
}
