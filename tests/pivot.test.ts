import { SurveyModel } from "survey-core";
import { PivotModel } from "../src/pivot";

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

test("default settings", async () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);

  expect(pivot["isSupportMissingAnswers"]()).toBeFalsy();
  expect(pivot["isSupportAnswersOrder"]()).toBeFalsy();

  const values = pivot.getValues();
  const labels = pivot.getLabels();
  const seriesValues = pivot.getSeriesValues();
  const seriesLabels = pivot.getSeriesLabels();

  expect(pivot.axisXQuestionName).toBe("question1");
  expect(pivot.axisYQuestionNames).toStrictEqual([]);
  expect(values).toStrictEqual(["female", "male"]);
  expect(labels).toStrictEqual(["female", "male"]);
  expect(seriesValues).toStrictEqual([]);
  expect(seriesLabels).toStrictEqual([]);

  expect((await pivot.getCalculatedValues()).data).toStrictEqual([[8, 4]]);
});

test("getSeriesValues and getSeriesLabels + values and labels", async () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);

  let values = pivot.getValues();
  let labels = pivot.getLabels();
  let seriesValues = pivot.getSeriesValues();
  let seriesLabels = pivot.getSeriesLabels();

  expect(pivot.axisXQuestionName).toBe("question1");
  expect(pivot.axisYQuestionNames).toStrictEqual([]);
  expect(values).toStrictEqual(["female", "male"]);
  expect(labels).toStrictEqual(["female", "male"]);
  expect(seriesValues).toStrictEqual([]);
  expect(seriesLabels).toStrictEqual([]);

  pivot.setAxisQuestions("question2", "question1");

  values = pivot.getValues();
  labels = pivot.getLabels();
  seriesValues = pivot.getSeriesValues();
  seriesLabels = pivot.getSeriesLabels();

  expect(pivot.axisXQuestionName).toBe("question2");
  expect(pivot.axisYQuestionNames).toStrictEqual(["question1"]);
  expect(values).toStrictEqual(["Item 1", "Item 2", "Item 3"]);
  expect(labels).toStrictEqual(["Item 1", "Item 2", "Item 3"]);
  expect(seriesValues).toStrictEqual(["female", "male"]);
  expect(seriesLabels).toStrictEqual(["female", "male"]);
  expect(pivot.getSeriesValueIndexes()).toStrictEqual({
    "question1_female": 0,
    "question1_male": 1,
  });
});

test("getCalculatedValues", async () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question1", "question2");
  let values = pivot.getValues();
  let seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual(["female", "male"]);
  expect(seriesValues).toStrictEqual(["Item 1", "Item 2", "Item 3"]);
  expect((await pivot.getCalculatedValues()).data).toStrictEqual([[1, 2], [3, 1], [4, 1]]);

  pivot.setAxisQuestions("question2", "question1");
  values = pivot.getValues();
  seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual(["Item 1", "Item 2", "Item 3"]);
  expect(seriesValues).toStrictEqual(["female", "male"]);
  expect((await pivot.getCalculatedValues()).data).toStrictEqual([[1, 3, 4], [2, 1, 1]]);

  pivot.setAxisQuestions("question1", "question3");
  values = pivot.getValues();
  seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual(["female", "male"]);
  expect(seriesValues).toStrictEqual(["question3"]);
  expect((await pivot.getCalculatedValues()).data).toStrictEqual([[2500, 1000]]);

  pivot.setAxisQuestions("question2", "question3");
  values = pivot.getValues();
  seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual(["Item 1", "Item 2", "Item 3"]);
  expect(seriesValues).toStrictEqual(["question3"]);
  expect((await pivot.getCalculatedValues()).data).toStrictEqual([[550, 1500, 1450]]);

  pivot.setAxisQuestions("question3", "question1");
  values = pivot.getValues();
  seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual([100, 150, 200, 250, 300, 350, 400, 450, 500, 550]);
  expect(seriesValues).toStrictEqual(["female", "male"]);
  expect((await pivot.getCalculatedValues()).data).toStrictEqual([[1, 1, 1, 1, 1, 0, 1, 0, 1, 1], [1, 0, 1, 0, 1, 0, 1, 0, 0, 0]]);
});

