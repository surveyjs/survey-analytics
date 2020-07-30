import { SurveyModel } from "survey-core";
import { Tabulator } from "../../src/tables/tabulator";
import { TableExtensions } from "../../src/tables/extensions/tableextensions";

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
const survey = new SurveyModel(json);
const tabulator = new Tabulator(survey, [], null);
(<any>TableExtensions).extensions["row"] = [];

test("registerExtension method", () => {
  var extension = {
    name: "test",
    location: "row",
    visibleIndex: 0,
    render: null,
  };
  TableExtensions.registerExtension(extension);
  expect((<any>TableExtensions).extensions["row"][0]).toEqual(extension);
  (<any>TableExtensions).extensions["row"].splice(0, 1);
});

test("check extensions order with same index", () => {
  TableExtensions.registerExtension({
    name: "prev",
    location: "row",
    visibleIndex: 0,
    render: null,
  });
  TableExtensions.registerExtension({
    name: "next",
    location: "row",
    visibleIndex: 0,
    render: null,
  });
  var tableExtensions = new TableExtensions(tabulator);
  expect(
    (<any>tableExtensions)
      .sortExtensions((<any>TableExtensions).extensions["row"])
      .map((extension) => {
        return extension.name;
      })
  ).toEqual(["prev", "next"]);
  (<any>TableExtensions).extensions["row"].splice(0, 2);
});

test("check extensions order index -1", () => {
  TableExtensions.registerExtension({
    name: "visible",
    location: "row",
    visibleIndex: 0,
    render: null,
  });

  TableExtensions.registerExtension({
    name: "invisible",
    location: "row",
    visibleIndex: -1,
    render: null,
  });
  var tableExtensions = new TableExtensions(tabulator);
  expect(
    (<any>tableExtensions)
      .sortExtensions((<any>TableExtensions).extensions["row"])
      .map((extension) => {
        return extension.name;
      })
  ).toEqual(["visible"]);
  (<any>TableExtensions).extensions["row"].splice(0, 2);
});

test("check findExtension method", () => {
  var extension = {
    name: "test",
    location: "row",
    visibleIndex: 0,
    render: null,
  };
  TableExtensions.registerExtension(extension);
  expect(TableExtensions.findExtension("row", "test")).toEqual(extension);
  (<any>TableExtensions).extensions["row"].splice(0, 1);
});

test("check rendering extension with null render", () => {
  var extension = {
    name: "test",
    location: "header",
    visibleIndex: 0,
    render: null,
  };
  TableExtensions.registerExtension(extension);
  var tableExtensions = new TableExtensions(tabulator);
  expect(() => {
    tableExtensions.render(
      document.createElement("extensionsContainer"),
      "header"
    );
  }).not.toThrow(Error);
  (<any>TableExtensions).extensions["header"].splice(0, 1);
});

test("check rendering extension with render's null return value", () => {
  var extension = {
    name: "test",
    location: "header",
    visibleIndex: 0,
    render: () => {
      return null;
    },
  };
  TableExtensions.registerExtension(extension);
  var tableExtensions = new TableExtensions(tabulator);
  expect(() => {
    try {
      tableExtensions.render(
        document.createElement("extensionsContainer"),
        "header"
      );
    } catch {
      throw new Error("tried to append null child");
    }
  }).not.toThrow(Error);
  (<any>TableExtensions).extensions["header"].splice(0, 1);
});
