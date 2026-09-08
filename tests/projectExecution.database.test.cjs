const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');

test('project migration seeds milestones and makes their average the only overall progress source', async () => {
  const db = new PGlite();
  const intern = '00000000-0000-0000-0000-000000000001';
  const mentor = '00000000-0000-0000-0000-000000000002';
  const admin = '00000000-0000-0000-0000-000000000003';
  const internship = '00000000-0000-0000-0000-000000000010';
  const futureInternship = '00000000-0000-0000-0000-000000000011';
  try {
    await db.exec(`
      CREATE ROLE authenticated; CREATE SCHEMA auth; CREATE SCHEMA storage;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('test.uid', true), '')::uuid $$;
      CREATE TABLE profiles (id uuid PRIMARY KEY, full_name text, email text, role text, status text);
      CREATE FUNCTION public.is_portal_admin() RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$ SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') $$;
      CREATE TYPE internship_status AS ENUM ('SELECTED','PROFILE_PENDING','PROFILE_COMPLETED','AREA_SELECTED','TOPIC_SELECTED','PROPOSAL_DRAFT','PROPOSAL_SUBMITTED','PROPOSAL_REVISION','PROPOSAL_APPROVED','MENTOR_ASSIGNED','PROJECT_ACTIVE','PROGRESS_REVIEW','FINAL_REPORT_SUBMITTED','MENTOR_APPROVED','ADMIN_APPROVED','INTERNSHIP_COMPLETED');
      CREATE TABLE internships (id uuid PRIMARY KEY, intern_id uuid REFERENCES profiles, mentor_id uuid REFERENCES profiles, status internship_status, overall_progress_percent integer NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE storage.buckets (id text PRIMARY KEY, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
      CREATE TABLE storage.objects (bucket_id text, name text);
      CREATE FUNCTION storage.foldername(text) RETURNS text[] LANGUAGE sql AS $$ SELECT string_to_array($1, '/') $$;
      ALTER TABLE internships ENABLE ROW LEVEL SECURITY; ALTER TABLE profiles ENABLE ROW LEVEL SECURITY; ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
      CREATE POLICY internship_access ON internships FOR ALL TO authenticated USING (intern_id = auth.uid() OR mentor_id = auth.uid() OR is_portal_admin()) WITH CHECK (intern_id = auth.uid() OR mentor_id = auth.uid() OR is_portal_admin());
      CREATE POLICY own_profile ON profiles FOR SELECT TO authenticated USING (id = auth.uid() OR is_portal_admin());
      GRANT USAGE ON SCHEMA public, auth, storage TO authenticated; GRANT SELECT, UPDATE ON internships TO authenticated; GRANT SELECT ON profiles, storage.objects TO authenticated;
      INSERT INTO profiles VALUES ('${intern}', 'Intern', 'intern@example.test', 'intern', 'active'), ('${mentor}', 'Mentor', 'mentor@example.test', 'mentor', 'active'), ('${admin}', 'Admin', 'admin@example.test', 'admin', 'active');
      INSERT INTO internships (id, intern_id, mentor_id, status) VALUES ('${internship}', '${intern}', '${mentor}', 'MENTOR_ASSIGNED');
      INSERT INTO internships (id, intern_id, mentor_id, status) VALUES ('${futureInternship}', '${intern}', '${mentor}', 'PROPOSAL_APPROVED');
    `);
    await db.exec(
      fs.readFileSync('supabase/migrations/20260908180000_project_execution.sql', 'utf8')
    );
    await db.exec(
      `GRANT SELECT, UPDATE ON internship_project_milestones TO authenticated; GRANT SELECT, INSERT, DELETE ON internship_progress_updates TO authenticated; GRANT SELECT, INSERT ON internship_progress_evidence TO authenticated;`
    );
    await db.query("SELECT set_config('test.uid', $1, false)", [intern]);
    await db.exec('SET ROLE authenticated');
    assert.equal(
      (
        await db.query('SELECT * FROM internship_project_milestones WHERE internship_id = $1', [
          internship,
        ])
      ).rows.length,
      7
    );
    const first = (
      await db.query(
        'SELECT id FROM internship_project_milestones WHERE internship_id = $1 ORDER BY position LIMIT 1',
        [internship]
      )
    ).rows[0];
    await db.query(
      'UPDATE internship_project_milestones SET progress_percent = 100 WHERE id = $1',
      [first.id]
    );
    assert.equal(
      (
        await db.query('SELECT overall_progress_percent FROM internships WHERE id = $1', [
          internship,
        ])
      ).rows[0].overall_progress_percent,
      14
    );
    await assert.rejects(
      db.query('UPDATE internships SET overall_progress_percent = 90 WHERE id = $1', [internship]),
      /calculated from milestones/
    );
    await db.query(
      "INSERT INTO internship_progress_updates (internship_id, intern_id, current_task, task_status, intern_update) VALUES ($1, $2, 'Literature review', 'IN_PROGRESS', 'Collected initial papers')",
      [internship, intern]
    );
    assert.equal(
      (
        await db.query(
          'SELECT count(*)::int AS count FROM internship_progress_updates WHERE internship_id = $1',
          [internship]
        )
      ).rows[0].count,
      1
    );
    await db.exec('RESET ROLE');
    await db.query("SELECT set_config('test.uid', $1, false)", [admin]);
    await db.exec('SET ROLE authenticated');
    await db.query("UPDATE internships SET status = 'MENTOR_ASSIGNED' WHERE id = $1", [
      futureInternship,
    ]);
    assert.equal(
      (
        await db.query(
          'SELECT count(*)::int AS count FROM internship_project_milestones WHERE internship_id = $1',
          [futureInternship]
        )
      ).rows[0].count,
      7
    );
  } finally {
    await db.close();
  }
});
