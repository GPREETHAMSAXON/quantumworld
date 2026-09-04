-- Mentor profile fields: expertise tags + intern capacity.
-- Both live on `profiles` (only meaningful for role = 'mentor') rather than a
-- separate table, matching how this schema already keeps mentor/intern/admin
-- fields flat on one row. `expertise` is free-text tags for now — swap to a
-- foreign key against a `research_areas` table once that exists.

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS expertise TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    ADD COLUMN IF NOT EXISTS mentor_capacity INTEGER NOT NULL DEFAULT 5 CHECK (mentor_capacity >= 0);