test("getQuestionValueType", async () => {
  const pivot = new PivotModel([], []);
  expect(pivot.getQuestionValueType({ getType: () => "text" } as any)).toBe("number");
  expect(pivot.getQuestionValueType({ getType: () => "text", inputType: "date" } as any)).toBe("date");
  expect(pivot.getQuestionValueType({ getType: () => "text", inputType: "datetime" } as any)).toBe("date");
  expect(pivot.getQuestionValueType({ getType: () => "rating" } as any)).toBe("number");
  expect(pivot.getQuestionValueType({ getType: () => "expression" } as any)).toBe("number");
  expect(pivot.getQuestionValueType({ getType: () => "range" } as any)).toBe("number");
  expect(pivot.getQuestionValueType({ getType: () => "dropdown" } as any)).toBe("enum");
  expect(pivot.getQuestionValueType({ getType: () => "radiogroup" } as any)).toBe("enum");
  expect(pivot.getQuestionValueType({ getType: () => "boolean" } as any)).toBe("enum");
  expect(pivot.getQuestionValueType({ getType: () => "checkbox" } as any)).toBe("enum");
});

test("getCalculatedValues multi-Y-axes", async () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question1", "question2", "question3");
  let values = pivot.getValues();
  let seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual(["female", "male"]);
  expect(seriesValues).toStrictEqual(["Item 1", "Item 2", "Item 3", "question3"]);
  expect(pivot.getSeriesValueIndexes()).toStrictEqual({ "question2_Item 1": 0, "question2_Item 2": 1, "question2_Item 3": 2, "question3": 3 });
  const calculatedValues = (await pivot.getCalculatedValues()).data;
  expect(calculatedValues).toHaveLength(4);
  expect(calculatedValues).toStrictEqual([[1, 2], [3, 1], [4, 1], [2500, 1000]]);
});

test("date value type handling", () => {
  const dateJson = {
    "elements": [
      {
        "type": "text",
        "inputType": "date",
        "name": "birthDate",
        "title": "Birth Date"
      }
    ]
  };
  const dateData = [
    { birthDate: "2020-01-01" },
    { birthDate: "2020-02-01" },
    { birthDate: "2020-03-01" }
  ];
  const dateSurvey = new SurveyModel(dateJson);
  const pivot = new PivotModel(dateSurvey.getAllQuestions(), dateData);

  expect(pivot.getValueType()).toBe("date");
  expect(pivot.getContinuousValue("2020-01-01")).toBe(Date.parse("2020-01-01"));
  expect(pivot.getString(Date.parse("2020-01-01"))).toMatch(/1\/1\/2020/);
});

test("continuous values and intervals", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question3", "question1");

  const continuousValues = pivot["getContinuousValues"]();
  expect(continuousValues.length).toBeGreaterThan(0);
  expect(continuousValues[0]).toHaveProperty("original");
  expect(continuousValues[0]).toHaveProperty("continuous");
  expect(continuousValues[0]).toHaveProperty("row");

  const intervals = pivot.intervals;
  expect(intervals.length).toBe(PivotModel.IntervalsCount);
  expect(intervals[0]).toHaveProperty("start");
  expect(intervals[0]).toHaveProperty("end");
  expect(intervals[0]).toHaveProperty("label");
});

