const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const moduleUnderTest = { exports: {} };
const transitions = [];
const output = ts.transpileModule(fs.readFileSync('src/lib/internship/assignMentor.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});
new Function('require', 'module', 'exports', output.outputText)(
  (name) =>
    name === './stateMachine'
      ? {
          transitionInternshipTo: async (...args) => {
            transitions.push(args);
            return { success: true, data: { id: args[0], status: args[1], ...args[2] } };
          },
        }
      : {},
  moduleUnderTest,
  moduleUnderTest.exports
);
const { mentorMatchScore, recommendMentors, assignMentor } = moduleUnderTest.exports;
const mentor = {
  id: 'mentor',
  fullName: 'Mentor',
  accountStatus: 'active',
  expertise: ['Quantum Computing'],
  capacity: 2,
  currentInterns: 1,
};

test('tag matching ignores case and whitespace without substring false positives', () => {
  assert.equal(mentorMatchScore([' quantum   computing '], 'Quantum Computing'), 100);
  assert.equal(mentorMatchScore(['Quantum'], 'Quantum Computing'), 0);
  assert.equal(mentorMatchScore([], null), 0);
});
test('recommendations rank matching active mentors first', () => {
  const rows = recommendMentors(
    [
      { ...mentor, id: 'nonmatch', expertise: [] },
      mentor,
      { ...mentor, id: 'disabled', accountStatus: 'disabled' },
    ],
    'Quantum Computing'
  );
  assert.deepEqual(
    rows.map((row) => row.id),
    ['mentor', 'nonmatch']
  );
});
test('assignment advances approved proposal and writes mentor atomically through state machine', async () => {
  const result = await assignMentor({ id: 'internship', status: 'PROPOSAL_APPROVED' }, mentor);
  assert.deepEqual(transitions, [['internship', 'MENTOR_ASSIGNED', { mentor_id: 'mentor' }]]);
  assert.equal(result.status, 'MENTOR_ASSIGNED');
});
test('unapproved, full and inactive assignments are rejected before mutation', async () => {
  await assert.rejects(assignMentor({ status: 'PROPOSAL_DRAFT' }, mentor), /approved/);
  await assert.rejects(
    assignMentor({ status: 'PROPOSAL_APPROVED' }, { ...mentor, currentInterns: 2 }),
    /capacity/
  );
  await assert.rejects(
    assignMentor({ status: 'PROPOSAL_APPROVED' }, { ...mentor, accountStatus: 'disabled' }),
    /active/
  );
  assert.equal(transitions.length, 1);
});
