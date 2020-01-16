import { SurveyModel, Question } from "survey-core";
import { DataTables } from "../src/datatables/datatables";
import {
  ColumnDataType,
  ColumnVisibility,
  QuestionLocation
} from "../src/datatables/config";

const json = {
  questions: [
    {
      type: "radiogroup",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
      choices: ["None", "Ford", "Vauxhall"]
    },
    {
      type: "file",
      name: "photo"
    }
  ]
};

test("buildColumns method", () => {
  const survey = new SurveyModel(json);
  const dataTables = new DataTables(
    document.createElement("table"),
    survey,
    [],
    null
  );

  const columns = <any>dataTables["buildColumns"](survey);

  expect(JSON.stringify(columns)).toBe(
    '[{"name":"car","displayName":"What car are you driving?","dataType":"Text","visibility":"Visible","location":"Column"},{"name":"photo","displayName":"photo","dataType":"FileLink","visibility":"Invisible","location":"Column"}]'
  );
});

test("getColumns method", () => {
  const survey = new SurveyModel(json);
  const dataTables = new DataTables(
    document.createElement("table"),
    survey,
    [],
    null
  );

  const columns = <any>dataTables.getColumns();

  expect(JSON.stringify(columns)).toBe(
    '[{"className":"sa-datatables__action-column","orderable":false,"data":null,"defaultContent":"<button title=\\"Show minor columns\\" class=\\"sa-datatables__svg-button\\"><svg><use href=\\"#sa-svg-detail\\"></use></svg></button>"},{"data":"car","sTitle":"What car are you driving?","visible":true}]'
  );
});

test("isVisible method", () => {
  let dataTables = new DataTables(
    document.createElement("table"),
    new SurveyModel(),
    [],
    null
  );
  expect(dataTables.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(dataTables.isVisible(ColumnVisibility.PublicInvisible)).toBeFalsy();
  expect(dataTables.isVisible(ColumnVisibility.Visible)).toBeTruthy();

  dataTables = new DataTables(
    document.createElement("table"),
    new SurveyModel(),
    [],
    null,
    [],
    true
  );
  expect(dataTables.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(dataTables.isVisible(ColumnVisibility.PublicInvisible)).toBeTruthy();
  expect(dataTables.isVisible(ColumnVisibility.Visible)).toBeTruthy();
});

test("pass columns through ctor", () => {
  let dataTables = new DataTables(
    document.createElement("table"),
    new SurveyModel(),
    [],
    null,
    [
      {
        name: "id",
        displayName: "Id",
        location: QuestionLocation.Column,
        visibility: ColumnVisibility.Visible,
        dataType: ColumnDataType.Text
      },
      {
        name: "happenedAt",
        displayName: "Happened At",
        location: QuestionLocation.Row,
        visibility: ColumnVisibility.Visible,
        dataType: ColumnDataType.Text
      }
    ]
  );

  const columns = <any>dataTables.getColumns();
  expect(JSON.stringify(columns)).toBe(
    '[{"className":"sa-datatables__action-column","orderable":false,"data":null,"defaultContent":"<button title=\\"Show minor columns\\" class=\\"sa-datatables__svg-button\\"><svg><use href=\\"#sa-svg-detail\\"></use></svg></button>"},{"data":"id","sTitle":"Id","visible":true}]'
  );
});

test("createDetailMarkup method", () => {
  let dataTables = new DataTables(
    document.createElement("table"),
    new SurveyModel(),
    [],
    null,
    [
      {
        name: "id",
        displayName: "Id",
        location: QuestionLocation.Column,
        visibility: ColumnVisibility.Visible,
        dataType: ColumnDataType.Text
      },
      {
        name: "happenedAt",
        displayName: "Happened At",
        location: QuestionLocation.Row,
        visibility: ColumnVisibility.Visible,
        dataType: ColumnDataType.Text
      }
    ]
  );

  const detailForm = dataTables["createDetailMarkup"]({});
  expect(detailForm[0].innerHTML).toBe(
    '<td colspan="2">Happened At</td><td></td><td colspan="1"><button class="sa-datatables__button sa-datatables__button--gray">Show as Column</button></td>'
  );
});
