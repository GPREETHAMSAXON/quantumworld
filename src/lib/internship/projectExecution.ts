import { createClient } from '@/lib/supabase/client';
import type { InternshipRecord, InternshipStatus } from './stateMachine';

export const EVIDENCE_CATEGORIES = [
  'RESEARCH_PAPER',
  'CODE',
  'DATASET',
  'RESULTS',
  'SCREENSHOTS',
] as const;
export type EvidenceCategory = (typeof EVIDENCE_CATEGORIES)[number];
export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE';
export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'DONE', label: 'Done' },
];
export const EVIDENCE_LABELS: Record<EvidenceCategory, string> = {
  RESEARCH_PAPER: 'Research Paper',
  CODE: 'Code',
  DATASET: 'Dataset',
  RESULTS: 'Results',
  SCREENSHOTS: 'Screenshots',
};
export const PROJECT_EVIDENCE_BUCKET = 'project-evidence';

export interface ProjectMilestone {
  id: string;
  milestone_key: string;
  label: string;
  position: number;
  progress_percent: number;
}
export interface ProgressUpdate {
  id: string;
  current_task: string;
  task_status: TaskStatus;
  expected_completion_date: string | null;
  intern_update: string | null;
  created_at: string;
}
export interface ProjectExecutionState {
  internship: InternshipRecord | null;
  mentor: { full_name: string; email: string } | null;
  milestones: ProjectMilestone[];
  latestUpdate: ProgressUpdate | null;
}
export interface ProgressUpdateInput {
  currentTask: string;
  taskStatus: TaskStatus;
  expectedCompletionDate: string;
  internUpdate: string;
  category: EvidenceCategory;
  files: File[];
}

export function canWorkOnProject(status: InternshipStatus): boolean {
  return status === 'MENTOR_ASSIGNED' || status === 'PROJECT_ACTIVE';
}
export function calculateMilestoneProgress(
  milestones: Pick<ProjectMilestone, 'progress_percent'>[]
): number {
  return milestones.length
    ? Math.round(
        milestones.reduce((sum, milestone) => sum + milestone.progress_percent, 0) /
          milestones.length
      )
    : 0;
}

export function validateEvidenceFiles(files: File[]): string | null {
  if (files.length > 10) return 'Upload up to 10 evidence files at a time.';
  if (files.some((file) => !file.size || file.size > 20 * 1024 * 1024))
    return 'Each evidence file must be non-empty and no larger than 20 MB.';
  return null;
}

export async function getProjectExecution(userId: string): Promise<ProjectExecutionState> {
  const supabase = createClient();
  const { data: internship, error: internshipError } = await supabase
    .from('internships')
    .select('*, mentor:profiles!internships_mentor_id_fkey(full_name, email)')
    .eq('intern_id', userId)
    .maybeSingle();
  if (internshipError) throw new Error(internshipError.message);
  if (!internship) return { internship: null, mentor: null, milestones: [], latestUpdate: null };
  const [milestones, updates] = await Promise.all([
    supabase
      .from('internship_project_milestones')
      .select('id, milestone_key, label, position, progress_percent')
      .eq('internship_id', internship.id)
      .order('position'),
    supabase
      .from('internship_progress_updates')
      .select('id, current_task, task_status, expected_completion_date, intern_update, created_at')
      .eq('internship_id', internship.id)
      .order('created_at', { ascending: false })
      .limit(1),
  ]);
  if (milestones.error) throw new Error(milestones.error.message);
  if (updates.error) throw new Error(updates.error.message);
  return {
    internship: internship as InternshipRecord,
    mentor: internship.mentor as { full_name: string; email: string } | null,
    milestones: (milestones.data ?? []) as ProjectMilestone[],
    latestUpdate: (updates.data?.[0] ?? null) as ProgressUpdate | null,
  };
}

export async function saveMilestoneProgress(
  internship: InternshipRecord,
  milestoneId: string,
  progress: number
): Promise<void> {
  if (!canWorkOnProject(internship.status))
    throw new Error('Project milestones are not editable at this stage.');
  if (!Number.isInteger(progress) || progress < 0 || progress > 100)
    throw new Error('Milestone progress must be between 0 and 100.');
  const { error } = await createClient()
    .from('internship_project_milestones')
    .update({ progress_percent: progress })
    .eq('id', milestoneId)
    .eq('internship_id', internship.id);
  if (error) throw new Error(error.message);
}

export async function submitProgressUpdate(
  internship: InternshipRecord,
  input: ProgressUpdateInput
): Promise<ProgressUpdate> {
  if (!canWorkOnProject(internship.status))
    throw new Error('Progress updates are not available at this stage.');
  if (!input.currentTask.trim())
    throw new Error('Enter the current task before submitting an update.');
  const fileError = validateEvidenceFiles(input.files);
  if (fileError) throw new Error(fileError);
  const supabase = createClient();
  const { data: update, error: updateError } = await supabase
    .from('internship_progress_updates')
    .insert({
      internship_id: internship.id,
      intern_id: internship.intern_id,
      current_task: input.currentTask.trim(),
      task_status: input.taskStatus,
      expected_completion_date: input.expectedCompletionDate || null,
      intern_update: input.internUpdate.trim() || null,
    })
    .select()
    .single();
  if (updateError || !update)
    throw new Error(updateError?.message || 'Could not create the progress update.');
  const uploadedPaths: string[] = [];
  try {
    for (const file of input.files) {
      const extension = file.name.includes('.') ? `.${file.name.split('.').pop()}` : '';
      const path = `${internship.intern_id}/${internship.id}/${update.id}/${crypto.randomUUID()}${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(PROJECT_EVIDENCE_BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (uploadError) throw new Error(uploadError.message);
      uploadedPaths.push(path);
      const { error: evidenceError } = await supabase.from('internship_progress_evidence').insert({
        progress_update_id: update.id,
        internship_id: internship.id,
        category: input.category,
        storage_path: path,
        file_name: file.name,
      });
      if (evidenceError) throw new Error(evidenceError.message);
    }
    return update as ProgressUpdate;
  } catch (err) {
    if (uploadedPaths.length)
      await supabase.storage.from(PROJECT_EVIDENCE_BUCKET).remove(uploadedPaths);
    await supabase.from('internship_progress_updates').delete().eq('id', update.id);
    throw err;
  }
}
