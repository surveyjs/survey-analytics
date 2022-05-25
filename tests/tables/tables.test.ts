import { SurveyModel, QuestionTextModel } from "survey-core";
import { Table } from "../../src/tables/table";
import { ColumnDataType, ITableState, QuestionLocation } from "../../src/tables/config";
const json = {
  questions: [
    {
      type: "radiogroup",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
      choices: ["None", "Ford", "Vauxhall"],
    },
    {
      type: "file",
      name: "photo",
    },
  ],
};

class TableTest extends Table {
  applyColumnFilter() {}
  applyFilter() {}
  render() {}
  sortByColumn() {}
}

test("buildColumns method", () => {
  const survey = new SurveyModel(json);
  const tables = new TableTest(survey, [], null, []);

  const columns = <any>tables["buildColumns"](survey);

  expect(JSON.stringify(columns)).toBe(
    '[{"name":"car","displayName":"What car are you driving?","dataType":0,"isVisible":true,"isPublic":true,"location":0},{"name":"photo","displayName":"photo","dataType":1,"isVisible":true,"isPublic":true,"location":0}]'
  );
});

test("signaturepad column data type", () => {
  const survey = new SurveyModel({
    elements: [{ type: "signaturepad", name: "q1" }],
  });
  const tables = new TableTest(survey, [], null, []);

  const columns = <any>tables["buildColumns"](survey);
  expect(columns.length).toBe(1);
  expect(columns[0].dataType).toBe(ColumnDataType.Image);
  expect(columns[0].name).toBe("q1");
});

test("locale", () => {
  const survey = new SurveyModel(json);
  const tables = new TableTest(survey, [], null, []);

  expect(tables.locale).toBe("");
  tables.locale = "ru";
  expect(tables.locale).toBe("ru");
});

test("get/set permissions, onPermissionsChangedCallback", () => {
  let tables = new TableTest(new SurveyModel(json), [], null, []);
  let count = 0;

  const p = tables.permissions;
  tables.permissions = p;

  tables.onPermissionsChangedCallback = () => {
    count++;
  };

  expect(tables.permissions[0].name).toEqual("car");
  expect(tables.permissions[0].isPublic).toEqual(true);

  const newPermissions = tables.permissions;
  newPermissions[0].isPublic = false;

  tables.permissions = newPermissions;

  expect(count).toEqual(1);
  expect(tables.permissions[0].isPublic).toEqual(false);
});

test("getState, setState, onStateChanged", () => {
  let tables = new TableTest(new SurveyModel(), [], null, []);

  let initialState: ITableState = {
    locale: "",
    elements: [],
    pageSize: 5,
  };
  let newState: ITableState = {
    locale: "fr",
    elements: [],
    pageSize: 5,
  };
  let count = 0;

  tables.onStateChanged.add(() => {
    count++;
  });

  expect(tables.state).toEqual(initialState);
  tables.state = null;

  tables.state = newState;
  expect(tables.state).toEqual(newState);
  expect(count).toBe(0);

  tables.locale = "ru";
  expect(count).toBe(1);
  expect(tables.state.locale).toEqual("ru");
});

test("partial state", () => {
  let tables = new TableTest(new SurveyModel(), [], null, []);
  tables.state = { locale: "ru" };
  tables.state = { pageSize: 4 };
  tables.state = { elements: [] };
});

test("move column method", () => {
  var table = new TableTest(new SurveyModel(), [], null, []);
  table.columns = [
    {
      name: "column1",
      displayName: "column1",
      dataType: 0,
      isVisible: true,
      isPublic: true,
      location: 0,
    },
    {
      name: "column2",
      displayName: "column2",
      dataType: 0,
      isVisible: true,
      isPublic: true,
      location: 0,
    },
    {
      name: "column3",
      displayName: "column3",
      dataType: 0,
      isVisible: true,
      isPublic: true,
      location: 0,
    },
  ];
  table.moveColumn(0, 1);
  var names = table.columns.map((column) => column.name);
  expect(names).toEqual(["column2", "column1", "column3"]);
  table.moveColumn(0, 2);
  names = table.columns.map((column) => column.name);
  expect(names).toEqual(["column1", "column3", "column2"]);
});

