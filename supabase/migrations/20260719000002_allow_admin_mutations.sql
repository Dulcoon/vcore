-- Izinkan Delete & Update untuk students
CREATE POLICY "Enable delete for everyone" ON public.students FOR DELETE USING (true);

-- Izinkan Delete & Update untuk student_plans
CREATE POLICY "Enable delete for everyone" ON public.student_plans FOR DELETE USING (true);

-- Izinkan Delete & Update untuk student_plan_activities
CREATE POLICY "Enable delete for everyone" ON public.student_plan_activities FOR DELETE USING (true);

-- Izinkan Insert, Update, Delete untuk professions
CREATE POLICY "Enable insert for everyone" ON public.professions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for everyone" ON public.professions FOR UPDATE USING (true);
CREATE POLICY "Enable delete for everyone" ON public.professions FOR DELETE USING (true);

-- Izinkan Insert, Update, Delete untuk activities
CREATE POLICY "Enable insert for everyone" ON public.activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for everyone" ON public.activities FOR UPDATE USING (true);
CREATE POLICY "Enable delete for everyone" ON public.activities FOR DELETE USING (true);
