import { SurveyModel, tooltipAttributeName } from "survey-core";
import { DocumentHelper } from "../src/utils/documentHelper";
import { SidebarWidget } from "../src/utils/sidebarWidget";
import { TableExtensions } from "../src/tables/extensions/tableextensions";
import { localization } from "../src/localizationManager";
import { VisualizationPanel } from "../src/visualizationPanel";
import { FilterInfo } from "../src/filterInfo";
import { createDropdown } from "../src/utils/dropdownWidget";
import { createActionDropdown } from "../src/utils/dropdownActionWidget";
import "../src/tables/extensions/columnextensions";

test("tooltipAttributeName is the survey-core tooltip attribute", () => {
  expect(tooltipAttributeName).toBe("data-sv-tooltip");
});

test("DocumentHelper.setTooltip sets and clears the survey-core tooltip and title", () => {
  const el = document.createElement("button");
  DocumentHelper.setTooltip(el, "Hint");
  expect(el.getAttribute("data-sv-tooltip")).toBe("Hint");
  expect(el.title).toBe("Hint");
  expect(el.getAttribute("aria-label")).toBe("Hint");

  DocumentHelper.setTooltip(el, "");
  expect(el.hasAttribute("data-sv-tooltip")).toBe(false);
  expect(el.hasAttribute("title")).toBe(false);
  expect(el.hasAttribute("aria-label")).toBe(false);
});

test("DocumentHelper.createSvgButton gets a tooltip only when a title is passed", () => {
  expect(DocumentHelper.createSvgButton("more-24x24", "More").getAttribute("data-sv-tooltip")).toBe("More");
  expect(DocumentHelper.createSvgButton("more-24x24").hasAttribute("data-sv-tooltip")).toBe(false);
});

test("DocumentHelper.createSvgToggleButton keeps its tooltip in sync with the state", () => {
  const button = DocumentHelper.createSvgToggleButton("a", "b", "First", "Second", () => { }, () => { });
  expect(button.getAttribute("data-sv-tooltip")).toBe("First");
  button.click();
  expect(button.getAttribute("data-sv-tooltip")).toBe("Second");
  expect(button.title).toBe("Second");
  expect(button.getAttribute("aria-label")).toBe("Second");
  button.click();
  expect(button.getAttribute("data-sv-tooltip")).toBe("First");

  const startsSecond = DocumentHelper.createSvgToggleButton("a", "b", "First", "Second", () => { }, () => { }, "second");
  expect(startsSecond.getAttribute("data-sv-tooltip")).toBe("Second");
});

test("SidebarWidget trigger and close buttons have tooltips", () => {
  const widget = new SidebarWidget({ title: "Panel", itemCreators: {}, buttonTitle: "Open panel" });
  const wrapper = document.createElement("div");
  wrapper.className = "sa-visualizer-wrapper";
  document.body.appendChild(wrapper);
  const trigger = widget.render();
  wrapper.appendChild(trigger);
  expect(trigger.getAttribute("data-sv-tooltip")).toBe("Open panel");
  trigger.click();
  const closeBtn = wrapper.querySelector(".sa-sidebar__close") as HTMLElement;
  expect(closeBtn.getAttribute("data-sv-tooltip")).toBe(localization.getString("close"));
  widget.close();
  wrapper.remove();
});

test("Table column sort and visibility buttons update their tooltips", () => {
  const sortExt = TableExtensions.findExtension("column", "sort");
  const table: any = { sortByColumn: () => { } };
  const sortBtn = sortExt.render(table, { columnName: "q1" }) as HTMLElement;
  expect(sortBtn.getAttribute("data-sv-tooltip")).toBe(localization.getString("defaultOrder"));
  sortBtn.click();
  expect(sortBtn.getAttribute("data-sv-tooltip")).toBe(localization.getString("descOrder"));
  sortBtn.click();
  expect(sortBtn.getAttribute("data-sv-tooltip")).toBe(localization.getString("ascOrder"));

  const dragBtn = TableExtensions.findExtension("column", "drag").render(table, { columnName: "q1" }) as HTMLElement;
  expect(dragBtn.getAttribute("data-sv-tooltip")).toBe(localization.getString("columnReorder"));
});

