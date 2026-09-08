-- Additive Module 7 schema. Do not replay the original auth or internships
-- migrations, which contain destructive type replacement.
ALTER TABLE public.internships
  ADD COLUMN IF NOT EXISTS project_started_at DATE,
  ADD COLUMN IF NOT EXISTS project_expected_completion_date DATE;

CREATE TABLE public.internship_project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  milestone_key TEXT NOT NULL,
  label TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (internship_id, milestone_key)
);

CREATE TABLE public.internship_progress_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  intern_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_task TEXT NOT NULL,
  task_status TEXT NOT NULL CHECK (task_status IN ('NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'DONE')),
  expected_completion_date DATE,
  intern_update TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.internship_progress_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  progress_update_id UUID NOT NULL REFERENCES public.internship_progress_updates(id) ON DELETE CASCADE,
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('RESEARCH_PAPER', 'CODE', 'DATASET', 'RESULTS', 'SCREENSHOTS')),
  storage_path TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_milestones_internship ON public.internship_project_milestones(internship_id, position);
CREATE INDEX idx_progress_updates_internship ON public.internship_progress_updates(internship_id, created_at DESC);
CREATE INDEX idx_progress_evidence_update ON public.internship_progress_evidence(progress_update_id);

CREATE FUNCTION public.set_project_execution_dates() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'MENTOR_ASSIGNED' THEN
    NEW.project_started_at := COALESCE(NEW.project_started_at, CURRENT_DATE);
    NEW.project_expected_completion_date := COALESCE(NEW.project_expected_completion_date, NEW.project_started_at + 90);
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.seed_project_milestones(p_internship_id UUID) RETURNS VOID
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.internship_project_milestones (internship_id, milestone_key, label, position)
  VALUES
    (p_internship_id, 'literature_review', 'Literature Review', 1),
    (p_internship_id, 'problem_definition', 'Problem Definition', 2),
    (p_internship_id, 'dataset_collection', 'Dataset Collection', 3),
    (p_internship_id, 'model_development', 'Model Development', 4),
    (p_internship_id, 'testing', 'Testing', 5),
    (p_internship_id, 'documentation', 'Documentation', 6),
    (p_internship_id, 'final_presentation', 'Final Presentation', 7)
  ON CONFLICT (internship_id, milestone_key) DO NOTHING;
$$;

CREATE FUNCTION public.seed_project_milestones_on_assignment() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'MENTOR_ASSIGNED' THEN
    PERFORM public.seed_project_milestones(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.recalculate_internship_progress() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  target_internship UUID := COALESCE(NEW.internship_id, OLD.internship_id);
  calculated_progress INTEGER;
BEGIN
  SELECT COALESCE(ROUND(AVG(progress_percent)), 0)::INTEGER INTO calculated_progress
  FROM public.internship_project_milestones WHERE internship_id = target_internship;
  PERFORM set_config('app.project_progress_sync', 'true', true);
  UPDATE public.internships SET overall_progress_percent = calculated_progress WHERE id = target_internship;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE FUNCTION public.validate_project_overall_progress() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.overall_progress_percent IS DISTINCT FROM OLD.overall_progress_percent
     AND current_setting('app.project_progress_sync', true) IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION 'Overall project progress is calculated from milestones';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_project_execution_dates BEFORE UPDATE ON public.internships
FOR EACH ROW EXECUTE FUNCTION public.set_project_execution_dates();
CREATE TRIGGER seed_project_milestones_on_assignment AFTER UPDATE ON public.internships
FOR EACH ROW EXECUTE FUNCTION public.seed_project_milestones_on_assignment();
CREATE TRIGGER validate_project_overall_progress BEFORE UPDATE ON public.internships
FOR EACH ROW EXECUTE FUNCTION public.validate_project_overall_progress();
CREATE TRIGGER recalculate_internship_progress AFTER INSERT OR UPDATE OR DELETE ON public.internship_project_milestones
FOR EACH ROW EXECUTE FUNCTION public.recalculate_internship_progress();

ALTER TABLE public.internship_project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_progress_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "intern_read_own_project_milestones" ON public.internship_project_milestones FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.internships i WHERE i.id = internship_id AND i.intern_id = auth.uid()));
CREATE POLICY "mentor_read_assigned_project_milestones" ON public.internship_project_milestones FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.internships i WHERE i.id = internship_id AND i.mentor_id = auth.uid()));
CREATE POLICY "admin_all_project_milestones" ON public.internship_project_milestones FOR ALL TO authenticated
USING (public.is_portal_admin()) WITH CHECK (public.is_portal_admin());
CREATE POLICY "intern_update_own_active_project_milestones" ON public.internship_project_milestones FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.internships i WHERE i.id = internship_id AND i.intern_id = auth.uid() AND i.status IN ('MENTOR_ASSIGNED', 'PROJECT_ACTIVE')))
WITH CHECK (EXISTS (SELECT 1 FROM public.internships i WHERE i.id = internship_id AND i.intern_id = auth.uid() AND i.status IN ('MENTOR_ASSIGNED', 'PROJECT_ACTIVE')));

