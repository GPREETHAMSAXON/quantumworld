-- Apply after 20260908120000_project_proposal.sql. Never replay the original
-- portal_auth or internships migrations. Existing enum values are preserved.
ALTER TABLE public.internships
  ADD COLUMN proposal_review_stage TEXT CHECK (proposal_review_stage IN
    ('awaiting_mentor', 'revision_requested', 'awaiting_admin', 'approved')),
  ADD COLUMN proposal_recommended_at TIMESTAMPTZ,
  ADD COLUMN proposal_recommended_by UUID REFERENCES public.profiles(id);

UPDATE public.internships SET proposal_review_stage = CASE
  WHEN status = 'PROPOSAL_SUBMITTED' THEN 'awaiting_mentor'
  WHEN status = 'PROPOSAL_REVISION' THEN 'revision_requested'
  WHEN status >= 'PROPOSAL_APPROVED' THEN 'approved'
  ELSE NULL END;

CREATE POLICY "mentors_read_assigned_intern_profiles" ON public.profiles
FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.internships i WHERE i.intern_id = profiles.id AND i.mentor_id = auth.uid())
);

-- Runs before the existing validation triggers. Protects review metadata even
-- against direct table updates under the existing broad internship RLS policies.
CREATE FUNCTION public.enforce_proposal_review() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  actor_role TEXT;
  actor_active BOOLEAN;
  content_changed BOOLEAN;
  resubmitting BOOLEAN;
