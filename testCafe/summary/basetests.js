const { initSummary, url } = require("../settings");
const { Selector, ClientFunction } = require("testcafe");
var json = {
  elements: [
    {
      type: "boolean",
      name: "bool",
      title: "Question 1",
    },
    {
      type: "boolean",
      name: "bool2",
      title: "Question 2",
    },
  ],
};

var data = [
  {
    bool: true,
    bool2: false,
  },
  {
    bool: true,
    bool2: false,
  },
  {
    bool: false,
    bool2: true,
  },
];

var options = {
  allowDynamicLayout: true,
  allowHideQuestions: true,
};

fixture`basetests`.page`${url}`.beforeEach(async (t) => {
  await t.resizeWindow(1920, 1080);
  await initSummary(json, data, options);
});

test("check show/hide questions", async (t) => {
  const isVisibleInState = ClientFunction((title) => {
    return visPanel.state.elements.filter(
      (question) => question.displayName == title
    )[0].isVisible;
  });
  const questionTitle = "Question 1";
  const questionSelector = Selector(
    "#summaryContainer .sa-question div"
  ).withText(questionTitle);
  const showDropdown = Selector("#summaryContainer .sa-question__select");
  await t
    .expect(questionSelector.exists)
    .ok()
    .click(questionSelector.find("span").withText("Hide"))
    .expect(questionSelector.exists)
    .notOk()
    .expect(isVisibleInState(questionTitle))
    .notOk()
    .click(showDropdown)
    .click(showDropdown.find("option").withText(questionTitle))
    .expect(questionSelector.exists)
    .ok()
    .expect(isVisibleInState(questionTitle))
    .ok();
});

test("check show/hide questions set from constructor", async (t) => {
  await initSummary(json, data, {}, [
    {
      name: "bool",
      displayName: "Question 1",
      isVisible: false,
      renderedElement: {},
    },
    {
      name: "bool2",
      displayName: "Question 2",
      isVisible: true,
      renderedElement: {},
    },
  ]);
  await t
    .expect(
      Selector("#summaryContainer .sa-question div").withText("Question 1")
        .exists
    )
    .notOk()
    .expect(
      Selector("#summaryContainer .sa-question div").withText("Question 2")
        .exists
    )
    .ok();
});

test("check change questions layout", async (t) => {
  const getPositionInState = ClientFunction((title) => {
    var elements = visPanel.state.elements.map(function (element) { return element.displayName; });
    return elements.indexOf(title);
  });
  const questionTitle = "Question 1";
  const questionSelector = Selector(
    "#summaryContainer .sa-question div"
  ).withText(questionTitle);
  await t
    .dragToElement(
      questionSelector.find(".sa-question__title"),
      Selector("#summaryContainer .sa-panel__content"),
      {
        offsetX: -1,
        offsetY: 1,
        destinationOffsetX: -1,
        destinationOffsetY: 1,
      }
    )
    .expect(getPositionInState(questionTitle))
    .eql(1);
});

test("check filtering data", async (t) => {
  const questionTitle = "Question 1";
  const secondQuestionTitle = "Question 2";
  const questionSelector = Selector(
    "#summaryContainer .sa-question div"
  ).withText(questionTitle);

  const secondQuestionSelector = Selector(
    "#summaryContainer .sa-question div"
  ).withText(secondQuestionTitle);

  await t
    .click(questionSelector.find("[data-unformatted='Yes<br>66.7%']"))
    .expect(questionSelector.find("[data-unformatted='No<br>33.3%']").exists)
    .notOk()
    .expect(
      secondQuestionSelector.find("[data-unformatted='Yes<br>33.3%']").exists
    )
    .notOk()
    .click(questionSelector.find("span").withText("Clear"))
    .expect(questionSelector.find("[data-unformatted='No<br>33.3%']").exists)
    .ok()
    .expect(
      secondQuestionSelector.find("[data-unformatted='Yes<br>33.3%']").exists
    )
    .ok();
});

test("check show/hide commercial license caption", async (t) => {
  var enableHaveCommercialLicense = ClientFunction(() => {
    SurveyAnalytics.VisualizationPanel.haveCommercialLicense = true;
  });
  const commercialSelector = Selector("div.sa-commercial");
  await t.expect(Selector(commercialSelector).exists).ok();
  await initSummary(json, data, { haveCommercialLicense: true });
  await t.expect(Selector(commercialSelector).exists).notOk();
  await enableHaveCommercialLicense();
  await initSummary(json, data, {});
  await t.expect(Selector(commercialSelector).exists).notOk();
});
