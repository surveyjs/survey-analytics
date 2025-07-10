function PollVisualizer(question, data, options) {
  // Step 1: Implement a rendering function
  function renderContent (contentContainer, visualizer) {
    visualizer.getAnswersData().then((vizData) => {
      const polls = vizData.datasets;
      const choices = vizData.labels;
      const percentages = vizData.texts;
      if (polls.length === 0 || polls[0].length === 0) {
        const emptyResultsHtml = `<p>` + SurveyAnalytics.localization.getString("noResults") + `</p>`;
        contentContainer.insertAdjacentHTML("beforeend", emptyResultsHtml);
        return;
      }
      polls.forEach((poll, idx) => {
        const tableNode = document.createElement("table");
        tableNode.classList.add("sa-poll-table");
        tableNode.style.backgroundColor = visualizer.backgroundColor;
        poll.forEach((voteCount, index) => {
          const textRow =
          `<tr>
            <td class="sa-poll-table__cell">` +
            choices[index] + " - " + percentages[idx][index] + "%" + " (" + voteCount + " votes)" + `
            </td>
          </tr>`;
          const graphRow =
          `<tr>
            <td class="sa-poll-table__cell" colspan="3">
              <div class="sa-poll-sparkline">
                <div class="sa-poll-sparkline-value" style="width:` + percentages[idx][index] + "%" + `"></div>
              </div>
            </td>
          </tr>`;
          tableNode.insertAdjacentHTML("beforeend", textRow);
          tableNode.insertAdjacentHTML("beforeend", graphRow);
        });
        contentContainer.appendChild(tableNode);
      });
    });
  };
  // Step 2: Instantiate the visualizer
  const visualizer = new SurveyAnalytics.SelectBase(
    question,
    data,
    { renderContent: renderContent, dataProvider: options.dataProvider },
    "pollVisualizer"
  );
  visualizer.answersOrder = "asc";
  visualizer.showPercentages = true;
  return visualizer;
}

SurveyAnalytics.VisualizationManager.registerVisualizer("radiogroup", PollVisualizer, 0);

var json = {
  "elements": [{
    "type": "radiogroup",
    "name": "organization_type",
    "title": "Which of the following best describes you or your organization?",
    "showOtherItem": true,
    "choices": [{
      "value": "ISV",
      "text": "ISV (building commercial/shrink-wrapped software)"
    }, {
      "value": "Consulting",
      "text": "Software consulting firm (providing development services to other organizations)"
    }, {
      "value": "Custom",
      "text": "Custom software development (as a freelancer/contractor)"
    }, {
      "value": "In-house",
      "text": "In-house software development"
    }, {
      "value": "Hobbyist",
      "text": "Hobbyist (developing apps for personal use)"
    }],
    "colCount": 2
  }]
};
var survey = new Survey.SurveyModel(json);

var dataFromServer = [
    { organization_type: "In-house" },
    { organization_type: "other" },
    { organization_type: "Hobbyist" },
    { organization_type: "Hobbyist" },
    { organization_type: "Hobbyist" },
    { organization_type: "Consulting" },
    { organization_type: "In-house" },
    { organization_type: "Consulting" },
    { organization_type: "Hobbyist" },
    { organization_type: "Hobbyist" },
    { organization_type: "ISV" },
    { organization_type: "ISV" },
    { organization_type: "Custom" },
    { organization_type: "ISV" },
    { organization_type: "Custom" }
];;

var vizPanel = new SurveyAnalytics.VisualizationPanel(
    survey.getAllQuestions(),
    dataFromServer,
    { allowDynamicLayout: false, allowHideQuestions: false }
);

vizPanel.render(document.getElementById("container"));
