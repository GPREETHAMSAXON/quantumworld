/**
 * Internship State Machine Service
 *
 * Enforces forward-only, sequential status transitions for the internships table.
 * Use `advanceInternshipStatus` (or the typed helpers below) instead of writing
 * raw status updates anywhere in the codebase.
 */

import { createClient } from '@/lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export const INTERNSHIP_STATES = [
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
  'INTERNSHIP_COMPLETED',
] as const;

export type InternshipStatus = (typeof INTERNSHIP_STATES)[number];

export interface InternshipRecord {
  id: string;
  intern_id: string;
  mentor_id: string | null;
  status: InternshipStatus;
  primary_area: string | null;
  specific_topic: string | null;
  research_objective: string | null;
  proposal_title: string | null;
  proposal_abstract: string | null;
  proposal_objectives: string | null;
  proposal_methodology: string | null;
  proposal_timeline: string | null;
  proposal_submitted_at: string | null;
  proposal_revision_notes: string | null;
  proposal_approved_at: string | null;
  overall_progress_percent: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface TransitionResult {
  success: boolean;
  data?: InternshipRecord;
  error?: string;
}

// ─── State Machine Helpers ────────────────────────────────────────────────────

/**
 * Returns the 0-based index of a status in the ordered state list.
 */
export function getStatusIndex(status: InternshipStatus): number {
  return INTERNSHIP_STATES.indexOf(status);
}

/**
 * Returns the next valid status after the given one, or null if already at the end.
 */
export function getNextStatus(current: InternshipStatus): InternshipStatus | null {
  const idx = getStatusIndex(current);
  if (idx === -1 || idx >= INTERNSHIP_STATES.length - 1) return null;
  return INTERNSHIP_STATES[idx + 1];
}

/**
 * Returns true if transitioning from `from` to `to` is a valid single-step forward move.
 */
export function isValidTransition(from: InternshipStatus, to: InternshipStatus): boolean {
  return getStatusIndex(to) === getStatusIndex(from) + 1;
}

/**
 * Returns true if the internship has reached its terminal state.
 */
export function isCompleted(status: InternshipStatus): boolean {
  return status === 'INTERNSHIP_COMPLETED';
}

/**
 * Returns a human-readable label for a status value.
 */
export function getStatusLabel(status: InternshipStatus): string {
  return status
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Returns progress percentage (0–100) based on position in the state machine.
 */
export function getStatusProgress(status: InternshipStatus): number {
  const idx = getStatusIndex(status);
  return Math.round((idx / (INTERNSHIP_STATES.length - 1)) * 100);
}

// ─── Supabase Transition Service ──────────────────────────────────────────────

/**
 * Advances an internship to the next sequential status.
 *
 * This is the ONLY function that should be used to update internship status.
 * It validates the transition client-side before hitting the DB, and the DB
 * trigger `validate_internship_status_transition` provides a second layer of
 * enforcement.
 *
 * @param internshipId - UUID of the internship row
 * @param extraFields  - Optional additional fields to update alongside the status
 */
export async function advanceInternshipStatus(
  internshipId: string,
  extraFields?: Partial<Omit<InternshipRecord, 'id' | 'intern_id' | 'status' | 'created_at' | 'updated_at'>>
): Promise<TransitionResult> {
  const supabase = createClient();

  // 1. Fetch current status
  const { data: current, error: fetchError } = await supabase
    .from('internships')
    .select('id, status')
    .eq('id', internshipId)
    .single();

  if (fetchError || !current) {
    return { success: false, error: fetchError?.message ?? 'Internship not found' };
  }

  const currentStatus = current.status as InternshipStatus;

  // 2. Determine next state
  const nextStatus = getNextStatus(currentStatus);
  if (!nextStatus) {
    return {
      success: false,
      error: `Internship is already in its final state: ${currentStatus}`,
    };
  }

  // 3. Client-side guard (DB trigger is the authoritative check)
  if (!isValidTransition(currentStatus, nextStatus)) {
    return {
      success: false,
      error: `Invalid transition: ${currentStatus} → ${nextStatus}`,
    };
  }

  // 4. Perform update
  const updatePayload: Record<string, unknown> = {
    status: nextStatus,
    ...extraFields,
  };

  const { data, error: updateError } = await supabase
    .from('internships')
    .update(updatePayload)
    .eq('id', internshipId)
    .select()
    .single();

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, data: data as InternshipRecord };
}

/**
 * Transitions an internship to a specific target status, validating it is
 * exactly one step forward from the current status.
 *
 * Use this when the caller already knows the intended next state explicitly.
 */
export async function transitionInternshipTo(
  internshipId: string,
  targetStatus: InternshipStatus,
  extraFields?: Partial<Omit<InternshipRecord, 'id' | 'intern_id' | 'status' | 'created_at' | 'updated_at'>>
): Promise<TransitionResult> {
  const supabase = createClient();

  // 1. Fetch current status
  const { data: current, error: fetchError } = await supabase
    .from('internships')
    .select('id, status')
    .eq('id', internshipId)
    .single();

  if (fetchError || !current) {
    return { success: false, error: fetchError?.message ?? 'Internship not found' };
  }

  const currentStatus = current.status as InternshipStatus;

  // 2. Validate transition
  if (!isValidTransition(currentStatus, targetStatus)) {
    return {
      success: false,
      error: `Invalid transition: ${currentStatus} → ${targetStatus}. Only single-step forward transitions are allowed.`,
    };
  }

  // 3. Perform update
  const updatePayload: Record<string, unknown> = {
    status: targetStatus,
    ...extraFields,
  };

  const { data, error: updateError } = await supabase
    .from('internships')
    .update(updatePayload)
    .eq('id', internshipId)
    .select()
    .single();

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, data: data as InternshipRecord };
}

/**
 * Fetches a single internship record by ID.
 */
export async function getInternship(internshipId: string): Promise<InternshipRecord | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('internships')
    .select('*')
    .eq('id', internshipId)
    .single();

  if (error || !data) return null;
  return data as InternshipRecord;
}

/**
 * Creates a new internship record in the SELECTED state for an intern.
 */
export async function createInternship(
  internId: string,
  extraFields?: Partial<Omit<InternshipRecord, 'id' | 'intern_id' | 'status' | 'created_at' | 'updated_at'>>
): Promise<TransitionResult> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('internships')
    .insert({
      intern_id: internId,
      status: 'SELECTED' as InternshipStatus,
      overall_progress_percent: 0,
      ...extraFields,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as InternshipRecord };
}
