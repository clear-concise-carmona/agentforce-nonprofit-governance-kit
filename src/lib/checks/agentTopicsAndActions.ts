/**
 * agentTopicsAndActions.ts
 *
 * Inventories configured Agentforce agents (Bots/BotVersions) and reports
 * a count of topics/actions where the API exposes them. Salesforce's own
 * developer docs describe the agent identifier as `{Bot}.{BotVersion}`
 * (example: `Agentforce_Service_Agent.v2`) but do not, as of this build,
 * document a single flat Tooling API object that lists every topic and
 * action per agent in one query - see
 * https://developer.salesforce.com/docs/ai/agentforce/references/agents-metadata-tooling/agents-metadata.html.
 *
 * This check queries the standard `BotDefinition` and `BotVersion`
 * Tooling API objects (the same underlying framework Agentforce agents
 * are built on) for an agent count and reports topic/action scoping as
 * "not independently verified" rather than guessing at a metadata shape.
 * Use this output as a starting inventory, then confirm topic/action
 * scoping by hand in Setup > Agentforce Agents until the Tooling API
 * surface for this is confirmed - track this in an issue if you can
 * confirm the current shape. See CONTRIBUTING.md.
 */
import { Connection } from "@salesforce/core";

export interface AgentInventoryResult {
  agentCount: number;
  agentDeveloperNames: string[];
  activeVersionCount: number;
  errors: string[];
  topicScopingVerified: false;
}

export async function checkAgentTopicsAndActions(conn: Connection): Promise<AgentInventoryResult> {
  const errors: string[] = [];
  let agentDeveloperNames: string[] = [];
  let activeVersionCount = 0;

  try {
    const bots = await conn.tooling.query<{ DeveloperName: string }>(
      "SELECT DeveloperName FROM BotDefinition"
    );
    agentDeveloperNames = bots.records.map((r) => r.DeveloperName).filter(Boolean);
  } catch (err: any) {
    errors.push(`Could not query BotDefinition via the Tooling API (${err?.message ?? err}).`);
  }

  try {
    const versions = await conn.tooling.query<{ Id: string; Status?: string }>(
      "SELECT Id, Status FROM BotVersion WHERE Status = 'Published'"
    );
    activeVersionCount = versions.records.length;
  } catch (err: any) {
    errors.push(`Could not query BotVersion via the Tooling API (${err?.message ?? err}).`);
  }

  return {
    agentCount: agentDeveloperNames.length,
    agentDeveloperNames,
    activeVersionCount,
    errors,
    topicScopingVerified: false,
  };
}
