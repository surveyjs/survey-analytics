var json = {
  pages: [
      {
          name: 'page1',
          elements: [
              {
                  type: 'matrix',
                  name: 'question1',
                  title: 'What is your perception of these brands?',
                  isRequired: true,
                  columns: [
                      'Excellent',
                      'Very Good',
                      'Good',
                      'Fair',
                      'Neither Fair Nor Poor',
                      'Poor',
                  ],
                  rows: ['Lizol', 'Harpic'],
                  isAllRowRequired: true,
              },
              {
                  type: 'matrixdropdown',
                  name: 'question2',
                  title: 'What do you feel about these brands?',
                  isRequired: true,
                  columns: [{ name: 'Column 1', isRequired: true }],
                  choices: ['High Quality', 'Natural', 'Trustworthy'],
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
          Lizol: { 'Column 1': 'Natural' },
          Harpic: { 'Column 1': 'Natural' },
      },
  },
  {
      question1: { Lizol: 'Very Good', Harpic: 'Very Good' },
      question2: {
          Lizol: { 'Column 1': 'Natural' },
          Harpic: { 'Column 1': 'Natural' },
      },
  },
  {
      question1: { Lizol: 'Very Good', Harpic: 'Good' },
      question2: {
          Lizol: { 'Column 1': 'Natural' },
          Harpic: { 'Column 1': 'Natural' },
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
