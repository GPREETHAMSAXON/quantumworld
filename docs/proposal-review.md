# Proposal review

The mentor screen is `/portal/mentor/proposals`, linked from the mentor dashboard.
It lists submitted proposals for internships whose `mentor_id` matches the signed-in
mentor. An admin must assign that reviewer before review; assigning the ID does not
advance the internship to the later `MENTOR_ASSIGNED` milestone.

Apply only `supabase/migrations/20260908140000_proposal_review.sql` after the prior
project-proposal migration. Do not replay the original auth or internship migrations.
No live database migration is performed by the feature build or tests.

The existing internship enum is preserved. `proposal_review_stage` controls the handoff:

| Action | Internship status | Review stage |
| --- | --- | --- |
| Intern submits | PROPOSAL_SUBMITTED | awaiting_mentor |
| Assigned mentor requests revision with feedback | PROPOSAL_REVISION | revision_requested |
| Intern saves revision draft | PROPOSAL_REVISION | revision_requested |
| Intern resubmits | PROPOSAL_REVISION | awaiting_mentor |
| Assigned mentor recommends | Existing submitted/revision status | awaiting_admin |
| Admin approves | PROPOSAL_APPROVED | approved |

Existing revision records are conservatively migrated to `revision_requested`:
interns must resubmit before they reappear in the pending mentor queue.

The admin UI can fetch rows with `proposal_review_stage = 'awaiting_admin'` and call
`reviewProposal(id, updated_at, 'approve')` from the shared state-machine service.
The database requires an active admin and prior mentor recommendation. Mentor decisions
use the same service with `request_revision` or `recommend`. Decisions are atomic, check
the reviewed version, and retain the latest revision feedback and recommendation author/time.

## Verification

Run `npm.cmd run build` and `node --test tests/internProposal.test.cjs`.
Database tests use an isolated PostgreSQL runtime and a minimal schema fixture; they
never connect to Supabase or execute the original destructive migrations.

```powershell
npm.cmd install --prefix "$env:TEMP/quantum-proposal-db-test" --no-audit --no-fund --ignore-scripts @electric-sql/pglite
$env:PGLITE_MODULE = "$env:TEMP/quantum-proposal-db-test/node_modules/@electric-sql/pglite"
node --test tests/proposalReview.database.test.cjs
```
