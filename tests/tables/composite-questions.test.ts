import { SurveyModel, ComponentCollection } from "survey-core";
import { TableTest } from "./tables.test";
import { BaseColumn, CompositeQuestionColumn, CustomQuestionColumn, DefaultColumn, SingleChoiceColumn } from "../../src/tables/columns";
import { CompositeColumnsBuilder } from "../../src/tables/columnbuilder";

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
  survey.data = { q1: "text" };
  let table = new TableTest(survey, [], {}, []);
  let columns = table.columns;
  expect(columns.length).toBe(1);
  expect(columns[0] instanceof CustomQuestionColumn).toBeTruthy();
  expect(columns[0].name).toBe("q1");
  expect(columns[0].displayName).toBe("q1");
  expect(columns[0].getCellData(table, survey.data).displayValue).toBe("text");

  ComponentCollection.Instance.clear();
});

test("custom component: defaultQuestionTitle", () => {
  ComponentCollection.Instance.add({
    name: "customtext",
    defaultQuestionTitle: "My custom text question",
    questionJSON: {
      type: "text",
    },
  });

  const survey = new SurveyModel({
    elements: [
      { type: "customtext", name: "q1" }
    ]
  });
  survey.data = { q1: "text" };
  let table = new TableTest(survey, [], {}, []);
  let columns = table.columns;
  expect(columns.length).toBe(1);
  expect(columns[0] instanceof CustomQuestionColumn).toBeTruthy();
  expect(columns[0].displayName).toBe("My custom text question");

  ComponentCollection.Instance.clear();
});

test("custom component: composite + CompositeColumnsBuilder.ShowAsSeparateColumns = false", () => {
  CompositeColumnsBuilder.ShowAsSeparateColumns = false;
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
  survey.data = { q1: { q1: "text", q2: 2, q3: 3 } };
  let table = new TableTest(survey, [], {}, []);
  let columns = table.columns;
  expect(columns.length).toBe(1);
  expect(columns[0] instanceof CompositeQuestionColumn).toBeTruthy();
  expect(columns[0].name).toBe("q1");
  expect(columns[0].displayName).toBe("q1");
  expect(columns[0].getCellData(table, survey.data).displayValue).toBe("{\"q1\":\"text\",\"q2\":\"2\",\"q3\":3}");

  ComponentCollection.Instance.clear();
  CompositeColumnsBuilder.ShowAsSeparateColumns = true;
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
  survey.data = { q1: { q1: "text", q2: 2, q3: 3 } };
  let table = new TableTest(survey, [], {}, []);
  let columns = table.columns;
  expect(columns.length).toBe(3);
  expect(columns[0] instanceof BaseColumn).toBeTruthy();
  expect(columns[0].name).toBe("q1.q1");
  expect(columns[0].displayName).toBe("q1 - q1");
  expect(columns[0].getCellData(table, survey.data).displayValue).toBe("text");
  expect(columns[1] instanceof SingleChoiceColumn).toBeTruthy();
  expect(columns[1].name).toBe("q1.q2");
  expect(columns[1].displayName).toBe("q1 - q2");
  expect(columns[1].getCellData(table, survey.data).displayValue).toBe("2");
  expect(columns[2] instanceof BaseColumn).toBeTruthy();
  expect(columns[2].name).toBe("q1.q3");
  expect(columns[2].displayName).toBe("q1 - q3");
  expect(columns[2].getCellData(table, survey.data).displayValue).toBe("3");

  ComponentCollection.Instance.clear();
});

test("custom component: composite - defaultQuestionTitle", () => {
  ComponentCollection.Instance.add({
    name: "test_composite",
    defaultQuestionTitle: "My custom composite question",
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
  survey.data = { q1: { q1: "text", q2: 2, q3: 3 } };
  let table = new TableTest(survey, [], {}, []);
  let columns = table.columns;
  expect(columns.length).toBe(3);
  expect(columns[0].name).toBe("q1.q1");
  expect(columns[0].displayName).toBe("My custom composite question - q1");
  expect(columns[1].name).toBe("q1.q2");
  expect(columns[1].displayName).toBe("My custom composite question - q2");
  expect(columns[2].name).toBe("q1.q3");
  expect(columns[2].displayName).toBe("My custom composite question - q3");

  ComponentCollection.Instance.clear();
});