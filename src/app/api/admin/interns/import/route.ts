import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/supabase/admin';
import { inviteIntern, type InviteInternResult } from '@/lib/internship/inviteIntern';

const MAX_ROWS = 200;

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const rows = Array.isArray(body?.rows) ? body.rows : null;

  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: 'No rows to import.' }, { status: 400 });
  }
  if (rows.length > MAX_ROWS) {
    return NextResponse.json({ error: `Import is limited to ${MAX_ROWS} rows at a time.` }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const results: InviteInternResult[] = [];

  for (const row of rows) {
    const fullName = typeof row?.fullName === 'string' ? row.fullName : '';
    const email = typeof row?.email === 'string' ? row.email : '';
    try {
      results.push(await inviteIntern({ fullName, email }, origin));
    } catch (err: any) {
      results.push({ success: false, email, error: err?.message ?? 'Unknown error.' });
    }
  }

  const succeeded = results.filter((r) => r.success).length;
  return NextResponse.json({ succeeded, failed: results.length - succeeded, results });
}
