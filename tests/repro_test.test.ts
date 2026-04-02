import { QuestionDropdownModel } from "survey-core";
import { SelectBase } from "../src/selectBase";
import { DataProvider } from "../src/dataProvider";

test("hideEmptyAnswers works after setFilter via DataProvider", async () => {
  const question = new QuestionDropdownModel("q1");
  question.choices = [
    { value: "father", text: "father_text" },
    { value: "mother", text: "mother_text" },
    { value: "sister", text: "sister_text" },
  ];

  const data = [
    { q1: "father", category: "A" },
    { q1: "father", category: "A" },
    { q1: "mother", category: "B" },
    { q1: "sister", category: "A" },
  ];

  const dataProvider = new DataProvider(data);
  const selectBase = new SelectBase(question, data, { dataProvider });

  // Set hideEmptyAnswers to true directly
  selectBase["_hideEmptyAnswers"] = true;

  // Apply filter: only category "B" data (so father and sister become 0)
  dataProvider.setFilter("category", "B");

  const result = await selectBase.getAnswersData();
  // eslint-disable-next-line no-console
  console.log("datasets:", JSON.stringify(result.datasets));
  // eslint-disable-next-line no-console
  console.log("labels:", JSON.stringify(result.labels));

  // After filter, father=0, mother=1, sister=0
  // With hideEmptyAnswers=true, only mother should be shown
  expect(result.labels).toEqual(["mother_text"]);
  expect(result.datasets[0]).toEqual([1]);
});
