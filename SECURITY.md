# Security Policy

## Reporting a problem

Open an issue at
[github.com/clear-concise-carmona/agentforce-nonprofit-governance-kit/issues](https://github.com/clear-concise-carmona/agentforce-nonprofit-governance-kit/issues).

Do not include org IDs, usernames, session IDs, auth URLs, agent transcripts, donor data, or a
full unredacted assessment report in a public issue. If the problem cannot be described without
that detail, open an issue saying only that you have a security report, and follow up through
the [contact page](https://www.clearconciseconsulting.com/contact).

There is no bug bounty and no committed response time. See the Maintenance Status section of
the [README](README.md#maintenance-status).

## Supported versions

Fixes go to the most recent tagged release.

| Version | Supported |
|---|---|
| 0.1.0 | Yes |

## What this tool does to your org

**`sf agentforce assess` is read-only against the target org.** Every check is a `describe`
call or a read-only SOQL/Tooling API query. See
[src/lib/orgChecks.ts](src/lib/orgChecks.ts) and the four files under
[src/lib/checks/](src/lib/checks/). It does not insert, update, or delete Salesforce records,
and it does not create, modify, activate, or deactivate an agent.

`scorer/score.ts` never connects to Salesforce at all. It reads a local YAML answers file and
prints a score.

Both write to stdout or to a local file. Neither writes to the org.

## Handling the output

An assessment report names your agents, planner bundles, plugin instruction definitions, and
which consent fields exist on Contact, Lead, and Account. That is a description of your AI
configuration surface. Treat it as internal material, redact it before attaching it to a public
issue, and do not commit one to a public repository.

Your completed answers file is a written record of governance gaps your organization has not
closed yet. Keep it out of public repositories for the same reason.

## Credentials

This plugin uses the authentication the Salesforce CLI already holds for the target org. It
does not read, store, log, or transmit credentials of its own.

Never commit auth files, `.env` files, connected app secrets, org IDs, or donor data to this
repository, including in issues and pull requests.

## Sandbox first

Run the assessment against a sandbox before production. The checks are read-only either way,
and Agentforce metadata shapes have been moving between API versions, so a sandbox run tells
you whether a check reads your org correctly before you rely on it.

## A note specific to this kit

Several checks, the Einstein Trust Layer field names in particular, are best-effort against
Salesforce's published Metadata API documentation and have not been confirmed against a live
org with Agentforce enabled. The README says this, and each check file says it in its own
header. A check reporting "could not determine" means the tool could not read the setting, not
that the setting is off. Do not record a governance control as satisfied on the strength of
this output alone. Confirm it in Setup.

## What this tool does not do

It does not certify, validate, or determine compliance with any standard, framework, or
program, including NIST AI RMF and ISO 42001, which it references for structure only. The
policy templates are drafting starting points, not legal advice. Both the scorecard and the org
checks produce evidence for a person with authority at your organization to review.
