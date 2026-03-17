import { SidebarWidget } from "../src/utils/sidebarWidget";

const createDummyCreator = (id: string) => (): HTMLElement => {
  const el = document.createElement("div");
  el.setAttribute("data-testid", id);
  return el;
};

test("getSideBarToolbarItemCreators returns entries sorted by groupIndex then by index", () => {
  const widget = new SidebarWidget({
    title: "Test",
    itemCreators: {
      third: { creator: createDummyCreator("c"), index: 5, groupIndex: 1 },
      first: { creator: createDummyCreator("a"), index: 0, groupIndex: 0 },
      second: { creator: createDummyCreator("b"), index: 10, groupIndex: 0 },
      fourth: { creator: createDummyCreator("d"), index: 0, groupIndex: 1 },
    },
  });

  const entries = (widget as any).getSideBarToolbarItemCreators();

  expect(entries).toHaveLength(4);
  expect(entries[0].groupIndex).toBe(0);
  expect(entries[1].groupIndex).toBe(0);
  expect(entries[2].groupIndex).toBe(1);
  expect(entries[3].groupIndex).toBe(1);
  expect(entries[0].creator().attributes["data-testid"].value).toEqual("a");
  expect(entries[1].creator().attributes["data-testid"].value).toEqual("b");
  expect(entries[2].creator().attributes["data-testid"].value).toEqual("d");
  expect(entries[3].creator().attributes["data-testid"].value).toEqual("c");
});