test("rating question with rateValues", () => {
  const ratingJson = {
    "elements": [
      {
        "type": "rating",
        "name": "satisfaction",
        "title": "Satisfaction",
        "rateValues": [
          { value: 1, text: "Very Dissatisfied" },
          { value: 2, text: "Dissatisfied" },
          { value: 3, text: "Neutral" },
          { value: 4, text: "Satisfied" },
          { value: 5, text: "Very Satisfied" }
        ]
      }
    ]
  };
  const ratingData = [
    { satisfaction: 1 },
    { satisfaction: 2 },
    { satisfaction: 3 },
    { satisfaction: 4 },
    { satisfaction: 5 }
  ];
  const ratingSurvey = new SurveyModel(ratingJson);
  const pivot = new PivotModel(ratingSurvey.getAllQuestions(), ratingData);

  expect(pivot["needUseRateValues"]).toBe(true);
  const intervals = pivot.intervals;
  expect(intervals.length).toBe(5);
  expect(intervals[0].label).toBe("Very Dissatisfied");
  expect(intervals[0].start).toBe(1);
  expect(intervals[0].end).toBe(2);
});

test("rating question without rateValues", () => {
  const ratingJson = {
    "elements": [
      {
        "type": "rating",
        "name": "satisfaction",
        "title": "Satisfaction",
        "rateMin": 1,
        "rateMax": 5,
        "rateStep": 1
      }
    ]
  };
  const ratingData = [
    { satisfaction: 1 },
    { satisfaction: 2 },
    { satisfaction: 3 },
    { satisfaction: 4 },
    { satisfaction: 5 }
  ];
  const ratingSurvey = new SurveyModel(ratingJson);
  const pivot = new PivotModel(ratingSurvey.getAllQuestions(), ratingData);

  expect(pivot["needUseRateValues"]).toBe(false);
  const intervals = pivot.intervals;
  expect(intervals.length).toBe(5);
  expect(intervals[0].start).toBe(1);
  expect(intervals[0].end).toBe(2);
});

test("custom intervals", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data, {
    question3: {
      intervals: [
        { start: 0, end: 200, label: "Low" },
        { start: 200, end: 400, label: "Medium" },
        { start: 400, end: 600, label: "High" }
      ]
    }
  });
  pivot.setAxisQuestions("question3", "question1");

  expect(pivot.hasCustomIntervals).toBe(true);
  const intervals = pivot.intervals;
  expect(intervals.length).toBe(3);
  expect(intervals[0].label).toBe("Low");
  expect(intervals[1].label).toBe("Medium");
  expect(intervals[2].label).toBe("High");
});

test("getSelectedItemByText with custom intervals", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data, {
    question3: {
      intervals: [
        { start: 0, end: 200, label: "Low" },
        { start: 200, end: 400, label: "Medium" },
        { start: 400, end: 600, label: "High" }
      ]
    }
  });
  pivot.setAxisQuestions("question3", "question1");

  const selectedItem = pivot.getSelectedItemByText("Medium");
  expect(selectedItem.value).toEqual({ start: 200, end: 400, label: "Medium" });
  expect(selectedItem.text).toBe("Medium");
});

test("getSelectedItemByText with enum values", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);

  const selectedItem = pivot.getSelectedItemByText("female");
  expect(selectedItem.value).toBe("female");
  expect(selectedItem.text).toBe("female");
});

test("updateData resets cached values", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question3", "question1");

  // Trigger caching
  pivot["getContinuousValues"]();
  expect(pivot["_cachedValues"]).toBeDefined();

  const newData = [
    { question1: "male", question2: "Item 1", question3: 100 },
    { question1: "female", question2: "Item 2", question3: 200 }
  ];

  pivot.updateData(newData);
  expect(pivot["_cachedValues"]).toBeUndefined();
  expect(pivot["_continuousData"]).toBeUndefined();
  expect(pivot["_cachedIntervals"]).toBeUndefined();
});

test("onDataChanged resets cached values", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question3", "question1");

  // Trigger caching
  pivot["getContinuousValues"]();
  expect(pivot["_cachedValues"]).toBeDefined();

  pivot["onDataChanged"]();
  expect(pivot["_cachedValues"]).toBeUndefined();
  expect(pivot["_continuousData"]).toBeUndefined();
  expect(pivot["_cachedIntervals"]).toBeUndefined();
});

