import { VisualizerBase } from "../src/visualizerBase";
import { QuestionDropdownModel } from "survey-core";

describe("VisualizerBase", () => {
  let visualizer: VisualizerBase;
  let question: QuestionDropdownModel;
  let data: Array<{ [index: string]: any }>;

  beforeEach(() => {
    question = new QuestionDropdownModel("q1");
    data = [
      { q1: "option1" },
      { q1: "option2" },
      { q1: "option3" }
    ];
    visualizer = new VisualizerBase(question, data, {});
  });

  describe("getSortedToolbarItemCreators", () => {
    test("should return empty array when no toolbar items are registered", () => {
      const result = visualizer.getSortedToolbarItemCreators();
      expect(result).toEqual([]);
    });

    test("should sort items by index within each type group", () => {
      // Register toolbar items with different indices
      visualizer.registerToolbarItem("item1", () => document.createElement("div"), "button", 3, 0);
      visualizer.registerToolbarItem("item2", () => document.createElement("div"), "button", 1, 0);
      visualizer.registerToolbarItem("item3", () => document.createElement("div"), "button", 2, 0);

      const result = visualizer.getSortedToolbarItemCreators();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("item2"); // index 1
      expect(result[1].name).toBe("item3"); // index 2
      expect(result[2].name).toBe("item1"); // index 3
    });

    test("should sort groups by groupIndex", () => {
      // Register items in different groups with different group indices
      visualizer.registerToolbarItem("group1_item1", () => document.createElement("div"), "button", 1, 2);
      visualizer.registerToolbarItem("group0_item1", () => document.createElement("div"), "dropdown", 1, 0);
      visualizer.registerToolbarItem("group1_item2", () => document.createElement("div"), "button", 2, 2);
      visualizer.registerToolbarItem("group0_item2", () => document.createElement("div"), "dropdown", 2, 0);

      const result = visualizer.getSortedToolbarItemCreators();

      expect(result).toHaveLength(4);
      // First group (groupIndex 0) should come first
      expect(result[0].type).toBe("dropdown");
      expect(result[1].type).toBe("dropdown");
      // Second group (groupIndex 2) should come second
      expect(result[2].type).toBe("button");
      expect(result[3].type).toBe("button");
    });

    test("should combine onGetToolbarItemCreators with registered items", () => {
      // Register items directly
      visualizer.registerToolbarItem("direct_item", () => document.createElement("div"), "button", 1, 0);

      // Set onGetToolbarItemCreators function
      visualizer.onGetToolbarItemCreators = () => ({
        "dynamic_item": {
          creator: () => document.createElement("div"),
          type: "dropdown" as const,
          index: 2,
          groupIndex: 0
        }
      });

      const result = visualizer.getSortedToolbarItemCreators();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("direct_item"); // index 1
      expect(result[1].name).toBe("dynamic_item"); // index 2
    });

    test("should handle items with default index and groupIndex values", () => {
      // Register items without specifying index and groupIndex (should use defaults)
      visualizer.registerToolbarItem("default_item1", () => document.createElement("div"), "button");
      visualizer.registerToolbarItem("default_item2", () => document.createElement("div"), "filter");

      const result = visualizer.getSortedToolbarItemCreators();

      expect(result).toHaveLength(2);
      expect(result[0].type).toBe("button"); // groupIndex 0 (default)
      expect(result[1].type).toBe("filter"); // groupIndex 0 (default)
    });

    test("should maintain correct structure of returned items", () => {
      const creator = () => document.createElement("div");
      visualizer.registerToolbarItem("test_item", creator, "button", 1, 2);

      const result = visualizer.getSortedToolbarItemCreators();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: "test_item",
        creator: creator,
        type: "button",
        index: 1,
        groupIndex: 2
      });
    });

    test("should handle multiple item types with complex sorting", () => {
      // Register items with various types, indices, and group indices
      visualizer.registerToolbarItem("filter1", () => document.createElement("div"), "filter", 1, 0);
      visualizer.registerToolbarItem("button1", () => document.createElement("div"), "button", 3, 1);
      visualizer.registerToolbarItem("dropdown1", () => document.createElement("div"), "dropdown", 2, 0);
      visualizer.registerToolbarItem("filter2", () => document.createElement("div"), "filter", 4, 0);
      visualizer.registerToolbarItem("button2", () => document.createElement("div"), "button", 1, 1);
      visualizer.registerToolbarItem("license1", () => document.createElement("div"), "license", 1, 2);

      const result = visualizer.getSortedToolbarItemCreators();

      expect(result).toHaveLength(6);

      // Check that groups are sorted by groupIndex
      const groupTypes = result.map(item => item.type);
      expect(groupTypes).toEqual(["filter", "filter", "dropdown", "button", "button", "license"]);

      // Check that items within each group are sorted by index
      const filterItems = result.filter(item => item.type === "filter");
      expect(filterItems[0].name).toBe("filter1"); // index 1
      expect(filterItems[1].name).toBe("filter2"); // index 4

      const buttonItems = result.filter(item => item.type === "button");
      expect(buttonItems[0].name).toBe("button2"); // index 1
      expect(buttonItems[1].name).toBe("button1"); // index 3
    });

    test("should handle empty onGetToolbarItemCreators", () => {
      visualizer.onGetToolbarItemCreators = () => ({});
      visualizer.registerToolbarItem("test_item", () => document.createElement("div"), "button", 1, 0);

      const result = visualizer.getSortedToolbarItemCreators();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("test_item");
    });

    test("should handle undefined onGetToolbarItemCreators", () => {
      visualizer.onGetToolbarItemCreators = undefined;
      visualizer.registerToolbarItem("test_item", () => document.createElement("div"), "button", 1, 0);

      const result = visualizer.getSortedToolbarItemCreators();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("test_item");
    });
  });
});