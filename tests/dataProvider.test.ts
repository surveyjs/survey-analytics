import { DataProvider } from "../src/dataProvider";

test("ctor", () => {
  const dataProvider = new DataProvider();
  expect(dataProvider.data).toEqual([]);
});

test("getData for boolean question values - mock", () => {
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
    getLabels: () => [ "true", "false" ],
    getSeriesNames: () => [ ],
    getSeriesTitles: () => [ ]
  })).toEqual([[3, 1]]);
});

test("getData for select base question values - mock", () => {
  const choices = ["father", "mother", "brother", "sister", "son", "dauhter"];
  const data = [
    {
      q1: "father"
    },
    {
      q1: "father"
    },
    {
      q1: "mother"
    },
    {
      q1: "sister"
    }
  ];
  const dataProvider = new DataProvider(data);
  expect(dataProvider.getData({
    dataName: "q1",
    getValues: () => choices,
    getLabels: () => choices,
    getSeriesNames: () => [ ],
    getSeriesTitles: () => [ ]
  })).toEqual([[2, 1, 0, 1, 0, 0]]);
});

// test("getData for matrix question values - mock", () => {
//   const data = [
//     {
//         question1: { Lizol: 'Excellent', Harpic: 'Excellent' },
//     },
//     {
//         question1: { Lizol: 'Very Good', Harpic: 'Very Good' },
//     },
//     {
//         question1: { Lizol: 'Very Good', Harpic: 'Good' },
//     }
//   ];
//   const dataProvider = new DataProvider(data);
//   expect(dataProvider.getData({
//     dataName: "question1",
//     getValues: () => [ 'Excellent', 'Very Good', 'Good', 'Fair', 'Neither Fair Nor Poor', 'Poor' ],
//     getLabels: () => [ 'Excellent', 'Very Good', 'Good', 'Fair', 'Neither Fair Nor Poor', 'Poor' ],
//     getSeriesNames: () => [ "Lizol", "Herpic" ],
//     getSeriesTitles: () => [ "Lizol", "Herpic" ]
//   })).toEqual([[1, 2, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0]]);
// });

// test("getData for matrix dropdown question values - mock", () => {
//   const data = [
//     {
//         question2: {
//             Lizol: { 'Column 1': 'Trustworthy', 'Column 2': 3 },
//             Harpic: { 'Column 1': 'High Quality', 'Column 2': 4 },
//         },
//     },
//     {
//         question2: {
//             Lizol: { 'Column 1': 'Natural', 'Column 2': 3 },
//             Harpic: { 'Column 1': 'Natural', 'Column 2': 4 },
//         },
//     },
//     {
//         question2: {
//             Lizol: { 'Column 1': 'Natural', 'Column 2': 1 },
//             Harpic: { 'Column 1': 'Trustworthy', 'Column 2': 5 },
//         },
//     },
//   ];
//   const dataProvider = new DataProvider(data);
//   expect(dataProvider.getData({
//     dataName: "Column 1",
//     getValues: () => ['High Quality', 'Natural', 'Trustworthy'],
//     getLabels: () => ['High Quality', 'Natural', 'Trustworthy'],
//     getSeriesNames: () => [ "Lizol", "Herpic" ],
//     getSeriesTitles: () => [ "Lizol", "Herpic" ]
//   })).toEqual([[0, 2, 1], [1, 1, 1]]);
//   expect(dataProvider.getData({
//     dataName: "Column 2",
//     getValues: () => [1, 2, 3, 4, 5],
//     getLabels: () => ["1", "2", "3", "4", "5"],
//     getSeriesNames: () => [ "Lizol", "Herpic" ],
//     getSeriesTitles: () => [ "Lizol", "Herpic" ]
//   })).toEqual([[1, 0, 2, 0, 0], [0, 0, 0, 2, 1]]);
// });

// test("getData for matrix dropdown question values", () => {
//   const json = {
//     questions: [{
//       type: 'matrixdropdown',
//       name: 'question2',
//       title: 'What do you feel about these brands?',
//       isRequired: true,
//       columns: [
//         { name: 'Column 1', title: "My Opinion", choices: ['High Quality', 'Natural', 'Trustworthy'] },
//         { name: 'Column 2', title: "Review Mark", choices: [1, 2, 3, 4, 5] }
//       ],
//       rows: ['Lizol', 'Harpic'],
//     }]
//   };
  
//   const data = [
//     {
//         question2: {
//             Lizol: { 'Column 1': 'Trustworthy', 'Column 2': 3 },
//             Harpic: { 'Column 1': 'High Quality', 'Column 2': 4 },
//         },
//     },
//     {
//         question2: {
//             Lizol: { 'Column 1': 'Natural', 'Column 2': 3 },
//             Harpic: { 'Column 1': 'Natural', 'Column 2': 4 },
//         },
//     },
//     {
//         question2: {
//             Lizol: { 'Column 1': 'Natural', 'Column 2': 1 },
//             Harpic: { 'Column 1': 'Trustworthy', 'Column 2': 5 },
//         },
//     },
//   ];

//   const survey = new SurveyModel(json);
//   const question = survey.getQuestionByName("question2");

//   let visualizer = new VisualizationMatrixDropdown(
//     <any>question,
//     data
//   );
//   let questions = visualizer.getQuestions();

//   const dataProvider = new DataProvider(data);
//   expect(dataProvider.getData(questions[0]).toEqual([[0, 2, 1], [1, 1, 1]]);
//   expect(dataProvider.getData({
//     dataName: "Column 2",
//     getValues: () => [1, 2, 3, 4, 5],
//     getLabels: () => ["1", "2", "3", "4", "5"],
//     getSeriesNames: () => [ "Lizol", "Herpic" ],
//     getSeriesTitles: () => [ "Lizol", "Herpic" ]
//   })).toEqual([[1, 0, 2, 0, 0], [0, 0, 0, 2, 1]]);
// });