CREATE POLICY "intern_read_own_progress_updates" ON public.internship_progress_updates FOR SELECT TO authenticated
USING (intern_id = auth.uid());
CREATE POLICY "mentor_read_assigned_progress_updates" ON public.internship_progress_updates FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.internships i WHERE i.id = internship_id AND i.mentor_id = auth.uid()));
CREATE POLICY "admin_all_progress_updates" ON public.internship_progress_updates FOR ALL TO authenticated
USING (public.is_portal_admin()) WITH CHECK (public.is_portal_admin());
CREATE POLICY "intern_create_own_active_progress_updates" ON public.internship_progress_updates FOR INSERT TO authenticated
WITH CHECK (intern_id = auth.uid() AND EXISTS (SELECT 1 FROM public.internships i WHERE i.id = internship_id AND i.intern_id = auth.uid() AND i.status IN ('MENTOR_ASSIGNED', 'PROJECT_ACTIVE')));
CREATE POLICY "intern_delete_own_progress_updates" ON public.internship_progress_updates FOR DELETE TO authenticated
USING (intern_id = auth.uid());

CREATE POLICY "intern_read_own_progress_evidence" ON public.internship_progress_evidence FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.internships i WHERE i.id = internship_id AND i.intern_id = auth.uid()));
CREATE POLICY "mentor_read_assigned_progress_evidence" ON public.internship_progress_evidence FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.internships i WHERE i.id = internship_id AND i.mentor_id = auth.uid()));
CREATE POLICY "admin_all_progress_evidence" ON public.internship_progress_evidence FOR ALL TO authenticated
USING (public.is_portal_admin()) WITH CHECK (public.is_portal_admin());
CREATE POLICY "intern_create_own_progress_evidence" ON public.internship_progress_evidence FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.internships i JOIN public.internship_progress_updates u ON u.internship_id = i.id WHERE i.id = internship_id AND u.id = progress_update_id AND i.intern_id = auth.uid() AND u.intern_id = auth.uid()));

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('project-evidence', 'project-evidence', false, 20971520)
ON CONFLICT (id) DO NOTHING;
CREATE POLICY "project_evidence_owner_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'project-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "project_evidence_assigned_read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'project-evidence' AND EXISTS (SELECT 1 FROM public.internships i WHERE i.id::text = (storage.foldername(name))[2] AND (i.intern_id = auth.uid() OR i.mentor_id = auth.uid() OR public.is_portal_admin())));
CREATE POLICY "project_evidence_owner_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'project-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);

UPDATE public.internships SET
  project_started_at = COALESCE(project_started_at, updated_at::date),
  project_expected_completion_date = COALESCE(project_expected_completion_date, updated_at::date + 90)
WHERE status IN ('MENTOR_ASSIGNED', 'PROJECT_ACTIVE', 'PROGRESS_REVIEW', 'FINAL_REPORT_SUBMITTED', 'MENTOR_APPROVED', 'ADMIN_APPROVED');
SELECT public.seed_project_milestones(id) FROM public.internships
WHERE status IN ('MENTOR_ASSIGNED', 'PROJECT_ACTIVE', 'PROGRESS_REVIEW', 'FINAL_REPORT_SUBMITTED', 'MENTOR_APPROVED', 'ADMIN_APPROVED');

REVOKE ALL ON FUNCTION public.seed_project_milestones(UUID) FROM PUBLIC;