test("toPrecision method", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data, { intervalPrecision: 2 });
  expect(pivot["_intervalPrecision"]).toBe(2);

  const result = pivot["toPrecision"](3.14159);
  expect(result).toBe(3.14);
});

test("convertFromExternalData", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  const externalData = { some: "data" };
  const result = pivot.convertFromExternalData(externalData);
  expect(result.data).toEqual([externalData]);
});

test("updateStatisticsSeriesValue with enum values", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question1", "question2");

  const statistics = [[0, 0], [0, 0], [0, 0]];
  const dataRow = { question1: "female", question2: "Item 1" };
  const valueIndex = 0;
  const seriesValueIndexes = { "question2_Item 1": 0, "question2_Item 2": 1, "question2_Item 3": 2 };

  pivot.updateStatisticsSeriesValue(statistics, dataRow, valueIndex, seriesValueIndexes);
  expect(statistics[0][0]).toBe(1);
});

test("updateStatisticsSeriesValue with number values", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question1", "question3");

  const statistics = [[0, 0]];
  const dataRow = { question1: "female", question3: 100 };
  const valueIndex = 0;
  const seriesValueIndexes = { "question3": 0 };

  pivot.updateStatisticsSeriesValue(statistics, dataRow, valueIndex, seriesValueIndexes);
  expect(statistics[0][0]).toBe(100);
});

test("isSupportSoftUpdateContent", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  expect(pivot["isSupportSoftUpdateContent"]()).toBe(false);
});

test("setAxisQuestions with empty array", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  const originalAxisX = pivot.axisXQuestionName;

  pivot.setAxisQuestions();
  expect(pivot.axisXQuestionName).toBe(originalAxisX);
});

test("onAxisYSelectorChanged removes subsequent selectors when value is empty", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question1", "question2", "question3");

  expect(pivot.axisYQuestionNames.length).toBe(2);

  // Mock the unregisterToolbarItem method
  const originalUnregister = pivot["unregisterToolbarItem"];
  const mockUnregister = jest.fn();
  pivot["unregisterToolbarItem"] = mockUnregister;

  // Mock the axisYSelectors array to have the expected length
  pivot["axisYSelectors"] = [{} as HTMLDivElement, {} as HTMLDivElement];

  pivot.onAxisYSelectorChanged(0, "");

  expect(mockUnregister).toHaveBeenCalledWith("axisYSelector1");
  expect(pivot.axisYQuestionNames.length).toBe(1);

  // Restore original method
  pivot["unregisterToolbarItem"] = originalUnregister;
});

test("onAxisYSelectorChanged adds new selector when value is set", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question1", "question2");

  // Mock the registerToolbarItem method
  const originalRegister = pivot["registerToolbarItem"];
  const mockRegister = jest.fn();
  pivot["registerToolbarItem"] = mockRegister;

  // Mock the axisYSelectors array to have the expected length
  pivot["axisYSelectors"] = [{} as HTMLDivElement, {} as HTMLDivElement];

  pivot.onAxisYSelectorChanged(1, "question3");

  expect(mockRegister).toHaveBeenCalledWith("axisYSelector2", expect.any(Function), "dropdown");

  // Restore original method
  pivot["registerToolbarItem"] = originalRegister;
});

test("updateQuestionsSelection prevents duplicate question selection", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);

  // Mock the onAxisYSelectorChanged method
  const originalOnAxisYSelectorChanged = pivot.onAxisYSelectorChanged;
  const mockOnAxisYSelectorChanged = jest.fn();
  pivot.onAxisYSelectorChanged = mockOnAxisYSelectorChanged;

  pivot.setAxisQuestions("question1", "question1");
  pivot["updateQuestionsSelection"]();

  expect(mockOnAxisYSelectorChanged).toHaveBeenCalledWith(0, undefined);

  // Restore original method
  pivot.onAxisYSelectorChanged = originalOnAxisYSelectorChanged;
});

test("createAxisYSelector returns undefined when no choices available", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question1", "question2", "question3");

  // All questions are already selected, so no choices should be available
  const selector = pivot["createAxisYSelector"](2);
  expect(selector).toBeUndefined();
});

