const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const testModule = { exports: {} };
const output = ts.transpileModule(
  fs.readFileSync('src/lib/internship/mentorDashboard.ts', 'utf8'),
  {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }
);
new Function('require', 'module', 'exports', output.outputText)(
  (name) => (name === '@/lib/supabase/client' ? { createClient: () => ({}) } : {}),
  testModule,
  testModule.exports
);
const { getProjectHealth, toMentorDashboardData } = testModule.exports;
const record = (id, status, progress = 0, reviewStage = null) => ({
  id,
  status,
  overall_progress_percent: progress,
  proposal_review_stage: reviewStage,
  proposal_title: `Project ${id}`,
  specific_topic: null,
  intern: { full_name: `Intern ${id}`, email: `${id}@example.test` },
});

test('project health maps active assigned work to on-track, attention, and review', () => {
  assert.equal(getProjectHealth(record('a', 'PROJECT_ACTIVE', 45)), 'on_track');
  assert.equal(getProjectHealth(record('b', 'MENTOR_ASSIGNED', 0)), 'attention');
  assert.equal(getProjectHealth(record('c', 'PROJECT_ACTIVE', 0)), 'attention');
  assert.equal(getProjectHealth(record('d', 'PROGRESS_REVIEW', 60)), 'review');
  assert.equal(getProjectHealth(record('e', 'FINAL_REPORT_SUBMITTED', 100)), 'review');
});

test('dashboard counts derive only from its assigned internship rows', () => {
  const data = toMentorDashboardData([
    record('review', 'PROPOSAL_SUBMITTED', 0, 'awaiting_mentor'),
    record('active', 'PROJECT_ACTIVE', 40),
    record('attention', 'MENTOR_ASSIGNED'),
    record('progress', 'PROGRESS_REVIEW', 60),
  ]);
  assert.equal(data.myInterns, 4);
  assert.equal(data.proposalsAwaitingReview, 1);
  assert.equal(data.reviewsInProgress, 1);
  assert.equal(data.activeProjects, 1);
  assert.deepEqual(
    data.projects.map((project) => project.health),
    ['on_track', 'on_track', 'attention', 'review']
  );
});
