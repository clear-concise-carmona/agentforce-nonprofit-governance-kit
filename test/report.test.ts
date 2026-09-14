import { expect } from "chai";
import { renderMarkdownReport } from "../src/lib/report";
import { OrgCheckResult } from "../src/lib/orgChecks";

describe("renderMarkdownReport", () => {
  const baseResult: OrgCheckResult = {
    scannedAt: "2026-09-14T00:00:00.000Z",
    trustLayer: { available: true, einsteinGenerativeAiEnabled: true, dataMaskingEnabled: true, toxicityDetectionEnabled: false },
    promptTemplates: { plannerBundleCount: 1, pluginInstructionCount: 0, plannerBundleNames: ["Donor_Support_Agent"], pluginInstructionNames: [], errors: [] },
    consentFields: {
      objects: [{ sobject: "Contact", exists: true, consentFieldsFound: ["HasOptedOutOfEmail"] }],
      anyConsentFieldFound: true,
    },
    agentInventory: { agentCount: 1, agentDeveloperNames: ["Donor_Support_Agent"], activeVersionCount: 1, errors: [], topicScopingVerified: false },
  };

  it("includes the org label in the heading", () => {
    const md = renderMarkdownReport(baseResult, "test-org");
    expect(md).to.include("test-org");
  });

  it("reports trust layer booleans", () => {
    const md = renderMarkdownReport(baseResult, "test-org");
    expect(md).to.include("Data masking enabled: yes");
    expect(md).to.include("Toxicity detection enabled: no");
  });

  it("reports 'could not determine' when a trust layer field is unread", () => {
    const unread: OrgCheckResult = {
      ...baseResult,
      trustLayer: { available: true, einsteinGenerativeAiEnabled: undefined, dataMaskingEnabled: undefined, toxicityDetectionEnabled: undefined },
    };
    const md = renderMarkdownReport(unread, "test-org");
    expect(md).to.include("could not determine");
  });

  it("surfaces check errors as notes instead of throwing", () => {
    const withErrors: OrgCheckResult = {
      ...baseResult,
      promptTemplates: { ...baseResult.promptTemplates, errors: ["Could not query GenAiPlannerBundle via the Tooling API (test)."] },
    };
    const md = renderMarkdownReport(withErrors, "test-org");
    expect(md).to.include("Could not query GenAiPlannerBundle");
  });

  it("links to the Six Gates framework page", () => {
    const md = renderMarkdownReport(baseResult, "test-org");
    expect(md).to.include("clearconciseconsulting.com/ai-center-of-excellence");
  });
});
