# Contributing

## This is a moving target on purpose

Agentforce metadata and API shapes are changing fast in 2026. Several checks in this repo say so
explicitly in their own file header, because they were written without access to a live org with
Agentforce enabled and could not be validated end to end. If you run this against a real org and a
field name, object name, or API version is wrong, that is expected and the most useful thing you
can do is open an issue or a PR with the corrected shape.

## Correcting a field name or metadata type

1. Find the check in `src/lib/checks/`. Each file's header comment says which parts are confirmed
   against Salesforce documentation and which are best-effort.
2. Fix the field/object name and update the header comment to say it's now confirmed, with a link
   to the documentation or your own (redacted) API response that confirms it.
3. Add or update a test in `test/` covering the corrected shape.
4. Every check must still degrade gracefully: wrap Salesforce API calls in try/catch and report
   "could not determine" or a note in the report rather than throwing. This tool has to run
   cleanly against orgs with no Agentforce license at all, not just fully-configured ones.

## Adding a new check

- Put query/API logic in its own file under `src/lib/checks/`, one function, one clear return type.
- Wire it into `src/lib/orgChecks.ts` and `src/lib/report.ts`.
- Add a test exercising both the "found something" and "found nothing / API call failed" path.
- If the check maps to one of the Six Gates, say which one in a comment.

## Changing the 15-question scorecard

The scorecard's gate names, gate order, and gate descriptions in `scorer/readiness-questions.yml`
are taken verbatim from Clear Concise Consulting's Six Salesforce AI Governance Gates framework.
Do not rename or reorder the gates without also updating the source citation at the top of that
file. Question wording and weights under a gate can be adjusted; if you change weights, they must
still sum to 100, and say in the PR what motivated the change.

## Code style

TypeScript, strict mode, no `any` beyond what `jsforce`/`@salesforce/core` types force on you.
Direct and plain language in comments and docs - no marketing language, no em dashes.

## Tests

```bash
npm install
npm run build
npm test
```

## Reporting a false positive / false negative

Open an issue with:

- The check name.
- What you expected vs. what you got.
- A redacted description of the org state that triggered it (field/object names are fine to
  share; record data is not).
