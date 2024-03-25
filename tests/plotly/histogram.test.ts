window.URL.createObjectURL = jest.fn();
import { HistogramPlotly } from "../../src/plotly/histogram";

test("getCalculatedValues", () => {
  const preparedData = [
    {
      "Column 1": 1,
      "Column 2": 1,
      "__sa_series_name": "Row 1"
    },
    {
      "Column 1": 2,
      "Column 2": 2,
      "__sa_series_name": "Row 2"
    },
    {
      "Column 1": 3,
      "Column 2": 1,
      "__sa_series_name": "Row 3"
    },
    {
      "Column 1": 4,
      "Column 2": 4,
      "__sa_series_name": "Row 4"
    },
    {
      "Column 1": 5,
      "Column 2": 5,
      "__sa_series_name": "Row 5"
    },
  ];
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "number",
    name: "Column 2",
  };
  const series = ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5"];
  const number = new HistogramPlotly(question, preparedData, {
    seriesValues: series,
    seriesLabels: series,
  });

  const chartData = number.getCalculatedValues();
  expect(chartData).toMatchObject([
    [1, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 1],
  ]);
});

test("getCalculatedValues - 2 rows", () => {
  const preparedData = [
    {
      "Column 1": 1,
      "Column 2": 1,
      "__sa_series_name": "Row 1"
    },
    {
      "Column 1": 2,
      "Column 2": 2,
      "__sa_series_name": "Row 2"
    },
    {
      "Column 1": 3,
      "Column 2": 1,
      "__sa_series_name": "Row 1"
    },
    {
      "Column 1": 4,
      "Column 2": 4,
      "__sa_series_name": "Row 2"
    },
    {
      "Column 1": 5,
      "Column 2": 5,
      "__sa_series_name": "Row 1"
    },
  ];
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "number",
    name: "Column 2",
  };
  const series = ["Row 1", "Row 2"];
  const number = new HistogramPlotly(question, preparedData, {
    seriesValues: series,
    seriesLabels: series,
  });

  const chartData = number.getCalculatedValues();
  expect(chartData).toMatchObject([[2, 0], [0, 0], [0, 1], [0, 0], [0, 0], [0, 0], [0, 0], [0, 1], [0, 0], [1, 0]]);
});
