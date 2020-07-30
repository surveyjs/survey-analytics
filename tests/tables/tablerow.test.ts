import { SurveyModel } from "survey-core";
import { Table, TableRow } from "../../src/tables/table";

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

test("remove row", () => {
  const survey = new SurveyModel(json);
  const table = new (<any>Table)(survey, [], null);
  const tableRow = new (<any>TableRow)(table, null, null);
  table._rows.push(tableRow);
  expect(table.getCreatedRows().length).toBe(1);
  tableRow.remove();
  expect(table.getCreatedRows().length).toBe(0);
});

test("toggle row", () => {
  const survey = new SurveyModel(json);
  const table = new (<any>Table)(survey, [], null);
  const tableRow = new (<any>TableRow)(table, null, null);
  expect(tableRow.getIsSelected()).toBeFalsy();
  tableRow.toggleSelect();
  expect(tableRow.getIsSelected()).toBeTruthy();
  tableRow.toggleSelect();
  expect(tableRow.getIsSelected()).toBeFalsy();
});
