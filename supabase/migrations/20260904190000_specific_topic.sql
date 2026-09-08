-- Specific Topic module: adds a short research-objective statement captured
-- alongside the chosen topic, ahead of the full project proposal later.

ALTER TABLE public.internships
    ADD COLUMN IF NOT EXISTS research_objective TEXT;
