# Sample Assessment: Riverside Community Services

> **This example uses fictional or placeholder data. It does not represent a real Salesforce
> org, client, or assessment result.** Riverside Community Services is invented.

*A worked example showing what the org check and the 15-question scorecard produce together, so
you know what to expect before running either against your own org.*

**How this was produced.** The org check output below was written by hand to show the report
format, since this kit has no live org with Agentforce enabled to scan. The score block further
down was not written by hand: it is the actual output of `scorer/score.ts` run against the
answers table in this file. Reproduce it by copying the answer table into a YAML file, one
`id: value` pair per line, and running:

```bash
npx ts-node scorer/score.ts your-copy.yml
```

## Org check output (`sf agentforce assess`)

```
# Agentforce Governance Org Check: riverside-cs-prod

Scanned at: 2026-09-14T04:50:00.000Z

## Einstein Trust Layer settings

- Generative AI enabled: yes
- Data masking enabled: yes
- Toxicity detection enabled: could not determine

## Prompt template and plugin instruction inventory

- Planner bundles found: 1
  - Donor_Support_Agent_Planner
- Plugin instruction definitions found: 3
  - Answer_FAQ, Log_Donation_Inquiry, Escalate_To_Human

## Agentforce agent inventory

- Agents (BotDefinition) found: 1
  - Donor_Support_Agent
- Published agent versions: 1
- Topic and tool/action scoping: not independently verified by this check - confirm by hand in Setup > Agentforce Agents.

## Consent field coverage

- Contact: consent-related fields found - HasOptedOutOfEmail, DoNotCall
- Lead: consent-related fields found - HasOptedOutOfEmail
- Account: no field with a consent-related name found

## Next step

Run the 15-question readiness scorecard...
```

Riverside's Salesforce admin couldn't tell from the API alone whether toxicity detection was on,
so that gets confirmed manually in Setup before the scorecard is filled in.

## 15-question scorecard answers (`scorer/score.ts`)

| Question | Answer | Notes |
|---|---|---|
| q1_data_quality_score | partial | Data quality scorecard run last quarter, scored 6/10 |
| q2_sharing_model_documented | yes | Documented in internal wiki |
| q3_data_ownership_confirmed | yes | Development director owns donor data |
| q4_fls_verified | yes | Verified for the integration user's permission set |
| q5_trust_layer_configured | partial | Data masking on, toxicity detection unconfirmed |
| q6_integration_user_least_privilege | yes | Scoped permission set, not admin |
| q7_risk_classification | yes | Classified Medium (external-facing, no financial actions) |
| q8_human_oversight_defined | yes | Program coordinator reviews flagged conversations daily |
| q9_four_audience_docs | partial | Staff and leadership docs done; board deck pending |
| q10_action_boundaries_tested | yes | Tested in sandbox against 20 sample conversations |
| q11_session_tracing_enabled | no | Not yet turned on |
| q12_topic_tool_scoping | yes | Scoped to FAQ + inquiry logging only, no write actions |
| q13_bias_fairness_tested | no | Not yet run |
| q14_rollback_and_pilot | partial | Pilot done with 2 named reviewers; no rollback drill yet |
| q15_post_launch_governance | no | No 30-day review scheduled yet |

## Resulting score

```
Agentforce Governance Readiness Score: 64/100

  Gate 01 - Data Readiness: 13/18
  Gate 02 - Permission and Access: 19/24
  Gate 03 - Design Review: 13/15
  Gate 04 - Agentic Governance Review: 16/23
  Gate 05 - Pre-Production Validation: 3/12
  Gate 06 - Post-Launch Governance: 0/8
```

## What Riverside does next

The two clearest gaps are Gate 05 (Pre-Production Validation) and Gate 06 (Post-Launch
Governance) - both are process gaps, not Salesforce configuration gaps, which is typical for an
org that got the agent built before it got the governance in place. Their next three actions:

1. Turn on Agentforce Session Tracing (q11) - a Setup toggle, not a project.
2. Schedule the 30-day post-launch review now, even before it's due (q15).
3. Run a bias/fairness pass on a sample of logged conversations before the next quarterly review
   (q13).

They did not attempt to argue their way to a higher score on Gate 06 by writing a governance
document without doing the review - the gate description requires the review actually happen.
