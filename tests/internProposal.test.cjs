const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function loadService(status = 'TOPIC_SELECTED', options = {}) {
  let row = { id: 'internship', intern_id: 'intern', status, proposal_document_path: null };
  const transitions = [];
  const removed = [];
  const client = {
    from() {
      let payload;
      const filters = [];
      const query = {
        update(value) {
          payload = value;
          return query;
        },
        select() {
          return query;
        },
        eq(key, value) {
          filters.push([key, value]);
          return query;
        },
        async single() {
          if (filters.some(([key, value]) => row[key] !== value))
            return { error: { message: 'stale state' } };
          if (payload) row = { ...row, ...payload };
          return { data: { ...row } };
        },
      };
      return query;
    },
    storage: {
      from: () => ({
        upload: async () => ({
          error: options.uploadFailure ? { message: 'upload failed' } : null,
        }),
        remove: async (paths) => {
          removed.push(...paths);
          return {};
        },
      }),
    },
  };
  function compile(path, dependencies) {
    const output = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    const module = { exports: {} };
    new Function('require', 'module', 'exports', output.outputText)(
      (name) => dependencies[name],
      module,
      module.exports
    );
    return module.exports;
  }
  const stateMachine = compile('src/lib/internship/stateMachine.ts', {
    '@/lib/supabase/client': { createClient: () => client },
  });
  const service = compile('src/lib/internship/internProposal.ts', {
    '@/lib/supabase/client': { createClient: () => client },
    './stateMachine': {
      ...stateMachine,
      transitionInternshipTo: async (...args) => {
        transitions.push(args[1]);
        if (options.submitFailure && args[1] === 'PROPOSAL_SUBMITTED')
          return { success: false, error: 'submission failed' };
        return stateMachine.transitionInternshipTo(...args);
      },
    },
  });
  return {
    service,
    record: () => ({ ...row }),
    transitions,
    removed,
    setStatus: (value) => {
      row.status = value;
    },
  };
}
const fields = {
  proposal_title: 'Title',
  proposal_abstract: 'Problem',
  proposal_objectives: 'Objectives',
  proposal_methodology: 'Methods',
  proposal_expected_outcome: 'Outcome',
};
const file = new File(['%PDF-1.7 proposal'], 'proposal.pdf', { type: 'application/pdf' });

test('partial drafts persist through the sequential draft transition', async () => {
  const ctx = loadService();
  const result = await ctx.service.saveProposal(
    ctx.record(),
    { ...fields, proposal_abstract: '' },
    null,
    false
  );
  assert.equal(result.status, 'PROPOSAL_DRAFT');
  assert.equal(result.proposal_abstract, null);
  assert.deepEqual(ctx.transitions, ['PROPOSAL_DRAFT']);
});

test('first submission saves draft before submitting with uploaded document', async () => {
  const ctx = loadService();
  const result = await ctx.service.saveProposal(ctx.record(), fields, file, true);
  assert.equal(result.status, 'PROPOSAL_SUBMITTED');
  assert.match(result.proposal_document_path, /^intern\/internship\/.+\.pdf$/);
  assert.ok(result.proposal_submitted_at);
  assert.deepEqual(ctx.transitions, ['PROPOSAL_DRAFT', 'PROPOSAL_SUBMITTED']);
});

test('submission requires every field and a document', async () => {
  const ctx = loadService('PROPOSAL_DRAFT');
  await assert.rejects(
    ctx.service.saveProposal(ctx.record(), { ...fields, proposal_title: '  ' }, file, true),
    /all five/
  );
  await assert.rejects(ctx.service.saveProposal(ctx.record(), fields, null, true), /Upload/);
  assert.equal(ctx.transitions.length, 0);
});

test('revisions save and resubmit without backward transition or self-approval', async () => {
  const ctx = loadService('PROPOSAL_REVISION');
  const result = await ctx.service.saveProposal(ctx.record(), fields, file, true);
  assert.equal(result.status, 'PROPOSAL_REVISION');
  assert.ok(result.proposal_submitted_at);
  assert.equal(ctx.transitions.length, 0);
});

test('locked and stale proposal writes fail', async () => {
  for (const status of ['SELECTED', 'PROPOSAL_SUBMITTED', 'PROPOSAL_APPROVED']) {
    const ctx = loadService(status);
    await assert.rejects(
      ctx.service.saveProposal(ctx.record(), fields, null, false),
      /no longer editable/
    );
  }
  const ctx = loadService('PROPOSAL_DRAFT');
  const stale = ctx.record();
  ctx.setStatus('PROPOSAL_SUBMITTED');
  await assert.rejects(ctx.service.saveProposal(stale, fields, null, false), /stale state/);
});

test('upload failure preserves status; submission failure keeps saved draft file', async () => {
  const failedUpload = loadService('TOPIC_SELECTED', { uploadFailure: true });
  await assert.rejects(
    failedUpload.service.saveProposal(failedUpload.record(), fields, file, true),
    /upload failed/
  );
  assert.equal(failedUpload.record().status, 'TOPIC_SELECTED');
  const failedSubmit = loadService('TOPIC_SELECTED', { submitFailure: true });
  await assert.rejects(
    failedSubmit.service.saveProposal(failedSubmit.record(), fields, file, true),
    /submission failed/
  );
  assert.equal(failedSubmit.record().status, 'PROPOSAL_DRAFT');
  assert.ok(failedSubmit.record().proposal_document_path);
  assert.equal(failedSubmit.removed.length, 0);
});

test('file validation accepts PDF/DOCX and rejects invalid or oversized files', () => {
  const { service } = loadService();
  assert.equal(service.validateProposalFile(file), null);
  assert.equal(service.validateProposalFile(new File(['docx'], 'proposal.DOCX')), null);
  assert.match(service.validateProposalFile(new File(['text'], 'proposal.txt')), /PDF or DOCX/);
  assert.match(service.validateProposalFile(new File([], 'empty.pdf')), /non-empty/);
  assert.match(
    service.validateProposalFile({ name: 'large.pdf', type: 'application/pdf', size: 10485761 }),
    /10 MB/
  );
});
