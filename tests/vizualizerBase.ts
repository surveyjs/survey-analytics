import { VisualizerBase } from "../src/visualizerBase";

test("custom colors", () => {
  expect(new VisualizerBase(null, null).getColors(1)).toEqual([
    "#86e1fb",
    "#3999fb",
    "#ff6771",
    "#1eb496",
    "#ffc152",
    "#aba1ff",
    "#7d8da5",
    "#4ec46c",
    "#cf37a6",
    "#4e6198",
  ]);

  VisualizerBase.customColors = ["red", "green", "blue"];

  expect(new VisualizerBase(null, null).getColors(2)).toEqual([
    "red",
    "green",
    "blue",
    "red",
    "green",
    "blue",
  ]);
});

test("series options", () => {
  const seriesNames = ["1", "2"];
  const seriesTitles = ["One", "Two"];
  let visualizer = new VisualizerBase(null, null, { seriesNames: seriesNames });
  expect(visualizer.getSeriesNames()).toEqual(seriesNames);
  expect(visualizer.getSeriesTitles()).toEqual(seriesNames);
  visualizer = new VisualizerBase(null, null, {
    seriesNames: seriesNames,
    seriesTitles: seriesTitles,
  });
  expect(visualizer.getSeriesNames()).toEqual(seriesNames);
  expect(visualizer.getSeriesTitles()).toEqual(seriesTitles);
});
