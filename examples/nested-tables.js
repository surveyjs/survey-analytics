var surveyJson = {
  questions: [
    {
      type: "matrixdynamic",
      name: "teachersRate",
      title: "Please rate your teachers",
      columns: [
        {
          name: "subject",
          cellType: "dropdown",
          title: "Subject",
          choices: [
            "Math",
            "Science",
            "History",
            "English",
            "Physical Education"
          ],
        },
        {
          name: "rating",
          cellType: "rating",
          title: "Rating",
          rateMax: 5
        },
        {
          name: "experience",
          cellType: "dropdown",
          title: "Teaching Experience",
          choices: ["Excellent", "Good", "Average", "Poor"]
        },
        {
          name: "feedback",
          cellType: "text",
          title: "Additional Feedback"
        },
      ],
    },
    {
      type: "paneldynamic",
      name: "relatives",
      title: "Please enter information about your relatives",
      templateElements: [
        {
          type: "dropdown",
          name: "relativeType",
          title: "Relationship",
          choices: ["Parent", "Sibling", "Spouse", "Child", "Other"]
        },
        {
          type: "text",
          name: "firstName",
          title: "First Name",
        },
        {
          type: "text",
          name: "lastName",
          title: "Last Name",
        },
        {
          type: "text",
          name: "age",
          title: "Age",
          inputType: "number"
        },
      ],
    },
  ],
};

var surveyData = [
  {
    teachersRate: [
      { subject: "Math", rating: 5, experience: "Excellent", feedback: "Great teacher!" },
      { subject: "Science", rating: 4, experience: "Good", feedback: "Very knowledgeable" },
      { subject: "History", rating: 3, experience: "Average", feedback: "Could improve" },
    ],
    relatives: [
      { relativeType: "Sibling", firstName: "John", lastName: "Doe", age: "28" },
      { relativeType: "Sibling", firstName: "Jane", lastName: "Doe", age: "25" },
      { relativeType: "Parent", firstName: "Bob", lastName: "Doe", age: "60" },
    ],
  },
  {
    teachersRate: [
      { subject: "English", rating: 5, experience: "Excellent", feedback: "Inspiring!" },
      { subject: "Physical Education", rating: 4, experience: "Good", feedback: "Motivating" },
    ],
    relatives: [
      { relativeType: "Spouse", firstName: "Mary", lastName: "Smith", age: "30" },
      { relativeType: "Child", firstName: "Tommy", lastName: "Smith", age: "5" },
    ],
  },
  {
    teachersRate: [
      { subject: "Math", rating: 4, experience: "Good", feedback: "Clear explanations" },
    ],
    relatives: [
      { relativeType: "Parent", firstName: "Alice", lastName: "Johnson", age: "65" },
    ],
  },
];

var survey = new Survey.SurveyModel(surveyJson);
var matrixTabulator = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  surveyData,
  {
    // useNestedTables: false,
  }
);
matrixTabulator.render("tabulatorContainer");
