const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const testModule = { exports: {} };
const output = ts.transpileModule(
  fs.readFileSync('src/lib/internship/projectExecution.ts', 'utf8'),
  {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }
);
new Function('require', 'module', 'exports', output.outputText)(
  (name) => (name === '@/lib/supabase/client' ? { createClient: () => ({}) } : {}),
  testModule,
  testModule.exports
);
const { calculateMilestoneProgress, canWorkOnProject, validateEvidenceFiles } = testModule.exports;

test('overall progress is the rounded average of milestone percentages', () => {
  assert.equal(calculateMilestoneProgress([]), 0);
  assert.equal(
    calculateMilestoneProgress([
      { progress_percent: 100 },
      { progress_percent: 0 },
      { progress_percent: 0 },
    ]),
    33
  );
  assert.equal(
    calculateMilestoneProgress([{ progress_percent: 100 }, { progress_percent: 100 }]),
    100
  );
});

test('only assigned or active projects permit intern project changes', () => {
  assert.equal(canWorkOnProject('MENTOR_ASSIGNED'), true);
  assert.equal(canWorkOnProject('PROJECT_ACTIVE'), true);
  assert.equal(canWorkOnProject('PROPOSAL_APPROVED'), false);
  assert.equal(canWorkOnProject('PROGRESS_REVIEW'), false);
});

test('evidence validation accepts multi-file evidence within the count and size limits', () => {
  assert.equal(
    validateEvidenceFiles([new File(['code'], 'model.py'), new File(['data'], 'results.csv')]),
    null
  );
  assert.match(
    validateEvidenceFiles(
      Array.from({ length: 11 }, (_, index) => new File(['x'], `${index}.txt`))
    ),
    /up to 10/
  );
  assert.match(validateEvidenceFiles([new File([], 'empty.txt')]), /non-empty/);
  assert.match(validateEvidenceFiles([{ size: 20 * 1024 * 1024 + 1 }]), /20 MB/);
});
