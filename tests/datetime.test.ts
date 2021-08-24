import { DateTimeModel } from "../src/datetime";

test("getData test", () => {
  const question: any = { type: "text", inputType: "date", name: "birthdate" };
  const data = [
    {
      birthdate: "2021-08-18"
    },
    {
      birthdate: "2021-08-19"
    },
    {
      birthdate: "2021-08-18"
    },
    {
      birthdate: "2021-08-20"
    },
    {
      birthdate: "2021-08-19"
    },
    {
      birthdate: "2021-08-19"
    },
    {
      birthdate: "2021-08-19"
    },
  ];
  const dateTimeModel = new DateTimeModel(question, data);

  let [x, y] = dateTimeModel.getData();

  expect(x).toEqual(["2021-08-18", "2021-08-19", "2021-08-20"]);
  expect(y).toEqual([2, 4, 1]);
});
