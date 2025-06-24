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
  { "question1": 3 },
  { "question1": 1 },
  { "question1": 3 },
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

// Создаем кастомный визуализатор для ApexCharts
// class ApexChartsHistogramVisualizer extends SurveyAnalyticsCore.VisualizerBase {
//   constructor(question, data, options = {}) {
//     super(question, data, options);
//     this.chart = null;
//   }

//   get name() {
//     return "apexcharts-histogram";
//   }

//   get displayName() {
//     return "ApexCharts Histogram";
//   }

//   get iconClass() {
//     return "sa-visualizer-bar";
//   }

//   getSupportedTypes() {
//     return ["number", "text"];
//   }

//   afterRender(container) {
//     const chartContainer = document.createElement("div");
//     chartContainer.style.width = "100%";
//     chartContainer.style.height = "400px";
//     container.appendChild(chartContainer);

//     const chartData = this.getChartData();
    
//     const options = {
//       series: [{
//         name: this.question.title || this.question.name,
//         data: chartData.data
//       }],
//       chart: {
//         type: 'bar',
//         height: 350,
//         toolbar: {
//           show: true
//         }
//       },
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: '55%',
//           endingShape: 'rounded'
//         },
//       },
//       dataLabels: {
//         enabled: false
//       },
//       stroke: {
//         show: true,
//         width: 2,
//         colors: ['transparent']
//       },
//       xaxis: {
//         categories: chartData.categories,
//         title: {
//           text: this.question.title || this.question.name
//         }
//       },
//       yaxis: {
//         title: {
//           text: 'Frequency'
//         }
//       },
//       fill: {
//         opacity: 1
//       },
//       tooltip: {
//         y: {
//           formatter: function (val) {
//             return val + " responses"
//           }
//         }
//       }
//     };

//     this.chart = new ApexCharts(chartContainer, options);
//     this.chart.render();
//   }

//   getChartData() {
//     const values = this.getValues();
//     const valueCounts = {};
    
//     values.forEach(value => {
//       if (value !== undefined && value !== null) {
//         const key = value.toString();
//         valueCounts[key] = (valueCounts[key] || 0) + 1;
//       }
//     });

//     const categories = Object.keys(valueCounts).sort((a, b) => {
//       const numA = parseFloat(a);
//       const numB = parseFloat(b);
//       return isNaN(numA) || isNaN(numB) ? a.localeCompare(b) : numA - numB;
//     });

//     const data = categories.map(cat => valueCounts[cat]);

//     return { categories, data };
//   }

//   getValues() {
//     return this.data.map(item => item[this.question.name]).filter(val => val !== undefined && val !== null);
//   }

//   destroy() {
//     if (this.chart) {
//       this.chart.destroy();
//       this.chart = null;
//     }
//   }
// }

// // Регистрируем кастомный визуализатор
// SurveyAnalyticsCore.VisualizationManager.registerVisualizer("apexcharts-histogram", ApexChartsHistogramVisualizer);

// SurveyAnalyticsCore.VisualizationManager.registerVisualizer("date", ApexChartsHistogramVisualizer);
// SurveyAnalyticsCore.VisualizationManager.registerVisualizer("number", ApexChartsHistogramVisualizer);
// SurveyAnalyticsCore.VisualizationManager.registerVisualizer("rating", ApexChartsHistogramVisualizer);


var visPanel = new SurveyAnalyticsApexcharts.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  {
    labelTruncateLength: 5,
    allowSortAnswers: true,
    allowShowPercentages: true,
    allowHideEmptyAnswers: false,
    allowTransposeData: false,
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
visPanel.onAlternativeVisualizerChanged.add(function(sender, options) {
  visPanel.visualizers.forEach(visualizer => {
    if(typeof visualizer.setVisualizer === "function") {
      visualizer.setVisualizer(options.visualizer.type, true);
    }
  });
});

// Устанавливаем ApexCharts как визуализатор по умолчанию
// visPanel.visualizers.forEach(visualizer => {
//   if (visualizer.question.getType() === "rating" || visualizer.question.getType() === "text") {
//     visualizer.setVisualizer("apexcharts-histogram", true);
//   }
// });

visPanel.render(document.getElementById("summaryContainer")); 