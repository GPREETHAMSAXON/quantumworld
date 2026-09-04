import { createClient } from '@/lib/supabase/client';

export const YEAR_OF_STUDY_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Final Year', 'Graduated'];

export type EducationDocumentSlot = 'resumePath' | 'academicCertificatePath' | 'idProofPath' | 'otherDocumentPath';

export interface EducationDetails {
  degree: string;
  specialization: string;
  institution: string;
  yearOfStudy: string;
  cgpaPercentage: string;
  academicYear: string;
  tenthInstitution: string;
  tenthYear: string;
  tenthPercentage: string;
  twelfthInstitution: string;
  twelfthYear: string;
  twelfthPercentage: string;
  resumePath: string | null;
  academicCertificatePath: string | null;
  idProofPath: string | null;
  otherDocumentPath: string | null;
}

export interface EducationState {
  education: EducationDetails;
  completedAt: string | null;
  error: string | null;
}

const EMPTY_EDUCATION: EducationDetails = {
  degree: '',
  specialization: '',
  institution: '',
  yearOfStudy: '',
  cgpaPercentage: '',
  academicYear: '',
  tenthInstitution: '',
  tenthYear: '',
  tenthPercentage: '',
  twelfthInstitution: '',
  twelfthYear: '',
  twelfthPercentage: '',
  resumePath: null,
  academicCertificatePath: null,
  idProofPath: null,
  otherDocumentPath: null,
};

export async function getEducationState(userId: string): Promise<EducationState> {
  const supabase = createClient();
  const { data, error } = await supabase.from('intern_education').select('*').eq('intern_id', userId).maybeSingle();

  if (error) return { education: EMPTY_EDUCATION, completedAt: null, error: error.message };
  if (!data) return { education: EMPTY_EDUCATION, completedAt: null, error: null };

  return {
    education: {
      degree: data.degree ?? '',
      specialization: data.specialization ?? '',
      institution: data.institution ?? '',
      yearOfStudy: data.year_of_study ?? '',
      cgpaPercentage: data.cgpa_percentage ?? '',
      academicYear: data.academic_year ?? '',
      tenthInstitution: data.tenth_institution ?? '',
      tenthYear: data.tenth_year ?? '',
      tenthPercentage: data.tenth_percentage ?? '',
      twelfthInstitution: data.twelfth_institution ?? '',
      twelfthYear: data.twelfth_year ?? '',
      twelfthPercentage: data.twelfth_percentage ?? '',
      resumePath: data.resume_path,
      academicCertificatePath: data.academic_certificate_path,
      idProofPath: data.id_proof_path,
      otherDocumentPath: data.other_document_path,
    },
    completedAt: data.completed_at,
    error: null,
  };
}

export async function saveEducation(userId: string, fields: EducationDetails): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from('intern_education').upsert(
    {
      intern_id: userId,
      degree: fields.degree || null,
      specialization: fields.specialization || null,
      institution: fields.institution || null,
      year_of_study: fields.yearOfStudy || null,
      cgpa_percentage: fields.cgpaPercentage || null,
      academic_year: fields.academicYear || null,
      tenth_institution: fields.tenthInstitution || null,
      tenth_year: fields.tenthYear || null,
      tenth_percentage: fields.tenthPercentage || null,
      twelfth_institution: fields.twelfthInstitution || null,
      twelfth_year: fields.twelfthYear || null,
      twelfth_percentage: fields.twelfthPercentage || null,
      resume_path: fields.resumePath,
      academic_certificate_path: fields.academicCertificatePath,
      id_proof_path: fields.idProofPath,
      other_document_path: fields.otherDocumentPath,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'intern_id' }
  );

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function uploadEducationDocument(userId: string, file: File): Promise<{ path: string | null; error?: string }> {
  const supabase = createClient();
  const ext = file.name.split('.').pop() || 'pdf';
  const path = `${userId}/${Date.now()}-${ext}`;

  const { error } = await supabase.storage.from('education-documents').upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (error) return { path: null, error: error.message };
  return { path };
}
