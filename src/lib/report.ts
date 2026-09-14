/**
 * report.ts
 *
 * Renders the automated org-check results as a Markdown report. This is
 * a diagnostic inventory, not a pass/fail grade - the 15-question weighted
 * score comes from scorer/score.ts, answered by a person, because most of
 * the Six Gates require judgment (has a rollback drill actually happened?)
 * that no API call can confirm.
 */
import { OrgCheckResult } from "./orgChecks";

export function renderMarkdownReport(result: OrgCheckResult, orgLabel: string): string {
  const lines: string[] = [];

  lines.push(`# Agentforce Governance Org Check: ${orgLabel}`);
  lines.push("");
  lines.push(`Scanned at: ${result.scannedAt}`);
  lines.push("");
  lines.push(
    "This is a read-only inventory of what the org's API currently exposes. " +
      "It does not replace the 15-question readiness scorecard (see scorer/) " +
      "or a human design review. Some Agentforce metadata type names used " +
      "below are best-effort and unconfirmed against a live 2026 org - see " +
      "each check's source file for details."
  );
  lines.push("");

  lines.push("## Einstein Trust Layer settings");
  lines.push("");
  if (result.trustLayer.available) {
    lines.push(`- Generative AI enabled: ${formatBool(result.trustLayer.einsteinGenerativeAiEnabled)}`);
    lines.push(`- Data masking enabled: ${formatBool(result.trustLayer.dataMaskingEnabled)}`);
    lines.push(`- Toxicity detection enabled: ${formatBool(result.trustLayer.toxicityDetectionEnabled)}`);
  } else {
    lines.push(`- Could not read EinsteinGptSettings: ${result.trustLayer.error ?? "unknown error"}`);
  }
  lines.push("");

  lines.push("## Prompt template and plugin instruction inventory");
  lines.push("");
  lines.push(`- Planner bundles found: ${result.promptTemplates.plannerBundleCount}`);
  if (result.promptTemplates.plannerBundleNames.length > 0) {
    lines.push(`  - ${result.promptTemplates.plannerBundleNames.join(", ")}`);
  }
  lines.push(`- Plugin instruction definitions found: ${result.promptTemplates.pluginInstructionCount}`);
  if (result.promptTemplates.pluginInstructionNames.length > 0) {
    lines.push(`  - ${result.promptTemplates.pluginInstructionNames.join(", ")}`);
  }
  for (const error of result.promptTemplates.errors) {
    lines.push(`- Note: ${error}`);
  }
  lines.push("");

  lines.push("## Agentforce agent inventory");
  lines.push("");
  lines.push(`- Agents (BotDefinition) found: ${result.agentInventory.agentCount}`);
  if (result.agentInventory.agentDeveloperNames.length > 0) {
    lines.push(`  - ${result.agentInventory.agentDeveloperNames.join(", ")}`);
  }
  lines.push(`- Published agent versions: ${result.agentInventory.activeVersionCount}`);
  lines.push(
    "- Topic and tool/action scoping: not independently verified by this check - confirm by hand in " +
      "Setup > Agentforce Agents. See src/lib/checks/agentTopicsAndActions.ts."
  );
  for (const error of result.agentInventory.errors) {
    lines.push(`- Note: ${error}`);
  }
  lines.push("");

  lines.push("## Consent field coverage");
  lines.push("");
  for (const obj of result.consentFields.objects) {
    if (!obj.exists) {
      lines.push(`- ${obj.sobject}: not found in this org${obj.error ? ` (${obj.error})` : ""}`);
      continue;
    }
    if (obj.consentFieldsFound.length > 0) {
      lines.push(`- ${obj.sobject}: consent-related fields found - ${obj.consentFieldsFound.join(", ")}`);
    } else {
      lines.push(`- ${obj.sobject}: no field with a consent-related name found`);
    }
  }
  if (!result.consentFields.anyConsentFieldFound) {
    lines.push("");
    lines.push(
      "No consent-related field was found by name on any checked object. This does not necessarily mean " +
        "you have no consent process - it means this heuristic didn't find a field it recognized. Confirm " +
        "manually before treating this as a gap."
    );
  }
  lines.push("");

  lines.push("## Next step");
  lines.push("");
  lines.push(
    "Run the 15-question readiness scorecard (`npx ts-node scorer/score.ts <answers.yml>`) to turn this " +
      "inventory plus your team's judgment calls into a weighted 0-100 score against the Six Salesforce AI " +
      "Governance Gates. For the full paid framework and hands-on implementation help, see " +
      "[Clear Concise Consulting's AI Center of Excellence](https://www.clearconciseconsulting.com/ai-center-of-excellence)."
  );

  return lines.join("\n");
}

function formatBool(value: boolean | undefined): string {
  if (value === undefined) return "could not determine";
  return value ? "yes" : "no";
}
