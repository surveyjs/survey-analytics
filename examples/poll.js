var json = {
  "pages": [
    {
      "name": "page_info",
      "elements": [
        {
          "type": "radiogroup",
          "name": "organization_type",
          "title": "Which of the following best describes you or your organization?",
          "hasOther": true,
          "choices": [
            {
              "value": "ISV",
              "text": "ISV (building commercial/shrink wrapped software)"
            }, {
              "value": "Consulting",
              "text": "Software consulting firm (provide development services to other organizations)"
            }, {
              "value": "Custom",
              "text": "Custom software development (as a freelancer/contractor)"
            }, {
              "value": "In-house",
              "text": "In-house software development"
            }, {
              "value": "Hobbyist",
              "text": "Hobbyist (develop apps for personal use)"
            }
          ],
          "colCount": 2
        }
      ]
    }
  ]
};

// Custom visualizer finds min and max values across all the answers on this question and shows them
function PollVisualizer(question, data) {

  var renderContent = function (contentContainer, visualizer) {
    var answersData = visualizer.getAnswersData();
    var datasets = answersData.datasets;
    var labels = answersData.labels;
    var colors = answersData.colors;
    var texts = answersData.texts;
    var seriesLabels = answersData.seriesLabels;
    var hasSeries = seriesLabels.length > 1;

    var emptyTextNode = SurveyAnalytics.DocumentHelper.createElement("p", "", {
      innerText: SurveyAnalytics.localization.getString("noResults"),
    });

    if (datasets.length === 0 || datasets[0].length === 0) {
      contentContainer.appendChild(emptyTextNode);
      return;
    }

    datasets.forEach(function (data, idx) {
      var tableNode = (
        SurveyAnalytics.DocumentHelper.createElement("table", "sa-poll-table")
      );

      tableNode.style.backgroundColor = visualizer.backgroundColor;

      data.forEach(function (rowData, index) {
        var row = SurveyAnalytics.DocumentHelper.createElement("tr");
        var labelCell = SurveyAnalytics.DocumentHelper.createElement("td", "sa-poll-table__cell", {
          textContent: labels[index] + " - " + texts[idx][index] + "%" + " (" + rowData + " votes)",
        });
        row.appendChild(labelCell);
        tableNode.appendChild(row);

        row = SurveyAnalytics.DocumentHelper.createElement("tr");
        var sparklineCell = SurveyAnalytics.DocumentHelper.createElement("td", "sa-poll-table__cell");
        sparklineCell.colspan = "3";
        var outerBar = SurveyAnalytics.DocumentHelper.createElement("div", "sa-poll-sparkline");
        var innerBar = SurveyAnalytics.DocumentHelper.createElement("div", "sa-poll-sparkline-value");
        innerBar.style.width = texts[idx][index] + "%";
        outerBar.appendChild(innerBar);
        sparklineCell.appendChild(outerBar);
        row.appendChild(sparklineCell);
        tableNode.appendChild(row);
      });

      contentContainer.appendChild(tableNode);
    });
  };
  var visualizer = new SurveyAnalytics.SelectBase(question, data, {
    renderContent: renderContent
  }, "pollVisualizer");
  visualizer.answersOrder = "asc";
  visualizer.showPercentages = true;
  return visualizer;
}

SurveyAnalytics
  .VisualizationManager
  .unregisterVisualizer("radiogroup", SurveyAnalytics.SelectBasePlotly);

// Register custom visualizer for the given question type
SurveyAnalytics
  .VisualizationManager
  .registerVisualizer("radiogroup", PollVisualizer);

// Set localized title of this visualizer
SurveyAnalytics
  .localization
  .locales["en"]["visualizer_pollVisualizer"] = "Poll visualizer";

var survey = new Survey.Model(json);
var allQuestions = survey.getAllQuestions();

var panelNode = document.getElementById("vizPanel");
panelNode.innerHTML = "";

var data = [
  {
    organization_type: "In-house",
    developer_count: "6-10"
  }, {
    organization_type: "other",
    developer_count: "3-5"
  }, {
    organization_type: "Hobbyist",
    developer_count: "3-5"
  }, {
    organization_type: "Hobbyist",
    developer_count: "5-10"
  }
];

var visPanel = new SurveyAnalytics.VisualizationPanel(allQuestions, data, { allowDynamicLayout: false, allowHideQuestions: false });
visPanel.render(panelNode);
$("#loadingIndicator").hide();
