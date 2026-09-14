# AI Usage Policy

**[Organization Name]**
**Effective date:** [DATE]
**Owner:** [Name / role - the person accountable for this policy, not just IT]
**Review cadence:** [e.g. Quarterly, tied to the Post-Launch Governance gate below]

> This is a template, not legal advice. It is meant to be edited by your board, executive
> director, and whoever runs Salesforce/IT before you adopt it. Have someone with actual legal
> or compliance authority at your organization review the final version. See the disclaimer in
> this repo's README.

## 1. Purpose

This policy governs how [Organization Name] uses AI features inside Salesforce (Agentforce
agents, Einstein generative AI, prompt templates, and any AI-assisted workflow) and any other
AI tool used in connection with donor, client, beneficiary, or staff data.

## 2. Scope

This policy applies to:

- Any Salesforce org used by [Organization Name], including sandboxes used for testing.
- Any Agentforce agent, whether internal-facing (staff) or external-facing (donors, clients,
  applicants).
- Any staff member, contractor, or volunteer who configures, prompts, or relies on AI output to
  make a decision or take an action on the organization's behalf.

## 3. Approved use cases

List the specific, named use cases this policy currently covers. An AI feature not on this list
requires a Design Review (Section 5) before it goes live.

| Use case | Agent / feature | Risk classification | Approved by | Date |
|---|---|---|---|---|
| [e.g. Donor inquiry triage] | [e.g. Donor Support Agent] | [Low / Medium / High] | [Name] | [Date] |

## 4. Prohibited uses

- No AI-generated content is sent to a donor, client, or beneficiary without the human review
  step defined in Section 6, unless that use case has been explicitly approved for unattended
  operation and documented as such.
- No AI feature is used to make an eligibility, funding, or service decision without a named
  human accountable for the final call.
- No AI feature is connected to data outside what Section 7 (Data Handling and Consent Policy)
  permits.

## 5. Design review requirement

Before a new AI use case goes live, it must go through Design Review per the Six Salesforce AI
Governance Gates framework (Gate 03: Design Review). At minimum, Design Review requires:

- A documented risk classification for the use case.
- Defined human oversight (who reviews outputs, how often, and what triggers an escalation).
- Documentation written for each of four audiences: end users, admins/ops, leadership, and the
  board.
- A named, accountable owner for the use case - not "the Salesforce team" as a group.

See `agent-escalation-and-human-review-policy.md` for the escalation and review mechanics, and
the [Agentforce Governance Readiness Score](../scorer/readiness-questions.yml) for the full
15-question self-assessment.

## 6. Human review and escalation

Every approved use case must state, in the table in Section 3 or in a linked document:

- Whether output requires human approval before it reaches a donor/client/beneficiary (yes/no).
- Who reviews it, and their backup if unavailable.
- What counts as an escalation (e.g. any output flagging self-harm, legal threats, or a request
  the agent is not authorized to act on) and where that escalation goes.

See `agent-escalation-and-human-review-policy.md` for the full escalation policy.

## 7. Incident handling

Any AI-related incident (wrong information sent to a donor, an agent acting outside its
authorized scope, a data exposure) is handled per
`incident-response-addendum.md`.

## 8. Review cadence

This policy, and every use case listed in Section 3, is reviewed:

- 30 days after any new use case goes live.
- Quarterly thereafter, or immediately after any incident.

## 9. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Executive Director / CEO | | | |
| Board liaison (if applicable) | | | |
| Salesforce/IT lead | | | |

---

Source framework: [Clear Concise Consulting - AI Center of Excellence](https://www.clearconciseconsulting.com/ai-center-of-excellence).
