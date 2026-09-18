# Changelog

## 0.1.0 - 2026-09-18

First tagged public release.

`package.json` was renumbered from 1.0.0 to 0.1.0 before any tag or GitHub Release existed.
The 1.0.0 was never published, never tagged, and never installable. 0.1.0 is a more accurate
description of a kit whose automated org checks have not been confirmed against a live org
with Agentforce enabled.

### Added

- 15-question weighted self-assessment scorecard at `scorer/readiness-questions.yml`, mapped to
  the six Salesforce AI Governance Gates. Weights sum to 100, verified by a test.
- `scorer/score.ts`, a local scorer that reads a YAML answers file and prints a total plus a
  per-gate breakdown. It does not connect to Salesforce.
- `sf agentforce assess`, an `sf` CLI plugin command running four read-only org checks:
  Einstein Trust Layer settings, prompt template and plugin instruction inventory, agent
  inventory, and consent field coverage. It writes a Markdown inventory report and does not
  produce a score.
- Four forkable policy templates under `policy-templates/`: AI usage, data handling and
  consent, agent escalation and human review, and an incident response addendum. Each carries
  a sign-off table and states that it is not legal advice.
- Worked fictional example at `samples/sample-assessment.md`. Its score block is reproducible
  by running `scorer/score.ts` against the answers table in the same file.
- `SECURITY.md` covering reporting, org read/write scope, and output handling.

### Known at release

- The org checks, the Einstein Trust Layer field names in particular, are best-effort against
  Salesforce's published Metadata API documentation and have not been confirmed against a live
  org with Agentforce enabled. Each check file says so in its own header, and checks degrade to
  "could not determine" rather than guessing at a pass or fail.
- Installed from source. Not published to npm.
- CI builds the TypeScript and runs 11 unit tests. It does not connect to a Salesforce org.
