import { SurveyModel } from "survey-core";
import { PivotModel } from "../src/pivot";
import { EditableSeriesListWidget } from "../src/utils/editableSeriesListWidget";

var json = {
  "elements": [
    {
      "type": "radiogroup",
      "name": "question1",
      "title": "Sex",
      "choices": [
        "female",
        "male"
      ]
    },
    {
      "type": "dropdown",
      "name": "question2",
      "title": "Item kind",
      "choices": [
        "Item 1",
        "Item 2",
        "Item 3"
      ],
    },
    {
      "type": "text",
      "inputType": "number",
      "name": "question3",
      "title": "Bill amount",
    }
  ]
};
var data = [
  { question1: "male", question2: "Item 1", question3: 100 },
  { question1: "male", question2: "Item 1", question3: 200 },
  { question1: "male", question2: "Item 2", question3: 300 },
  { question1: "male", question2: "Item 3", question3: 400 },
  { question1: "female", question2: "Item 2", question3: 500 },
  { question1: "female", question2: "Item 2", question3: 600 },
  { question1: "female", question2: "Item 2", question3: 100 },
  { question1: "female", question2: "Item 3", question3: 200 },
  { question1: "female", question2: "Item 3", question3: 300 },
  { question1: "female", question2: "Item 3", question3: 400 },
  { question1: "female", question2: "Item 3", question3: 150 },
  { question1: "female", question2: "Item 1", question3: 250 },
];

var survey = new SurveyModel(json);

// test("onAxisYSelectorChanged removes subsequent selectors when value is empty", () => {
//   const pivot = new PivotModel(survey.getAllQuestions(), data);
//   pivot.setAxisQuestions("question1", "question2", "question3");

//   expect(pivot.primaryYAxes.length).toBe(2);

//   // Mock the unregisterToolbarItem method
//   const originalUnregister = pivot["unregisterToolbarItem"];
//   const mockUnregister = jest.fn();
//   pivot["unregisterToolbarItem"] = mockUnregister;

//   // Mock the axisYSelectors array to have the expected length
//   pivot["axisYSelectors"] = [{} as HTMLDivElement, {} as HTMLDivElement];

//   pivot.onAxisYSelectorChanged(0, "");

//   expect(mockUnregister).toHaveBeenCalledWith("axisYSelector1");
//   expect(pivot.primaryYAxes.length).toBe(1);

//   // Restore original method
//   pivot["unregisterToolbarItem"] = originalUnregister;
// });

// test("onAxisYSelectorChanged adds new selector when value is set", () => {
//   const pivot = new PivotModel(survey.getAllQuestions(), data);
//   pivot.setAxisQuestions("question1", "question2");

//   // Mock the registerToolbarItem method
//   const originalRegister = pivot["registerToolbarItem"];
//   const mockRegister = jest.fn();
//   pivot["registerToolbarItem"] = mockRegister;

//   // Mock the axisYSelectors array to have the expected length
//   pivot["axisYSelectors"] = [{} as HTMLDivElement, {} as HTMLDivElement];

//   pivot.onAxisYSelectorChanged(1, "question3");

//   expect(mockRegister).toHaveBeenCalledWith("axisYSelector2", expect.any(Function), "dropdown");

//   // Restore original method
//   pivot["registerToolbarItem"] = originalRegister;
// });

// test("updateQuestionsSelection prevents duplicate question selection", () => {
//   const pivot = new PivotModel(survey.getAllQuestions(), data);

//   // Mock the onAxisYSelectorChanged method
//   const originalOnAxisYSelectorChanged = pivot.onAxisYSelectorChanged;
//   const mockOnAxisYSelectorChanged = jest.fn();
//   pivot.onAxisYSelectorChanged = mockOnAxisYSelectorChanged;

//   pivot.setAxisQuestions("question1", "question1");
//   pivot["updateQuestionsSelection"]();

//   expect(mockOnAxisYSelectorChanged).toHaveBeenCalledWith(0, undefined);

//   // Restore original method
//   pivot.onAxisYSelectorChanged = originalOnAxisYSelectorChanged;
// });

// test("createAxisYSelector returns undefined when no choices available", () => {
//   const pivot = new PivotModel(survey.getAllQuestions(), data);
//   pivot.setAxisQuestions("question1", "question2", "question3");

//   // All questions are already selected, so no choices should be available
//   const selector = pivot["createAxisYSelector"](2);
//   expect(selector).toBeUndefined();
// });

test("EditableSeriesListWidget without maxSeriesCount shows add button", () => {
  const getOptions = () => survey.getAllQuestions().map(q => ({ value: q.name, text: q.title || q.name }));
  const widget = new EditableSeriesListWidget({
    title: "Y axis",
    items: [{ dataName: "question1", valueName: "question1", aggregation: "count" }],
    getOptions,
    onChange: () => {},
  });
  const root = widget.render();
  const addBtn = root.querySelector(".sa-series-list__add-button");
  expect(addBtn).toBeTruthy();
});

test("EditableSeriesListWidget with maxSeriesCount: 1 hides add button when at limit", () => {
  const getOptions = () => survey.getAllQuestions().map(q => ({ value: q.name, text: q.title || q.name }));
  const widget = new EditableSeriesListWidget({
    title: "Y axis",
    items: [{ dataName: "question1", valueName: "question1", aggregation: "count" }],
    getOptions,
    onChange: () => {},
    maxSeriesCount: 1,
  });
  const root = widget.render();
  const addBtn = root.querySelector(".sa-series-list__add-button");
  expect(addBtn).toBeFalsy();
});

test("EditableSeriesListWidget with maxSeriesCount: 2 shows add button when under limit", () => {
  const getOptions = () => survey.getAllQuestions().map(q => ({ value: q.name, text: q.title || q.name }));
  const widget = new EditableSeriesListWidget({
    title: "Y axis",
    items: [{ dataName: "question1", valueName: "question1", aggregation: "count" }],
    getOptions,
    onChange: () => {},
    maxSeriesCount: 2,
  });
  const root = widget.render();
  const addBtn = root.querySelector(".sa-series-list__add-button");
  expect(addBtn).toBeTruthy();
});
