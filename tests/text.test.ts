import { QuestionMultipleTextModel, QuestionTextModel } from "survey-core";
import { Text, TextTableAdapter } from "../src/text";

const multipleTextQuestionData = [{
  "bloodPressure": {
    "systolic": 90,
    "diastolic": "100",
    "pulse": "80"
  }
},
{
  "bloodPressure": {
    "systolic": 80,
    "diastolic": "110",
    "pulse": "70"
  }
},
{
  "bloodPressure": {
    "systolic": 85,
    "diastolic": "120",
    "pulse": "77"
  }
}];

test("multiple text visualizer", async () => {
  const question = new QuestionMultipleTextModel("bloodPressure");
  question.fromJSON({
    "type": "multipletext",
    "name": "bloodPressure",
    "title": "Blood Pressure",
    "items": [
      {
        "name": "systolic",
        "inputType": "number",
        "title": "Systolic",
      },
      {
        "name": "diastolic",
        "title": "Diastolic",
      },
      {
        "name": "pulse",
        "title": "Pulse:"
      }
    ]
  });
  const text = new Text(question, multipleTextQuestionData);

  const columns = text.columns;
  expect(columns.length).toBe(3);
  expect(columns[0].name).toBe("systolic");
  expect(columns[0].title).toBe("Systolic");
  expect(columns[0].type).toBe("number");
  expect(columns[1].name).toBe("diastolic");
  expect(columns[1].title).toBe("Diastolic");
  expect(columns[1].type).toBe("text");

  const { columnCount, data }: any = await text.getCalculatedValues();
  expect(columnCount).toBe(3);
  expect(data.length).toBe(3);
});

test("text visualizer - columns", async () => {
  const question = new QuestionTextModel("systolic");
  question.fromJSON({
    "name": "systolic",
    "type": "text",
    "title": "Systolic",
  });
  const text = new Text(question, [{ "systolic": "83" }]);

  const columns = text.columns;
  expect(columns.length).toBe(0);

  const { columnCount, data }: any = await text.getCalculatedValues();
  expect(columnCount).toBe(1);
  expect(data.length).toBe(1);
});
