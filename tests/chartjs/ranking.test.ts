import { RankingVisualizer } from "../../src/chartjs/ranking";

describe("RankingVisualizer", () => {
  let container: HTMLElement;
  let visualizer: RankingVisualizer;

  beforeEach(() => {
    container = document.createElement("div");
    visualizer = new RankingVisualizer(container);
  });

  afterEach(() => {
    visualizer.destroy();
  });

  it("should create ranking chart with correct data", () => {
    const testData = ["Option A", "Option B", "Option A", "Option C"];
    const options = ["Option A", "Option B", "Option C"];

    visualizer.render(testData, options);

    expect(container.querySelector("canvas")).toBeTruthy();
  });
});