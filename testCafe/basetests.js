const { initSummary, url } = require("./settings");
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
    bool2: false,
    bool: true,
  },
  {
    bool2: false,
    bool: true,
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
  const questionSelector = "Question 1";
  const question = Selector("#summaryContainer .sa-question div").withText(
    questionSelector
  );
  const showDropdown = Selector("#summaryContainer .sa-question__select");
  await t
    .expect(question.exists)
    .ok()
    .click(question.find("span").withText("Hide"))
    .expect(question.exists)
    .notOk()
    .expect(isVisibleInState(questionSelector))
    .notOk()
    .click(showDropdown)
    .click(showDropdown.find("option").withText(questionSelector))
    .expect(question.exists)
    .ok()
    .expect(isVisibleInState(questionSelector))
    .ok();
});

test("check change questions layout", async (t) => {
  const getPositionInState = ClientFunction((title) => {
    var question = visPanel.state.elements.filter(
      (question) => question.displayName == title
    )[0];
    return visPanel.state.elements.indexOf(question);
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
