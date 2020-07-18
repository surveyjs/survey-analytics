import { SurveyModel } from "survey-core";
import { VisualizationPanel } from "../src/visualizationPanel";

test("allowDynamicLayout option", () => {
  const json = {
    elements: [
      {
        name: "question1",
        type: "paneldynamic",
        isRequired: true,
        templateElements: [
          {
            type: "text",
            name: "question2"
          }
        ]
      }
    ]
  };
  const data = [
    {
      question1: [{ question2: "testValue" }]
    }
  ];
  const survey = new SurveyModel(json);
  let viz = new VisualizationPanel(
    survey.getAllQuestions(),
    data,
    {}
  );
  expect(viz.allowDynamicLayout).toBeTruthy();
  viz = new VisualizationPanel(
    survey.getAllQuestions(),
    data,
    { allowDynamicLayout: false }
  );
  expect(viz.allowDynamicLayout).toBeFalsy();

  viz.render(document.createElement("div"));
  expect(viz.layoutEngine).toBe(undefined);
});

test("allowHideQuestions option", () => {
  const json = {
    elements: [
      {
        name: "question1",
        type: "paneldynamic",
        isRequired: true,
        templateElements: [
          {
            type: "text",
            name: "question2"
          }
        ]
      }
    ]
  };
  const data = [
    {
      question1: [{ question2: "testValue" }]
    }
  ];
  const survey = new SurveyModel(json);
  let viz = new VisualizationPanel(
    survey.getAllQuestions(),
    data,
    { allowDynamicLayout: false }
  );
  expect(viz.allowHideQuestions).toBeTruthy();
  viz.render(document.createElement("div"));
  var innerViz = viz["visualizers"][0]
  expect(innerViz.toolbarItemCreators["removeQuestion"]).toBeDefined();

  viz = new VisualizationPanel(
    survey.getAllQuestions(),
    data,
    { allowDynamicLayout: false, allowHideQuestions: false }
  );
  expect(viz.allowHideQuestions).toBeFalsy();
  viz.render(document.createElement("div"));
  innerViz = viz["visualizers"][0]
  expect(innerViz.toolbarItemCreators["removeQuestion"]).toBeUndefined();
});
