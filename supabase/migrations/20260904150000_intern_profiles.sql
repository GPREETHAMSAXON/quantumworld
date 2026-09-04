-- Intern Profile Details: personal-details wizard data + profile photo storage.
-- Started with the Personal section only; Contact/Identity/Education/Skills
-- get their own columns (or tables) in later migrations as those sections
-- are built, matching the wizard's incremental rollout.

-- 1. Table
CREATE TABLE IF NOT EXISTS public.intern_profiles (
    intern_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- Personal section
    profile_photo_url TEXT,
    date_of_birth DATE,
    gender TEXT,
    mobile_number TEXT,
    communication_address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    personal_completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. updated_at trigger
CREATE OR REPLACE FUNCTION public.set_intern_profile_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_intern_profile_updated_at ON public.intern_profiles;
CREATE TRIGGER set_intern_profile_updated_at
    BEFORE UPDATE ON public.intern_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_intern_profile_updated_at();

-- 3. RLS
ALTER TABLE public.intern_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "intern_read_own_profile_details" ON public.intern_profiles;
CREATE POLICY "intern_read_own_profile_details"
ON public.intern_profiles
FOR SELECT
TO authenticated
USING (intern_id = auth.uid());

DROP POLICY IF EXISTS "intern_insert_own_profile_details" ON public.intern_profiles;
CREATE POLICY "intern_insert_own_profile_details"
ON public.intern_profiles
FOR INSERT
TO authenticated
WITH CHECK (intern_id = auth.uid());

DROP POLICY IF EXISTS "intern_update_own_profile_details" ON public.intern_profiles;
CREATE POLICY "intern_update_own_profile_details"
ON public.intern_profiles
FOR UPDATE
TO authenticated
USING (intern_id = auth.uid())
WITH CHECK (intern_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_intern_profiles" ON public.intern_profiles;
CREATE POLICY "admin_full_access_intern_profiles"
ON public.intern_profiles
FOR ALL
TO authenticated
USING (public.is_portal_admin())
WITH CHECK (public.is_portal_admin());

-- 4. Storage bucket for profile photos (public read; writes scoped to the
-- owning user's own folder, e.g. profile-photos/<user_id>/<file>).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profile-photos', 'profile-photos', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "profile_photos_public_read" ON storage.objects;
CREATE POLICY "profile_photos_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-photos');

DROP POLICY IF EXISTS "profile_photos_owner_insert" ON storage.objects;
CREATE POLICY "profile_photos_owner_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "profile_photos_owner_update" ON storage.objects;
CREATE POLICY "profile_photos_owner_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "profile_photos_owner_delete" ON storage.objects;
CREATE POLICY "profile_photos_owner_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
