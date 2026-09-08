const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function loadService(response) {
  const module = { exports: {} };
  const source = fs.readFileSync('src/lib/internship/internMentor.ts', 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const query = { select: () => query, eq: () => query, maybeSingle: async () => response };
  new Function('require', 'module', 'exports', output.outputText)(
    (name) =>
      name === '@/lib/supabase/client' ? { createClient: () => ({ from: () => query }) } : {},
    module,
    module.exports
  );
  return module.exports;
}

test('unassigned internships return the waiting state without requesting a mentor profile', async () => {
  const { getInternMentorState } = loadService({
    data: { id: 'internship', mentor_id: null },
    error: null,
  });
  const state = await getInternMentorState('intern');
  assert.equal(state.internship.id, 'internship');
  assert.equal(state.mentor, null);
});

test('assigned mentor data includes safe profile details and expertise tags', async () => {
  const { getInternMentorState } = loadService({
    data: {
      id: 'internship',
      mentor_id: 'mentor',
      specific_topic: 'Quantum sensing',
      mentor: {
        id: 'mentor',
        full_name: 'Dr. Ada',
        email: 'ada@example.test',
        mentor_research_area: 'Quantum Technologies',
        expertise: ['Quantum Sensing', 7, 'Metrology'],
      },
    },
    error: null,
  });
  const state = await getInternMentorState('intern');
  assert.deepEqual(state.mentor, {
    id: 'mentor',
    fullName: 'Dr. Ada',
    email: 'ada@example.test',
    researchArea: 'Quantum Technologies',
    expertise: ['Quantum Sensing', 'Metrology'],
  });
});

test('mentor state surfaces database errors', async () => {
  const { getInternMentorState } = loadService({
    data: null,
    error: { message: 'permission denied' },
  });
  await assert.rejects(getInternMentorState('intern'), /permission denied/);
});
