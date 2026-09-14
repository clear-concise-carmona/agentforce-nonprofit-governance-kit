import { expect } from "chai";
import * as path from "node:path";
import { loadQuestionnaire, scoreReadiness, QuestionnaireFile } from "../scorer/score";

describe("scoreReadiness", () => {
  const questionnaire: QuestionnaireFile = loadQuestionnaire(
    path.join(__dirname, "..", "scorer", "readiness-questions.yml")
  );

  it("loads exactly 15 questions across 6 gates", () => {
    expect(questionnaire.gates).to.have.length(6);
    const totalQuestions = questionnaire.gates.reduce((sum, g) => sum + g.questions.length, 0);
    expect(totalQuestions).to.equal(15);
  });

  it("weights sum to exactly 100", () => {
    const totalWeight = questionnaire.gates.reduce(
      (sum, g) => sum + g.questions.reduce((s, q) => s + q.weight, 0),
      0
    );
    expect(totalWeight).to.equal(100);
  });

  it("scores 100 when every question is answered yes", () => {
    const answers: Record<string, "yes"> = {};
    for (const gate of questionnaire.gates) {
      for (const q of gate.questions) {
        answers[q.id] = "yes";
      }
    }
    const result = scoreReadiness(questionnaire, answers);
    expect(result.overallScore).to.equal(100);
    expect(result.unanswered).to.have.length(0);
  });

  it("scores 0 when every question is answered no", () => {
    const answers: Record<string, "no"> = {};
    for (const gate of questionnaire.gates) {
      for (const q of gate.questions) {
        answers[q.id] = "no";
      }
    }
    const result = scoreReadiness(questionnaire, answers);
    expect(result.overallScore).to.equal(0);
  });

  it("gives half credit for partial answers", () => {
    const answers: Record<string, "partial"> = {};
    for (const gate of questionnaire.gates) {
      for (const q of gate.questions) {
        answers[q.id] = "partial";
      }
    }
    const result = scoreReadiness(questionnaire, answers);
    expect(result.overallScore).to.equal(50);
  });

  it("lists unanswered questions instead of silently scoring them", () => {
    const result = scoreReadiness(questionnaire, {});
    expect(result.unanswered).to.have.length(15);
    expect(result.overallScore).to.equal(0);
  });
});
