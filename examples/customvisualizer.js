// Register the custom question type
// Lets the question collects two values - min and max
// Question value is an object like { min: 3, max: 9 }
Survey.Serializer.addClass("custom-question", [], null, "text");

// Custom visualizer finds min and max values across all the answers on this question and shows them
function CustomVisualizer(question, data) {
  var getData = function (visualizer) {
    var result = [Number.MAX_VALUE, Number.MIN_VALUE];
    visualizer.data.forEach(function (row) {
      var rowValue = row[visualizer.question.name];
      if (!!rowValue) {
        if (rowValue.min < result[0]) {
          result[0] = rowValue.min;
        }
        if (rowValue.max > result[1]) {
          result[1] = rowValue.max;
        }
      }
    });

    return result;
  };

  var renderContent = function (contentContainer, visualizer) {
    var data2render = getData(visualizer);
    var minEl = document.createElement("div");
    var minTextEl = document.createElement("span");
    minTextEl.innerText = "Min: ";
    var minValEl = document.createElement("span");
    minValEl.innerText = data2render[0];
    minEl.appendChild(minTextEl);
    minEl.appendChild(minValEl);
    contentContainer.appendChild(minEl);
    var maxEl = document.createElement("div");
    var maxTextEl = document.createElement("span");
    maxTextEl.innerText = "Max: ";
    var maxValEl = document.createElement("span");
    maxValEl.innerText = data2render[1];
    maxEl.appendChild(maxTextEl);
    maxEl.appendChild(maxValEl);
    contentContainer.appendChild(maxEl);
  };
  return new SurveyAnalytics.VisualizerBase(
    question,
    data,
    { renderContent: renderContent },
    "minMaxVisualizer"
  );
}

// Register custom visualizer for the given question type
SurveyAnalytics.VisualizationManager.registerVisualizer(
  "custom-question",
  CustomVisualizer
);
// Set localized title of this visualizer
SurveyAnalytics.localization.locales["en"]["visualizer_minMaxVisualizer"] =
  "Min/Max Values";

// Custom visualizer finds min value across all the answers on this question and shows it
function CustomMinVisualizer(question, data) {
  var getData = function (visualizerBase) {
    var result = Number.MAX_VALUE;

    visualizerBase.data.forEach(function (row) {
      var rowValue = row[visualizerBase.name];
      if (!!rowValue) {
        if (rowValue.min < result) {
          result = rowValue.min;
        }
      }
    });

    return result;
  };

  var renderContent = function (contentContainer, visualizer) {
    var data2render = getData(visualizer);
    var minEl = document.createElement("div");
    var minTextEl = document.createElement("span");
    minTextEl.innerText = "Min: ";
    var minValEl = document.createElement("span");
    minValEl.innerText = data2render;
    minEl.appendChild(minTextEl);
    minEl.appendChild(minValEl);
    contentContainer.appendChild(minEl);
  };

  return new SurveyAnalytics.VisualizerBase(
    question,
    data,
    {
      renderContent: renderContent,
    },
    "minVisualizer"
  );
}

// Register the second custom visualizer for the given question type
SurveyAnalytics.VisualizationManager.registerVisualizer(
  "custom-question",
  CustomMinVisualizer
);
// Set localized title of this visualizer
SurveyAnalytics.localization.locales["en"]["visualizer_minVisualizer"] =
  "Min Value Only";
