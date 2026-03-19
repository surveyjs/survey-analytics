// Matrix Dynamic Example
var matrixDynamicJson = {
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
  ],
};

var matrixDynamicData = [
  {
    teachersRate: [
      { subject: "Math", rating: 5, experience: "Excellent", feedback: "Great teacher!" },
      { subject: "Science", rating: 4, experience: "Good", feedback: "Very knowledgeable" },
      { subject: "History", rating: 3, experience: "Average", feedback: "Could improve" },
    ],
  },
  {
    teachersRate: [
      { subject: "English", rating: 5, experience: "Excellent", feedback: "Inspiring!" },
      { subject: "Physical Education", rating: 4, experience: "Good", feedback: "Motivating" },
    ],
  },
  {
    teachersRate: [
      { subject: "Math", rating: 4, experience: "Good", feedback: "Clear explanations" },
    ],
  },
];

// Panel Dynamic Example
var panelDynamicJson = {
  questions: [
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

var panelDynamicData = [
  {
    relatives: [
      { relativeType: "Sibling", firstName: "John", lastName: "Doe", age: "28" },
      { relativeType: "Sibling", firstName: "Jane", lastName: "Doe", age: "25" },
      { relativeType: "Parent", firstName: "Bob", lastName: "Doe", age: "60" },
    ],
  },
  {
    relatives: [
      { relativeType: "Spouse", firstName: "Mary", lastName: "Smith", age: "30" },
      { relativeType: "Child", firstName: "Tommy", lastName: "Smith", age: "5" },
    ],
  },
  {
    relatives: [
      { relativeType: "Parent", firstName: "Alice", lastName: "Johnson", age: "65" },
    ],
  },
];

// Initialize Matrix Dynamic Table with nested tables
var matrixSurvey = new Survey.SurveyModel(matrixDynamicJson);
var matrixTabulator = new SurveyAnalytics.Tabulator(
  matrixSurvey,
  matrixDynamicData,
  {
    useNestedTables: true, // Enable nested tables
  }
);
matrixTabulator.render("matrixDynamicTable");

// Initialize Panel Dynamic Table with nested tables
var panelSurvey = new Survey.SurveyModel(panelDynamicJson);
var panelTabulator = new SurveyAnalytics.Tabulator(
  panelSurvey,
  panelDynamicData,
  {
    useNestedTables: true, // Enable nested tables
  }
);
panelTabulator.render("panelDynamicTable");
