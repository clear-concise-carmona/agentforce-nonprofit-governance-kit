# Data Handling and Consent Policy (AI Addendum)

**[Organization Name]**
**Effective date:** [DATE]
**Owner:** [Name / role]

> This is a template, not legal advice. Consent and data-handling requirements vary by
> jurisdiction, funding source, and the type of data involved (health, financial, minors'
> data, etc). Have counsel review before adoption. See the disclaimer in this repo's README.

## 1. Purpose

This addendum defines what donor, client, and beneficiary data may be used by an AI agent or
generative AI feature in Salesforce, and what consent must exist before that data is used.

## 2. Data classification

Classify each data category your organization holds before connecting it to any AI feature:

| Data category | Example fields | Sensitivity | May an agent read this? | May an agent write/act on this? |
|---|---|---|---|---|
| Contact information | Name, email, phone | Low | [Yes/No] | [Yes/No] |
| Donation history | Gift amount, date, fund | Medium | [Yes/No] | [Yes/No] |
| Communication preference / consent | Opt-in/opt-out flags | High (governs everything else) | [Yes/No] | [Yes/No] |
| Case/beneficiary notes | Free text case notes | High | [Yes/No] | [Yes/No] |
| Health, financial, or minors' data | [organization-specific] | Highest | [Yes/No] | [Yes/No] |

## 3. Consent requirement

Before any AI agent reads or acts on a donor, client, or beneficiary record, that record must
have a determinable consent/communication-preference status. Salesforce standard fields
(`HasOptedOutOfEmail`, `DoNotCall`, `HasOptedOutOfFax`) and any custom consent field your org
uses should be checked programmatically before an agent acts - see
`../src/lib/checks/consentFieldCoverage.ts` in this repo for an automated check of whether such
a field exists at all. That check only confirms a field *exists*; it does not confirm your
process actually captures consent correctly. That is a manual verification.

## 4. Minimum necessary data

Each approved AI use case (see `ai-usage-policy.md` Section 3) must state which data categories
from Section 2 it actually needs. Do not grant an agent's integration user access to a data
category it does not need for its approved use case - see the least-privilege requirement in
Gate 02 (Permission and Access) of the Six Salesforce AI Governance Gates.

## 5. Data masking and the Einstein Trust Layer

Confirm, before any use case goes live, that Einstein Trust Layer data masking is reviewed for
what it does and does not mask for your org's configuration. Do not assume masking covers a
field just because it looks like PII - test it. See `../src/lib/checks/einsteinTrustLayerSettings.ts`
for an automated attempt to read this setting, and confirm manually in Setup either way.

## 6. Retention and AI decision logs

If your org logs AI-assisted decisions (see the AI Decision Log pattern described at
[Clear Concise Consulting's AI Center of Excellence](https://www.clearconciseconsulting.com/ai-center-of-excellence)),
state your retention period for that log here: [RETENTION PERIOD].

## 7. Review cadence

Reviewed on the same cadence as `ai-usage-policy.md` Section 8.

## 8. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Executive Director / CEO | | | |
| Data owner (Section 2) | | | |
| Salesforce/IT lead | | | |
