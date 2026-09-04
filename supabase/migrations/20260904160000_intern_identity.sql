-- Identity Verification module: encrypted government-ID storage + an
-- append-only audit log for every time the full (decrypted) value is read.
--
-- Security model:
--   * id_number_encrypted holds AES-256-GCM ciphertext only (app-level key,
--     never in this database) — Postgres/Supabase never sees the plaintext.
--   * id_number_last4 is the only plaintext fragment stored, purely so the
--     masked "XXXX XXXX 1234" display never has to decrypt anything.
--   * identity_access_log has no client-writable policy for INSERT other
--     than "is an admin" and NO update/delete policy at all — it's
--     append-only even for admins.

-- 1. Identity documents table
CREATE TABLE IF NOT EXISTS public.intern_identity (
    intern_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,

    document_type TEXT NOT NULL DEFAULT 'Aadhaar',
    id_number_encrypted TEXT NOT NULL,
    id_number_last4 TEXT NOT NULL,
    document_file_path TEXT,

    status TEXT NOT NULL DEFAULT 'SUBMITTED'
        CHECK (status IN ('SUBMITTED', 'UNDER_VERIFICATION', 'VERIFIED')),

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION public.set_intern_identity_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_intern_identity_updated_at ON public.intern_identity;
CREATE TRIGGER set_intern_identity_updated_at
    BEFORE UPDATE ON public.intern_identity
    FOR EACH ROW
    EXECUTE FUNCTION public.set_intern_identity_updated_at();

ALTER TABLE public.intern_identity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "intern_read_own_identity" ON public.intern_identity;
CREATE POLICY "intern_read_own_identity"
ON public.intern_identity
FOR SELECT
TO authenticated
USING (intern_id = auth.uid());

DROP POLICY IF EXISTS "intern_insert_own_identity" ON public.intern_identity;
CREATE POLICY "intern_insert_own_identity"
ON public.intern_identity
FOR INSERT
TO authenticated
WITH CHECK (intern_id = auth.uid());

-- Interns may only correct their submission before review has started.
DROP POLICY IF EXISTS "intern_update_own_identity_while_submitted" ON public.intern_identity;
CREATE POLICY "intern_update_own_identity_while_submitted"
ON public.intern_identity
FOR UPDATE
TO authenticated
USING (intern_id = auth.uid() AND status = 'SUBMITTED')
WITH CHECK (intern_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_identity" ON public.intern_identity;
CREATE POLICY "admin_full_access_identity"
ON public.intern_identity
FOR ALL
TO authenticated
USING (public.is_portal_admin())
WITH CHECK (public.is_portal_admin());

-- 2. Append-only audit log for full-ID access
CREATE TABLE IF NOT EXISTS public.identity_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    accessed_by UUID NOT NULL REFERENCES public.profiles(id),
    action TEXT NOT NULL DEFAULT 'VIEW_FULL_ID',
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_identity_access_log_intern ON public.identity_access_log(intern_id);

ALTER TABLE public.identity_access_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_insert_identity_access_log" ON public.identity_access_log;
CREATE POLICY "admin_insert_identity_access_log"
ON public.identity_access_log
FOR INSERT
TO authenticated
WITH CHECK (public.is_portal_admin());

DROP POLICY IF EXISTS "admin_read_identity_access_log" ON public.identity_access_log;
CREATE POLICY "admin_read_identity_access_log"
ON public.identity_access_log
FOR SELECT
TO authenticated
USING (public.is_portal_admin());

-- 3. Private storage bucket for ID document uploads (no public policy at all)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('identity-documents', 'identity-documents', false, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "identity_documents_owner_insert" ON storage.objects;
CREATE POLICY "identity_documents_owner_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'identity-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "identity_documents_owner_select" ON storage.objects;
CREATE POLICY "identity_documents_owner_select"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'identity-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "identity_documents_owner_update" ON storage.objects;
CREATE POLICY "identity_documents_owner_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'identity-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "identity_documents_admin_select" ON storage.objects;
CREATE POLICY "identity_documents_admin_select"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'identity-documents' AND public.is_portal_admin());
