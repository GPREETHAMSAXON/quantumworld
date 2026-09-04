import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { inviteIntern } from '@/lib/internship/inviteIntern';

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const fullName = typeof body?.fullName === 'string' ? body.fullName : '';
  const email = typeof body?.email === 'string' ? body.email : '';

  if (!fullName.trim() || !email.trim()) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  let result;
  try {
    result = await inviteIntern({ fullName, email }, origin);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to create intern account.' }, { status: 500 });
  }

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ internId: result.internId, email: result.email }, { status: 201 });
}
