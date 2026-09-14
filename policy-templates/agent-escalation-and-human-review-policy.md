# Agent Escalation and Human Review Policy

**[Organization Name]**
**Effective date:** [DATE]
**Owner:** [Name / role]

> This is a template, not legal advice. See the disclaimer in this repo's README.

## 1. Purpose

Defines when an Agentforce agent must hand off to a human, who that human is, and how the
handoff happens, so "a human is in the loop" is a specific, testable statement instead of a
slide bullet.

## 2. Action boundaries

For each agent, list what it is authorized to do without review, and what it must never do
regardless of confidence:

| Agent | Allowed without review | Always requires human review | Never allowed |
|---|---|---|---|
| [e.g. Donor Support Agent] | [e.g. Answer FAQ questions from a fixed knowledge base] | [e.g. Any response mentioning a specific gift amount or tax deduction] | [e.g. Processing a refund, changing bank details] |

This table should match what is actually configured in the agent's topic/action scoping
(Setup > Agentforce Agents), not what you intend to configure eventually. Gate 04 (Agentic
Governance Review) requires these boundaries be documented *and tested*, not just written down.

## 3. Escalation triggers

An agent interaction is escalated to a human immediately when it involves:

- A request the agent is not authorized to act on (see "Never allowed" column above).
- Language suggesting self-harm, harassment, legal threat, or an emergency.
- A confidence score below [THRESHOLD] where the agent's platform exposes one.
- A user explicitly asking for a human.
- Any repeated failure to resolve the same request after [N] attempts.

## 4. Escalation routing

| Trigger type | Routed to | Response time target |
|---|---|---|
| [e.g. Self-harm language] | [e.g. On-call program director] | [e.g. Immediate / same business day] |
| [e.g. General escalation] | [e.g. Assigned case owner] | [e.g. Within 1 business day] |

## 5. Review of agent output

- **Named reviewers:** [List names/roles who review agent output during pilot and post-launch.]
- **Sampling rate:** [e.g. 100% during first 30 days, then a defined sample percentage after.]
- **What gets logged:** interaction transcript, agent confidence (if available), whether a human
  reviewed it, and the outcome. See the AI Decision Log pattern in
  [Clear Concise Consulting's AI Center of Excellence](https://www.clearconciseconsulting.com/ai-center-of-excellence)
  for a structured way to capture this in Salesforce.

## 6. Session Tracing

Agentforce Session Tracing should be enabled for every production agent so escalation triggers
and reviewer sign-off can be checked against an actual interaction record rather than a
self-report. Confirm this is turned on in Setup > Einstein Audit, Analytics, and Monitoring.

## 7. Review cadence

Reviewed on the same cadence as `ai-usage-policy.md` Section 8.

## 8. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Program lead accountable for escalations | | | |
| Salesforce/IT lead | | | |
