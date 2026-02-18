import { SurveyModel, QuestionTextModel } from "survey-core";
import { VisualizationPanelDynamic } from "../src/visualizationPanelDynamic";
import { VisualizationPanel } from "../src/visualizationPanel";
import { WordCloud } from "../src/wordcloud/wordcloud";
import { Text } from "../src/text";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";

test("check paneldynamic visualization getQuestions() when panels count is 0", () => {
  const json = {
    elements: [
      {
        name: "question1",
        type: "paneldynamic",
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
  vis.contentVisualizer.afterRender(null);
  expect(count).toEqual(1);
});

test("check content panel visualizer data", () => {
  const json = {
    elements: [
      {
        name: "question1",
        type: "paneldynamic",
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
    {
      question1: [{ question2: "another testValue" }],
    },
  ];

  const survey = new SurveyModel(json);
  const question = survey.getAllQuestions()[0];
  const vis: any = new VisualizationPanelDynamic(<any>question, data, {});

  expect(vis.contentVisualizer.surveyData).toStrictEqual(data);
});

test("A Wordcloud/Text in Table visualizer doesn't display responses for Text question which is located in a dynamic panel - https://github.com/surveyjs/survey-analytics/issues/683", async () => {
  const json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "paneldynamic",
            name: "question1",
            templateElements: [
              {
                type: "radiogroup",
                name: "question2",
                choices: ["Item 1", "Item 2", "Item 3"],
              },
              {
                type: "text",
                name: "question3",
              },
            ],
          },
        ],
      },
    ],
  };
  const data = [
    {
      question1: [
        {
          question2: "Item 1",
          question3: "First response text",
        },
      ],
    },
    {
      question1: [
        {
          question2: "Item 2",
          question3: "Another answer",
        },
        {
          question2: "Item 3",
          question3: "Second panel entry",
        },
      ],
    },
    {
      question1: [
        {
          question2: "Item 3",
          question3: "Sample text here",
        },
      ],
    },
    {
      question1: [
        {
          question2: "Item 1",
          question3: "Panel item one",
        },
        {
          question2: "Item 2",
          question3: "Panel item two",
        },
        {
          question2: "Item 3",
          question3: "Panel item three",
        },
      ],
    },
  ];

  const survey = new SurveyModel(json);
  const question = survey.getAllQuestions()[0];
  const vis: any = new VisualizationPanelDynamic(<any>question, data, {});
  const innerPanel = vis.contentVisualizer as VisualizationPanel;
  expect(innerPanel.visualizers.length).toBe(2);
  expect(innerPanel.visualizers[0].name).toBe("question2");
  expect(innerPanel.visualizers[1].name).toBe("question3");
  expect(innerPanel.visualizers[1] instanceof AlternativeVisualizersWrapper).toBeTruthy();

  const alternativeWisualizer = innerPanel.visualizers[1] as AlternativeVisualizersWrapper;
  expect(alternativeWisualizer.type).toBe("alternative");

  const textWisualizers = alternativeWisualizer.getVisualizers();
  expect(textWisualizers[0] instanceof WordCloud).toBeTruthy();
  expect(textWisualizers[1] instanceof Text).toBeTruthy();

  const textWisualizer = textWisualizers[1] as Text;
  expect(await textWisualizer.getCalculatedValues()).toStrictEqual({ "columnCount": 1, "data": [["First response text"], ["Another answer"], ["Second panel entry"], ["Sample text here"], ["Panel item one"], ["Panel item two"], ["Panel item three"]] });
  const wordcloudWisualizer = textWisualizers[0] as WordCloud;
  expect(await wordcloudWisualizer.getCalculatedValues()).toStrictEqual([["response", 1], ["text", 2], ["answer", 1], ["panel", 4], ["entry", 1], ["sample", 1], ["item", 3]]);
});
