import { SurveyModel, QuestionCommentModel } from "survey-core";
import { WordCloud } from "../src/wordcloud/wordcloud";
import { Text } from "../src/text";
import { SelectBase } from "../src/selectBase";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";
import { VisualizationPanel } from "../src/visualizationPanel";
import { IState } from "../src/config";
import { VisualizationManager } from "../src/visualizationManager";
import { LayoutEngine } from "../src/layoutEngine";

VisualizationManager.registerVisualizer("comment", Text);
VisualizationManager.registerVisualizer("comment", WordCloud);
VisualizationManager.registerVisualizer("checkbox", SelectBase);
VisualizationManager.registerVisualizer("radiogroup", SelectBase);
VisualizationManager.registerAltVisualizerSelector(AlternativeVisualizersWrapper);

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
        type: "checkbox",
        name: "question1",
        choices: [1, 2, 3]
      },
    ],
  };
  const data = [
    {
      question1: [1, 2],
    },
  ];
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), data);
  let chartVisualizer = visPanel.getVisualizer("question1") as SelectBase;

  expect(chartVisualizer["chartTypes"]).toStrictEqual([]);
  chartVisualizer["chartTypes"] = ["bar", "scatter"];

  let initialState: IState = {
    locale: "",
    elements: [
      {
        displayName: "question1",
        name: "question1",
        isVisible: true,
        isPublic: true,
        chartType: "bar",
        answersOrder: "default",
        hideEmptyAnswers: false,
        topN: -1
      },
    ],
  };
  let newState: IState = {
    locale: "fr",
    elements: [
      {
        displayName: "question1",
        name: "question1",
        isVisible: false,
        isPublic: true,
        chartType: "scatter",
        answersOrder: "asc",
        hideEmptyAnswers: true,
        topN: 10
      },
    ],
  };
  let count = 0;

  visPanel.onStateChanged.add(() => {
    count++;
  });

  expect(visPanel.state).toEqual(initialState);
  visPanel.state = null as any;
  expect(count).toBe(0);

  visPanel.state = newState;
  expect(visPanel.state).toEqual(newState);
  expect(count).toBe(0);

  const visualizer = visPanel.visualizers[0] as SelectBase;
  expect(visualizer.chartType).toBe("scatter");
  expect(visualizer.answersOrder).toBe("asc");
  expect(visualizer.hideEmptyAnswers).toBe(true);
  expect(visualizer.topN).toBe(10);

  visPanel.locale = "ru";
  expect(count).toBe(1);
  expect(visPanel.state.locale).toEqual("ru");

  visualizer.chartType = "bar";
  expect(count).toBe(2);
  expect(visPanel.state.elements![0].chartType).toEqual("bar");

  visualizer.answersOrder = "desc";
  expect(count).toBe(3);
  expect(visPanel.state.elements![0].answersOrder).toEqual("desc");

  visualizer.topN = 5;
  expect(count).toBe(4);
  expect(visPanel.state.elements![0].topN).toEqual(5);

  visualizer.hideEmptyAnswers = false;
  expect(count).toBe(5);
  expect(visPanel.state.elements![0].hideEmptyAnswers).toEqual(false);
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

test("partial state", () => {
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

  visPanel.state = { locale: "ru" };
  visPanel.state = { elements: [] };
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
    { name: "el0", isVisible: true },
    { name: "el1", isVisible: false },
    { name: "el2", isVisible: true },
    { name: "el3", isVisible: false },
    { name: "el4", isVisible: true },
  ];
  const resultElements = [
    { name: "el0", isVisible: true },
    { name: "el1", isVisible: false },
    { name: "el4", isVisible: true },
    { name: "el2", isVisible: true },
    { name: "el3", isVisible: false },
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
  expect(visPanel.permissions[0].isPublic).toEqual(true);

  const newPermissions = visPanel.permissions;
  newPermissions[0].isPublic = false;

  visPanel.permissions = newPermissions;

  expect(count).toEqual(1);
  expect(visPanel.permissions[0].isPublic).toEqual(false);
});

test("check onAfterRender", () => {
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
  var count = 0;
  visPanel.onAfterRender.add(() => {
    count++;
  });
  (<any>visPanel).visualizers[0].afterRender(null);
  expect((<any>visPanel).renderedQuestionsCount).toEqual(1);
  expect(count).toEqual(0);
  (<any>visPanel).visualizers[1].afterRender(null);
  expect((<any>visPanel).renderedQuestionsCount).toEqual(0);
  expect(count).toEqual(1);
});

