import { SelectBase } from "../../src/chartjs/selectBase";

describe("SelectBase", () => {
  let container: HTMLElement;
  let selectBase: SelectBase;

  beforeEach(() => {
    container = document.createElement("div");
    selectBase = new SelectBase(container);
  });

  afterEach(() => {
    selectBase.destroy();
  });

  it("should create instance correctly", () => {
    expect(selectBase).toBeInstanceOf(SelectBase);
  });

  it("should destroy chart properly", () => {
    selectBase.destroy();
    expect(container.children.length).toBe(0);
  });
});