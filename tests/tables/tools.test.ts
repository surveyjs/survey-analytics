import { SurveyModel } from "survey-core";
import { Tabulator } from "../../src/tables/tabulator";
import { TableTools } from "../../src/tables/tools/tabletools";

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
TableTools.actions["row"].splice(0, 1);

test("registerTool method", () => {
  var tool = {
    name: "test",
    location: "row",
    visibleIndex: 0,
    render: null,
  };
  TableTools.registerTool(tool);
  expect(TableTools.actions["row"][0]).toEqual(tool);
  TableTools.actions["row"].splice(0, 1);
});

test("check tools order with same index", () => {
  TableTools.registerTool({
    name: "prev",
    location: "row",
    visibleIndex: 0,
    render: null,
  });
  TableTools.registerTool({
    name: "next",
    location: "row",
    visibleIndex: 0,
    render: null,
  });
  var tableTools = new TableTools(
    document.createElement("toolsContainer"),
    tabulator
  );
  expect(
    (<any>tableTools).sortTools(TableTools.actions["row"]).map((tool) => {
      return tool.name;
    })
  ).toEqual(["prev", "next"]);
  TableTools.actions["row"].splice(0, 2);
});

test("check tools order index -1", () => {
  TableTools.registerTool({
    name: "visible",
    location: "row",
    visibleIndex: 0,
    render: null,
  });

  TableTools.registerTool({
    name: "invisible",
    location: "row",
    visibleIndex: -1,
    render: null,
  });
  var tableTools = new TableTools(
    document.createElement("toolsContainer"),
    tabulator
  );
  expect(
    (<any>tableTools).sortTools(TableTools.actions["row"]).map((tool) => {
      return tool.name;
    })
  ).toEqual(["visible"]);
  TableTools.actions["row"].splice(0, 2);
});

test("check findTool method", () => {
  var tool = {
    name: "test",
    location: "row",
    visibleIndex: 0,
    render: null,
  };
  TableTools.registerTool(tool);
  expect(TableTools.findTool("row", "test")).toEqual(tool);
});
