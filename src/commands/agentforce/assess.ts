import * as fs from "node:fs";
import * as path from "node:path";
import { SfCommand, Flags } from "@salesforce/sf-plugins-core";
import { Messages } from "@salesforce/core";
import { runAllOrgChecks } from "../../lib/orgChecks";
import { renderMarkdownReport } from "../../lib/report";

// __dirname here (commonjs build output) resolves to lib/commands/agentforce
// at runtime, so walk up to the package root to find messages/.
Messages.importMessagesDirectory(path.join(__dirname, "..", "..", ".."));
const messages = Messages.loadMessages("agentforce-nonprofit-governance-kit", "assess");

export type AssessCommandResult = {
  agentCount: number;
  reportPath: string;
};

/**
 * `sf agentforce assess`
 *
 * Runs the automated, read-only org checks (Einstein Trust Layer settings,
 * prompt template inventory, agent inventory, consent field coverage) and
 * writes a Markdown report. This is an inventory, not a score - run the
 * 15-question scorecard in scorer/ for a weighted 0-100 readiness score.
 */
export default class AgentforceAssess extends SfCommand<AssessCommandResult> {
  public static readonly summary = messages.getMessage("summary");
  public static readonly description = messages.getMessage("description");
  public static readonly examples = messages.getMessages("examples");

  public static readonly flags = {
    "target-org": Flags.requiredOrg({
      summary: messages.getMessage("flags.target-org.summary"),
    }),
    "output-file": Flags.file({
      char: "f",
      summary: messages.getMessage("flags.output-file.summary"),
      default: "agentforce-governance-org-check.md",
    }),
    json: Flags.boolean({
      summary: messages.getMessage("flags.json.summary"),
      default: false,
    }),
  };

  public async run(): Promise<AssessCommandResult> {
    const { flags } = await this.parse(AgentforceAssess);
    const org = flags["target-org"];
    const conn = org.getConnection();

    this.spinner.start("Checking org for Agentforce governance signals");
    const result = await runAllOrgChecks(conn);
    this.spinner.stop();

    const orgLabel = org.getUsername() ?? org.getOrgId();
    const reportMarkdown = renderMarkdownReport(result, orgLabel ?? "unknown org");
    const outputPath = path.resolve(flags["output-file"]);
    fs.writeFileSync(outputPath, reportMarkdown, "utf8");

    this.log("");
    this.log(`Agents found: ${result.agentInventory.agentCount}`);
    this.log(`Report written to: ${outputPath}`);
    this.log("");
    this.log(
      "This is an inventory, not a score. Run the 15-question scorecard in scorer/ " +
        "for a weighted 0-100 readiness score against the Six Salesforce AI Governance Gates."
    );

    return {
      agentCount: result.agentInventory.agentCount,
      reportPath: outputPath,
    };
  }
}
