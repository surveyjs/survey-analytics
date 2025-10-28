function generateValues (maxValue, stepsCount) {
  const values = [];

  for (let i = 0; i < stepsCount; i++) {
    values.push(maxValue / stepsCount);
  }
  values.push(maxValue);

  return values;
}

function getData (visualizer, minValue, maxValue, level, arrowColor) {
  const stepsCount = SurveyAnalytics.GaugePlotly.stepsCount;
  const values = generateValues(maxValue, stepsCount);
  const text = [ "Most likely", "Likely", "Neutral", "Unlikely", "Most unlikely" ];
  const colors = visualizer.generateColors(maxValue, minValue, stepsCount);

  return [
    // Draw a dot for the gauge arrow
    // https://plotly.com/javascript/reference/scatter/
    {
      type: "scatter",
      name: name,
      text: level,
      x: [0],
      y: [0],
      marker: {
        size: 20,
        color: arrowColor
      },
      showlegend: false,
      hoverinfo: "text+name"
    },

    // Draw gauge sectors
    // https://plotly.com/javascript/reference/pie/
    {
      type: "pie",
      values: values,
      rotation: 90,
      text: text,
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: colors
      },
      hole: 0.55,
      showlegend: false,
      hoverinfo: "skip"
    }
  ];
}

function getLayout (maxValue, level, arrowColor) {
  const degrees = maxValue - level;
  const radius = 0.5;
  const radians = (degrees * Math.PI) / maxValue;
  const x = radius * Math.cos(radians);
  const y = radius * Math.sin(radians);
  const baseX = 0.49;
  const baseY = 0.25;
  // Build SVG markup for the gauge arrow
  const path = "M " + (baseX - 0.01) + " " + baseY + " L " +  (baseX + 0.01) + " " + baseY + " L " +  (baseX + x) + " " + (baseY + y) + " Z";

  // https://plotly.com/javascript/reference/layout/
  const layout = {
    title: level,
    height: 600,
    width: 600,
    // Draw the gauge arrow
    shapes: [{
      type: "path",
      path: path,
      fillcolor: arrowColor,
      line: {
          color: arrowColor
      }
    }],
    plot_bgcolor: "transparent",
    paper_bgcolor: "transparent",
  };

  return layout;
}

SurveyAnalytics.PlotlySetup.onPlotCreating.add((visualizer, options) => {
  const arrowColor = "#4e6198";
  const level = options.data.datasets[0][options.data.labels.indexOf("average")];
  const maxValue = options.data.datasets[0][options.data.labels.indexOf("max")];
  const minValue = options.data.datasets[0][options.data.labels.indexOf("min")];  
  options.data = getData(visualizer, minValue, maxValue, level, arrowColor);
  options.layout = getLayout(maxValue, level, arrowColor);
});

var options = {
  // allowDynamicLayout: false,
  // allowDragDrop: false,
  // allowHideQuestions: false,
  // allowShowPercentages: true,
  // showPercentages: true,
  // showOnlyPercentages: true,
  // useValuesAsLabels: false
  // haveCommercialLicense: false,
  // allowSortAnswers: true,
  // answersOrder: "desc"
  // allowHideEmptyAnswers: true,
  // hideEmptyAnswers: true,
  // allowTopNAnswers: true,
  // showCorrectAnswers: true
  // labelTruncateLength: 27,
};

const visualizerDefinition1 = {
  visualizerType: "gauge",
  chartType: "bullet",
  dataName: "test",
  displayValueName: "count",
  title: "Total answers count - Gauge bullet"
};

const visualizerDefinition2 = {
  visualizerType: "card",
  dataName: "test",
  displayValueName: "count",
  title: "Total answers count - Card"
};

const visualizerDefinition3 = {
  visualizerType: "gauge",
  chartType: "gauge",
  dataName: "test",
  title: "Total answers count - Gauge gauge"
};

const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }, {}];
let visPanel = new SurveyAnalytics.VisualizationPanel([visualizerDefinition2, visualizerDefinition1], data, options);


visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
