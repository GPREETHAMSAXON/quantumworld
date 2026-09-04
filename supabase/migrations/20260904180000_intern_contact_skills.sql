-- Contact and Skills sections of the intern profile wizard. Both are
-- optional-everything, low-stakes data (no verification workflow, no file
-- uploads) so this is a simpler RLS shape than identity/education.

-- 1. Contact
CREATE TABLE IF NOT EXISTS public.intern_contact (
    intern_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,

    alternate_email TEXT,
    alternate_phone TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    preferred_contact_method TEXT NOT NULL DEFAULT 'Email',
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata (IST)',

    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION public.set_intern_contact_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_intern_contact_updated_at ON public.intern_contact;
CREATE TRIGGER set_intern_contact_updated_at
    BEFORE UPDATE ON public.intern_contact
    FOR EACH ROW
    EXECUTE FUNCTION public.set_intern_contact_updated_at();

ALTER TABLE public.intern_contact ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "intern_read_own_contact" ON public.intern_contact;
CREATE POLICY "intern_read_own_contact"
ON public.intern_contact
FOR SELECT
TO authenticated
USING (intern_id = auth.uid());

DROP POLICY IF EXISTS "intern_insert_own_contact" ON public.intern_contact;
CREATE POLICY "intern_insert_own_contact"
ON public.intern_contact
FOR INSERT
TO authenticated
WITH CHECK (intern_id = auth.uid());

DROP POLICY IF EXISTS "intern_update_own_contact" ON public.intern_contact;
CREATE POLICY "intern_update_own_contact"
ON public.intern_contact
FOR UPDATE
TO authenticated
USING (intern_id = auth.uid())
WITH CHECK (intern_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_contact" ON public.intern_contact;
CREATE POLICY "admin_full_access_contact"
ON public.intern_contact
FOR ALL
TO authenticated
USING (public.is_portal_admin())
WITH CHECK (public.is_portal_admin());

-- 2. Skills
CREATE TABLE IF NOT EXISTS public.intern_skills (
    intern_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,

    technical_skills TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    certifications TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    languages_known TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    tools_frameworks TEXT[] NOT NULL DEFAULT '{}'::TEXT[],

    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION public.set_intern_skills_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_intern_skills_updated_at ON public.intern_skills;
CREATE TRIGGER set_intern_skills_updated_at
    BEFORE UPDATE ON public.intern_skills
    FOR EACH ROW
    EXECUTE FUNCTION public.set_intern_skills_updated_at();

ALTER TABLE public.intern_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "intern_read_own_skills" ON public.intern_skills;
CREATE POLICY "intern_read_own_skills"
ON public.intern_skills
FOR SELECT
TO authenticated
USING (intern_id = auth.uid());

DROP POLICY IF EXISTS "intern_insert_own_skills" ON public.intern_skills;
CREATE POLICY "intern_insert_own_skills"
ON public.intern_skills
FOR INSERT
TO authenticated
WITH CHECK (intern_id = auth.uid());

DROP POLICY IF EXISTS "intern_update_own_skills" ON public.intern_skills;
CREATE POLICY "intern_update_own_skills"
ON public.intern_skills
FOR UPDATE
TO authenticated
USING (intern_id = auth.uid())
WITH CHECK (intern_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_skills" ON public.intern_skills;
CREATE POLICY "admin_full_access_skills"
ON public.intern_skills
FOR ALL
TO authenticated
USING (public.is_portal_admin())
WITH CHECK (public.is_portal_admin());