test("check that setPageSize fires onStateChanged", () => {
  var table = new TableTest(new SurveyModel(), [], null, []);
  var count = 0;
  table.onStateChanged.add(() => {
    count++;
  });
  table.setPageSize(2);
  expect(count).toBe(1);
});

test("check save/restore page size in the state", () => {
  var table = new TableTest(new SurveyModel(), [], null, []);
  table.setPageSize(2);
  expect(table.state.pageSize).toBe(2);
  table.state = { elements: [], locale: "", pageSize: 4 };
  expect(table.getPageSize()).toBe(4);
});

test("check setColumnWidth method", () => {
  var table = new TableTest(new SurveyModel(), [], null, []);
  table.columns = [
    {
      name: "column1",
      displayName: "column1",
      dataType: 0,
      isVisible: true,
      isPublic: true,
      location: 0,
    },
  ];
  table.setColumnWidth("column1", 50);
  expect(table.columns[0].width).toBe(50);
});

test("check that setColumnWidth fires onStateChanged", () => {
  var table = new TableTest(new SurveyModel(), [], null, []);
  var count = 0;
  table.columns = [
    {
      name: "column1",
      displayName: "column1",
      dataType: 0,
      isVisible: true,
      isPublic: true,
      location: 0,
    },
  ];
  table.onStateChanged.add(() => {
    count++;
  });
  table.setColumnWidth("column1", 50);
  expect(count).toBe(1);
});

test("check useValuesAsLabels option", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        name: "radio",
        choices: [{ value: "choiceValue", text: "choiceText" }],
      },
    ],
  };
  const survey = new SurveyModel(json);
  var data = [{ radio: "choiceValue" }];
  var table = new TableTest(survey, data, {}, []);
  expect((<any>table).tableData[0]["radio"]).toEqual("choiceText");
  table = new TableTest(survey, data, { useValuesAsLabels: true }, []);
  expect((<any>table).tableData[0]["radio"]).toEqual("choiceValue");
});

test("check onGetQuestionValue event", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        name: "radio",
        choices: [{ value: "choiceValue", text: "choiceText" }],
      },
    ],
  };
  const survey = new SurveyModel(json);
  var data = [{ radio: "choiceValue" }];
  var table = new TableTest(survey, data, {}, []);
  expect((<any>table).tableData[0]["radio"]).toEqual("choiceText");
  table = new TableTest(
    survey,
    data,
    {
      onGetQuestionValue: (opt) => {
        opt.displayValue = opt.question.value;
      },
    },
    []
  );
  expect((<any>table).tableData[0]["radio"]).toEqual("choiceValue");
});

test("check columns for question with comment", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        title: "Radio",
        name: "radio",
        choices: [{ value: "choiceValue", text: "choiceText" }],
        commentText: "Describe Radio",
        hasComment: true,
      },
    ],
  };
  const survey = new SurveyModel(json);
  const table = new TableTest(survey, [], {}, []);
  expect((<any>table).columns[0].name).toEqual("radio");
  expect(<any>table.columns[1].name).toEqual("radio-Comment");
  expect(<any>table.columns[1].displayName).toEqual("Describe Radio");
  expect(<any>table.columns[1].dataType).toEqual(ColumnDataType.Text);
});

test("check columns for question with other and storeOthersAsComment: true", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        title: "Radio",
        name: "radio",
        choices: [{ value: "choiceValue", text: "choiceText" }],
        otherText: "Other (Describe Radio)",
        hasOther: true,
      },
    ],
  };
  const survey = new SurveyModel(json);
  const table = new TableTest(survey, [], {}, []);
  expect((<any>table).columns[0].name).toEqual("radio");
  expect(<any>table.columns[1].name).toEqual("radio-Comment");
  expect(<any>table.columns[1].displayName).toEqual("Other (Describe Radio)");
  expect(<any>table.columns[1].dataType).toEqual(ColumnDataType.Text);
});

test("check columns for question with other and storeOthersAsComment: false", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        title: "Radio",
        name: "radio",
        storeOthersAsComment: false,
        choices: [{ value: "choiceValue", text: "choiceText" }],
        otherText: "Other (Describe Radio)",
        hasOther: true,
      },
    ],
  };
  const survey = new SurveyModel(json);
  const table = new TableTest(survey, [], {}, []);
  expect((<any>table).columns[0].name).toEqual("radio");
  expect((<any>table).columns.length).toEqual(1);
});

