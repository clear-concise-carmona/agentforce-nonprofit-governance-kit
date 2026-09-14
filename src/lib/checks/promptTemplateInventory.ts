/**
 * promptTemplateInventory.ts
 *
 * Inventories prompt templates and generative AI plugin instructions
 * configured in the org via the Tooling API. `GenAiPluginInstructionDef`
 * and `GenAiPlannerBundle` are the two Metadata/Tooling API type names
 * documented on Salesforce's Agentforce developer reference as of this
 * build (https://developer.salesforce.com/docs/ai/agentforce/references/agents-metadata-tooling/agents-metadata.html),
 * but that same page opens with "Agent metadata changed in v68" - this
 * surface moves fast. Each query below is wrapped independently so one
 * object not existing in your org's API version doesn't sink the whole
 * check - see CONTRIBUTING.md if a query here needs correcting for a
 * newer API version.
 */
import { Connection } from "@salesforce/core";

export interface PromptTemplateInventoryResult {
  plannerBundleCount: number;
  pluginInstructionCount: number;
  plannerBundleNames: string[];
  pluginInstructionNames: string[];
  errors: string[];
}

export async function checkPromptTemplateInventory(conn: Connection): Promise<PromptTemplateInventoryResult> {
  const errors: string[] = [];
  let plannerBundleNames: string[] = [];
  let pluginInstructionNames: string[] = [];

  try {
    const result = await conn.tooling.query<{ DeveloperName: string }>(
      "SELECT DeveloperName FROM GenAiPlannerBundle"
    );
    plannerBundleNames = result.records.map((r) => r.DeveloperName).filter(Boolean);
  } catch (err: any) {
    errors.push(
      `Could not query GenAiPlannerBundle via the Tooling API (${err?.message ?? err}). ` +
        "This object name is unconfirmed against a live org for this build - see the module docstring."
    );
  }

  try {
    const result = await conn.tooling.query<{ DeveloperName: string }>(
      "SELECT DeveloperName FROM GenAiPluginInstructionDef"
    );
    pluginInstructionNames = result.records.map((r) => r.DeveloperName).filter(Boolean);
  } catch (err: any) {
    errors.push(
      `Could not query GenAiPluginInstructionDef via the Tooling API (${err?.message ?? err}). ` +
        "This object name is unconfirmed against a live org for this build - see the module docstring."
    );
  }

  return {
    plannerBundleCount: plannerBundleNames.length,
    pluginInstructionCount: pluginInstructionNames.length,
    plannerBundleNames,
    pluginInstructionNames,
    errors,
  };
}