test("strip html tags from title", () => {
  const json = {
    elements: [
      {
        type: "text",
        name: "question1",
        title: "<p>Some <span class='my-class'>formatted</span> text</p>"
      }
    ],
  };
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), []);
  let element = visPanel.getElement("question1");
  expect(element.displayName).toEqual("Some formatted text");
  visPanel = new VisualizationPanel(survey.getAllQuestions(), [], { stripHtmlFromTitles: false });
  element = visPanel.getElement("question1");
  expect(element.displayName).toEqual(json.elements[0].title);
});

test("pass backgroundColor to children", () => {
  const json = {
    elements: [
      {
        type: "comment",
        name: "question1"
      }
    ],
  };
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), []);
  visPanel.backgroundColor = "red";
  const visualizer: AlternativeVisualizersWrapper = <AlternativeVisualizersWrapper>visPanel.getVisualizer("question1");
  const alternatives = visualizer.getVisualizers();
  const wordcloud: WordCloud = <WordCloud>alternatives[0];
  const text: Text = <Text>alternatives[1];
  expect(visualizer.backgroundColor).toEqual("red");
  expect(wordcloud.backgroundColor).toEqual("red");
  expect(text.backgroundColor).toEqual("red");
});

test("set state for non-existing questions", () => {
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
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), []);

  expect(visPanel.getElements().length).toBe(2);
  expect(visPanel.state).toEqual({
    "elements": [
      {
        "displayName": "question1",
        "isPublic": true,
        "isVisible": true,
        "name": "question1",
        "type": undefined,
        "visualizer": "wordcloud"
      },
      {
        "displayName": "question2",
        "isPublic": true,
        "isVisible": true,
        "name": "question2",
        "type": undefined,
        "visualizer": "wordcloud"
      },
    ],
    "locale": "ru",
  });

  visPanel.state = {
    "elements": [
      {
        "displayName": "question1",
        "isPublic": true,
        "isVisible": true,
        "name": "question1",
      },
      {
        "displayName": "question3",
        "isPublic": true,
        "isVisible": true,
        "name": "question3",
      },
    ],
  };
  expect(visPanel.state).toEqual({
    "elements": [
      {
        "displayName": "question1",
        "isPublic": true,
        "isVisible": true,
        "name": "question1",
        "type": undefined,
        "visualizer": "wordcloud"
      },
    ],
    "locale": "ru",
  });

});

test("updateData should be called in order to update data - #269", () => {
  const json = {
    elements: [{
      name: "satisfaction-score",
      title: "How would you describe your experience with our product?",
      type: "radiogroup",
      choices: [
        { value: 5, text: "Fully satisfying" },
        { value: 4, text: "Generally satisfying" },
        { value: 3, text: "Neutral" },
        { value: 2, text: "Rather unsatisfying" },
        { value: 1, text: "Not satisfying at all" }
      ]
    }, {
      name: "nps-score",
      title: "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
      type: "rating",
      rateMin: 0,
      rateMax: 10,
    }]
  };
  const data = [{
    "satisfaction-score": 5,
    "nps-score": 10
  }, {
    "satisfaction-score": 5,
    "nps-score": 9
  }, {
    "satisfaction-score": 3,
    "nps-score": 6
  }, {
    "satisfaction-score": 3,
    "nps-score": 6
  }, {
    "satisfaction-score": 2,
    "nps-score": 3
  }];
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), data);

  const questionVisualizer = visPanel.visualizers[0];
  expect(questionVisualizer.getCalculatedValues()).toEqual([[0, 1, 2, 0, 2]]);

  const newAnswer = { "satisfaction-score": 4, "nps-score": 9 };
  data.push(newAnswer);
  expect(questionVisualizer.getCalculatedValues()).toEqual([[0, 1, 2, 0, 2]]);

  visPanel.updateData(data);
  expect(questionVisualizer.getCalculatedValues()).toEqual([[0, 1, 2, 1, 2]]);
});