test("check data for question with comment", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        name: "radio",
        choices: [{ value: "choiceValue", text: "choiceText" }],
        hasComment: true,
      },
    ],
  };
  const survey = new SurveyModel(json);
  const data = [{ radio: "choiceValue", "radio-Comment": "commentValue" }];
  const table = new TableTest(survey, data, {}, []);
  expect((<any>table).tableData[0]["radio"]).toEqual("choiceText");
  expect((<any>table).tableData[0]["radio-Comment"]).toEqual("commentValue");
});

test("check data for question with other and storeOthersAsComment: true", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        name: "radio",
        choices: [{ value: "choiceValue", text: "choiceText" }],
        hasOther: true,
      },
    ],
  };
  const survey = new SurveyModel(json);
  const data = [{ radio: "choiceValue", "radio-Comment": "otherValue" }];
  const table = new TableTest(survey, data, {}, []);
  expect((<any>table).tableData[0]["radio"]).toEqual("choiceText");
  expect((<any>table).tableData[0]["radio-Comment"]).toEqual("otherValue");
});

test("check data for question with other and storeOthersAsComment: true", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        name: "radio",
        storeOthersAsComment: false,
        choices: [{ value: "choiceValue", text: "choiceText" }],
        hasOther: true,
      },
    ],
  };
  const survey = new SurveyModel(json);
  const data = [{ radio: "otherValue" }];
  const table = new TableTest(survey, data, {}, []);
  expect((<any>table).tableData[0]["radio"]).toEqual("otherValue");
  expect((<any>table).tableData[0]["radio-Comment"]).toBeUndefined();
});

test("check useNamesAsTitles option", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        name: "radio",
        title: "Radio",
        choices: [{ value: "choiceValue", text: "choiceText" }],
      },
    ],
  };
  const survey = new SurveyModel(json);
  var table = new TableTest(survey, [], { useNamesAsTitles: true }, []);
  expect((<any>table).columns[0].displayName).toEqual("radio");
});

test("check question which is not ready", () => {
  const json = {
    questions: [
      {
        type: "text",
        name: "text",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const question = <QuestionTextModel>survey.getAllQuestions()[0];
  const data = [{ "text": "test_value" }];
  question["isReadyValue"] = false;
  const table = new TableTest(survey, data, []);
  expect(table["tableData"][0]["text"]).toEqual("test_value");
  question["isReadyValue"] = true;
  data[0].text = "test_text";
  question.onReadyChanged.fire(question, { isReady: true });
  expect(table["tableData"][0]["text"]).toEqual("test_text");
});

test("Generate columns for question matrix", () => {
  const json = {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "matrix",
            "name": "q1",
            "columns": [
              "Column 1",
              "Column 2",
              "Column 3"
            ],
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }
        ]
      }
    ]
  };
  const survey = new SurveyModel(json);
  const table = new TableTest(survey, [], {}, []);
  expect((<any>table).columns.length).toEqual(2);
  expect((<any>table).columns[0].name).toEqual("q1.Row 1");
  expect((<any>table).columns[0].displayName).toEqual("q1 - Row 1");
  expect(<any>table.columns[1].name).toEqual("q1.Row 2");
  expect((<any>table).columns[1].displayName).toEqual("q1 - Row 2");
});

test("Fill columns data for question matrix", () => {
  const json = {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "matrix",
            "name": "q1",
            "columns": [
              "Column 1",
              { value: "Column 2", text: "Column 2 text" },
              "Column 3"
            ],
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }
        ]
      }
    ]
  };
  const survey = new SurveyModel(json);
  const table = new TableTest(survey, [{
    "q1": {
      "Row 1": "Column 1",
      "Row 2": "Column 2"
    }
  }], {}, []);
  const tableData: Array<any> = (<any>table).tableData;
  expect(tableData.length).toEqual(1);
  expect(tableData[0]["q1"]).toBeUndefined();
  expect(tableData[0]["q1.Row 1"]).toEqual("Column 1");
  expect(tableData[0]["q1.Row 2"]).toEqual("Column 2 text");
});

