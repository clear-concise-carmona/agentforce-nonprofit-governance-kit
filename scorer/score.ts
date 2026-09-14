/**
 * score.ts
 *
 * Scores an answered readiness questionnaire against
 * readiness-questions.yml. Answers are supplied as a flat map of
 * question id -> "yes" | "partial" | "no". This is a manual self-assessment
 * scorer (a human answers each question) - it is separate from the
 * automated org checks in src/lib/checks/, which check what the API can
 * actually see. Some questions (e.g. "has a rollback drill been run")
 * cannot be answered from an API call at all - that is why this exists
 * as its own tool instead of trying to force everything into an
 * automated check.
 *
 * Usage:
 *   npx ts-node scorer/score.ts path/to/answers.yml
 *
 * answers.yml shape:
 *   q1_data_quality_score: yes
 *   q2_sharing_model_documented: partial
 *   ...
 */
import * as fs from "node:fs";
import * as path from "node:path";
import * as yaml from "js-yaml";

export type AnswerValue = "yes" | "partial" | "no";

export interface Question {
  id: string;
  weight: number;
  text: string;
}

export interface Gate {
  id: string;
  nist_function: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface QuestionnaireFile {
  gates: Gate[];
}

export interface GateScore {
  gateId: string;
  gateName: string;
  earned: number;
  possible: number;
}

export interface ReadinessScoreResult {
  overallScore: number; // 0-100
  gateScores: GateScore[];
  unanswered: string[];
}

const CREDIT_FOR_ANSWER: Record<AnswerValue, number> = {
  yes: 1,
  partial: 0.5,
  no: 0,
};

export function loadQuestionnaire(questionnairePath: string): QuestionnaireFile {
  const raw = fs.readFileSync(questionnairePath, "utf8");
  return yaml.load(raw) as QuestionnaireFile;
}

export function scoreReadiness(
  questionnaire: QuestionnaireFile,
  answers: Record<string, AnswerValue>
): ReadinessScoreResult {
  const gateScores: GateScore[] = [];
  const unanswered: string[] = [];
  let totalEarned = 0;
  let totalPossible = 0;

  for (const gate of questionnaire.gates) {
    let gateEarned = 0;
    let gatePossible = 0;
    for (const question of gate.questions) {
      gatePossible += question.weight;
      const answer = answers[question.id];
      if (answer === undefined) {
        unanswered.push(question.id);
        continue;
      }
      gateEarned += question.weight * CREDIT_FOR_ANSWER[answer];
    }
    gateScores.push({ gateId: gate.id, gateName: gate.name, earned: gateEarned, possible: gatePossible });
    totalEarned += gateEarned;
    totalPossible += gatePossible;
  }

  const overallScore = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
  return { overallScore, gateScores, unanswered };
}

// Allow running directly: `npx ts-node scorer/score.ts answers.yml`
if (require.main === module) {
  const answersPath = process.argv[2];
  if (!answersPath) {
    console.error("Usage: npx ts-node scorer/score.ts <answers.yml>");
    process.exit(1);
  }
  const questionnaire = loadQuestionnaire(path.join(__dirname, "readiness-questions.yml"));
  const answers = yaml.load(fs.readFileSync(answersPath, "utf8")) as Record<string, AnswerValue>;
  const result = scoreReadiness(questionnaire, answers);

  console.log(`Agentforce Governance Readiness Score: ${result.overallScore}/100`);
  console.log("");
  for (const gate of result.gateScores) {
    console.log(`  Gate ${gate.gateId} - ${gate.gateName}: ${Math.round(gate.earned)}/${gate.possible}`);
  }
  if (result.unanswered.length > 0) {
    console.log("");
    console.log(`Unanswered questions (scored as 0): ${result.unanswered.join(", ")}`);
  }
}
