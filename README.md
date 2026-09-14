# agentforce-nonprofit-governance-kit

A **Salesforce Agentforce governance kit** for nonprofits: a free 15-question weighted readiness
scorecard, an `sf` CLI plugin that runs read-only org checks for Einstein Trust Layer and agent
configuration signals, and four forkable policy templates (AI usage, data handling and consent,
escalation and human review, incident response).

Nonprofit Cloud was renamed **Agentforce Nonprofit** in December 2025
([Salesforce Dictionary](https://salesforcedictionary.com/blogs/npsp-to-agentforce-nonprofit-migration-2026)),
and the Donor Support Agent went GA with the Agentforce Nonprofit Summer '26 rollout, completed
the week of June 12, 2026 ([Belmar](https://belmarcloud.com/agentforce-nonprofit-summer-26-is-live/)).
Every nonprofit adopting an Agentforce agent now has to answer a question NPSP-era Salesforce
never asked: what happens when the system doesn't just store donor data, but acts on it. The
Einstein Trust Layer masks sensitive data before it reaches an LLM, but as one nonprofit
Salesforce consultancy put it, that "is not a substitute for AI governance"
([Dynamic Specialties Group](https://dynaspecgroup.com/crms-project-success/nonprofit-ai-governance-salesforce-best-practices)).
This kit is the governance layer most nonprofits skip because nobody handed them a checklist.

**Not a Salesforce product, not officially affiliated with or endorsed by Salesforce.** Independent
tool built by [Clear Concise Consulting](https://www.clearconciseconsulting.com) out of repeated
Agentforce governance scoping work.

**This is not legal advice.** The policy templates in this repo are starting drafts for your
board, executive director, and Salesforce/IT lead to edit - not a substitute for review by
someone with actual legal or compliance authority at your organization.

## Why AI governance needs a Salesforce-specific layer

Generic AI governance frameworks (NIST AI RMF, ISO 42001) tell you to map risks, govern access,
measure performance, and manage incidents - they don't tell you which Salesforce setting to
check first, which object's field-level security matters, or what "least privilege" means for
an Agentforce integration user. This kit maps that generic framework onto specific Salesforce
gates:

## The Six Salesforce AI Governance Gates

This scorecard's gate names, order, and descriptions are taken directly from Clear Concise
Consulting's Six Salesforce AI Governance Gates framework
([AI Center of Excellence](https://www.clearconciseconsulting.com/ai-center-of-excellence)). The
free scorecard here uses the same definitions as the paid framework, so a nonprofit that starts
with this repo and later works with Clear Concise Consulting is working from one set of
definitions, not two.

| Gate | NIST AI RMF function | Gate name | Requires |
|---|---|---|---|
| 01 | MAP | Data Readiness | A data quality score of 7/10+ (see the companion [nonprofit-data-quality-scorecard](https://github.com/clear-concise-carmona/nonprofit-data-quality-scorecard)), a documented sharing model, confirmed data ownership |
| 02 | GOVERN | Permission and Access | Field-level security verified on every object the agent touches, Trust Layer configuration, an integration user scoped to least privilege |
| 03 | MAP + GOVERN | Design Review | Use case risk classification, defined human oversight, four-audience documentation, assigned accountability |
| 04 | GOVERN + MAP | Agentic Governance Review | Documented and tested agent action boundaries, enabled Session Tracing, scoped topic restrictions and tool authorization |
| 05 | MEASURE | Pre-Production Validation | Bias and fairness testing on a representative sample, a rollback drill in a Full sandbox, pilot testing with named reviewers |
| 06 | MANAGE | Post-Launch Governance | A scheduled 30-day review, baselined drift indicators, a published incident response runbook, a committed quarterly review cadence |

## The 15-question scorecard

`scorer/readiness-questions.yml` breaks the six gates into 15 weighted questions (weights sum to
100). This is a **manual self-assessment** - you answer yes/partial/no for each question based on
what your organization has actually done, not what the API can see. Some questions (has a
rollback drill actually happened, are named reviewers actually assigned) can't be answered by a
query at all.

```bash
git clone https://github.com/clear-concise-carmona/agentforce-nonprofit-governance-kit.git
cd agentforce-nonprofit-governance-kit
npm install

# create your answers file, one line per question id, e.g.:
#   q1_data_quality_score: partial
#   q2_sharing_model_documented: yes
#   ...
npx ts-node scorer/score.ts path/to/your-answers.yml
```

See [samples/sample-assessment.md](samples/sample-assessment.md) for a full worked example,
including how a fictional nonprofit's answers turn into a 64/100 score and what they did about
the two weakest gates.

## Running the automated org checks

The `sf agentforce assess` command runs four read-only checks against a real org and writes a
Markdown inventory report. It does not produce a score by itself - pair it with the scorecard
above.

```bash
sf plugins link .          # after npm install && npm run build, from the repo root
sf org login web --alias my-nonprofit-org
sf agentforce assess --target-org my-nonprofit-org
```

| Check | File | What it looks for |
|---|---|---|
| Einstein Trust Layer settings | [src/lib/checks/einsteinTrustLayerSettings.ts](src/lib/checks/einsteinTrustLayerSettings.ts) | Whether generative AI, data masking, and toxicity detection are enabled (Gate 02) |
| Prompt template inventory | [src/lib/checks/promptTemplateInventory.ts](src/lib/checks/promptTemplateInventory.ts) | Configured planner bundles and plugin instruction definitions |
| Agent inventory | [src/lib/checks/agentTopicsAndActions.ts](src/lib/checks/agentTopicsAndActions.ts) | Configured Agentforce agents and published versions (Gate 04) |
| Consent field coverage | [src/lib/checks/consentFieldCoverage.ts](src/lib/checks/consentFieldCoverage.ts) | Whether Contact/Lead/Account have a recognizable consent/opt-in field before an agent touches them |

**Read this before you trust the output:** Agentforce's Metadata and Tooling API surface has
been moving fast - Salesforce's own developer docs for agent metadata open with "Agent metadata
changed in v68"
([Agentforce Metadata and Tooling API reference](https://developer.salesforce.com/docs/ai/agentforce/references/agents-metadata-tooling/agents-metadata.html)).
This kit was built without access to a live org with Agentforce enabled, so several checks
(especially `einsteinTrustLayerSettings.ts`'s field names) are best-effort against Salesforce's
published Metadata API docs, not confirmed against a live 2026 response. Every check says so in
its own file header and degrades gracefully - it reports "could not determine" or a note instead
of crashing or guessing at a pass/fail. If you run this against a real org and find a wrong field
or object name, please open an issue or a PR; see [CONTRIBUTING.md](CONTRIBUTING.md).

Nothing in this tool writes, updates, or deletes data in the target org. Every check is a
describe call or a read-only SOQL/Tooling API query.

## Policy templates

Four Markdown templates in [policy-templates/](policy-templates/), meant to be forked and edited
by your board and operations team, not used as-is:

- [ai-usage-policy.md](policy-templates/ai-usage-policy.md) - approved use cases, prohibited
  uses, design review requirement, sign-off table.
- [data-handling-and-consent-policy.md](policy-templates/data-handling-and-consent-policy.md) -
  data classification, consent requirements, minimum-necessary-data rule.
- [agent-escalation-and-human-review-policy.md](policy-templates/agent-escalation-and-human-review-policy.md) -
  action boundaries table, escalation triggers and routing, reviewer sampling rate.
- [incident-response-addendum.md](policy-templates/incident-response-addendum.md) - containment,
  investigation, notification decisions, incident log.

**These are not legal advice.** Every template says so at the top and includes a sign-off table
so a specific person, not "the team," is accountable for the final version.

## Sample assessment walkthrough

[samples/sample-assessment.md](samples/sample-assessment.md) walks through a fictional
nonprofit's org check output, its 15-question answers, the resulting 64/100 score broken down by
gate, and what they prioritized fixing first (a Setup toggle and a calendar invite, not a
project).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) - especially the section on correcting field/object names
that turn out to be wrong against a live org. This repo was built to fail loudly toward "we
don't know" rather than quietly toward a false pass, and contributions that keep it that way are
the most useful kind.

## About Clear Concise Consulting

[Clear Concise Consulting](https://www.clearconciseconsulting.com) is a Salesforce consultancy
working with nonprofits, healthcare, enterprise, and government clients, founded by Jeremy
Carmona, a 13x certified Salesforce Architect who also teaches Salesforce at NYU.

**Want the paid version of this framework, with hands-on implementation?** [Get your Agentforce Governance Readiness Score](https://www.clearconciseconsulting.com/services/salesforce-nonprofit-consulting) -
a guided assessment against the full Six Salesforce AI Governance Gates, not just the free
15-question self-serve version here.

## License

MIT - see [LICENSE](LICENSE).
