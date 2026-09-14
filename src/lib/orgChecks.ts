/**
 * orgChecks.ts
 *
 * Runs every automated, read-only org check and bundles the results.
 * Nothing here modifies data in the target org - every check is a
 * describe call or a read-only SOQL/Tooling API query. This is the
 * automated counterpart to scorer/score.ts, which scores manual yes/
 * partial/no answers a human has to supply for anything an API can't see
 * directly (documentation, drills, reviewer sign-off, and so on).
 */
import { Connection } from "@salesforce/core";
import { checkEinsteinTrustLayerSettings, TrustLayerCheckResult } from "./checks/einsteinTrustLayerSettings";
import { checkPromptTemplateInventory, PromptTemplateInventoryResult } from "./checks/promptTemplateInventory";
import { checkConsentFieldCoverage, ConsentFieldCoverageResult } from "./checks/consentFieldCoverage";
import { checkAgentTopicsAndActions, AgentInventoryResult } from "./checks/agentTopicsAndActions";

export interface OrgCheckResult {
  scannedAt: string;
  trustLayer: TrustLayerCheckResult;
  promptTemplates: PromptTemplateInventoryResult;
  consentFields: ConsentFieldCoverageResult;
  agentInventory: AgentInventoryResult;
}

export async function runAllOrgChecks(conn: Connection): Promise<OrgCheckResult> {
  const [trustLayer, promptTemplates, consentFields, agentInventory] = await Promise.all([
    checkEinsteinTrustLayerSettings(conn),
    checkPromptTemplateInventory(conn),
    checkConsentFieldCoverage(conn),
    checkAgentTopicsAndActions(conn),
  ]);

  return {
    scannedAt: new Date().toISOString(),
    trustLayer,
    promptTemplates,
    consentFields,
    agentInventory,
  };
}
