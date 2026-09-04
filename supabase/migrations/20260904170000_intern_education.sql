-- Education section of the intern profile wizard: current qualification,
-- prior schooling, and supporting document uploads.

CREATE TABLE IF NOT EXISTS public.intern_education (
    intern_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- Current qualification
    degree TEXT,
    specialization TEXT,
    institution TEXT,
    year_of_study TEXT,
    cgpa_percentage TEXT,
    academic_year TEXT,

    -- Previous education
    tenth_institution TEXT,
    tenth_year TEXT,
    tenth_percentage TEXT,
    twelfth_institution TEXT,
    twelfth_year TEXT,
    twelfth_percentage TEXT,

    -- Document uploads (paths in the private education-documents bucket)
    resume_path TEXT,
    academic_certificate_path TEXT,
    id_proof_path TEXT,
    other_document_path TEXT,

    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION public.set_intern_education_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_intern_education_updated_at ON public.intern_education;
CREATE TRIGGER set_intern_education_updated_at
    BEFORE UPDATE ON public.intern_education
    FOR EACH ROW
    EXECUTE FUNCTION public.set_intern_education_updated_at();

ALTER TABLE public.intern_education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "intern_read_own_education" ON public.intern_education;
CREATE POLICY "intern_read_own_education"
ON public.intern_education
FOR SELECT
TO authenticated
USING (intern_id = auth.uid());

DROP POLICY IF EXISTS "intern_insert_own_education" ON public.intern_education;
CREATE POLICY "intern_insert_own_education"
ON public.intern_education
FOR INSERT
TO authenticated
WITH CHECK (intern_id = auth.uid());

DROP POLICY IF EXISTS "intern_update_own_education" ON public.intern_education;
CREATE POLICY "intern_update_own_education"
ON public.intern_education
FOR UPDATE
TO authenticated
USING (intern_id = auth.uid())
WITH CHECK (intern_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_education" ON public.intern_education;
CREATE POLICY "admin_full_access_education"
ON public.intern_education
FOR ALL
TO authenticated
USING (public.is_portal_admin())
WITH CHECK (public.is_portal_admin());

-- Private storage bucket for education documents (resume, certificates, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('education-documents', 'education-documents', false, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "education_documents_owner_insert" ON storage.objects;
CREATE POLICY "education_documents_owner_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'education-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "education_documents_owner_select" ON storage.objects;
CREATE POLICY "education_documents_owner_select"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'education-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "education_documents_owner_update" ON storage.objects;
CREATE POLICY "education_documents_owner_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'education-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "education_documents_admin_select" ON storage.objects;
CREATE POLICY "education_documents_admin_select"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'education-documents' AND public.is_portal_admin());
