-- Supabase Schema for ViCore Career Plan

-- 1. Students Table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age TEXT,
    grade TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Professions Table
CREATE TABLE public.professions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Activities Table
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profession_id UUID REFERENCES public.professions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    xp INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Student Plans Table
CREATE TABLE public.student_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE UNIQUE NOT NULL,
    profession_id UUID REFERENCES public.professions(id) ON DELETE CASCADE NOT NULL,
    total_xp INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Student Plan Activities (The 6 selected activities)
CREATE TABLE public.student_plan_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES public.student_plans(id) ON DELETE CASCADE NOT NULL,
    activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
    slot_index INTEGER NOT NULL CHECK (slot_index >= 0 AND slot_index <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(plan_id, slot_index)
);

-- Setup Row Level Security (RLS)
-- Since there is no auth yet, we will enable RLS but allow anonymous access for MVP.
-- For production, you should lock this down with actual auth policies.

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_plan_activities ENABLE ROW LEVEL SECURITY;

-- Allow public access for all operations (since it's a public kiosk-style app for now)
CREATE POLICY "Allow public select on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert on students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on students" ON public.students FOR UPDATE USING (true);

CREATE POLICY "Allow public select on professions" ON public.professions FOR SELECT USING (true);
CREATE POLICY "Allow public select on activities" ON public.activities FOR SELECT USING (true);

CREATE POLICY "Allow public select on student_plans" ON public.student_plans FOR SELECT USING (true);
CREATE POLICY "Allow public insert on student_plans" ON public.student_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on student_plans" ON public.student_plans FOR UPDATE USING (true);

CREATE POLICY "Allow public select on student_plan_activities" ON public.student_plan_activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert on student_plan_activities" ON public.student_plan_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on student_plan_activities" ON public.student_plan_activities FOR DELETE USING (true);