BEGIN
  SELECT role::text, status = 'active' INTO actor_role, actor_active
    FROM public.profiles WHERE id = auth.uid();

  IF (NEW.mentor_id IS DISTINCT FROM OLD.mentor_id OR NEW.intern_id IS DISTINCT FROM OLD.intern_id)
     AND auth.uid() IS NOT NULL AND NOT (COALESCE(actor_active, false) AND actor_role = 'admin') THEN
    RAISE EXCEPTION 'Only an active admin can change internship participants';
  END IF;

  content_changed := ROW(NEW.proposal_title, NEW.proposal_abstract, NEW.proposal_objectives,
    NEW.proposal_methodology, NEW.proposal_expected_outcome, NEW.proposal_document_path, NEW.proposal_document_name)
    IS DISTINCT FROM ROW(OLD.proposal_title, OLD.proposal_abstract, OLD.proposal_objectives,
    OLD.proposal_methodology, OLD.proposal_expected_outcome, OLD.proposal_document_path, OLD.proposal_document_name);
  resubmitting := NEW.proposal_submitted_at IS DISTINCT FROM OLD.proposal_submitted_at;

  IF content_changed OR resubmitting THEN
    IF auth.uid() IS DISTINCT FROM OLD.intern_id OR NOT COALESCE(actor_active, false)
       OR actor_role IS DISTINCT FROM 'intern' THEN
      RAISE EXCEPTION 'Only the intern can edit or submit their proposal';
    END IF;
    IF OLD.status NOT IN ('TOPIC_SELECTED', 'PROPOSAL_DRAFT') AND
       NOT (OLD.status = 'PROPOSAL_REVISION' AND OLD.proposal_review_stage = 'revision_requested') THEN
      RAISE EXCEPTION 'Proposal is locked while awaiting review';
    END IF;
  END IF;

  IF NEW.proposal_review_stage IS DISTINCT FROM OLD.proposal_review_stage
     OR NEW.proposal_revision_notes IS DISTINCT FROM OLD.proposal_revision_notes
     OR NEW.proposal_recommended_at IS DISTINCT FROM OLD.proposal_recommended_at
     OR NEW.proposal_recommended_by IS DISTINCT FROM OLD.proposal_recommended_by
     OR NEW.proposal_approved_at IS DISTINCT FROM OLD.proposal_approved_at
     OR (NEW.status IS DISTINCT FROM OLD.status AND NEW.status IN ('PROPOSAL_REVISION', 'PROPOSAL_APPROVED')) THEN
    IF NOT COALESCE(actor_active, false) THEN RAISE EXCEPTION 'Active reviewer account required'; END IF;
    IF NEW.proposal_review_stage IN ('revision_requested', 'awaiting_admin') AND
       OLD.proposal_review_stage = 'awaiting_mentor' AND
       OLD.status IN ('PROPOSAL_SUBMITTED', 'PROPOSAL_REVISION') THEN
      IF actor_role IS DISTINCT FROM 'mentor' OR auth.uid() IS DISTINCT FROM OLD.mentor_id THEN
        RAISE EXCEPTION 'Only the assigned mentor can review this proposal';
      END IF;
      IF content_changed OR resubmitting OR NEW.proposal_approved_at IS DISTINCT FROM OLD.proposal_approved_at THEN
        RAISE EXCEPTION 'Mentor review cannot change proposal content or approval';
      END IF;
      IF NEW.proposal_review_stage = 'revision_requested' THEN
        IF NULLIF(btrim(NEW.proposal_revision_notes), '') IS NULL THEN
          RAISE EXCEPTION 'Revision feedback is required';
        END IF;
        NEW.status := 'PROPOSAL_REVISION';
        NEW.proposal_recommended_at := NULL;
        NEW.proposal_recommended_by := NULL;
      ELSE
        NEW.status := OLD.status;
        NEW.proposal_revision_notes := OLD.proposal_revision_notes;
        NEW.proposal_recommended_at := CURRENT_TIMESTAMP;
        NEW.proposal_recommended_by := auth.uid();
      END IF;
    ELSIF NEW.status = 'PROPOSAL_APPROVED' AND OLD.proposal_review_stage = 'awaiting_admin'
          AND OLD.status IN ('PROPOSAL_SUBMITTED', 'PROPOSAL_REVISION') THEN
      IF actor_role IS DISTINCT FROM 'admin' THEN RAISE EXCEPTION 'Only an admin can approve proposals'; END IF;
      IF content_changed OR resubmitting
         OR NEW.proposal_revision_notes IS DISTINCT FROM OLD.proposal_revision_notes
         OR NEW.proposal_recommended_at IS DISTINCT FROM OLD.proposal_recommended_at
         OR NEW.proposal_recommended_by IS DISTINCT FROM OLD.proposal_recommended_by THEN
        RAISE EXCEPTION 'Approval cannot change the reviewed proposal';
      END IF;
      NEW.proposal_review_stage := 'approved';
      NEW.proposal_approved_at := CURRENT_TIMESTAMP;
    ELSE
      RAISE EXCEPTION 'Invalid proposal review action';
    END IF;
  END IF;

  IF NEW.status = 'PROPOSAL_SUBMITTED' AND OLD.status = 'PROPOSAL_DRAFT' THEN
    IF auth.uid() IS DISTINCT FROM OLD.intern_id OR actor_role IS DISTINCT FROM 'intern'
       OR NOT COALESCE(actor_active, false) THEN RAISE EXCEPTION 'Only the intern can submit'; END IF;
    NEW.proposal_review_stage := 'awaiting_mentor';
    NEW.proposal_submitted_at := CURRENT_TIMESTAMP;
  ELSIF resubmitting AND OLD.status = 'PROPOSAL_REVISION' THEN
    NEW.proposal_review_stage := 'awaiting_mentor';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_proposal_review BEFORE UPDATE ON public.internships
FOR EACH ROW EXECUTE FUNCTION public.enforce_proposal_review();

-- One additional edge: a recommended first submission does not need a fake
-- revision before admin approval. All other existing transitions are unchanged.
CREATE OR REPLACE FUNCTION public.validate_internship_transition() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
DECLARE
  ordered_states TEXT[] := ARRAY['SELECTED', 'PROFILE_PENDING', 'PROFILE_COMPLETED',
    'AREA_SELECTED', 'TOPIC_SELECTED', 'PROPOSAL_DRAFT', 'PROPOSAL_SUBMITTED',
    'PROPOSAL_REVISION', 'PROPOSAL_APPROVED', 'MENTOR_ASSIGNED', 'PROJECT_ACTIVE',
    'PROGRESS_REVIEW', 'FINAL_REPORT_SUBMITTED', 'MENTOR_APPROVED', 'ADMIN_APPROVED', 'INTERNSHIP_COMPLETED'];
  old_idx INTEGER;
  new_idx INTEGER;
