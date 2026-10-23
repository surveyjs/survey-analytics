import { createDropdown } from "../src/utils/dropdownWidget";

function mockRect(element: Element, rect: { x: number, y: number, width: number, height: number }) {
  element.getBoundingClientRect = () => ({
    ...rect,
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height,
    toJSON: () => rect,
  } as DOMRect);
}

describe("DropdownWidget", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("popup list is not shrunk to the visualizer height (#874)", () => {
    const visualizer = document.createElement("div");
    visualizer.className = "sa-visualizer";
    document.body.appendChild(visualizer);

    const dropdown = createDropdown({
      options: [{ value: "wordcloud", text: "Wordcloud" }, { value: "text", text: "Texts in table" }],
      isSelected: (option) => option.value === "wordcloud",
      handler: () => { },
    });
    visualizer.appendChild(dropdown);

    // A short visualizer (one answer) whose bottom is above the bottom of the opened list
    mockRect(visualizer, { x: 0, y: 0, width: 600, height: 80 });
    const list = dropdown.querySelector(".sa-dropdown-list") as HTMLUListElement;
    mockRect(list, { x: 0, y: 60, width: 600, height: 120 });

    (dropdown.querySelector(".sa-dropdown-header") as HTMLDivElement).click();

    expect(list.classList.contains("sa-dropdown--opened")).toBe(true);
    expect(list.style.height).toBe("");
  });
});
