import { SurveyModel } from "survey-core";
import { DataTables } from "../../src/tables/datatables";
import {
  ColumnDataType,
  ColumnVisibility,
  QuestionLocation,
} from "../../src/tables/config";

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

test("buildColumns method", () => {
  const survey = new SurveyModel(json);
  const dataTables = new DataTables(survey, [], null);

  const columns = <any>dataTables["buildColumns"](survey);

  expect(JSON.stringify(columns)).toBe(
    '[{"name":"car","displayName":"What car are you driving?","dataType":0,"visibility":0,"location":0},{"name":"photo","displayName":"photo","dataType":1,"visibility":1,"location":0}]'
  );
});

test("getColumns method", () => {
  const survey = new SurveyModel(json);
  const dataTables = new DataTables(survey, [], null);

  const columns = <any>dataTables.getColumns();

  expect(JSON.stringify(columns)).toBe(
    '[{"orderable":false,"data":null,"defaultContent":""},{"name":"car","data":"car","sTitle":"What car are you driving?","visible":true,"orderable":false}]'
  );
});

test("isVisible method", () => {
  let dataTables = new DataTables(new SurveyModel(), [], null);
  expect(dataTables.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(dataTables.isVisible(ColumnVisibility.PublicInvisible)).toBeFalsy();
  expect(dataTables.isVisible(ColumnVisibility.Visible)).toBeTruthy();

  dataTables = new DataTables(new SurveyModel(), [], null, [], true);
  expect(dataTables.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(dataTables.isVisible(ColumnVisibility.PublicInvisible)).toBeTruthy();
  expect(dataTables.isVisible(ColumnVisibility.Visible)).toBeTruthy();
});

test("pass columns through ctor", () => {
  let dataTables = new DataTables(new SurveyModel(), [], null, [
    {
      name: "id",
      displayName: "Id",
      location: QuestionLocation.Column,
      visibility: ColumnVisibility.Visible,
      dataType: ColumnDataType.Text,
    },
    {
      name: "happenedAt",
      displayName: "Happened At",
      location: QuestionLocation.Row,
      visibility: ColumnVisibility.Visible,
      dataType: ColumnDataType.Text,
    },
  ]);

  const columns = <any>dataTables.getColumns();
  expect(JSON.stringify(columns)).toBe(
    '[{"orderable":false,"data":null,"defaultContent":""},{"name":"id","data":"id","sTitle":"Id","visible":true,"orderable":false}]'
  );
});

test.skip("createDetailMarkup method", () => {
  let dataTables = new DataTables(new SurveyModel(), [], null, [
    {
      name: "id",
      displayName: "Id",
      location: QuestionLocation.Column,
      visibility: ColumnVisibility.Visible,
      dataType: ColumnDataType.Text,
    },
    {
      name: "happenedAt",
      displayName: "Happened At",
      location: QuestionLocation.Row,
      visibility: ColumnVisibility.Visible,
      dataType: ColumnDataType.Text,
    },
  ]);

  const detailForm = dataTables["createDetailMarkup"]({});
  expect(detailForm[0].innerHTML).toBe(
    '<td colspan="2">Happened At</td><td></td><td colspan="1"><button class="sa-datatables__button sa-datatables__button--gray">Show as Column</button></td>'
  );
});

test.skip("makeprivate button existance", () => {
  const survey = new SurveyModel(json);
  let dataTables = new DataTables(survey, [], null, undefined, true);

  expect(
    dataTables.headerButtonCreators.indexOf(
      dataTables.createColumnPrivateButton
    )
  ).toBe(2);

  dataTables = new DataTables(survey, [], null, undefined, false);

  expect(
    dataTables.headerButtonCreators.indexOf(
      dataTables.createColumnPrivateButton
    )
  ).toBe(-1);
});
