
const { Selector, ClientFunction } = require("testcafe");

export const url = "http://127.0.0.1:8080/examples/tabulator.html";

export const explicitErrorHandler = ClientFunction(() => {
  window.addEventListener("error", e => {
    if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
      e.message === "ResizeObserver loop limit exceeded") {
      e.stopImmediatePropagation();
    }
  });
});


fixture`basetests`.page`${url}`.beforeEach(async (t) => {
  await explicitErrorHandler();
  await t.resizeWindow(1920, 1080);
});

test("check xss in header and cell", async (t) => {
  const xssText = `Which of the following best describes you or your organization?<button id='xyz' onclick='alert();'>hello</button><img src='dymmy' onerror='alert("xss");'>`;
  const headerSelector = Selector(
    ".tabulator-headers div:nth-child(6) span"
  );
  const cellSelector = Selector(
    ".tabulator-row div:nth-child(6)"
  );

  await t
    .expect(headerSelector.innerText)
    .eql(xssText)
    .expect(cellSelector.innerText)
    .eql(xssText);
});