test("isXYChart method", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot["chartTypes"] = ["bar", "vbar", "line", "scatter", "pie", "doughnut"];

  // Set chart type directly on the property
  pivot.chartType = "bar";
  expect(pivot["isXYChart"]()).toBe(true);

  pivot.chartType = "pie";
  expect(pivot["isXYChart"]()).toBe(false);

  pivot.chartType = "doughnut";
  expect(pivot["isXYChart"]()).toBe(false);
});

test("getValueType returns correct type", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);

  // Default should be enum
  expect(pivot.getValueType()).toBe("enum");

  // Set to number type
  pivot.setAxisQuestions("question3", "question1");
  expect(pivot.getValueType()).toBe("number");
});

test("getContinuousValue with different value types", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);

  // Test number type
  pivot.setAxisQuestions("question3", "question1");
  expect(pivot.getContinuousValue("100")).toBe(100);
  expect(pivot.getContinuousValue(200)).toBe(200);

  // Test date type
  const datePivot = new PivotModel([], []);
  datePivot["valueType"] = "date";
  const dateValue = "2020-01-01";
  expect(datePivot.getContinuousValue(dateValue)).toBe(Date.parse(dateValue));
});

test("getString with different value types", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);

  // Test number type
  pivot.setAxisQuestions("question3", "question1");
  expect(pivot.getString(100)).toBe("100");

  // Test date type
  const datePivot = new PivotModel([], []);
  datePivot["valueType"] = "date";
  const timestamp = Date.parse("2020-01-01");
  expect(datePivot.getString(timestamp)).toMatch(/1\/1\/2020/);
});

test("setupPivot with non-existent question", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  const originalQuestion = pivot.question;
  pivot.axisXQuestionName = "nonExistentQuestion";

  pivot["setupPivot"]();

  // Should not throw error and should handle gracefully
  expect(pivot.question).toBe(originalQuestion);
});

test("getContinuousValues with enum type returns empty array", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);

  const continuousValues = pivot["getContinuousValues"]();
  expect(continuousValues).toEqual([]);
});

test("getContinuousValues with number type processes data correctly", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question3", "question1");

  const continuousValues = pivot["getContinuousValues"]();
  expect(continuousValues.length).toBeGreaterThan(0);
  expect(continuousValues[0]).toHaveProperty("original");
  expect(continuousValues[0]).toHaveProperty("continuous");
  expect(continuousValues[0]).toHaveProperty("row");

  // Values should be sorted
  for(let i = 1; i < continuousValues.length; i++) {
    expect(continuousValues[i].continuous).toBeGreaterThanOrEqual(continuousValues[i - 1].continuous);
  }
});

test("intervals with no continuous values", () => {
  const pivot = new PivotModel(survey.getAllQuestions(), []);
  pivot.setAxisQuestions("question3", "question1");

  const intervals = pivot.intervals;
  expect(intervals).toEqual([]);
});

test("getCalculatedValuesCore with empty data", async () => {
  const pivot = new PivotModel(survey.getAllQuestions(), []);
  pivot.setAxisQuestions("question1", "question2");

  const calculatedValues = pivot["getCalculatedValuesCore"]();
  expect(calculatedValues.data).toEqual([[0, 0], [0, 0], [0, 0]]);
});

test("getCalculatedValuesCore with number type and no Y questions", async () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question3");

  const calculatedValues = pivot["getCalculatedValuesCore"]().data;
  expect(calculatedValues.length).toBe(1);
  expect(calculatedValues[0].length).toBe(PivotModel.IntervalsCount);
});

test("getCalculatedValuesCore with number type and Y questions", async () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question3", "question1");

  const calculatedValues = pivot["getCalculatedValuesCore"]().data;
  expect(calculatedValues.length).toBe(2); // female, male
  expect(calculatedValues[0].length).toBe(PivotModel.IntervalsCount);
});
