-- Internships Migration: intern journey table with 16-state machine
-- Each row represents one intern's full journey from SELECTED to INTERNSHIP_COMPLETED

-- 1. Internship status enum (strict ordered states)
DROP TYPE IF EXISTS public.internship_status CASCADE;
CREATE TYPE public.internship_status AS ENUM (
    'SELECTED',
    'PROFILE_PENDING',
    'PROFILE_COMPLETED',
    'AREA_SELECTED',
    'TOPIC_SELECTED',
    'PROPOSAL_DRAFT',
    'PROPOSAL_SUBMITTED',
    'PROPOSAL_REVISION',
    'PROPOSAL_APPROVED',
    'MENTOR_ASSIGNED',
    'PROJECT_ACTIVE',
    'PROGRESS_REVIEW',
    'FINAL_REPORT_SUBMITTED',
    'MENTOR_APPROVED',
    'ADMIN_APPROVED',
    'INTERNSHIP_COMPLETED'
);

-- 2. Internships table
CREATE TABLE IF NOT EXISTS public.internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Participants
    intern_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    -- State machine
    status public.internship_status NOT NULL DEFAULT 'SELECTED'::public.internship_status,

    -- Research area & topic
    primary_area TEXT,
    specific_topic TEXT,

    -- Proposal fields
    proposal_title TEXT,
    proposal_abstract TEXT,
    proposal_objectives TEXT,
    proposal_methodology TEXT,
    proposal_timeline TEXT,
    proposal_submitted_at TIMESTAMPTZ,
    proposal_revision_notes TEXT,
    proposal_approved_at TIMESTAMPTZ,

    -- Progress
    overall_progress_percent INTEGER NOT NULL DEFAULT 0
        CHECK (overall_progress_percent >= 0 AND overall_progress_percent <= 100),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_internships_intern_id ON public.internships(intern_id);
CREATE INDEX IF NOT EXISTS idx_internships_mentor_id ON public.internships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_internships_status ON public.internships(status);

-- 4. updated_at auto-update trigger function
CREATE OR REPLACE FUNCTION public.set_internship_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Function: validate internship status transition (forward-only, no skipping)
CREATE OR REPLACE FUNCTION public.validate_internship_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    ordered_states TEXT[] := ARRAY[
        'SELECTED',
        'PROFILE_PENDING',
        'PROFILE_COMPLETED',
        'AREA_SELECTED',
        'TOPIC_SELECTED',
        'PROPOSAL_DRAFT',
        'PROPOSAL_SUBMITTED',
        'PROPOSAL_REVISION',
        'PROPOSAL_APPROVED',
        'MENTOR_ASSIGNED',
        'PROJECT_ACTIVE',
        'PROGRESS_REVIEW',
        'FINAL_REPORT_SUBMITTED',
        'MENTOR_APPROVED',
        'ADMIN_APPROVED',
        'INTERNSHIP_COMPLETED'
    ];
    old_idx INTEGER;
    new_idx INTEGER;
BEGIN
    -- Allow same-state updates (no-op on status)
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    -- Find positions (1-based)
    old_idx := array_position(ordered_states, OLD.status::TEXT);
    new_idx := array_position(ordered_states, NEW.status::TEXT);

    -- Must move exactly one step forward
    IF new_idx IS NULL OR old_idx IS NULL THEN
        RAISE EXCEPTION 'Unknown internship status value';
    END IF;

    IF new_idx != old_idx + 1 THEN
        RAISE EXCEPTION
            'Invalid internship status transition: % → %. Only sequential forward transitions are allowed.',
            OLD.status, NEW.status;
    END IF;

    -- Auto-set completed_at when reaching INTERNSHIP_COMPLETED
    IF NEW.status = 'INTERNSHIP_COMPLETED' THEN
        NEW.completed_at = COALESCE(NEW.completed_at, CURRENT_TIMESTAMP);
    END IF;

    RETURN NEW;
END;
$$;

-- Function: check if current user is admin (reuse auth metadata pattern)
CREATE OR REPLACE FUNCTION public.is_internship_admin()
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

-- 5. Enable RLS
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Interns can read their own internship record
DROP POLICY IF EXISTS "intern_read_own_internship" ON public.internships;
CREATE POLICY "intern_read_own_internship"
ON public.internships
FOR SELECT
TO authenticated
USING (intern_id = auth.uid());

-- Interns can update their own internship record
DROP POLICY IF EXISTS "intern_update_own_internship" ON public.internships;
CREATE POLICY "intern_update_own_internship"
ON public.internships
FOR UPDATE
TO authenticated
USING (intern_id = auth.uid())
WITH CHECK (intern_id = auth.uid());

-- Mentors can read internships assigned to them
DROP POLICY IF EXISTS "mentor_read_assigned_internships" ON public.internships;
CREATE POLICY "mentor_read_assigned_internships"
ON public.internships
FOR SELECT
TO authenticated
USING (mentor_id = auth.uid());

-- Mentors can update internships assigned to them
DROP POLICY IF EXISTS "mentor_update_assigned_internships" ON public.internships;
CREATE POLICY "mentor_update_assigned_internships"
ON public.internships
FOR UPDATE
TO authenticated
USING (mentor_id = auth.uid())
WITH CHECK (mentor_id = auth.uid());

-- Admins have full access
DROP POLICY IF EXISTS "admin_full_access_internships" ON public.internships;
CREATE POLICY "admin_full_access_internships"
ON public.internships
FOR ALL
TO authenticated
USING (public.is_internship_admin())
WITH CHECK (public.is_internship_admin());

-- 7. Triggers
DROP TRIGGER IF EXISTS set_internship_updated_at ON public.internships;
CREATE TRIGGER set_internship_updated_at
    BEFORE UPDATE ON public.internships
    FOR EACH ROW
    EXECUTE FUNCTION public.set_internship_updated_at();

DROP TRIGGER IF EXISTS validate_internship_status_transition ON public.internships;
CREATE TRIGGER validate_internship_status_transition
    BEFORE UPDATE ON public.internships
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_internship_transition();
