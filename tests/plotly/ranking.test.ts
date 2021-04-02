window.URL.createObjectURL = jest.fn();
import { RankingPlotly } from "../../src/plotly/ranking";

test("applyResultToPlotlyData method", () => {
  const rp = new RankingPlotly(<any>{}, null);

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
