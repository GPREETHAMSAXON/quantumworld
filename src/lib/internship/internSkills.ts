import { createClient } from '@/lib/supabase/client';

export interface SkillsDetails {
  technicalSkills: string[];
  certifications: string[];
  languagesKnown: string[];
  toolsFrameworks: string[];
}

export interface SkillsState {
  skills: SkillsDetails;
  completedAt: string | null;
  error: string | null;
}

const EMPTY_SKILLS: SkillsDetails = {
  technicalSkills: [],
  certifications: [],
  languagesKnown: [],
  toolsFrameworks: [],
};

export async function getSkillsState(userId: string): Promise<SkillsState> {
  const supabase = createClient();
  const { data, error } = await supabase.from('intern_skills').select('*').eq('intern_id', userId).maybeSingle();

  if (error) return { skills: EMPTY_SKILLS, completedAt: null, error: error.message };
  if (!data) return { skills: EMPTY_SKILLS, completedAt: null, error: null };

  return {
    skills: {
      technicalSkills: data.technical_skills ?? [],
      certifications: data.certifications ?? [],
      languagesKnown: data.languages_known ?? [],
      toolsFrameworks: data.tools_frameworks ?? [],
    },
    completedAt: data.completed_at,
    error: null,
  };
}

export async function saveSkills(userId: string, fields: SkillsDetails): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from('intern_skills').upsert(
    {
      intern_id: userId,
      technical_skills: fields.technicalSkills,
      certifications: fields.certifications,
      languages_known: fields.languagesKnown,
      tools_frameworks: fields.toolsFrameworks,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'intern_id' }
  );

  if (error) return { success: false, error: error.message };
  return { success: true };
}
