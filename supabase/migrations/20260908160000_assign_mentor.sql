-- Additive guard; preserves the existing enum and proposal review workflow.
CREATE FUNCTION public.validate_mentor_assignment() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  capacity INTEGER;
  assigned_count INTEGER;
BEGIN
  IF NEW.status = 'MENTOR_ASSIGNED' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF OLD.status != 'PROPOSAL_APPROVED' THEN
      RAISE EXCEPTION 'Proposal approval is required before mentor assignment';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin' AND status = 'active') THEN
      RAISE EXCEPTION 'Only an active admin can assign a mentor';
    END IF;
    -- Serialize assignments to this mentor before checking their live capacity.
    SELECT mentor_capacity INTO capacity FROM public.profiles
      WHERE id = NEW.mentor_id AND role = 'mentor' AND status = 'active' FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Choose an active mentor'; END IF;
    SELECT count(*) INTO assigned_count FROM public.internships
      WHERE mentor_id = NEW.mentor_id AND id != NEW.id AND status IN
        ('MENTOR_ASSIGNED', 'PROJECT_ACTIVE', 'PROGRESS_REVIEW',
         'FINAL_REPORT_SUBMITTED', 'MENTOR_APPROVED', 'ADMIN_APPROVED');
    IF assigned_count >= capacity THEN RAISE EXCEPTION 'This mentor has reached capacity'; END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_mentor_assignment BEFORE UPDATE ON public.internships
FOR EACH ROW EXECUTE FUNCTION public.validate_mentor_assignment();
