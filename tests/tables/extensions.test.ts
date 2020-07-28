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
TableExtensions.actions["row"] = [];

test("registerExtension method", () => {
  var extension = {
    name: "test",
    location: "row",
    visibleIndex: 0,
    render: null,
  };
  TableExtensions.registerExtension(extension);
  expect(TableExtensions.actions["row"][0]).toEqual(extension);
  TableExtensions.actions["row"].splice(0, 1);
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
  var tableExtensions = new TableExtensions(
    document.createElement("extensionsContainer"),
    tabulator
  );
  expect(
    (<any>tableExtensions)
      .sortExtensions(TableExtensions.actions["row"])
      .map((extension) => {
        return extension.name;
      })
  ).toEqual(["prev", "next"]);
  TableExtensions.actions["row"].splice(0, 2);
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
  var tableExtensions = new TableExtensions(
    document.createElement("extensionsContainer"),
    tabulator
  );
  expect(
    (<any>tableExtensions)
      .sortExtensions(TableExtensions.actions["row"])
      .map((extension) => {
        return extension.name;
      })
  ).toEqual(["visible"]);
  TableExtensions.actions["row"].splice(0, 2);
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
});
