import { HistogramVisualizer } from "../../src/chartjs/histogram";

describe("HistogramVisualizer", () => {
  let container: HTMLElement;
  let visualizer: HistogramVisualizer;

  beforeEach(() => {
    container = document.createElement("div");
    visualizer = new HistogramVisualizer(container);
  });

  afterEach(() => {
    visualizer.destroy();
  });

  it("should create histogram with correct data", () => {
    const testData = [1, 2, 2, 3, 3, 3, 4, 4, 5];
    visualizer.render(testData, 5);

    expect(container.querySelector("canvas")).toBeTruthy();
  });

  it("should handle empty data", () => {
    const testData: number[] = [];
    visualizer.render(testData, 5);

    expect(container.querySelector("canvas")).toBeTruthy();
  });
});