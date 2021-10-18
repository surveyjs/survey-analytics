import { HistogramModel } from "../src/histogram";

const data = [
  {
    date: "2021-10-13",
    age: 17
  },
  {
    date: "2021-10-13",
    age: 17
  },
  {
    date: "2021-10-13",
    age: 17
  },
  {
    date: "2011-10-13",
    age: 30
  },
  {
    date: "2011-10-13",
    age: 30
  },
  {
    date: "2004-10-13",
    age: 40
  },
  {
    date: "2004-10-13",
    age: 40
  },
  {
    date: "2016-10-13",
    age: 25
  },
];

test("number default histogram", () => {
  const question: any = {
    type: "text",
    inputType: "number",
    name: "age",
  };
  const number = new HistogramModel(question, data);

  const histValues = number.getValues();
  const histData = number.getData();

  expect(histValues).toMatchObject(["17", "25", "30", "40"]);
  expect(histData).toMatchObject([[3, 1, 2, 2]]);
});

test("date default histogram", () => {
  const question: any = {
    type: "text",
    inputType: "date",
    name: "date",
  };
  const date = new HistogramModel(question, data);

  const histValues = date.getValues();
  const histData = date.getData();

  expect(histValues).toMatchObject(["2021-10-13", "2011-10-13", "2004-10-13", "2016-10-13"]);
  expect(histData).toMatchObject([[3, 2, 2, 1]]);
});
