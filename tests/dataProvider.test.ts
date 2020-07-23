import { DataProvider } from "../src/dataProvider";

test("ctor", () => {
  const dataProvider = new DataProvider();
  expect(dataProvider.data).toEqual([]);
});

test("getData for boolean question values", () => {
  var data = [
    {
      q1: true
    },
    {
      q1: true
    },
    {
      q2: true
    },
    {
      q1: false
    },
    {
      q1: true
    }
  ];  
  const dataProvider = new DataProvider(data);
  expect(dataProvider.getData({
    dataName: "q1",
    getValues: () => [ true, false ],
    getLabels: () => [ "true", "false" ]
  })).toEqual([[3, 1]]);
});
