/**
 * einsteinTrustLayerSettings.ts
 *
 * Reads the org's EinsteinGptSettings via the Metadata API - the setting
 * that governs org-level generative AI configuration, including the
 * Einstein Trust Layer (data masking, toxicity detection, audit logging).
 * See: https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_einsteingptsettings.htm
 *
 * Honesty note, since this matters for a governance tool specifically:
 * Salesforce's Settings-type metadata (the family EinsteinGptSettings
 * belongs to) is retrieved with `metadata.read("Settings", [<name>])` in
 * most cases, but the exact fullName token and the field shape returned
 * have moved as Agentforce's Summer '26 rollout progressed
 * (https://belmarcloud.com/agentforce-nonprofit-summer-26-is-live/), and
 * this repo has not been validated against a live 2026 org with Agentforce
 * enabled. This function tries the documented retrieval path and reports
 * exactly what it got back - including the raw response - rather than
 * asserting a pass/fail against field names that might not match your
 * org's actual API version. If your org returns a different shape, please
 * open an issue with the (redacted) response so this can be corrected.
 * See CONTRIBUTING.md.
 */
import { Connection } from "@salesforce/core";

export interface TrustLayerCheckResult {
  available: boolean;
  raw?: unknown;
  error?: string;
  /** Best-effort reads - undefined means "could not determine from the response we got", not "off". */
  einsteinGenerativeAiEnabled?: boolean;
  dataMaskingEnabled?: boolean;
  toxicityDetectionEnabled?: boolean;
}

export async function checkEinsteinTrustLayerSettings(conn: Connection): Promise<TrustLayerCheckResult> {
  try {
    const raw = await (conn.metadata as any).read("EinsteinGptSettings", ["EinsteinGpt"]);
    if (!raw) {
      return { available: false, error: "Metadata API returned an empty response for EinsteinGptSettings." };
    }

    // Field names below are best-effort guesses based on the documented
    // metadata type and are NOT confirmed against a live org - see the
    // module docstring. Read defensively; never throw on a missing field.
    const record = Array.isArray(raw) ? raw[0] : raw;
    const einsteinGenerativeAiEnabled = readBoolean(record, [
      "enableEinsteinGenerativeAI",
      "einsteinGenerativeAiEnabled",
    ]);
    const dataMaskingEnabled = readBoolean(record, ["dataMaskingEnabled", "enableDataMasking"]);
    const toxicityDetectionEnabled = readBoolean(record, ["toxicityDetectionEnabled", "enableToxicityDetection"]);

    return {
      available: true,
      raw: record,
      einsteinGenerativeAiEnabled,
      dataMaskingEnabled,
      toxicityDetectionEnabled,
    };
  } catch (err: any) {
    return {
      available: false,
      error: err?.message ?? String(err),
    };
  }
}

function readBoolean(record: any, candidateKeys: string[]): boolean | undefined {
  if (!record || typeof record !== "object") {
    return undefined;
  }
  for (const key of candidateKeys) {
    if (key in record) {
      const value = record[key];
      if (typeof value === "boolean") {
        return value;
      }
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
    }
  }
  return undefined;
}
