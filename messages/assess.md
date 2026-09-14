# summary

Check a Salesforce org for Agentforce/Einstein AI governance signals.

# description

Runs a set of read-only checks against the target org - Einstein Trust Layer settings, prompt template and plugin instruction inventory, Agentforce agent inventory, and consent field coverage on donor-facing objects - and writes a Markdown inventory report.

This command produces an inventory, not a score. For the weighted 0-100 readiness score against the Six Salesforce AI Governance Gates, answer the 15 questions in scorer/readiness-questions.yml and run scorer/score.ts.

Nothing in this command writes, updates, or deletes any data in the target org. It only runs describe calls and read-only SOQL/Tooling API queries.

# flags.target-org.summary

Username or alias of the org to check.

# flags.output-file.summary

Path to write the Markdown report to.

# flags.json.summary

Format output as json.

# examples

- <%= config.bin %> <%= command.id %> --target-org my-nonprofit-org

- <%= config.bin %> <%= command.id %> --target-org my-nonprofit-org --output-file reports/2026-09-assess.md
