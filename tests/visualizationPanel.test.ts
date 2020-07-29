import { SurveyModel } from "survey-core";
import { VisualizationPanel } from "../src/visualizationPanel";
import { IState } from "../src/config";

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
  let vis = new VisualizationPanel(survey.getAllQuestions(), data, {});
  expect(vis.allowDynamicLayout).toBeTruthy();
  vis = new VisualizationPanel(survey.getAllQuestions(), data, {
    allowDynamicLayout: false,
  });
  expect(vis.allowDynamicLayout).toBeFalsy();

  vis.render(document.createElement("div"));
  expect(vis.layoutEngine).toBe(undefined);
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
  let vis = new VisualizationPanel(survey.getAllQuestions(), data, {
    allowDynamicLayout: false,
  });
  expect(vis.allowHideQuestions).toBeTruthy();
  vis.render(document.createElement("div"));
  var innerVis = vis["visualizers"][0];
  expect(innerVis["toolbarItemCreators"]["removeQuestion"]).toBeDefined();

  vis = new VisualizationPanel(survey.getAllQuestions(), data, {
    allowDynamicLayout: false,
    allowHideQuestions: false,
  });
  expect(vis.allowHideQuestions).toBeFalsy();
  vis.render(document.createElement("div"));
  innerVis = vis["visualizers"][0];
  expect(innerVis["toolbarItemCreators"]["removeQuestion"]).toBeUndefined();
});

test("change language", () => {
  var json = {
    locale: "ru",
    questions: [
      {
        type: "dropdown",
        name: "satisfaction",
        title: {
          default: "How satisfied are you with the Product?",
          ru: "Насколько Вас устраивает наш продукт?",
        },
        choices: [
          {
            value: 0,
            text: {
              default: "Not Satisfied",
              ru: "Coвсем не устраивает",
            },
          },
          {
            value: 1,
            text: {
              default: "Satisfied",
              ru: "Устраивает",
            },
          },
          {
            value: 2,
            text: {
              default: "Completely satisfied",
              ru: "Полностью устраивает",
            },
          },
        ],
      },
    ],
  };
  const survey = new SurveyModel(json);
  let visualizationPanel = new VisualizationPanel(
    survey.getAllQuestions(),
    [],
    { survey: survey }
  );
  var element = visualizationPanel.getElement("satisfaction");
  expect(visualizationPanel.locale).toEqual("ru");
  expect(element.displayName).toEqual("Насколько Вас устраивает наш продукт?");

  visualizationPanel.locale = "en";
  expect(visualizationPanel.locale).toEqual("");
  expect(element.displayName).toEqual(
    "How satisfied are you with the Product?"
  );
});

test("getState, setState, onStateChanged", () => {
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
  let vizPanel = new VisualizationPanel(survey.getAllQuestions(), data, {});

  let initialState: IState = {
    locale: "",
    elements: [
      {
        displayName: "question1",
        name: "question1",
        type: undefined,
        visibility: 0,
      },
    ],
  };
  let newState: IState = {
    locale: "fr",
    elements: [
      {
        displayName: "question2",
        name: "question2",
        type: "bar",
        visibility: 1,
      },
    ],
  };
  let count = 0;

  vizPanel.onStateChanged.add(() => {
    count++;
  });

  expect(vizPanel.state).toEqual(initialState);

  vizPanel.state = newState;
  expect(vizPanel.state).toEqual(newState);
  expect(count).toBe(1);

  vizPanel.locale = "ru";
  expect(count).toBe(2);
  expect(vizPanel.state.locale).toEqual("ru");
});
