import { createClient } from '@/lib/supabase/client';
import { transitionInternshipTo, type InternshipStatus } from './stateMachine';

export interface ResearchAreaState {
  internshipId: string | null;
  status: InternshipStatus | null;
  primaryArea: string | null;
  error: string | null;
}

/**
 * Fetches the current intern's internship row (just the fields the research
 * area selector needs). Mirrors the fetch pattern in internDashboard.ts.
 */
export async function getResearchAreaState(userId: string): Promise<ResearchAreaState> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('internships')
    .select('id, status, primary_area')
    .eq('intern_id', userId)
    .maybeSingle();

  if (error) {
    return { internshipId: null, status: null, primaryArea: null, error: error.message };
  }
  if (!data) {
    return { internshipId: null, status: null, primaryArea: null, error: null };
  }

  return {
    internshipId: data.id,
    status: data.status as InternshipStatus,
    primaryArea: data.primary_area,
    error: null,
  };
}

/**
 * Saves the intern's chosen primary research area.
 *
 * - If the internship is still at PROFILE_COMPLETED, this advances it to
 *   AREA_SELECTED in the same update (the one sequential forward step the
 *   `validate_internship_status_transition` DB trigger allows), via the
 *   shared state-machine service so the transition is validated the same
 *   way everywhere else in the app.
 * - If the internship is already at AREA_SELECTED (the intern is revisiting
 *   to change their pick before topic selection is built), this just
 *   updates primary_area without touching status — the trigger's
 *   `OLD.status = NEW.status` no-op branch covers that.
 * - Any other status is a caller error (the page guards against reaching
 *   this before PROFILE_COMPLETED or after AREA_SELECTED).
 */
export async function saveResearchArea(
  internshipId: string,
  currentStatus: InternshipStatus,
  area: string
): Promise<{ success: boolean; status: InternshipStatus; error?: string }> {
  if (currentStatus === 'PROFILE_COMPLETED') {
    const result = await transitionInternshipTo(internshipId, 'AREA_SELECTED', { primary_area: area });
    if (!result.success) {
      return { success: false, status: currentStatus, error: result.error };
    }
    return { success: true, status: 'AREA_SELECTED' };
  }

  if (currentStatus === 'AREA_SELECTED') {
    const supabase = createClient();
    const { error } = await supabase.from('internships').update({ primary_area: area }).eq('id', internshipId);
    if (error) return { success: false, status: currentStatus, error: error.message };
    return { success: true, status: currentStatus };
  }

  return {
    success: false,
    status: currentStatus,
    error: `Research area cannot be saved from status ${currentStatus}.`,
  };
}

export interface ResearchTopicState {
  internshipId: string | null;
  status: InternshipStatus | null;
  primaryArea: string | null;
  specificTopic: string | null;
  researchObjective: string | null;
  error: string | null;
}

/**
 * Fetches the fields the specific-topic selector needs: which area was
 * chosen (to scope the checklist) plus any topic/objective already saved.
 */
export async function getResearchTopicState(userId: string): Promise<ResearchTopicState> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('internships')
    .select('id, status, primary_area, specific_topic, research_objective')
    .eq('intern_id', userId)
    .maybeSingle();

  if (error) {
    return { internshipId: null, status: null, primaryArea: null, specificTopic: null, researchObjective: null, error: error.message };
  }
  if (!data) {
    return { internshipId: null, status: null, primaryArea: null, specificTopic: null, researchObjective: null, error: null };
  }

  return {
    internshipId: data.id,
    status: data.status as InternshipStatus,
    primaryArea: data.primary_area,
    specificTopic: data.specific_topic,
    researchObjective: data.research_objective,
    error: null,
  };
}

/**
 * Saves the intern's chosen specific topic + research objective. Same
 * two-branch shape as saveResearchArea: advances AREA_SELECTED ->
 * TOPIC_SELECTED on first save (the DB trigger's one allowed forward step),
 * or just updates the fields in place while already at TOPIC_SELECTED.
 */
export async function saveResearchTopic(
  internshipId: string,
  currentStatus: InternshipStatus,
  topic: string,
  objective: string
): Promise<{ success: boolean; status: InternshipStatus; error?: string }> {
  if (currentStatus === 'AREA_SELECTED') {
    const result = await transitionInternshipTo(internshipId, 'TOPIC_SELECTED', {
      specific_topic: topic,
      research_objective: objective || null,
    });
    if (!result.success) {
      return { success: false, status: currentStatus, error: result.error };
    }
    return { success: true, status: 'TOPIC_SELECTED' };
  }

  if (currentStatus === 'TOPIC_SELECTED') {
    const supabase = createClient();
    const { error } = await supabase
      .from('internships')
      .update({ specific_topic: topic, research_objective: objective || null })
      .eq('id', internshipId);
    if (error) return { success: false, status: currentStatus, error: error.message };
    return { success: true, status: currentStatus };
  }

  return {
    success: false,
    status: currentStatus,
    error: `Specific topic cannot be saved from status ${currentStatus}.`,
  };
}
