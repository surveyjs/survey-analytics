import { createActionDropdown } from "../src/utils/dropdownActionWidget";

describe("Action dropdown item title", () => {
  test("uses item title and text as title when rendering options", () => {
    const dropdown = createActionDropdown({
      options: [{ value: "csv", text: "CSV", title: "Title" }, { value: "pdf", text: "PDF" }],
      isSelected: () => false,
      handler: () => true,
      title: "Export As...",
    });

    const csvItem = dropdown.querySelectorAll(".sa-action-dropdown-item")[0] as HTMLLIElement;
    expect(csvItem).toBeTruthy();
    expect(csvItem.textContent).toBe("CSV");
    expect(csvItem.title).toBe("Title");
    const pdfItem = dropdown.querySelectorAll(".sa-action-dropdown-item")[1] as HTMLLIElement;
    expect(pdfItem).toBeTruthy();
    expect(pdfItem.textContent).toBe("PDF");
    expect(pdfItem.title).toBe("PDF");
  });

  test("keeps title synced with updated item title", () => {
    const options = [{ value: "csv", text: "CSV", title: "Title" }];
    const dropdown = createActionDropdown({
      options,
      isSelected: () => false,
      updateOption: (option) => {
        if(option.value === "csv") {
          option.text = "Comma-Separated Values";
          option.title = "Another title";
        }
      },
      handler: () => true,
      title: "Export As...",
    });

    document.body.appendChild(dropdown);
    const header = dropdown.querySelector(".sa-action-dropdown-header") as HTMLDivElement;
    header.click();

    const item = dropdown.querySelector(".sa-action-dropdown-item") as HTMLLIElement;
    const text = item.querySelector("span")?.textContent;

    expect(text).toBe("Comma-Separated Values");
    expect(item.title).toBe("Another title");
  });
});
