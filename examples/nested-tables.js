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
        {
          type: "matrixdynamic",
          name: "contactInfo",
          title: "Contact Information",
          columns: [
            { name: "type", cellType: "dropdown", title: "Type", choices: ["Email", "Phone", "Address"] },
            { name: "value", cellType: "text", title: "Value" },
          ],
        },
        {
          type: "paneldynamic",
          name: "children",
          title: "Children",
          templateElements: [
            { type: "text", name: "childName", title: "Child Name" },
            { type: "text", name: "childAge", title: "Child Age", inputType: "number" },
          ],
        },
        {
          type: "matrixdropdown",
          name: "availability",
          title: "Availability",
          columns: [
            { name: "morning", cellType: "checkbox", title: "Morning" },
            { name: "afternoon", cellType: "checkbox", title: "Afternoon" },
          ],
          rows: ["Monday", "Tuesday"],
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
      { relativeType: "Sibling", firstName: "John", lastName: "Doe", age: "28", contactInfo: [{ type: "Email", value: "john@example.com" }, { type: "Phone", value: "555-0101" }], children: [{ childName: "Tommy", childAge: "5" }], availability: { Monday: { morning: true, afternoon: false }, Tuesday: { morning: false, afternoon: true } } },
      { relativeType: "Sibling", firstName: "Jane", lastName: "Doe", age: "25", contactInfo: [{ type: "Email", value: "jane@example.com" }], children: [], availability: { Monday: { morning: true, afternoon: true }, Tuesday: { morning: true, afternoon: false } } },
      { relativeType: "Parent", firstName: "Bob", lastName: "Doe", age: "60", contactInfo: [{ type: "Phone", value: "555-0102" }], children: [{ childName: "John", childAge: "28" }, { childName: "Jane", childAge: "25" }], availability: { Monday: { morning: false, afternoon: false }, Tuesday: { morning: true, afternoon: true } } },
    ],
  },
  {
    teachersRate: [
      { subject: "English", rating: 5, experience: "Excellent", feedback: "Inspiring!" },
      { subject: "Physical Education", rating: 4, experience: "Good", feedback: "Motivating" },
    ],
    relatives: [
      { relativeType: "Spouse", firstName: "Mary", lastName: "Smith", age: "30", contactInfo: [{ type: "Email", value: "mary@example.com" }, { type: "Phone", value: "555-0201" }], children: [{ childName: "Tommy", childAge: "5" }], availability: { Monday: { morning: true, afternoon: true }, Tuesday: { morning: false, afternoon: true } } },
      { relativeType: "Child", firstName: "Tommy", lastName: "Smith", age: "5", contactInfo: [], children: [], availability: { Monday: { morning: false, afternoon: false }, Tuesday: { morning: false, afternoon: false } } },
    ],
  },
  {
    teachersRate: [
      { subject: "Math", rating: 4, experience: "Good", feedback: "Clear explanations" },
    ],
    relatives: [
      { relativeType: "Parent", firstName: "Alice", lastName: "Johnson", age: "65", contactInfo: [{ type: "Address", value: "123 Main St" }], children: [{ childName: "Mark", childAge: "35" }], availability: { Monday: { morning: true, afternoon: false }, Tuesday: { morning: true, afternoon: false } } },
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
