-- Migration: Problem Solving Quizzes and Student Quiz Results

-- 1. Create Problem Solving Questions Table
CREATE TABLE IF NOT EXISTS public.problem_solving_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profession_id UUID REFERENCES public.professions(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C')),
    score_value INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Student Quiz Results Table
CREATE TABLE IF NOT EXISTS public.student_quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    profession_id UUID REFERENCES public.professions(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public.problem_solving_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_quiz_results ENABLE ROW LEVEL SECURITY;

-- 4. Public Access Policies for problem_solving_questions
CREATE POLICY "Allow public select on problem_solving_questions" ON public.problem_solving_questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on problem_solving_questions" ON public.problem_solving_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on problem_solving_questions" ON public.problem_solving_questions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on problem_solving_questions" ON public.problem_solving_questions FOR DELETE USING (true);

-- 5. Public Access Policies for student_quiz_results
CREATE POLICY "Allow public select on student_quiz_results" ON public.student_quiz_results FOR SELECT USING (true);
CREATE POLICY "Allow public insert on student_quiz_results" ON public.student_quiz_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on student_quiz_results" ON public.student_quiz_results FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on student_quiz_results" ON public.student_quiz_results FOR DELETE USING (true);
