import { ElementVisibilityAction } from "../src/utils/elementVisibilityAction";
import { Dashboard } from "../src/dashboard";

export * from "../src/card";

describe("ElementVisibilityAction responsecount display name", () => {
  test("uses default displayName for responsecount item", () => {
    const dashboard = new Dashboard({
      items: [{ type: "responsecount" }],
      data: [{ q1: "a" }]
    });

    const options = new ElementVisibilityAction(dashboard as any).getOptions();
    const responseCountOption = options.find((option) => option.value === "responsecount");

    expect(responseCountOption).toBeDefined();
    expect(responseCountOption?.text).toBe("Total responses");
    expect(responseCountOption?.title).toBe("Total responses");
  });

  test("uses custom displayName for responsecount item", () => {
    const dashboard = new Dashboard({
      items: [{ type: "responsecount", title: "Custom Title" }],
      data: [{ q1: "a" }]
    });

    const options = new ElementVisibilityAction(dashboard as any).getOptions();
    const responseCountOption = options.find((option) => option.value === "responsecount");

    expect(responseCountOption).toBeDefined();
    expect(responseCountOption?.text).toBe("Custom Title");
    expect(responseCountOption?.title).toBe("Custom Title");
  });
});