test("Fill columns data for question matrix - has unanswered rows https://github.com/surveyjs/survey-analytics/issues/246", () => {
  const json = {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "matrix",
            "name": "q1",
            "columns": [
              "Column 1",
              { value: "Column 2", text: "Column 2 text" },
              "Column 3"
            ],
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }
        ]
      }
    ]
  };
  const survey = new SurveyModel(json);
  const table = new TableTest(survey, [{
    "q1": {
      "Row 2": "Column 2"
    }
  }], {}, []);
  const tableData: Array<any> = (<any>table).tableData;
  expect(tableData[0]["q1.Row 1"]).toEqual("");
});

test("Check table get/set state for columns", () => {
  const json = {
    "elements": [
      {
        name: "q1",
        "type": "text",
      },
      {
        name: "q2",
        type: "dropdown"
      }
    ]
  };
  const survey = new SurveyModel(json);
  let table = new TableTest(survey, [{
    "q1": "q1_value",
    "q2": "q2_value"
  }], {}, []);
  const state = table.state;
  expect(JSON.stringify(table.state)).toBe("{\"locale\":\"\",\"elements\":[{\"name\":\"q1\",\"displayName\":\"q1\",\"dataType\":0,\"isVisible\":true,\"isPublic\":true,\"location\":0},{\"name\":\"q2\",\"displayName\":\"q2\",\"dataType\":0,\"isVisible\":true,\"isPublic\":true,\"location\":0}],\"pageSize\":5}");
  survey.getQuestionByName("q2").hasComment = true;
  table = new TableTest(survey, [{
    "q1": "q1_value",
    "q2": "q2_value",
    "q2-Comment": "r32r2r23r23r",
  }], {}, []);
  state.elements[0].displayName = "q1_changed";
  state.elements[0].location = QuestionLocation.Row;
  state.elements[1].isVisible = false;

  state.elements = [state.elements[1], state.elements[0]];
  state.elements.push(
    {
      name: "q3",
      displayName: "not currently existed",
      dataType: ColumnDataType.Text,
      location: 0,
      isVisible: true,
      isPublic: false,
    }
  );
  table.state = state;

  expect(JSON.stringify(table.columns)).toBe("[{\"name\":\"q2\",\"displayName\":\"q2\",\"dataType\":0,\"isVisible\":false,\"isPublic\":true,\"location\":0},{\"name\":\"q1\",\"displayName\":\"q1_changed\",\"dataType\":0,\"isVisible\":true,\"isPublic\":true,\"location\":1},{\"name\":\"q2-Comment\",\"displayName\":\"Other (describe)\",\"dataType\":0,\"isVisible\":true,\"isPublic\":true,\"location\":0},{\"name\":\"q3\",\"displayName\":\"not currently existed\",\"dataType\":0,\"isVisible\":true,\"isPublic\":false,\"location\":0}]");
});

test("check pass columns data via constructor", () => {
  const json = {
    "elements": [
      {
        name: "q1",
        "type": "text",
      },
      {
        name: "q2",
        type: "dropdown"
      }
    ]
  };
  const survey = new SurveyModel(json);
  let table = new TableTest(survey, [{
    "q1": "q1_value",
    "q2": "q2_value"
  }], {}, []);
  const state = table.state;
  state.elements[0].displayName = "q1_changed";
  state.elements[0].location = QuestionLocation.Row;
  state.elements[1].isVisible = false;

  state.elements = [state.elements[1], state.elements[0]];
  state.elements.push(
    {
      name: "q3",
      displayName: "not currently existed",
      dataType: ColumnDataType.Text,
      location: 0,
      isVisible: true,
      isPublic: false,
    }
  );
  survey.getQuestionByName("q2").hasComment = true;
  table = new TableTest(survey, [{
    "q1": "q1_value",
    "q2": "q2_value",
    "q2-Comment": "r32r2r23r23r",
  }], {}, state.elements);

  expect(JSON.stringify(table.columns)).toBe("[{\"name\":\"q2\",\"displayName\":\"q2\",\"dataType\":0,\"isVisible\":false,\"isPublic\":true,\"location\":0},{\"name\":\"q1\",\"displayName\":\"q1_changed\",\"dataType\":0,\"isVisible\":true,\"isPublic\":true,\"location\":1},{\"name\":\"q2-Comment\",\"displayName\":\"Other (describe)\",\"dataType\":0,\"isVisible\":true,\"isPublic\":true,\"location\":0},{\"name\":\"q3\",\"displayName\":\"not currently existed\",\"dataType\":0,\"isVisible\":true,\"isPublic\":false,\"location\":0}]");
});