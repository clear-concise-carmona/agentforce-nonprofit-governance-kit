# Incident Response Addendum (AI/Agentforce)

**[Organization Name]**
**Effective date:** [DATE]
**Owner:** [Name / role]

> This is a template, not legal advice. If an incident involves a legal, regulatory, or funder
> reporting obligation, get counsel involved immediately rather than relying solely on this
> document. See the disclaimer in this repo's README.

## 1. What counts as an AI incident

- An agent took an action outside its documented boundaries (see
  `agent-escalation-and-human-review-policy.md` Section 2).
- An agent sent incorrect, misleading, or harmful information to a donor, client, or
  beneficiary.
- Data was exposed to an AI model or third party outside what
  `data-handling-and-consent-policy.md` permits.
- A bias or fairness issue was identified in agent output after launch.
- Any of the above reported by a donor, client, beneficiary, staff member, or board member,
  even if unconfirmed.

## 2. Immediate response

1. **Contain:** Disable the affected agent or restrict its topic/action scope
   (Setup > Agentforce Agents) if the incident is ongoing.
2. **Notify:** Notify [OWNER NAME/ROLE] within [TIME TARGET, e.g. 2 hours of detection].
3. **Preserve evidence:** Do not delete the interaction transcript or Session Tracing data for
   the affected session. Export or lock it for review.

## 3. Investigation

- Pull the interaction transcript and Session Tracing data (if enabled) for the affected
  session(s).
- Determine root cause: configuration error, data quality issue (see the companion
  [nonprofit-data-quality-scorecard](https://github.com/clear-concise-carmona/nonprofit-data-quality-scorecard)),
  model behavior, or human error in setup.
- Determine scope: how many records/individuals were affected.

## 4. Notification decisions

Decide, with counsel if the incident involves personal data exposure or a funder reporting
requirement:

- Does this require notifying affected individuals?
- Does this require notifying a funder, regulator, or board?
- What is the notification timeline required by applicable law or funder agreement?

[Organization Name]-specific notification thresholds and contacts: [FILL IN]

## 5. Remediation

- Fix the root cause (reconfigure action boundaries, correct underlying data, retrain
  reviewers).
- Re-run the relevant check(s) from this repo's automated org checks
  (`sf agentforce assess`) and the 15-question scorecard before resuming the affected use case.
- Document what changed and why in the use case's entry in `ai-usage-policy.md` Section 3.

## 6. Post-incident review

Within [TIME TARGET, e.g. 5 business days] of resolution:

- Written summary of what happened, root cause, and remediation.
- Update to the relevant policy template(s) if the incident revealed a gap.
- Report to [OWNER/BOARD] per your governance structure.

## 7. Incident log

| Date | Description | Root cause | Affected records/individuals | Remediation | Reviewed by |
|---|---|---|---|---|---|
| | | | | | |

## 8. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Executive Director / CEO | | | |
| Salesforce/IT lead | | | |
