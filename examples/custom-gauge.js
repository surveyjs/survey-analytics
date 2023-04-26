var surveyId = "";
var accessKey = "";

var survey = new Survey.SurveyModel(json);

function generateValues(maxValue, stepsCount) {
  const values = [];

  for (let i = 0; i < stepsCount; i++) {
    values.push(maxValue / stepsCount);
  }

  values.push(maxValue);

  return values;
}

function generateText(maxValue, minValue, stepsCount) {
  return [
    "very hight (" + maxValue + ")",
    "hight",
    "medium",
    "low",
    "very low (" + minValue + ")",
  ];
}

function getCustomData(model, level, arrowColor) {
  const question = model.question;
  const name = model.type;

  const maxValue = question.rateMax;
  const minValue = question.rateMin;
  const stepsCount = SurveyAnalytics.GaugePlotly.stepsCount;
  const values = generateValues(maxValue, stepsCount);
  const text = generateText(maxValue, minValue, stepsCount);
  const colors = model.generateColors(maxValue, minValue, stepsCount);

  return [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: {
        size: 28,
        color: arrowColor,
      },
      name: name,
      text: level,
      showlegend: false,
      hoverinfo: "text+name",
    },
    {
      values: values,
      rotation: 90,
      text: text,
      textinfo: "text",
      textposition: "inside",
      // textfont: {
      //   size: 20
      // },
      marker: {
        colors: colors,
      },
      hoverinfo: "skip",
      hole: 0.5,
      type: "pie",
      showlegend: false,
    },
  ];
}

function getCustomLayout(model, level, arrowColor) {
  const maxValue = model.question.rateMax;
  const degrees = maxValue - level;
  const radius = 0.5;
  const radians = (degrees * Math.PI) / maxValue;
  const x = radius * Math.cos(radians);
  const y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  const mainPath = "M -.0 -0.025 L .0 0.025 L ",
    pathX = String(x),
    space = " ",
    pathY = String(y),
    pathEnd = " Z";
  const path = mainPath.concat(pathX, space, pathY, pathEnd);

  return {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: arrowColor,
        line: {
          color: arrowColor,
        },
      },
    ],
    title: level,
    height: 600,
    width: 600,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1],
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1],
    },
    plot_bgcolor: model.backgroundColor,
    paper_bgcolor: model.backgroundColor,
  };
}

SurveyAnalytics.PlotlySetup.onPlotCreating.add((model, options) => {
  if (model.chartType !== "gauge") return;
  const arrowColor = "#4e6198";
  const level = options.data[0].value;
  options.data = getCustomData(model, level, arrowColor);
  options.layout = getCustomLayout(model, level, arrowColor);
});

var visPanel = new SurveyAnalytics.VisualizationPanel(
  [survey.getQuestionByName("nps_score")],
  data,
  {}
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
