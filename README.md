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

## How to validate results

This kit produces two separate things, and they need validating differently.

**The 15-question scorecard is a self-assessment.** Its output is only as honest as its inputs.
Before the number leaves the room:

1. Answer it with the people who would know, not alone. Gate 05 and Gate 06 ask whether things
   actually happened. A Salesforce admin usually cannot answer for the board, and the board
   usually cannot answer for the integration user's permission set.
2. Require evidence for every `yes`. A link to the document, the sandbox drill notes, the
   calendar invite for the 30-day review. A `yes` with nothing behind it is a `partial`.
3. Re-run the scorer after you change answers, rather than adjusting the total by hand:
   `npx ts-node scorer/score.ts your-answers.yml`.
4. Keep the answers file. The point is the delta at the next quarterly review, not the first
   score.

**The automated org checks need confirming in Setup.** They read what the API exposes, and that
surface has been moving:

1. Run `sf agentforce assess` against a sandbox first.
2. Treat "could not determine" as unread, not as off. It means the check could not read the
   setting. Open Setup and look.
3. Confirm every reported value by hand before recording a governance control as satisfied.
   Trust Layer settings in particular: open Setup, Einstein Setup, and read the toggles.
4. Compare the agent inventory against what Setup shows under Agentforce Agents. A published
   version the check missed is a bug worth an issue.
5. Consent field coverage matches on field naming. A consent field your org named something
   unusual will not be recognized, and a field with a consent-like name that your org uses for
   something else will be. Confirm what the field actually means in your org before counting it.

If a check reads your org wrong, open an issue or a PR with the corrected object or field name.
That is the most useful contribution this repo can receive.

## Limitations

This kit supports technical assessment and review. It does not replace architecture review,
security review, legal advice, compliance determination, or organization-specific implementation
decisions. Review the source, the question weights, and the output before relying on a result.

- **The org checks have not been confirmed against a live org with Agentforce enabled.** This is
  stated above and in every check file header, and it is the single most important limit here.
- **The scorecard is self-reported.** It cannot detect an optimistic answer. It is a structured
  conversation, not an audit.
- **The 15 questions are not exhaustive.** Six gates and 15 questions cover the ground that has
  come up repeatedly in scoping work. An organization with unusual risk, direct-to-beneficiary
  agents or clinical data for example, has questions this scorecard does not ask.
- **The question weights are documented judgment, not a validated model.** They sum to 100 and
  the reasoning is visible in `scorer/readiness-questions.yml`. Disagree with one, change it,
  and say that you did.
- **The policy templates are drafting starting points, not legal advice.** They need review by
  someone with legal or compliance authority at your organization before adoption.
- **NIST AI RMF and ISO 42001 are referenced for structure only.** Mapping a question to a NIST
  function does not make a score a NIST assessment, and nothing here certifies or determines
  conformity with either framework.
- **A score is not a go or no-go decision.** It shows which gates are weak. A person decides
  whether to deploy an agent.

## Maintenance Status

This is an independently maintained open-source project by Clear Concise Consulting. Issues and
pull requests are welcome. Maintenance is prioritized around correctness, documentation,
security concerns, and compatibility with supported Salesforce tooling. No response-time or
feature-delivery commitment is implied.

Current release: **v0.1.0**, the first tagged release. It builds and its 11 unit tests pass in
CI. The org checks have not been confirmed against a live org with Agentforce enabled. Corrections
to object and field names from anyone who has one are the most valuable contribution here.

Security reports: see [SECURITY.md](SECURITY.md).

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
