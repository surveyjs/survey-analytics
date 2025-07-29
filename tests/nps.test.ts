import { SurveyModel } from "survey-core";
import { NpsVisualizer, NpsVisualizerWidget } from "../src/nps";
import { VisualizationManager } from "../src/visualizationManager";
import { GaugePlotly, HistogramPlotly } from "../src/plotly/legacy";
import { VisualizationPanel } from "../src/visualizationPanel";

test("result resultMin resultMax", async () => {
  const question: any = { type: "rating", name: "test" };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  const nps = new NpsVisualizer(question, data);

  let result: any = await nps.getCalculatedValues();

  expect(result.total).toBe(6);
  expect(result.detractors).toBe(1);
  expect(result.passive).toBe(2);
  expect(result.promoters).toBe(3);
});

test("result precision is 2 digits", async () => {
  const question: any = { type: "rating", name: "test" };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  const nps = new NpsVisualizer(question, data);
  const calculations = await nps.getCalculatedValues();
  const widget = new NpsVisualizerWidget(nps, calculations as any);

  expect(widget.npsScore).toBe(33.33);
  expect(widget.detractorsPercent).toBe(16.67);
  expect(widget.passivePercent).toBe(33.33);
  expect(widget.promotersPercent).toBe(50);
});

test("check unregisterVisualizer function", () => {
  VisualizationManager.unregisterVisualizer("rating", HistogramPlotly);
  VisualizationManager.unregisterVisualizer("rating", GaugePlotly);
  VisualizationManager.registerVisualizer("rating", NpsVisualizer);

  const json = {
    "pages": [
      {
        "name": "promotion",
        "elements": [
          {
            "type": "rating",
            "name": "nps",
            "title": "How likely are you to recommend our product to a friend or colleague?",
            "isRequired": true,
            "rateMin": 0,
            "rateMax": 10,
            "minRateDescription": "Most unlikely",
            "maxRateDescription": "Most likely"
          }
        ]
      }
    ]
  };

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function generateData() {
    const data: Array<any> = [];
    for (let index = 0; index < 1000; index++) {
      data.push({ nps: (index % 2) ? randomIntFromInterval(0, 10) : randomIntFromInterval(8, 10) });
    }
    return data;
  }

  try {
    const dataFromServer = generateData();
    const survey = new SurveyModel(json);
    const visPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      dataFromServer,
      { allowDynamicLayout: false, allowHideQuestions: false }
    );

    expect(visPanel.visualizers.length).toBe(1);
    expect(visPanel.visualizers[0].name).toBe("nps");
    expect(visPanel.visualizers[0] instanceof NpsVisualizer).toBeTruthy();
  } finally {
    VisualizationManager.registerVisualizer("rating", HistogramPlotly);
    VisualizationManager.registerVisualizer("rating", GaugePlotly);
    VisualizationManager.unregisterVisualizer("rating", NpsVisualizer);
  }
});