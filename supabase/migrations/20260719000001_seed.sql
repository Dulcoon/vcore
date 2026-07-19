-- Allow anonymous access for the app (since there is no login)
CREATE POLICY "Enable insert for everyone" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for everyone" ON public.students FOR UPDATE USING (true);

CREATE POLICY "Enable insert for everyone" ON public.student_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for everyone" ON public.student_plans FOR UPDATE USING (true);

CREATE POLICY "Enable insert for everyone" ON public.student_plan_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for everyone" ON public.student_plan_activities FOR UPDATE USING (true);

-- Seed file for initial data
INSERT INTO public.professions (id, slug, name, icon, image_url) VALUES 
('85b318da-1c88-4c31-8975-d227b68264d8', 'pelayan', 'Pelayan Restoran', '🍽️', '/images/Waiter.png'),
('c969b910-63ce-4467-85b8-569b9f71c4c9', 'fotostudio', 'Fotografer Studio', '📷', '/images/Photo Studio.png'),
('5b18f8c4-0619-4cb5-8d51-e77a11e43c68', 'chef', 'Chef Profesional', '🍳', '/images/Chef.png'),
('f80f68c3-42e7-4959-994c-47fc91fa7fb6', 'contentcreator', 'Content Creator', '🎬', '/images/Konten kreator.png'),
('d3600ab4-601c-43f1-b924-d2c67c293776', 'guruisyarat', 'Guru Bahasa Isyarat', '🤟', '/images/Guru Bahasa Isyarat4.png'),
('24c9c211-1a35-4672-9ea3-f54f15d59a72', 'desaingrafis', 'Desainer Grafis', '🎨', '/images/Desain grafis.png')
ON CONFLICT (slug) DO NOTHING;

-- Pelayan Restoran
INSERT INTO public.activities (profession_id, title, category, icon, xp) VALUES 
('85b318da-1c88-4c31-8975-d227b68264d8', 'Belajar Komunikasi dengan Tamu', 'Belajar', '🗣️', 10),
('85b318da-1c88-4c31-8975-d227b68264d8', 'Belajar Tata Cara Penyajian', 'Belajar', '🍽️', 10),
('85b318da-1c88-4c31-8975-d227b68264d8', 'Latihan Melayani Tamu', 'Latihan', '🙋', 15),
('85b318da-1c88-4c31-8975-d227b68264d8', 'Ikut Pelatihan Hospitality', 'Belajar', '📘', 10),
('85b318da-1c88-4c31-8975-d227b68264d8', 'Magang di Restoran/Kafe', 'Magang', '🏨', 20),
('85b318da-1c88-4c31-8975-d227b68264d8', 'Ikut Lomba Pelayanan Terbaik', 'Lomba', '🏆', 25),
('85b318da-1c88-4c31-8975-d227b68264d8', 'Latihan Mencatat Pesanan Cepat', 'Latihan', '📝', 10);

-- Fotografer Studio
INSERT INTO public.activities (profession_id, title, category, icon, xp) VALUES 
('c969b910-63ce-4467-85b8-569b9f71c4c9', 'Belajar Dasar Fotografi', 'Belajar', '📷', 10),
('c969b910-63ce-4467-85b8-569b9f71c4c9', 'Belajar Pencahayaan Studio', 'Belajar', '💡', 10),
('c969b910-63ce-4467-85b8-569b9f71c4c9', 'Latihan Memotret Model', 'Latihan', '🧍', 15),
('c969b910-63ce-4467-85b8-569b9f71c4c9', 'Belajar Mengedit Foto', 'Belajar', '🖥️', 10),
('c969b910-63ce-4467-85b8-569b9f71c4c9', 'Magang di Studio Foto', 'Magang', '🏢', 20),
('c969b910-63ce-4467-85b8-569b9f71c4c9', 'Ikut Lomba Fotografi', 'Lomba', '🏆', 25),
('c969b910-63ce-4467-85b8-569b9f71c4c9', 'Membuat Portofolio Online', 'Kreatif', '💼', 15);

-- Chef Profesional
INSERT INTO public.activities (profession_id, title, category, icon, xp) VALUES 
('5b18f8c4-0619-4cb5-8d51-e77a11e43c68', 'Belajar Dasar Memasak', 'Belajar', '🔪', 10),
('5b18f8c4-0619-4cb5-8d51-e77a11e43c68', 'Belajar Mengenal Bahan Makanan', 'Belajar', '🥕', 10),
('5b18f8c4-0619-4cb5-8d51-e77a11e43c68', 'Latihan Membuat Menu Sederhana', 'Latihan', '🍳', 15),
('5b18f8c4-0619-4cb5-8d51-e77a11e43c68', 'Ikut Kelas Memasak Online', 'Belajar', '💻', 10),
('5b18f8c4-0619-4cb5-8d51-e77a11e43c68', 'Magang di Dapur Restoran', 'Magang', '👨‍🍳', 20),
('5b18f8c4-0619-4cb5-8d51-e77a11e43c68', 'Mengikuti Lomba Memasak', 'Lomba', '🏆', 25),
('5b18f8c4-0619-4cb5-8d51-e77a11e43c68', 'Belajar Plating & Penyajian', 'Belajar', '🍱', 10),
('5b18f8c4-0619-4cb5-8d51-e77a11e43c68', 'Membuat Konten Resep', 'Kreatif', '📱', 15);

