import { SurveyModel, Question } from "survey-core";
import { VisualizationMatrixDynamic } from "../src/visualizationMatrixDynamic";

const json = {
  questions: [
    {
      type: "matrixdynamic",
      name: "teachersRate",
      title: "Please rate your teachers",
      addRowText: "Add Subject",
      horizontalScroll: true,
      columnMinWidth: "130px",
      columnColCount: 1,
      cellType: "radiogroup",
      choices: [
        {
          value: 1,
          text: "Yes",
        },
        {
          value: 0,
          text: "Sometimes",
        },
        {
          value: -1,
          text: "No",
        },
      ],
      columns: [
        {
          name: "subject",
          cellType: "dropdown",
          title: "Select a subject",
          isRequired: true,
          minWidth: "300px",
          choices: [
            "English: American Literature",
            "English: British and World Literature",
            "Math: Consumer Math",
            "Math: Practical Math",
            "Math: Developmental Algebra",
            "Math: Continuing Algebra",
            "Math: Pre-Algebra",
            "Math: Algebra",
            "Math: Geometry",
            "Math: Integrated Mathematics",
            "Science: Physical Science",
            "Science: Earth Science",
            "Science: Biology",
            "Science: Chemistry",
            "History: World History",
            "History: Modern World Studies",
            "History: U.S. History",
            "History: Modern U.S. History",
            "Social Sciences: U.S. Government and Politics",
            "Social Sciences: U.S. and Global Economics",
            "World Languages: Spanish",
            "World Languages: French",
            "World Languages: German",
            "World Languages: Latin",
            "World Languages: Chinese",
            "World Languages: Japanese",
          ],
        },
        {
          name: "explains",
          title: "Clearly explains the objectives",
        },
        {
          name: "interesting",
          title: "Makes class interesting",
        },
        {
          name: "effective",
          title: "Uses class time effectively",
        },
        {
          name: "knowledge",
          title: "Knows the subject matter",
        },
        {
          name: "recognition",
          title: "Recognizes and acknowledges effort",
        },
        {
          name: "inform",
          title: "Keeps me informed of my progress",
        },
        {
          name: "opinion",
          title: "Encourages and accepts different opinions",
        },
        {
          name: "respect",
          title: "Has the respect of the student",
        },
        {
          name: "cooperation",
          title: "Encourages cooperation and participation",
        },
        {
          name: "parents",
          title: "Communicates with my parents",
        },
        {
          name: "selfthinking",
          title: "Encourages me to think for myself",
        },
        {
          name: "frusturation",
          cellType: "comment",
          title: "Is there anything about this class that frustrates you?",
          minWidth: "250px",
        },
        {
          name: "likeTheBest",
          cellType: "comment",
          title: "What do you like best about this class and/or teacher?",
          minWidth: "250px",
        },
        {
          name: "improvements",
          cellType: "comment",
          title:
            "What do you wish this teacher would do differently that would improve this class?",
          minWidth: "250px",
        },
      ],
      rowCount: 2,
    },
  ],
};

const data = [
  {
    teachersRate: [
      {
        subject: "Math: Continuing Algebra",
        explains: 0,
        interesting: -1,
        effective: 1,
        knowledge: -1,
        recognition: 0,
        parents: -1,
        selfthinking: -1,
        frusturation: "love",
        likeTheBest: "wombat",
        improvements: "peace",
      },
      {
        subject: "History: Modern U.S. History",
        explains: 0,
        interesting: 0,
        effective: 0,
        knowledge: -1,
        recognition: 0,
        inform: 0,
        opinion: 1,
        respect: -1,
        cooperation: 1,
        parents: 0,
        selfthinking: -1,
        frusturation: "war",
        likeTheBest: "peace",
        improvements: "love",
      },
      {
        subject: "World Languages: Chinese",
        explains: 1,
        interesting: 0,
        effective: -1,
        knowledge: 0,
        recognition: 1,
        inform: 1,
        opinion: 0,
        respect: 1,
        cooperation: -1,
        parents: 0,
        selfthinking: 1,
        frusturation: "two",
        likeTheBest: "war",
        improvements: "one",
      },
    ],
  },
];

test("getQuestions", () => {
  const survey = new SurveyModel(json);
  const question = survey.getQuestionByName("teachersRate");
  const visualizer = new VisualizationMatrixDynamic(<any>question, []);

  let questions = visualizer.getQuestions();
  expect(questions.length).toBe(15);
  expect(questions[0].name).toBe("subject");
});

test("data and inner panel data", () => {
  const survey = new SurveyModel(json);
  const question = survey.getQuestionByName("teachersRate");
  const visualizer = new VisualizationMatrixDynamic(<any>question, data);

  expect(visualizer["data"]).toEqual(data);
  expect(visualizer["_panelVisualizer"]["data"]).toEqual(data[0].teachersRate);
});
