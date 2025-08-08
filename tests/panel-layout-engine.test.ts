import { PanelLayoutEngine, IPanelLayoutItemConfig } from "../src/panel-layout-engine";

let container: HTMLElement;
let engine: PanelLayoutEngine;

beforeEach(() => {
  container = document.createElement("div");
  container.style.width = "500px";
  document.body.appendChild(container);
  engine = new PanelLayoutEngine(true, ".layout-item", true);
  engine.start(container);
});

afterEach(() => {
  engine.destroy();
  document.body.removeChild(container);
});

test("should initialize with empty panels", () => {
  expect(engine.panels.length).toBe(0);
});

test("should add a panel", () => {
  const panel = engine.addPanel("Test Panel");
  expect(engine.panels.length).toBe(1);
  expect(panel.element?.dataset.title).toBe("Test Panel");
});

test("should export and import layout", () => {
  engine.addPanel("Panel 1");
  engine.addPanel("Panel 2");
  const exported = engine.exportLayout();
  expect(exported.length).toBe(2);
  engine.panels = [];
  engine.importLayout(exported);
  expect(engine.panels.length).toBe(2);
  expect(engine.panels[0].element?.dataset.title).toBe("Panel 1");
});

test("should position panels correctly", () => {
  engine.addPanel("Panel 1");
  engine.addPanel("Panel 2");
  engine.positionPanels();
  expect(engine.panels[0].x).toBeLessThanOrEqual(engine.panels[1].x as any);
});

test("should reset layout", () => {
  engine.addPanel("Panel 1");
  engine.addPanel("Panel 2");
  engine.panels[0].x = 10;
  engine.panels[1].x = 20;
  engine.resetLayout();
  expect(engine.panels[0].x).not.toBe(10);
  expect(engine.panels[1].x).not.toBe(20);
});

test("should update panel style and coords", () => {
  const panel = engine.addPanel("Panel");
  panel.x = 2;
  panel.y = 3;
  panel.width = 4;
  panel.height = 5;
  engine.updatePanelStyle(panel);
  engine.updateCoordsDisplay(panel);
  expect(panel.element?.style.left).toBe(`${2 * PanelLayoutEngine.GRID_SIZE}px`);
  expect(panel.element?.style.top).toBe(`${3 * PanelLayoutEngine.GRID_SIZE}px`);
  expect(panel.element?.style.width).toBe(`${4 * PanelLayoutEngine.GRID_SIZE}px`);
  expect(panel.element?.style.height).toBe(`${5 * PanelLayoutEngine.GRID_SIZE}px`);
  const coords = panel.element?.querySelector(".item-coords");
  expect(coords?.textContent).toContain("2,3");
});

test("should destroy and cleanup", () => {
  engine.addPanel("Panel");
  engine.destroy();
  expect(engine.panels.length).toBe(0);
  expect(engine.container).toBeUndefined();
});