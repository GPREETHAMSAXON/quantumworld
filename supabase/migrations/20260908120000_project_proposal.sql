-- Additive only. Do not rerun the original auth or internships migrations.
ALTER TABLE public.internships
    ADD COLUMN IF NOT EXISTS proposal_expected_outcome TEXT,
    ADD COLUMN IF NOT EXISTS proposal_document_path TEXT,
    ADD COLUMN IF NOT EXISTS proposal_document_name TEXT;

-- Validate proposal writes independently of the existing transition trigger.
CREATE FUNCTION public.validate_project_proposal() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
    IF ROW(NEW.proposal_title, NEW.proposal_abstract, NEW.proposal_objectives,
           NEW.proposal_methodology, NEW.proposal_expected_outcome, NEW.proposal_document_path,
           NEW.proposal_document_name, NEW.proposal_submitted_at)
       IS DISTINCT FROM
       ROW(OLD.proposal_title, OLD.proposal_abstract, OLD.proposal_objectives,
           OLD.proposal_methodology, OLD.proposal_expected_outcome, OLD.proposal_document_path,
           OLD.proposal_document_name, OLD.proposal_submitted_at)
       AND OLD.status NOT IN ('TOPIC_SELECTED', 'PROPOSAL_DRAFT', 'PROPOSAL_REVISION') THEN
        RAISE EXCEPTION 'Proposal is not editable at this stage';
    END IF;

    IF (NEW.status = 'PROPOSAL_SUBMITTED' AND OLD.status = 'PROPOSAL_DRAFT')
       OR (NEW.status = 'PROPOSAL_REVISION' AND NEW.proposal_submitted_at IS DISTINCT FROM OLD.proposal_submitted_at) THEN
        IF NULLIF(btrim(NEW.proposal_title), '') IS NULL
           OR NULLIF(btrim(NEW.proposal_abstract), '') IS NULL
           OR NULLIF(btrim(NEW.proposal_objectives), '') IS NULL
           OR NULLIF(btrim(NEW.proposal_methodology), '') IS NULL
           OR NULLIF(btrim(NEW.proposal_expected_outcome), '') IS NULL
           OR NEW.proposal_document_path IS NULL THEN
            RAISE EXCEPTION 'Complete all proposal fields and upload a document before submitting';
        END IF;
        NEW.proposal_submitted_at = CURRENT_TIMESTAMP;
    END IF;

    IF NEW.proposal_document_path IS NOT NULL AND
       (NEW.proposal_document_path IS DISTINCT FROM OLD.proposal_document_path
        OR NEW.proposal_submitted_at IS DISTINCT FROM OLD.proposal_submitted_at) THEN
        IF split_part(NEW.proposal_document_path, '/', 1) != NEW.intern_id::text
           OR split_part(NEW.proposal_document_path, '/', 2) != NEW.id::text
           OR NOT EXISTS (SELECT 1 FROM storage.objects
               WHERE bucket_id = 'proposal-documents' AND name = NEW.proposal_document_path) THEN
            RAISE EXCEPTION 'Proposal document must be an uploaded file belonging to this internship';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER validate_project_proposal BEFORE UPDATE ON public.internships
FOR EACH ROW EXECUTE FUNCTION public.validate_project_proposal();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('proposal-documents', 'proposal-documents', false, 10485760,
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "proposal_documents_owner_insert" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'proposal-documents' AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (SELECT 1 FROM public.internships i
        WHERE i.id::text = (storage.foldername(name))[2] AND i.intern_id = auth.uid()
        AND i.status IN ('TOPIC_SELECTED', 'PROPOSAL_DRAFT', 'PROPOSAL_REVISION')));

CREATE POLICY "proposal_documents_read" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'proposal-documents' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_portal_admin()
    OR EXISTS (SELECT 1 FROM public.internships i
        WHERE i.id::text = (storage.foldername(name))[2] AND i.mentor_id = auth.uid())
));

-- Only abandoned uploads can be removed; saved submissions remain intact.
CREATE POLICY "proposal_documents_cleanup" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'proposal-documents' AND (storage.foldername(name))[1] = auth.uid()::text
    AND NOT EXISTS (SELECT 1 FROM public.internships i WHERE i.proposal_document_path = name));
