import { VisualizationPanel } from "../src/visualizationPanel";

test("setFilter method", () => {
  var data = [
    {
      q2: "father",
      q1: "mother"
    },
    {
      q2: "father"
    },
    {
      q1: "mother"
    },
    {
      q1: "sister"
    }
  ];
  const panel = new VisualizationPanel([], data);
  expect(panel["filteredData"]).toEqual(data);
  panel.setFilter("q1", "sister");
  expect(panel["filteredData"]).toEqual([
    {
      q1: "sister"
    }
  ]);
  panel.setFilter("q1", "mother");
  expect(panel["filteredData"]).toEqual([
    {
      q2: "father",
      q1: "mother"
    },
    {
      q1: "mother"
    }
  ]);
  panel.setFilter("q2", "father");
  expect(panel["filteredData"]).toEqual([
    {
      q2: "father",
      q1: "mother"
    }
  ]);
  panel.setFilter("q2", undefined);
  expect(panel["filteredData"]).toEqual([
    {
      q2: "father",
      q1: "mother"
    },
    {
      q1: "mother"
    }
  ]);
});