test("DocumentHelper.setTooltip sets aria-label on controls only", () => {
  const generic = document.createElement("div");
  DocumentHelper.setTooltip(generic, "Hint");
  expect(generic.getAttribute("data-sv-tooltip")).toBe("Hint");
  expect(generic.hasAttribute("aria-label")).toBe(false);

  const roleButton = document.createElement("div");
  roleButton.setAttribute("role", "button");
  DocumentHelper.setTooltip(roleButton, "Hint");
  expect(roleButton.getAttribute("aria-label")).toBe("Hint");
});

test("Card hide action has a tooltip and an accessible name", () => {
  const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] });
  const panel = new VisualizationPanel(survey.getAllQuestions(), [], { allowHideQuestions: true });
  const hideAction = (panel as any).createHideButtonElement({ name: "q1" }) as HTMLElement;
  expect(hideAction.getAttribute("data-sv-tooltip")).toBe(localization.getString("hideButton"));
  expect(hideAction.getAttribute("aria-label")).toBe(localization.getString("hideButton"));
});

test("Filter info clear button has a tooltip", () => {
  const filterInfo = new FilterInfo({ setSelection: () => { } } as any);
  const clearButton = filterInfo.htmlElement.querySelector(".sa-toolbar__button") as HTMLElement;
  expect(clearButton.getAttribute("data-sv-tooltip")).toBe(localization.getString("clearButton"));
  expect(clearButton.getAttribute("aria-label")).toBe(localization.getString("clearButton"));
});

test("Dropdown reset button has a tooltip", () => {
  const dropdown = createDropdown({
    options: [{ value: "a", text: "A" }],
    isSelected: () => true,
    handler: () => { },
    resetHandler: () => { },
  });
  const resetButton = dropdown.querySelector("[class*='-reset']") as HTMLElement;
  expect(resetButton.getAttribute("data-sv-tooltip")).toBe(localization.getString("clearButton"));
  // A role-less element nested in the role="button" header: no aria-label (prohibited on generic elements).
  expect(resetButton.hasAttribute("aria-label")).toBe(false);
});

test("Dropdown items show the tooltip only for a title that differs from the text", () => {
  const dropdown = createActionDropdown({
    options: [
      { value: "pdf", text: "PDF", title: "Export as PDF" },
      { value: "csv", text: "CSV" },
    ],
    isSelected: () => false,
    handler: () => true,
    title: "Export",
  });
  const items = dropdown.querySelectorAll("li");
  expect(items[0].getAttribute("data-sv-tooltip")).toBe("Export as PDF");
  expect(items[0].title).toBe("Export as PDF");
  expect(items[1].hasAttribute("data-sv-tooltip")).toBe(false);
  expect(items[1].title).toBe("CSV");
  expect(items[1].hasAttribute("aria-label")).toBe(false);
});

test("DocumentHelper.observeNativeTitles mirrors third-party titles that add to the visible text", async () => {
  const root = document.createElement("div");
  root.innerHTML = "<button title='First Page'>First</button><button title='2'>2</button>";
  const stop = DocumentHelper.observeNativeTitles(root);
  const [first, page2] = Array.from(root.querySelectorAll("button"));
  expect(first.getAttribute("data-sv-tooltip")).toBe("First Page");
  expect(page2.hasAttribute("data-sv-tooltip")).toBe(false);

  // A widget re-render (new buttons) and a title change are picked up.
  root.insertAdjacentHTML("beforeend", "<button title='Last Page'>Last</button>");
  first.setAttribute("title", "Go to first page");
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(root.querySelector("button:last-child")!.getAttribute("data-sv-tooltip")).toBe("Last Page");
  expect(first.getAttribute("data-sv-tooltip")).toBe("Go to first page");

  // The survey-core tooltip takes `title` off while shown: the tooltip attribute must survive that.
  first.removeAttribute("title");
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(first.getAttribute("data-sv-tooltip")).toBe("Go to first page");

  stop();
  root.insertAdjacentHTML("beforeend", "<button title='Next Page'>Next</button>");
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(root.querySelector("button:last-child")!.hasAttribute("data-sv-tooltip")).toBe(false);
});
