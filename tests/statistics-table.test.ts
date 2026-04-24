import { QuestionBooleanModel, QuestionCheckboxModel } from "survey-core";
import { StatisticsTable, StatisticsTableBoolean } from "../src/statistics-table";

test("StatisticsTable uses hard content update strategy", () => {
  const question = new QuestionCheckboxModel("q1");
  question.choices = ["A", "B"];
  const model = new StatisticsTable(question as any, [{ q1: ["A"] }], {});

  const softUpdateSpy = jest.spyOn(model as any, "softUpdateContent");
  const hardUpdateSpy = jest.spyOn(model as any, "hardUpdateContent").mockImplementation(() => {});

  (model as any).updateContent();

  expect(hardUpdateSpy).toHaveBeenCalledTimes(1);
  expect(softUpdateSpy).not.toHaveBeenCalled();
});

test("StatisticsTableBoolean uses hard content update strategy", () => {
  const question = new QuestionBooleanModel("q1");
  const model = new StatisticsTableBoolean(question as any, [{ q1: true }], {});

  const softUpdateSpy = jest.spyOn(model as any, "softUpdateContent");
  const hardUpdateSpy = jest.spyOn(model as any, "hardUpdateContent").mockImplementation(() => {});

  (model as any).updateContent();

  expect(hardUpdateSpy).toHaveBeenCalledTimes(1);
  expect(softUpdateSpy).not.toHaveBeenCalled();
});