BEGIN
  IF OLD.status = NEW.status THEN RETURN NEW; END IF;
  IF OLD.status = 'PROPOSAL_SUBMITTED' AND NEW.status = 'PROPOSAL_APPROVED'
     AND OLD.proposal_review_stage = 'awaiting_admin' AND NEW.proposal_review_stage = 'approved' THEN
    RETURN NEW;
  END IF;
  old_idx := array_position(ordered_states, OLD.status::text);
  new_idx := array_position(ordered_states, NEW.status::text);
  IF old_idx IS NULL OR new_idx IS NULL OR new_idx != old_idx + 1 THEN
    RAISE EXCEPTION 'Invalid internship status transition: % -> %', OLD.status, NEW.status;
  END IF;
  IF NEW.status = 'INTERNSHIP_COMPLETED' THEN
    NEW.completed_at := COALESCE(NEW.completed_at, CURRENT_TIMESTAMP);
  END IF;
  RETURN NEW;
END;
$$;

-- Invoker rights retain RLS. Row lock and version check prevent reviewing a
-- changed draft or double-clicking a stale decision. Also provides the admin
-- handoff: p_decision = 'approve' is reserved for active admins by the trigger.
CREATE FUNCTION public.review_project_proposal(
  p_internship_id UUID, p_expected_updated_at TIMESTAMPTZ, p_decision TEXT, p_feedback TEXT DEFAULT ''
) RETURNS public.internships LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE current_row public.internships;
BEGIN
  SELECT * INTO current_row FROM public.internships WHERE id = p_internship_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Proposal not found or access denied'; END IF;
  IF current_row.updated_at IS DISTINCT FROM p_expected_updated_at THEN
    RAISE EXCEPTION 'Proposal changed since you opened it. Refresh before reviewing.';
  END IF;
  IF p_decision IN ('request_revision', 'recommend') AND
     (current_row.proposal_review_stage IS DISTINCT FROM 'awaiting_mentor'
      OR current_row.status NOT IN ('PROPOSAL_SUBMITTED', 'PROPOSAL_REVISION')) THEN
    RAISE EXCEPTION 'This proposal is not waiting for mentor review';
  END IF;
  IF p_decision = 'approve' AND current_row.proposal_review_stage IS DISTINCT FROM 'awaiting_admin' THEN
    RAISE EXCEPTION 'A mentor recommendation is required before approval';
  END IF;
  IF p_decision = 'request_revision' THEN
    IF NULLIF(btrim(p_feedback), '') IS NULL THEN RAISE EXCEPTION 'Revision feedback is required'; END IF;
    UPDATE public.internships SET proposal_review_stage = 'revision_requested',
      proposal_revision_notes = btrim(p_feedback), status = 'PROPOSAL_REVISION'
      WHERE id = p_internship_id RETURNING * INTO current_row;
  ELSIF p_decision = 'recommend' THEN
    UPDATE public.internships SET proposal_review_stage = 'awaiting_admin'
      WHERE id = p_internship_id RETURNING * INTO current_row;
  ELSIF p_decision = 'approve' THEN
    UPDATE public.internships SET status = 'PROPOSAL_APPROVED', proposal_review_stage = 'approved'
      WHERE id = p_internship_id RETURNING * INTO current_row;
  ELSE RAISE EXCEPTION 'Unknown review decision';
  END IF;
  RETURN current_row;
END;
$$;
REVOKE ALL ON FUNCTION public.review_project_proposal(UUID, TIMESTAMPTZ, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.review_project_proposal(UUID, TIMESTAMPTZ, TEXT, TEXT) TO authenticated;
