// Isolated PostgreSQL test. Install @electric-sql/pglite outside the project and
// set PGLITE_MODULE to its module path before running node --test on this file.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PGlite } = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');

test('proposal review permissions and full revision/recommendation/approval lifecycle', async () => {
  const db = new PGlite();
  const intern = '00000000-0000-0000-0000-000000000001';
  const mentor = '00000000-0000-0000-0000-000000000002';
  const admin = '00000000-0000-0000-0000-000000000003';
  const outsider = '00000000-0000-0000-0000-000000000004';
  const id = '00000000-0000-0000-0000-000000000010';
  try {
    // Minimal existing-schema fixture; never execute destructive original migrations.
    await db.exec(`
      CREATE ROLE authenticated;
      CREATE SCHEMA auth; CREATE SCHEMA storage;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
        $$ SELECT nullif(current_setting('test.uid', true), '')::uuid $$;
      CREATE TABLE profiles (id uuid PRIMARY KEY, full_name text, email text, role text, status text);
      CREATE TYPE internship_status AS ENUM ('SELECTED','PROFILE_PENDING','PROFILE_COMPLETED','AREA_SELECTED',
        'TOPIC_SELECTED','PROPOSAL_DRAFT','PROPOSAL_SUBMITTED','PROPOSAL_REVISION','PROPOSAL_APPROVED',
        'MENTOR_ASSIGNED','PROJECT_ACTIVE','PROGRESS_REVIEW','FINAL_REPORT_SUBMITTED','MENTOR_APPROVED',
        'ADMIN_APPROVED','INTERNSHIP_COMPLETED');
      CREATE TABLE internships (id uuid PRIMARY KEY, intern_id uuid REFERENCES profiles, mentor_id uuid REFERENCES profiles,
        status internship_status, proposal_title text, proposal_abstract text, proposal_objectives text,
        proposal_methodology text, proposal_submitted_at timestamptz, proposal_revision_notes text,
        proposal_approved_at timestamptz, completed_at timestamptz, updated_at timestamptz DEFAULT clock_timestamp());
      CREATE TABLE storage.buckets (id text PRIMARY KEY, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
      CREATE TABLE storage.objects (bucket_id text, name text);
      CREATE FUNCTION storage.foldername(text) RETURNS text[] LANGUAGE sql AS $$ SELECT string_to_array($1, '/') $$;
      CREATE FUNCTION public.is_portal_admin() RETURNS boolean LANGUAGE sql SECURITY DEFINER AS
        $$ SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') $$;
      ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
      CREATE POLICY own_profile ON profiles FOR SELECT TO authenticated USING (id = auth.uid() OR is_portal_admin());
      CREATE POLICY internship_access ON internships FOR ALL TO authenticated
        USING (intern_id = auth.uid() OR mentor_id = auth.uid() OR is_portal_admin())
        WITH CHECK (intern_id = auth.uid() OR mentor_id = auth.uid() OR is_portal_admin());
      CREATE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at := clock_timestamp(); RETURN NEW; END $$;
      CREATE TRIGGER set_internship_updated_at BEFORE UPDATE ON internships FOR EACH ROW EXECUTE FUNCTION set_updated_at();
      GRANT USAGE ON SCHEMA public, auth, storage TO authenticated;
      GRANT SELECT, UPDATE ON internships TO authenticated;
      GRANT SELECT ON profiles, storage.objects TO authenticated;
      INSERT INTO profiles VALUES ('${intern}','Intern','intern@example.test','intern','active'),
        ('${mentor}','Mentor','mentor@example.test','mentor','active'),
        ('${admin}','Admin','admin@example.test','admin','active'),
        ('${outsider}','Other Mentor','other@example.test','mentor','active');
    `);
    await db.exec(
      fs.readFileSync('supabase/migrations/20260908120000_project_proposal.sql', 'utf8')
    );
    await db.exec(
      fs.readFileSync('supabase/migrations/20260908140000_proposal_review.sql', 'utf8')
    );
    await db.exec(`CREATE TRIGGER validate_internship_status_transition BEFORE UPDATE ON internships
      FOR EACH ROW EXECUTE FUNCTION validate_internship_transition();
      INSERT INTO internships (id, intern_id, mentor_id, status, proposal_title, proposal_abstract, proposal_objectives,
        proposal_methodology, proposal_expected_outcome, proposal_document_path)
      VALUES ('${id}', '${intern}', '${mentor}', 'PROPOSAL_DRAFT', 'Title', 'Problem', 'Objectives', 'Methods', 'Outcome', '${intern}/${id}/proposal.pdf');
      INSERT INTO storage.objects VALUES ('proposal-documents', '${intern}/${id}/proposal.pdf');`);
    async function actor(uid) {
      await db.exec('RESET ROLE');
      await db.query("SELECT set_config('test.uid', $1, false)", [uid]);
      await db.exec('SET ROLE authenticated');
    }
    async function row() {
      return (
        await db.query('SELECT *, updated_at::text AS updated_at FROM internships WHERE id = $1', [
          id,
        ])
      ).rows[0];
    }
    async function decide(action, feedback = '', version) {
      const current = await row();
      return db.query('SELECT * FROM review_project_proposal($1, $2, $3, $4)', [
        id,
        version || current?.updated_at,
        action,
        feedback,
      ]);
    }
    await actor(intern);
    await db.query("UPDATE internships SET status = 'PROPOSAL_SUBMITTED' WHERE id = $1", [id]);
    assert.equal((await row()).proposal_review_stage, 'awaiting_mentor');
    await assert.rejects(decide('recommend'), /assigned mentor/);
    await actor(outsider);
    assert.equal((await db.query('SELECT * FROM internships')).rows.length, 0);
    await assert.rejects(
      db.query('SELECT review_project_proposal($1, now(), $2, $3)', [id, 'recommend', '']),
      /access denied/
    );
    await actor(admin);
    await assert.rejects(decide('approve'), /recommendation is required/);
    await actor(mentor);
    assert.equal(
      (await db.query('SELECT full_name FROM profiles WHERE id = $1', [intern])).rows[0].full_name,
      'Intern'
    );
    assert.equal((await db.query('SELECT * FROM storage.objects')).rows.length, 1);
    await assert.rejects(decide('request_revision', '   '), /feedback is required/);
    await assert.rejects(decide('recommend', '', '2000-01-01T00:00:00Z'), /changed since/);
    await decide('request_revision', 'Clarify the methodology.');
    assert.equal((await row()).status, 'PROPOSAL_REVISION');
    await actor(intern);
    assert.equal((await row()).proposal_revision_notes, 'Clarify the methodology.');
    await db.query(
      "UPDATE internships SET proposal_methodology = 'Revised methods' WHERE id = $1",
      [id]
    );
    assert.equal((await row()).proposal_review_stage, 'revision_requested');
    await db.query(
      'UPDATE internships SET proposal_submitted_at = clock_timestamp() WHERE id = $1',
      [id]
    );
    assert.equal((await row()).proposal_review_stage, 'awaiting_mentor');
    await assert.rejects(
      db.query("UPDATE internships SET proposal_title = 'Unauthorized edit' WHERE id = $1", [id]),
      /locked/
    );
    await actor(mentor);
    await decide('request_revision', 'Add measurable outcomes.');
    await actor(intern);
    await db.query(
      'UPDATE internships SET proposal_submitted_at = clock_timestamp() WHERE id = $1',
      [id]
    );
    await actor(mentor);
    await decide('recommend');
    assert.equal((await row()).proposal_review_stage, 'awaiting_admin');
    assert.equal((await row()).proposal_recommended_by, mentor);
    await assert.rejects(decide('approve'), /Only an admin/);
    await assert.rejects(decide('recommend'), /not waiting/);
    await actor(admin);
    await decide('approve');
    assert.equal((await row()).status, 'PROPOSAL_APPROVED');
    assert.ok((await row()).proposal_approved_at);

    // First-pass approval must work without manufacturing a revision.
    await db.exec('RESET ROLE');
    await db.query(
      "INSERT INTO internships (id, intern_id, mentor_id, status, proposal_review_stage) VALUES ($1, $2, $3, 'PROPOSAL_SUBMITTED', 'awaiting_mentor')",
      ['00000000-0000-0000-0000-000000000011', intern, mentor]
    );
    const secondId = '00000000-0000-0000-0000-000000000011';
    await actor(mentor);
    await db.query(
      "SELECT review_project_proposal(id, updated_at, 'recommend') FROM internships WHERE id = $1",
      [secondId]
    );
    await actor(admin);
    await db.query(
      "SELECT review_project_proposal(id, updated_at, 'approve') FROM internships WHERE id = $1",
      [secondId]
    );
    assert.equal(
      (await db.query('SELECT status FROM internships WHERE id = $1', [secondId])).rows[0].status,
      'PROPOSAL_APPROVED'
    );
    // Assignment capacity uses the same active-mentee definition as mentor cards.
    await db.exec('RESET ROLE');
    await db.exec(
      fs.readFileSync('supabase/migrations/20260904120000_mentor_profile_fields.sql', 'utf8')
    );
    await db.exec(fs.readFileSync('supabase/migrations/20260908160000_assign_mentor.sql', 'utf8'));
    await db.exec(`GRANT UPDATE ON profiles TO authenticated;
      CREATE POLICY admin_update_profile ON profiles FOR UPDATE TO authenticated
      USING (is_portal_admin()) WITH CHECK (is_portal_admin());`);
    await db.query('UPDATE profiles SET mentor_capacity = 1 WHERE id = $1', [mentor]);
    await actor(intern);
    await assert.rejects(
      db.query("UPDATE internships SET status = 'MENTOR_ASSIGNED' WHERE id = $1", [id]),
      /active admin/
    );
    await actor(admin);
    await assert.rejects(
      db.query(
        "UPDATE internships SET status = 'MENTOR_ASSIGNED', mentor_id = NULL WHERE id = $1",
        [id]
      ),
      /active mentor/
    );
    await db.query("UPDATE profiles SET status = 'disabled' WHERE id = $1", [outsider]);
    await assert.rejects(
      db.query("UPDATE internships SET status = 'MENTOR_ASSIGNED', mentor_id = $2 WHERE id = $1", [
        id,
        outsider,
      ]),
      /active mentor/
    );
    await db.query(
      "UPDATE internships SET status = 'MENTOR_ASSIGNED', mentor_id = $2 WHERE id = $1",
      [id, mentor]
    );
    assert.equal((await row()).status, 'MENTOR_ASSIGNED');
    assert.equal((await row()).mentor_id, mentor);
    await assert.rejects(
      db.query("UPDATE internships SET status = 'MENTOR_ASSIGNED', mentor_id = $2 WHERE id = $1", [
        secondId,
        mentor,
      ]),
      /capacity/
    );
    assert.equal(
      (await db.query('SELECT status FROM internships WHERE id = $1', [secondId])).rows[0].status,
      'PROPOSAL_APPROVED'
    );
  } finally {
    await db.close();
  }
});
