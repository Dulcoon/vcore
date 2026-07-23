-- Migration: Self Appraisal Questions & Student Results

CREATE TABLE IF NOT EXISTS public.self_appraisal_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statement TEXT NOT NULL,
    category TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.student_self_appraisal_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    yes_count INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    answers_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.self_appraisal_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_self_appraisal_results ENABLE ROW LEVEL SECURITY;

-- Public Access Policies
CREATE POLICY "Allow public select on self_appraisal_questions" ON public.self_appraisal_questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on self_appraisal_questions" ON public.self_appraisal_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on self_appraisal_questions" ON public.self_appraisal_questions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on self_appraisal_questions" ON public.self_appraisal_questions FOR DELETE USING (true);

CREATE POLICY "Allow public select on student_self_appraisal_results" ON public.student_self_appraisal_results FOR SELECT USING (true);
CREATE POLICY "Allow public insert on student_self_appraisal_results" ON public.student_self_appraisal_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on student_self_appraisal_results" ON public.student_self_appraisal_results FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on student_self_appraisal_results" ON public.student_self_appraisal_results FOR DELETE USING (true);
