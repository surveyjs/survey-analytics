var json = {
  elements: [
    // {
    //   "type": "rating",
    //   "name": "nps_score",
    //   "title": "How likely are you to recommend our product to a friend or colleague?"
    // },
    // {
    //   type: "text",
    //   inputType: "date",
    //   name: "date",
    // },
    // {
    //   type: "text",
    //   inputType: "number",
    //   name: "age",
    // },
    // { "type": "rating", "name": "question1", "rateValues": [{ "value": 1, "text": "15 minutes" }, { "value": 2, "text": "30 minutes" }, { "value": 3, "text": "1 hour" }] },
    // {
    //   "type": "text",
    //   "name": "question2",
    //   "inputType": "number"    
    //  }
    {
          type: "matrixdropdown",
          name: "question2",
          title: "What do you feel about these brands?",
          isRequired: true,
          columns: [
            {
              name: "Column 1",
              title: "My Opinion",
              choices: ["High Quality", "Natural", "Trustworthy"],
            },
            {
              name: "Column 2",
              title: "Review Mark",
              choices: [1, 2, 3, 4, 5],
            },
          ],
          rows: ["Lizol", "Harpic"],
        },
        {
          type: "dropdown",
          name: "m0",
          choices: [
            { value: "FRA", text: "France" },
            { value: "ATG", text: "Antigua and Barbuda" },
            { value: "ALB", text: "Albania" },
          ],
        },
  ]
}
var survey = new Survey.SurveyModel(json);

var data = [
  {
    nps_score: 1,
    date: "2021-10-13",
    age: 17
  },
  {
    nps_score: 1,
    date: "2021-10-13",
    age: 17
  },
  {
    nps_score: 5,
    date: "2021-10-13",
    age: 17
  },
  {
    nps_score: 10,
    date: "2011-10-13",
    age: 30
  },
  {
    nps_score: 5,
    date: "2011-10-13",
    age: 30
  },
  {
    nps_score: 5,
    date: "2004-10-13",
    age: 40
  },
  {
    nps_score: 5,
    date: "2004-10-13",
    age: 40
  },
  {
    nps_score: 5,
    date: "2016-10-13",
    age: 25
  },
  {
    nps_score: 6,
    date: "2017-10-13",
    age: 25
  },
  {
    date: "2018-10-13",
    age: 25
  },
  {
    date: "2019-10-13",
    age: 25
  },
  {
    date: "2020-10-13",
    age: 25
  },
  {
    date: "2021-10-13",
    age: 25
  },
  {
    nps_score: 7,
    date: "2022-10-13",
    age: 25
  },
  {
    nps_score: 8,
    date: "2023-10-13",
    age: 25
  },
  {
    nps_score: 9,
    date: "2024-10-13",
    age: 25
  },
  {
    nps_score: 2,
    date: "2025-10-13",
    age: 25
  },
  {
    nps_score: 2,
    date: "2026-10-13",
    age: 25
  },
  {
    nps_score: 3,
    date: "2027-10-13",
    age: 25
  },
  {
    nps_score: 4,
    date: "2028-10-13",
    age: 25
  },
  {
    nps_score: 4,
    date: "2029-10-13",
    age: 25
  },
  {
    nps_score: 0,
    date: "2030-10-13",
    age: 25
  },
  // { "question1": 3 },
  // { "question1": 1 },
  // { "question1": 3 },
  
  {
    "hystogram-without-series-labels-rows": {
      "Row 1": {
        "Column 1": 1,
        "Column 2": 1,
      },
      "Row 2": {
        "Column 1": 2,
        "Column 2": 2
      },
      // "Row 3": {
      //   "Column 1": 3,
      //   "Column 2": 1
      // },
      // "Row 4": {
      //   "Column 1": 4,
      //   "Column 2": 4
      // },
      // "Row 5": {
      //   "Column 1": 5,
      //   "Column 2": 5
      // }
    },
    "hystogram-matrixdynamic": [
      {
        "Column 1": 1,
        "Column 2": 1,
      },
      {
        "Column 1": 2,
        "Column 2": 2
      },
      {
        "Column 1": 3,
        "Column 2": 3
      },
      {
        "Column 1": 4,
        "Column 2": 4
      },
      {
        "Column 1": 5,
        "Column 2": 5
      }
    ],
    question1: { Lizol: "Excellent", Harpic: "Excellent" },
    question2: {
      Lizol: { "Column 1": "Trustworthy", "Column 2": 3 },
      Harpic: { "Column 1": "High Quality", "Column 2": 4 },
    },
  },
  {
    "hystogram-without-series-labels-rows": {
      "Row 1": {
        "Column 1": 5
      },
      "Row 2": {
        "Column 1": 4
      },
      // "Row 3": {
      //   "Column 1": 3
      // },
      // "Row 4": {
      //   "Column 1": 2
      // },
      // "Row 5": {
      //   "Column 1": 1
      // }
    },
    question1: { Lizol: "Very Good", Harpic: "Very Good" },
    question2: {
      Lizol: { "Column 1": "Natural", "Column 2": 3 },
      Harpic: { "Column 1": "Natural", "Column 2": 4 },
    },
  },
  {
    "hystogram-without-series-labels-rows": {
      "Row 1": {
        "Column 1": 1
      },
      "Row 2": {
        "Column 1": 1
      },
      // "Row 3": {
      //   "Column 1": 1
      // },
      // "Row 4": {
      //   "Column 1": 1
      // },
      // "Row 5": {
      //   "Column 1": 1
      // }
    },
    question1: { Lizol: "Very Good", Harpic: "Good" },
    question2: {
      Lizol: { "Column 1": "Natural", "Column 2": 1 },
      Harpic: { "Column 1": "Trustworthy", "Column 2": 5 },
    },
  },

];

data = data.concat([
  {
    m0: "FRA",
    m11: "FRA",
    m1: "FRA",
  },
    {
    m0: "FRA",
    m11: "FRA",
    m1: "FRA",
  },
  {
    m0: "ALB",
    m11: "ALB",
    m1: "ALB",
  },
  {
    m0: "ATG",
    m11: "ATG",
    m1: "ATG",
  },
]);

var visPanel = new SurveyAnalyticsChartjs.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  {
    labelTruncateLength: 5,
    allowSortAnswers: true,
    allowShowPercentages: true,
    allowHideEmptyAnswers: true,
    allowTransposeData: true,
    allowTopNAnswers: true,
    age: {
      intervals: [
        { start: 0, end: 7, label: "childhood" },
        { start: 7, end: 14, label: "adolescence" },
        { start: 14, end: 19, label: "youth" },
        { start: 19, end: 70, label: "adult" },
        { start: 70, end: 100, label: "old age" }
      ]
    }
  }
);

visPanel.showToolbar = true;
visPanel.render(document.getElementById("chart-container")); 

// Example usage of Chart.js visualizers
// const container = document.getElementById('chart-container');

// // Example with histogram
// const histogramData = [1, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5, 5];
// const histogram = new HistogramVisualizer(container);
// histogram.render(histogramData, 5);

// // Example with ranking
// const rankingData = ['Option A', 'Option B', 'Option A', 'Option C', 'Option B'];
// const rankingOptions = ['Option A', 'Option B', 'Option C'];
// const ranking = new RankingVisualizer(container);
// ranking.render(rankingData, rankingOptions); 