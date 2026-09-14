/**
 * consentFieldCoverage.ts
 *
 * Checks whether donor-facing objects have a recognizable consent/opt-in
 * field before an agent is allowed to read or act on that data. This uses
 * the standard Describe API (conn.describe), which is stable across API
 * versions - unlike the newer Agentforce metadata types, this check does
 * not depend on unverified 2026 field names.
 *
 * This is a heuristic, not a compliance certification: it flags fields
 * whose API name or label contains a consent-related keyword. A "pass"
 * here means "a plausible consent field exists," not "your consent
 * capture process is compliant." Pair this with a human review of your
 * actual consent workflow - see policy-templates/data-handling-and-consent-policy.md.
 */
import { Connection } from "@salesforce/core";

const CONSENT_KEYWORDS = [
  "consent",
  "optin",
  "opt_in",
  "opt-in",
  "optout",
  "opt_out",
  "opt-out",
  "unsubscribe",
  "donotcontact",
  "do_not_contact",
  "hasoptedout",
  "communicationpreference",
];

const DEFAULT_OBJECTS_TO_CHECK = ["Contact", "Lead", "Account"];

export interface ObjectConsentResult {
  sobject: string;
  exists: boolean;
  consentFieldsFound: string[];
  error?: string;
}

export interface ConsentFieldCoverageResult {
  objects: ObjectConsentResult[];
  anyConsentFieldFound: boolean;
}

export async function checkConsentFieldCoverage(
  conn: Connection,
  objectsToCheck: string[] = DEFAULT_OBJECTS_TO_CHECK
): Promise<ConsentFieldCoverageResult> {
  const objects: ObjectConsentResult[] = [];

  for (const sobject of objectsToCheck) {
    try {
      const describeResult = await conn.describe(sobject);
      const consentFieldsFound = describeResult.fields
        .filter((field) => {
          const haystack = `${field.name} ${field.label ?? ""}`.toLowerCase().replace(/[\s_-]/g, "");
          return CONSENT_KEYWORDS.some((keyword) => haystack.includes(keyword.replace(/[\s_-]/g, "")));
        })
        .map((field) => field.name);

      objects.push({ sobject, exists: true, consentFieldsFound });
    } catch (err: any) {
      if (err?.errorCode === "NOT_FOUND") {
        objects.push({ sobject, exists: false, consentFieldsFound: [] });
      } else {
        objects.push({ sobject, exists: false, consentFieldsFound: [], error: err?.message ?? String(err) });
      }
    }
  }

  return {
    objects,
    anyConsentFieldFound: objects.some((o) => o.consentFieldsFound.length > 0),
  };
}
