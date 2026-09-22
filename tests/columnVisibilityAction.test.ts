import { SurveyModel } from "survey-core";
import { ColumnVisibilityAction } from "../src/utils/columnVisibilityAction";
import { Tabulator } from "../src/tables/tabulator";

describe("ColumnVisibilityAction", () => {
  function createAction() {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", title: "Question 1" },
        { type: "text", name: "q2", title: "Very long column title that should be truncated" },
      ]
    });
    const table = new Tabulator(survey, []);
    return { table, action: new ColumnVisibilityAction(table) };
  }

  test("adds Select all / Clear selection option", () => {
    const { action } = createAction();
    const options = action.getOptions();

    expect(options[0].value).toBe("__toggle_all__");
    expect(options[0].text).toBe("Clear selection");
    expect(options[0].title).toBe("Clear selection");
    expect(options[0].className).toBe("sa-action-dropdown-item--toggle-all");
    expect(action.isSelected(options[0])).toBe(false);
    expect(options.map(option => option.value)).toEqual(["__toggle_all__", "q1", "q2"]);
    expect(options[2].text).toBe("Very long column tit...");
    expect(options[2].title).toBe("Very long column title that should be truncated");
  });

  test("toggles all columns and updates action text", () => {
    const { table, action } = createAction();

    expect(action.handleSelect("__toggle_all__")).toBe(false);
    expect(table.columns.map(column => column.isVisible)).toEqual([false, false]);
    expect(action.toggleText).toBe("Select all");

    action.updateOption(action.getOptions()[0]);
    expect(action.getOptions()[0].text).toBe("Select all");

    expect(action.handleSelect("__toggle_all__")).toBe(false);
    expect(table.columns.map(column => column.isVisible)).toEqual([true, true]);
    expect(action.toggleText).toBe("Clear selection");
  });

  test("toggles a single column", () => {
    const { table, action } = createAction();
    const q1Option = action.getOptions()[1];

    expect(action.isSelected(q1Option)).toBe(true);
    expect(action.handleSelect("q1")).toBe(false);
    expect(table.getColumnByName("q1").isVisible).toBe(false);
    expect(action.isSelected(q1Option)).toBe(false);
    expect(action.toggleText).toBe("Select all");

    action.handleSelect("q1");
    expect(table.getColumnByName("q1").isVisible).toBe(true);
    expect(action.isSelected(q1Option)).toBe(true);
  });

  test("Select all restores remaining hidden columns", () => {
    const { table, action } = createAction();
    table.setColumnVisibility("q2", false);

    expect(action.toggleText).toBe("Select all");
    action.handleSelect("__toggle_all__");
    expect(table.columns.map(column => column.isVisible)).toEqual([true, true]);
    expect(action.toggleText).toBe("Clear selection");
  });
});
