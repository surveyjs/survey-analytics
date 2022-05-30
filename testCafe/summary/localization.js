const { getYAxisValues, url, initSummary } = require("../settings");
const { Selector, ClientFunction } = require("testcafe");
const assert = require("assert");
const { SurveyElement } = require("survey-core");
var json = {
  locale: "ru",
  questions: [
    {
      type: "dropdown",
      name: "satisfaction",
      title: {
        default: "How satisfied are you with the Product?",
        ru: "Насколько Вас устраивает наш продукт?",
      },
      choices: [
        {
          value: 0,
          text: {
            default: "Not Satisfied",
            ru: "Coвсем не устраивает",
          },
        },
        {
          value: 1,
          text: {
            default: "Satisfied",
            ru: "Устраивает",
          },
        },
        {
          value: 2,
          text: {
            default: "Completely satisfied",
            ru: "Полностью устраивает",
          },
        },
      ],
    },
  ],
};

var data = [{ satisfaction: 0 }, { satisfaction: 1 }, { satisfaction: 2 }];

fixture`localization`.page`${url}`.beforeEach(async (t) => {
  await t.resizeWindow(1920, 1080);
  await initSummary(json, data, {});
});

test("check change locale", async (t) => {
  const getLocaleInState = ClientFunction(() => window.visPanel.state.locale);
  const changeLocaleDropdown = Selector(".sa-question__select").withText(
    "Русский"
  );

  assert.deepEqual(
    await getYAxisValues(),
    json.questions[0].choices.map((choice) => choice.text.ru + "  ").reverse()
  );

  await t
    .expect(Selector(".sa-question__title").innerText)
    .eql(json.questions[0].title.ru);

  await t
    .click(changeLocaleDropdown)
    .click(changeLocaleDropdown.find("option").withText("English"));

  assert.deepEqual(
    await getYAxisValues(),
    json.questions[0].choices.map((choice) => choice.text.default + "  ").reverse()
  );
  await t
    .expect(Selector(".sa-question__title").innerText)
    .eql(json.questions[0].title.default);

  await t
    .expect(Selector(".sa-question__select").withText("English").exists)
    .ok();
  assert.strictEqual(await getLocaleInState(), "");
});

test("check set locale from state", async (t) => {
  await initSummary(json, data, {}, undefined, { locale: "en" });

  assert.deepEqual(
    await getYAxisValues(),
    json.questions[0].choices.map((choice) => choice.text.default + "  ").reverse()
  );
  await t
    .expect(Selector(".sa-question__select").withText("English").exists)
    .ok();
});
