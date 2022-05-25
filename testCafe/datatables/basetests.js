
const { Selector, ClientFunction } = require("testcafe");

export const url = "http://127.0.0.1:8080/examples/datatables.html";

fixture`basetests`.page`${url}`.beforeEach(async (t) => {
  await t.resizeWindow(1920, 1080);
});

test("check xss in header and cell", async (t) => {
  const xssText = `Which of the following best describes you or your organization?<button id='xyz' onclick='alert();'>hello</button><img src='dymmy' onerror='alert("xss");'>`;
  const headerSelector = Selector(
    ".dataTables_scrollHead th:nth-child(6)"
  );
  const cellSelector = Selector(
    ".dataTables_scrollBody td:nth-child(6)"
  );

  await t
    .expect(headerSelector.innerText)
    .eql(xssText)
    .expect(cellSelector.innerText)
    .eql(xssText);
});
