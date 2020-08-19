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
  expect(vis.layoutEngine.allowed).toBe(false);
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
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), data);

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

  visPanel.onStateChanged.add(() => {
    count++;
  });

  expect(visPanel.state).toEqual(initialState);

  visPanel.state = newState;
  expect(visPanel.state).toEqual(newState);
  expect(count).toBe(0);

  visPanel.locale = "ru";
  expect(count).toBe(1);
  expect(visPanel.state.locale).toEqual("ru");
});

test("getState/setState and results order", () => {
  const json = {
    elements: [
      {
        type: "text",
        name: "question1",
      },
      {
        type: "text",
        name: "question2",
      },
    ],
  };
  const data = [
    {
      question1: "1-1",
      question2: "1-2",
    },
    {
      question1: "2-1",
      question2: "2-2",
    },
  ];
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), data);

  const oldState = visPanel.state;

  visPanel["moveElement"](0, 1);

  expect(oldState.elements[0].name).toEqual(visPanel.state.elements[1].name);
  expect(oldState.elements[1].name).toEqual(visPanel.state.elements[0].name);
});

test("onVisibleElementsChanged and onStateChanged raised on move element", () => {
  const originalElements = [{ name: "el1" }, { name: "el2" }, { name: "el3" }];
  const resultElements = [{ name: "el2" }, { name: "el3" }, { name: "el1" }];
  let visPanel = new VisualizationPanel([], [], {}, <any>originalElements);
  let onVisibleElementsChangedСllCount = 0;
  visPanel.onVisibleElementsChanged.add((_, options) => {
    onVisibleElementsChangedСllCount++;
    expect(options.changed.name).toEqual("el1");
    expect(options.reason).toEqual("MOVED");
  });
  let onStateChangedCallCount = 0;
  visPanel.onStateChanged.add((_, options) => {
    onStateChangedCallCount++;
  });
  expect(onStateChangedCallCount).toEqual(0);
  expect(onVisibleElementsChangedСllCount).toEqual(0);

  visPanel["moveElement"](0, 2);
  expect(onStateChangedCallCount).toEqual(1);
  expect(onVisibleElementsChangedСllCount).toEqual(1);
  expect(visPanel.getElements()).toEqual(resultElements);
});

test("setFilter method", () => {
  var data = [
    {
      q2: "father",
      q1: "mother",
    },
    {
      q2: "father",
    },
    {
      q1: "mother",
    },
    {
      q1: "sister",
    },
  ];
  const panel = new VisualizationPanel([], data);
  expect(panel["data"]).toEqual(data);
  panel.setFilter("q1", "sister");
  expect(panel["data"]).toEqual([
    {
      q1: "sister",
    },
  ]);
  panel.setFilter("q1", "mother");
  expect(panel["data"]).toEqual([
    {
      q2: "father",
      q1: "mother",
    },
    {
      q1: "mother",
    },
  ]);
  panel.setFilter("q2", "father");
  expect(panel["data"]).toEqual([
    {
      q2: "father",
      q1: "mother",
    },
  ]);
  panel.setFilter("q2", undefined);
  expect(panel["data"]).toEqual([
    {
      q2: "father",
      q1: "mother",
    },
    {
      q1: "mother",
    },
  ]);
});

test("moveVisibleElement if hidden elements exist", () => {
  const originalElements = [
    { name: "el0", visibility: 0 },
    { name: "el1", visibility: 1 },
    { name: "el2", visibility: 0 },
    { name: "el3", visibility: 1 },
    { name: "el4", visibility: 0 },
  ];
  const resultElements = [
    { name: "el0", visibility: 0 },
    { name: "el1", visibility: 1 },
    { name: "el4", visibility: 0 },
    { name: "el2", visibility: 0 },
    { name: "el3", visibility: 1 },
  ];
  let visPanel = new VisualizationPanel([], [], {}, <any>originalElements);

  visPanel["moveVisibleElement"](2, 1); // should be transform to visPanel["moveElement"](4, 2);

  expect(visPanel.state.elements).toEqual(resultElements);
});

test("get/set permissions, onPermissionsChangedCallback", () => {
  const json = {
    elements: [
      {
        type: "text",
        name: "question1",
      },
      {
        type: "text",
        name: "question2",
      },
    ],
  };
  const data = [
    {
      question1: "1-1",
      question2: "1-2",
    },
    {
      question1: "2-1",
      question2: "2-2",
    },
  ];
  let count = 0;
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), data);

  const p = visPanel.permissions;
  visPanel.permissions = p;

  visPanel.onPermissionsChangedCallback = () => {
    count++;
  };

  expect(visPanel.permissions[0].name).toEqual("question1");
  expect(visPanel.permissions[0].visibility).toEqual(0);

  const newPermissions = visPanel.permissions;
  newPermissions[0].visibility = 2;

  visPanel.permissions = newPermissions;

  expect(count).toEqual(1);
  expect(visPanel.permissions[0].visibility).toEqual(2);
});
