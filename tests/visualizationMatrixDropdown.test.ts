import { SurveyModel, Question } from "survey-core";
import { VisualizationMatrixDropdown } from "../src/visualizationMatrixDropdown";
import { DataProvider } from "../src/dataProvider";

const json = {
  questions: [
    {
      type: "matrixdropdown",
      name: "question2",
      title: "What do you feel about these brands?",
      isRequired: true,
      columns: [
        {
          name: "Column 1",
          title: "My Opinion",
          choices: ["High Quality", "Natural", "Trustworthy"],
        },
        { name: "Column 2", title: "Review Mark", choices: [1, 2, 3, 4, 5] },
        { name: "Column 3", title: "Default choices" },
      ],
      choices: ["one", "two", "three"],
      rows: ["Lizol", "Harpic"],
    },
  ],
};

const data = [
  {
    question1: { Lizol: "Excellent", Harpic: "Excellent" },
    question2: {
      Lizol: { "Column 1": "Trustworthy", "Column 2": 3 },
      Harpic: { "Column 1": "High Quality", "Column 2": 4 },
    },
  },
  {
    question1: { Lizol: "Very Good", Harpic: "Very Good" },
    question2: {
      Lizol: { "Column 1": "Natural", "Column 2": 3 },
      Harpic: { "Column 1": "Natural", "Column 2": 4 },
    },
  },
  {
    question1: { Lizol: "Very Good", Harpic: "Good" },
    question2: {
      Lizol: { "Column 1": "Natural", "Column 2": 1 },
      Harpic: { "Column 1": "Trustworthy", "Column 2": 5 },
    },
  },
];

let visualizer: VisualizationMatrixDropdown = undefined;

beforeEach(() => {
  const survey = new SurveyModel(json);
  const question = survey.getQuestionByName("question2");

  visualizer = new VisualizationMatrixDropdown(<any>question, data);
});

test("getQuestions", () => {
  let questions = visualizer.getQuestions();
  expect(questions.length).toBe(3);
  expect(questions[0].name).toBe("Column 1");
  expect(questions[1].name).toBe("Column 2");
  expect(questions[2].name).toBe("Column 3");
});

test("set data via update", () => {
  let qdata: Array<any> = visualizer["_panelVisualizer"]["data"];
  expect(qdata.length).toBe(6);
  expect(qdata[0]["Column 1"]).toBe("Trustworthy");
});

test("series marker is added to data", () => {
  let qdata: Array<any> = visualizer["_panelVisualizer"]["data"];
  expect(qdata.length).toBe(6);
  expect(qdata[0][DataProvider.seriesMarkerKey]).toBe("Lizol");
  expect(qdata[1][DataProvider.seriesMarkerKey]).toBe("Harpic");
});

test("series options for inner panel visualizer", () => {
  const innerPanelVisualizer = visualizer["_panelVisualizer"];
  expect(innerPanelVisualizer.getSeriesValues()).toEqual(
    json.questions[0].rows
  );
  expect(innerPanelVisualizer.getSeriesLabels()).toEqual(
    json.questions[0].rows
  );
});

test("check onAfterRender", () => {
  let count = 0;
  visualizer.onAfterRender.add(() => {
    count++;
  });
  const innerPanelVisualizer: any = visualizer["_panelVisualizer"];
  innerPanelVisualizer.afterRender();
  expect(count).toEqual(1);
});

test("check default choices - passed from matrixdropdown to default column type", () => {
  let questions = visualizer.getQuestions();
  expect(questions.length).toBe(3);
  const defaultCHoices = questions[2].choices;
  expect(defaultCHoices.length).toBe(3);
  expect(defaultCHoices[0].value).toBe("one");
});
