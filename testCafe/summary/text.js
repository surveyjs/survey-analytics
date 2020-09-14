const { initSummary, url } = require("../settings");
const { Selector, ClientFunction } = require("testcafe");
var json = {
  elements: [
    {
      type: "text",
      name: "text",
      title: "Question 1",
    },
  ],
};
var data = [{ text: "answer1" }, { text: "answer2" }, { text: "answer3" }];

var options = {};

fixture`text`.page`${url}`.beforeEach(async (t) => {
  await t.resizeWindow(1920, 1080);
  await initSummary(json, data, options);
});

test("check text table", async (t) => {
  var getTableCells = ClientFunction(() => {
    var cells = [];
    document.querySelectorAll(".sa-text-table tr td").forEach((td) => {
      cells.push(td.innerHTML);
    });
    return cells;
  });
  await t
    .click(Selector(".sa-question__select").withText("Texts in table"))
    .click(Selector(".sa-question__select option").withText("Texts in table"));

  var cells = await getTableCells();
  await t.expect(cells).eql(["answer1", "answer2", "answer3"]);
});
