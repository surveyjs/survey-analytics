import { SurveyModel, QuestionCommentModel, ComponentCollection } from "survey-core";
import { WordCloud } from "../src/wordcloud/wordcloud";
import { Text } from "../src/text";
import { SelectBase } from "../src/selectBase";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";
import { VisualizationPanel } from "../src/visualizationPanel";
import { VisualizationComposite } from "../src/visualizationComposite";
import { VisualizationManager } from "../src/visualizationManager";

VisualizationManager.registerVisualizer("comment", Text);
VisualizationManager.registerVisualizer("comment", WordCloud);
VisualizationManager.registerAltVisualizerSelector(AlternativeVisualizersWrapper);

test("custom component: single", () => {
  ComponentCollection.Instance.add({
    name: "customtext",
    inheritBaseProps: ["placeholder"],
    questionJSON: {
      type: "text",
      placeholder: "placeholder"
    },
  });

  const survey = new SurveyModel({
    elements: [
      { type: "customtext", name: "q1" }
    ]
  });
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), [], {});
  expect(visPanel.visualizers.length).toEqual(1);
  expect(visPanel.visualizers[0].type).toEqual("alternative");
  const altVis = visPanel.visualizers[0] as AlternativeVisualizersWrapper;
  expect(altVis.getVisualizers().length).toEqual(2);
  expect(altVis.getVisualizers()[0].type).toEqual("wordcloudmodel");
  expect(altVis.getVisualizers()[1].type).toEqual("text");

  ComponentCollection.Instance.clear();
});

test("custom component: composite", () => {
  ComponentCollection.Instance.add({
    name: "test_composite",
    elementsJSON: [
      { type: "text", name: "q1" },
      { type: "dropdown", name: "q2", choices: [1, 2, 3] },
      { type: "text", inputType: "number", name: "q3" }
    ],
  });

  const survey = new SurveyModel({
    elements: [
      { type: "test_composite", name: "q1" }
    ]
  });
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), [], {});
  expect(VisualizationComposite).toBeDefined();
  expect(visPanel.visualizers.length).toEqual(1);
  expect(visPanel.visualizers[0].type).toEqual("composite");
  const compositePanelVis = (visPanel.visualizers[0] as VisualizationComposite).contentVisualizer;
  expect(compositePanelVis.visualizers.length).toEqual(3);
  expect(compositePanelVis.visualizers[0].type).toEqual("alternative");
  expect(compositePanelVis.visualizers[1].type).toEqual("chartmodel");
  expect(compositePanelVis.visualizers[2].type).toEqual("alternative");

  ComponentCollection.Instance.clear();
});

test("custom component: composite content panel visualizer data", () => {
  ComponentCollection.Instance.add({
    name: "test_composite",
    defaultQuestionTitle: "Composite Question",
    elementsJSON: [
      { type: "text", name: "q1" },
      { type: "dropdown", name: "q2", choices: [1, 2, 3] },
      { type: "text", inputType: "number", name: "q3" }
    ],
  });

  const survey = new SurveyModel({
    elements: [
      { type: "test_composite", name: "q1" }
    ]
  });
  const surveyData = [{
    "q1": {
      "q1": "testValue",
      "q2": "another testValue",
    }
  }];
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), surveyData, {});
  expect(visPanel.visualizers.length).toEqual(1);
  expect(visPanel.visualizers[0].type).toEqual("composite");
  expect(visPanel.visibleElements[0].displayName).toEqual("Composite Question");
  const compositePanelVis = (visPanel.visualizers[0] as VisualizationComposite).contentVisualizer;
  expect(compositePanelVis.options.dataPath).toBe("q1");
  expect(compositePanelVis["surveyData"]).toStrictEqual(surveyData);

  ComponentCollection.Instance.clear();
});