-- Content Creator
INSERT INTO public.activities (profession_id, title, category, icon, xp) VALUES 
('f80f68c3-42e7-4959-994c-47fc91fa7fb6', 'Belajar Riset & Ide Konten', 'Belajar', '💡', 10),
('f80f68c3-42e7-4959-994c-47fc91fa7fb6', 'Belajar Syuting dengan HP', 'Belajar', '🎥', 10),
('f80f68c3-42e7-4959-994c-47fc91fa7fb6', 'Latihan Mengedit Video', 'Latihan', '✂️', 15),
('f80f68c3-42e7-4959-994c-47fc91fa7fb6', 'Belajar Membuat Naskah & Caption', 'Belajar', '✍️', 10),
('f80f68c3-42e7-4959-994c-47fc91fa7fb6', 'Konsisten Upload Konten', 'Latihan', '📅', 15),
('f80f68c3-42e7-4959-994c-47fc91fa7fb6', 'Kolaborasi dengan Kreator Lain', 'Kolaborasi', '🤝', 20),
('f80f68c3-42e7-4959-994c-47fc91fa7fb6', 'Ikut Kompetisi Konten Kreatif', 'Lomba', '🏆', 25),
('f80f68c3-42e7-4959-994c-47fc91fa7fb6', 'Membangun Portofolio Media Sosial', 'Kreatif', '📱', 15);

-- Guru Bahasa Isyarat
INSERT INTO public.activities (profession_id, title, category, icon, xp) VALUES 
('d3600ab4-601c-43f1-b924-d2c67c293776', 'Belajar BISINDO/SIBI Dasar', 'Belajar', '🤟', 10),
('d3600ab4-601c-43f1-b924-d2c67c293776', 'Belajar Teknik Mengajar', 'Belajar', '📘', 10),
('d3600ab4-601c-43f1-b924-d2c67c293776', 'Latihan Mengajar Teman Sebaya', 'Latihan', '🧑‍🏫', 15),
('d3600ab4-601c-43f1-b924-d2c67c293776', 'Ikut Pelatihan Kebahasaan', 'Belajar', '📚', 10),
('d3600ab4-601c-43f1-b924-d2c67c293776', 'Magang Mengajar di Komunitas Tuli', 'Magang', '🏫', 20),
('d3600ab4-601c-43f1-b924-d2c67c293776', 'Ikut Festival Bahasa Isyarat', 'Lomba', '🏆', 25);

-- Desainer Grafis
INSERT INTO public.activities (profession_id, title, category, icon, xp) VALUES 
('24c9c211-1a35-4672-9ea3-f54f15d59a72', 'Belajar Dasar Desain', 'Belajar', '🎨', 10),
('24c9c211-1a35-4672-9ea3-f54f15d59a72', 'Belajar Aplikasi Desain (Canva/CorelDraw)', 'Belajar', '🖥️', 10),
('24c9c211-1a35-4672-9ea3-f54f15d59a72', 'Latihan Membuat Poster', 'Latihan', '🖼️', 15),
('24c9c211-1a35-4672-9ea3-f54f15d59a72', 'Belajar Teori Warna & Tipografi', 'Belajar', '🔤', 10),
('24c9c211-1a35-4672-9ea3-f54f15d59a72', 'Magang di Studio Desain', 'Magang', '🏢', 20),
('24c9c211-1a35-4672-9ea3-f54f15d59a72', 'Ikut Lomba Desain Grafis', 'Lomba', '🏆', 25),
('24c9c211-1a35-4672-9ea3-f54f15d59a72', 'Membuat Portofolio Desain', 'Kreatif', '💼', 15),
('24c9c211-1a35-4672-9ea3-f54f15d59a72', 'Ikut Kelas Desain Online', 'Belajar', '💻', 10);

-- Dummy Student for testing Admin Dashboard
INSERT INTO public.students (id, name, age, grade, avatar_url) VALUES 
('9b8cc5d0-1c42-4f31-8178-5d2a37f02d09', 'Rian (Dummy Data)', '11', 'Kelas 5 SD', '/images/avatar_waiter.png')
ON CONFLICT (id) DO NOTHING;

-- Assign dummy student a career plan (Pelayan)
INSERT INTO public.student_plans (id, student_id, profession_id, total_xp) VALUES 
('a4c49831-7b0b-46cb-b70c-2d33bfd92d43', '9b8cc5d0-1c42-4f31-8178-5d2a37f02d09', '85b318da-1c88-4c31-8975-d227b68264d8', 20)
ON CONFLICT (id) DO NOTHING;