test("hide/show all elements", () => {
  const json = {
    elements: [
      {
        type: "text",
        name: "question1",
      },
      {
        type: "text",
        name: "question2",
      }
    ],
  };
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), [], { layoutEngine: new LayoutEngine(true) });
  let changesCount = 0;
  visPanel.onVisibleElementsChanged.add(() => {
    changesCount++;
  });

  expect(changesCount).toBe(0);
  expect(visPanel.getElements().map(el => el.isVisible)).toStrictEqual([true, true]);
  visPanel.hideAllElements();
  expect(changesCount).toBe(1);
  expect(visPanel.getElements().map(el => el.isVisible)).toStrictEqual([false, false]);
  visPanel.showAllElements();
  expect(changesCount).toBe(2);
  expect(visPanel.getElements().map(el => el.isVisible)).toStrictEqual([true, true]);
});

test("hide/show element", () => {
  const json = {
    elements: [
      {
        type: "text",
        name: "question1",
      },
      {
        type: "text",
        name: "question2",
      }
    ],
  };
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), [], { layoutEngine: new LayoutEngine(true) });
  let changesCount = 0;
  visPanel.onVisibleElementsChanged.add(() => {
    changesCount++;
  });

  expect(changesCount).toBe(0);
  expect(visPanel.getElements().map(el => el.isVisible)).toStrictEqual([true, true]);
  visPanel.hideElement("question1");
  expect(changesCount).toBe(1);
  expect(visPanel.getElements().map(el => el.isVisible)).toStrictEqual([false, true]);
  visPanel.showElement("question1");
  expect(changesCount).toBe(2);
  expect(visPanel.getElements().map(el => el.isVisible)).toStrictEqual([true, true]);
});

test("change language with different locales order", () => {
  var json = {
    locale: "fr",
    questions: [
      {
        type: "dropdown",
        name: "satisfaction",
        title: {
          fr: "Dans quelle mesure êtes-vous satisfait du produit ?",
          default: "How satisfied are you with the Product?",
          ru: "Насколько Вас устраивает наш продукт?",
        },
        choices: [
          {
            value: 0,
            text: {
              default: "Not Satisfied",
              fr: "Pas satisfait",
              ru: "Coвсем не устраивает",
            },
          },
          {
            value: 1,
            text: {
              default: "Satisfied",
              fr: "Satisfait",
              ru: "Устраивает",
            },
          },
          {
            value: 2,
            text: {
              default: "Completely satisfied",
              fr: "Totalement satisfait",
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
  const changeLocaleSelectorCreator = visualizationPanel["toolbarItemCreators"]["changeLocale"] as (el: HTMLElement) => HTMLSelectElement;
  var element = visualizationPanel.getElement("satisfaction");
  expect(visualizationPanel.locale).toEqual("fr");
  expect(visualizationPanel["locales"]).toStrictEqual(["fr", "en", "ru"]);
  expect(element.displayName).toEqual("Dans quelle mesure êtes-vous satisfait du produit ?");
  let localeSelector = changeLocaleSelectorCreator(document.createElement("div"));

  visualizationPanel.locale = "en";
  expect(visualizationPanel.locale).toEqual("");
  expect(visualizationPanel["locales"]).toStrictEqual(["fr", "en", "ru"]);
  expect(element.displayName).toEqual("How satisfied are you with the Product?");
  localeSelector = changeLocaleSelectorCreator(document.createElement("div"));

  visualizationPanel.locale = "fr";
  expect(visualizationPanel.locale).toEqual("fr");
  expect(visualizationPanel["locales"]).toStrictEqual(["fr", "en", "ru"]);
  expect(element.displayName).toEqual("Dans quelle mesure êtes-vous satisfait du produit ?");
  localeSelector = changeLocaleSelectorCreator(document.createElement("div"));
});

test("reorderVisibleElements", () => {
  var json = {
    questions: [
      { type: "text", name: "q1", },
      { type: "text", name: "q2", },
      { type: "text", name: "q3", },
    ],
  };
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), []);
  let stateChagedCounter = 0;
  visPanel.onStateChanged.add((s, o) => {
    stateChagedCounter++;
  });

  const state1 = visPanel.state;
  expect(state1.elements?.map(el => el.name)).toStrictEqual(["q1", "q2", "q3"]);

  visPanel.reorderVisibleElements(["q2", "q1", "q3"]);
  const state2 = visPanel.state;
  expect(state2.elements?.map(el => el.name)).toStrictEqual(["q2", "q1", "q3"]);
  expect(stateChagedCounter).toBe(1);
});
