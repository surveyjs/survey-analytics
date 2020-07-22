var json = {
  pages: [
      {
          name: 'page1',
          elements: [
              {
                  type: 'matrix',
                  name: 'question1',
                  title: 'What is your perception of these brands?',
                  columns: [
                      'Excellent',
                      'Very Good',
                      'Good',
                      'Fair',
                      'Neither Fair Nor Poor',
                      'Poor',
                  ],
                  rows: ['Lizol', 'Harpic'],
              },
              {
                  type: 'matrixdropdown',
                  name: 'question2',
                  title: 'What do you feel about these brands?',
                  isRequired: true,
                  columns: [
                    { name: 'Column 1', title: "My Opinion", choices: ['High Quality', 'Natural', 'Trustworthy'] },
                    { name: 'Column 2', title: "Review Mark", choices: [1, 2, 3, 4, 5] }
                  ],
                  rows: ['Lizol', 'Harpic'],
              },
          ],
      },
  ],
};

var survey = new Survey.SurveyModel(json);

var data = [
  {
      question1: { Lizol: 'Excellent', Harpic: 'Excellent' },
      question2: {
          Lizol: { 'Column 1': 'Trustworthy', 'Column 2': 3 },
          Harpic: { 'Column 1': 'High Quality', 'Column 2': 4 },
      },
  },
  {
      question1: { Lizol: 'Very Good', Harpic: 'Very Good' },
      question2: {
          Lizol: { 'Column 1': 'Natural', 'Column 2': 3 },
          Harpic: { 'Column 1': 'Natural', 'Column 2': 4 },
      },
  },
  {
      question1: { Lizol: 'Very Good', Harpic: 'Good' },
      question2: {
          Lizol: { 'Column 1': 'Natural', 'Column 2': 1 },
          Harpic: { 'Column 1': 'Trustworthy', 'Column 2': 5 },
      },
  },
];

var normalizedData = data.map(function(item) {
  survey.getAllQuestions().forEach(function(q) {
    if (item[q.name] === undefined) {
      item[q.name] = "";
    }
  });
  return item;
});

var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false
}

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  normalizedData,
  options
);
visPanel.showHeader = true;
visPanel.render(document.getElementById("summaryContainer"));
