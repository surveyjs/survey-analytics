import { SurveyModel, QuestionTextModel } from "survey-core";
import { VisualizationPanelDynamic } from "../src/visualizationPanelDynamic";

test("check paneldynamic visualization getQuestions() when panels count is 0", () => {
  const json = {
    elements: [
      {
        name: "question1",
        type: "paneldynamic",
        isRequired: true,
        templateElements: [
          {
            type: "text",
            name: "question2",
          },
        ],
      },
    ],
  };
  const data = [
    {
      question1: [{ question2: "testValue" }],
    },
  ];
  const survey = new SurveyModel(json);
  const question = survey.getAllQuestions()[0];
  const viz = new VisualizationPanelDynamic(<any>question, data, {});
  expect(viz.getQuestions()).toBeTruthy();
});

test("check onAfterRender", () => {
  const json = {
    elements: [
      {
        name: "question1",
        type: "paneldynamic",
        isRequired: true,
        templateElements: [
          {
            type: "text",
            name: "question2",
          },
        ],
      },
    ],
  };
  const data = [
    {
      question1: [{ question2: "testValue" }],
    },
  ];

  const survey = new SurveyModel(json);
  const question = survey.getAllQuestions()[0];
  const vis: any = new VisualizationPanelDynamic(<any>question, data, {});
  let count = 0;
  vis.onAfterRender.add(() => {
    count++;
  });
  vis["_panelVisualizer"].afterRender(null);
  expect(count).toEqual(1);
});
