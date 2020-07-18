import { VisualizationPanel } from "../src/visualizationPanel";

test("applyFilter method", () => {
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
  panel.applyFilter("q1", "sister");
  expect(panel["filteredData"]).toEqual([
    {
      q1: "sister"
    }
  ]);
  panel.applyFilter("q1", "mother");
  expect(panel["filteredData"]).toEqual([
    {
      q2: "father",
      q1: "mother"
    },
    {
      q1: "mother"
    }
  ]);
  panel.applyFilter("q2", "father", false);
  expect(panel["filteredData"]).toEqual([
    {
      q2: "father",
      q1: "mother"
    }
  ]);
  panel.applyFilter("q2", undefined, false);
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
