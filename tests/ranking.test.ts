import { vi } from "vitest";

window.URL.createObjectURL = vi.fn();
import { QuestionRankingModel } from "survey-core";
import { RankingModel } from "../src/ranking";

test("applyResultToPlotlyData method", () => {
  const rp = new RankingModel(<any>{}, null);

  const result = ["c", "b", "a"];
  const plotlyData = [0, 0, 0];
  const choices = ["a", "b", "c"];

  rp.applyResultToPlotlyData(null, plotlyData, choices);
  rp.applyResultToPlotlyData(result, null, choices);
  rp.applyResultToPlotlyData(result, plotlyData, null);
  expect(plotlyData).toEqual([0, 0, 0]);

  rp.applyResultToPlotlyData(result, plotlyData, choices);
  rp.applyResultToPlotlyData(result, plotlyData, choices);

  expect(plotlyData).toEqual([2, 4, 6]);
});

test("Ranking reads the answers by the question's valueName (question valueName)", async () => {
  const json = { type: "ranking", name: "r", choices: ["a", "b", "c"] };
  const flatQuestion = new QuestionRankingModel("r");
  flatQuestion.fromJSON(json);
  const question = new QuestionRankingModel("r");
  question.fromJSON({ ...json, valueName: "rv" });

  const flatResult = await new RankingModel(flatQuestion, [{ r: ["c", "b", "a"] }, { r: ["a", "c", "b"] }]).getCalculatedValues();
  const result = await new RankingModel(question, [{ rv: ["c", "b", "a"] }, { rv: ["a", "c", "b"] }]).getCalculatedValues();

  expect(flatResult.data).not.toEqual([[0, 0, 0]]);
  expect(result).toEqual(flatResult);
});
