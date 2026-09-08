-- Additive mentor-assignment presentation data. Do not replay original portal
-- auth or internship migrations, which contain destructive type replacement.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS mentor_research_area TEXT;

ALTER TABLE public.internships
  ADD COLUMN IF NOT EXISTS mentor_message TEXT;

CREATE FUNCTION public.validate_mentor_message() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.mentor_message IS DISTINCT FROM OLD.mentor_message AND NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND status = 'active'
      AND (role = 'admin' OR (role = 'mentor' AND id = OLD.mentor_id))
  ) THEN
    RAISE EXCEPTION 'Only the assigned mentor or an active admin can update the mentor message';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_mentor_message BEFORE UPDATE ON public.internships
FOR EACH ROW EXECUTE FUNCTION public.validate_mentor_message();

-- An intern needs the assigned mentor's profile fields to render Module 6.
CREATE POLICY "intern_read_assigned_mentor_profile" ON public.profiles
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.internships i
  WHERE i.intern_id = auth.uid() AND i.mentor_id = profiles.id
));
