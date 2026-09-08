import { createClient } from '@/lib/supabase/client';
import { transitionInternshipTo, type InternshipRecord } from './stateMachine';

export const PROPOSAL_FIELDS = [
  ['proposal_title', 'Project Title'],
  ['proposal_abstract', 'Problem Statement'],
  ['proposal_objectives', 'Objectives'],
  ['proposal_methodology', 'Methodology'],
  ['proposal_expected_outcome', 'Expected Outcome'],
] as const;
export type ProposalFields = Record<(typeof PROPOSAL_FIELDS)[number][0], string>;
export const PROPOSAL_BUCKET = 'proposal-documents';
const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function validateProposalFile(file: File): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!MIME_TYPES[extension] || (file.type && file.type !== MIME_TYPES[extension]))
    return 'Choose a PDF or DOCX file.';
  if (!file.size || file.size > 10 * 1024 * 1024) return 'Choose a non-empty file up to 10 MB.';
  return null;
}

export async function getProposal(userId: string): Promise<InternshipRecord | null> {
  const { data, error } = await createClient()
    .from('internships')
    .select('*')
    .eq('intern_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as InternshipRecord | null;
}

export async function saveProposal(
  record: InternshipRecord,
  fields: ProposalFields,
  file: File | null,
  submit: boolean
): Promise<InternshipRecord> {
  if (!['TOPIC_SELECTED', 'PROPOSAL_DRAFT', 'PROPOSAL_REVISION'].includes(record.status))
    throw new Error('This proposal is no longer editable. Reload to see its current status.');
  if (submit && PROPOSAL_FIELDS.some(([key]) => !fields[key].trim()))
    throw new Error('Complete all five proposal fields before submitting.');
  if (submit && !file && !record.proposal_document_path)
    throw new Error('Upload your completed proposal before submitting.');
  if (file) {
    const error = validateProposalFile(file);
    if (error) throw new Error(error);
  }
  const supabase = createClient();
  const payload: Partial<InternshipRecord> = {};
  for (const [key] of PROPOSAL_FIELDS) payload[key] = fields[key].trim() || null;
  let uploadedPath: string | null = null;
  let persisted = false;
  try {
    if (file) {
      const extension = file.name.split('.').pop()!.toLowerCase();
      uploadedPath = `${record.intern_id}/${record.id}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage
        .from(PROPOSAL_BUCKET)
        .upload(uploadedPath, file, { contentType: MIME_TYPES[extension], upsert: false });
      if (error) throw new Error(error.message);
      payload.proposal_document_path = uploadedPath;
      payload.proposal_document_name = file.name;
    }
    let current = record;
    if (current.status === 'TOPIC_SELECTED') {
      const result = await transitionInternshipTo(current.id, 'PROPOSAL_DRAFT', payload);
      if (!result.success || !result.data) throw new Error(result.error || 'Could not save draft.');
      current = result.data;
      persisted = true;
    }
    if (submit) payload.proposal_submitted_at = new Date().toISOString();
    if (submit && current.status === 'PROPOSAL_DRAFT') {
      const result = await transitionInternshipTo(current.id, 'PROPOSAL_SUBMITTED', payload);
      if (!result.success || !result.data)
        throw new Error(result.error || 'Draft saved, but submission failed. Please retry.');
      persisted = true;
      return result.data;
    }
    // Revised submissions stay in REVISION: the existing state machine is forward-only.
    const { data, error } = await supabase
      .from('internships')
      .update(payload)
      .eq('id', current.id)
      .eq('status', current.status)
      .select()
      .single();
    if (error) throw new Error(error.message);
    persisted = true;
    return data as InternshipRecord;
  } finally {
    if (uploadedPath && !persisted)
      await supabase.storage.from(PROPOSAL_BUCKET).remove([uploadedPath]);
  }
}
