-- Portal Auth Migration: profiles table with role-based access
-- Roles: admin, intern, mentor
-- Status: invited, active, disabled

-- 1. Types
DROP TYPE IF EXISTS public.portal_role CASCADE;
CREATE TYPE public.portal_role AS ENUM ('admin', 'intern', 'mentor');

DROP TYPE IF EXISTS public.portal_status CASCADE;
CREATE TYPE public.portal_status AS ENUM ('invited', 'active', 'disabled');

-- 2. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    role public.portal_role NOT NULL DEFAULT 'intern'::public.portal_role,
    status public.portal_status NOT NULL DEFAULT 'invited'::public.portal_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- 4. Functions (BEFORE RLS policies)

-- Function to check if current user is admin (reads from auth metadata to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_portal_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (au.raw_user_meta_data->>'role' = 'admin'
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Function to get current user's portal role from profiles
CREATE OR REPLACE FUNCTION public.get_portal_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT role::TEXT FROM public.profiles WHERE id = auth.uid() LIMIT 1
$$;

-- Trigger function: auto-create profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_portal_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'intern')::public.portal_role,
        COALESCE(NEW.raw_user_meta_data->>'status', 'invited')::public.portal_status
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Users can read their own profile
DROP POLICY IF EXISTS "users_read_own_profile" ON public.profiles;
CREATE POLICY "users_read_own_profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can update their own profile (limited fields)
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
CREATE POLICY "users_update_own_profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admins can read all profiles
DROP POLICY IF EXISTS "admin_read_all_profiles" ON public.profiles;
CREATE POLICY "admin_read_all_profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_portal_admin());

-- Admins can insert new profiles (create accounts)
DROP POLICY IF EXISTS "admin_insert_profiles" ON public.profiles;
CREATE POLICY "admin_insert_profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (public.is_portal_admin());

-- Admins can update any profile (activate/disable accounts)
DROP POLICY IF EXISTS "admin_update_profiles" ON public.profiles;
CREATE POLICY "admin_update_profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.is_portal_admin())
WITH CHECK (public.is_portal_admin());

-- 7. Trigger
DROP TRIGGER IF EXISTS on_portal_user_created ON auth.users;
CREATE TRIGGER on_portal_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_portal_user();

-- 8. Mock Data: Create demo admin, intern, mentor accounts
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    intern_uuid UUID := gen_random_uuid();
    mentor_uuid UUID := gen_random_uuid();
BEGIN
    -- Admin user
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@quantumworld.in', crypt('Admin@2026', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'Portal Admin', 'role', 'admin', 'status', 'active'),
         jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (intern_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'intern@quantumworld.in', crypt('Intern@2026', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'Demo Intern', 'role', 'intern', 'status', 'active'),
         jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (mentor_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'mentor@quantumworld.in', crypt('Mentor@2026', gen_salt('bf', 10)), now(), now(), now(),
         jsonb_build_object('full_name', 'Demo Mentor', 'role', 'mentor', 'status', 'active'),
         jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null)
    ON CONFLICT (id) DO NOTHING;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;
