import { LayoutEngine } from "./layout-engine";
import "./panel-layout-engine.scss";

export interface IPanelLayoutItemConfig {
  id?: string; // Unique identifier for the panel
  element?: HTMLElement; // The panel element
  header?: HTMLElement; // Header element for the panel
  resizeHandle?: HTMLElement; // Resize handle element
  // Position and size in grid units
  x?: number; // X position in grid units
  y?: number; // Y position in grid units
  width?: number; // Width in grid units
  height?: number; // Height in grid units
  relativeX?: number; // Relative X position (0-1)
  relativeWidth?: number; // Relative width (0-1)
  dragHandler?: (e: MouseEvent) => void; // Mouse down handler for dragging
  resizeHandler?: (e: MouseEvent) => void; // Mouse down handler for resizing
}

export class PanelLayoutEngine extends LayoutEngine {
  public static GRID_SIZE = 25;
  public static DEFAULT_COL_COUNT = 2;
  container: HTMLElement;
  panels: Array<IPanelLayoutItemConfig> = [];
  zIndexCounter = 10;
  resizeObserver = null;
  moveCallback = null;
  originalContainerWidth: number = 0;

  wrapItem(item: HTMLElement): IPanelLayoutItemConfig {
    const id = item.dataset.id || `panel-${Date.now()}`;
    item.dataset.id = id;
    item.classList.add("sa-panel-layout__layout-item");

    const panel: IPanelLayoutItemConfig = {
      id: id,
      element: item,
      x: Math.floor(item.getBoundingClientRect().x / PanelLayoutEngine.GRID_SIZE),
      y: Math.floor(item.getBoundingClientRect().y / PanelLayoutEngine.GRID_SIZE),
      width: Math.floor(item.getBoundingClientRect().width / PanelLayoutEngine.GRID_SIZE),
      height: Math.floor(item.getBoundingClientRect().height / PanelLayoutEngine.GRID_SIZE),
      relativeX: 0, // Relative X position (0-1)
      relativeWidth: 0, // Relative width (0-1)
      dragHandler: (e) => this.startDrag(panel, e),
      resizeHandler: (e) => this.startResize(panel, e)
    };

    let header = item.querySelector(".sa-panel-layout__item-header") as HTMLElement;
    if (!header) {
      header = document.createElement("div");
      header.className = "sa-panel-layout__item-header";
      const title = item.dataset.title || (item.querySelector(".sa-question__title") as HTMLElement)?.innerText || "Panel";
      header.innerHTML = `
              <div class="sa-panel-layout__item-title">${title}</div>
              <div class="sa-panel-layout__item-coords">${panel.x},${panel.y} | ${panel.width}×${panel.height}</div>
          `;
      item.prepend(header);
    }
    panel.header = header;

    let content = item.querySelector(".sa-panel-layout__item-content");
    if (!content) {
      content = document.createElement("div");
      content.className = "sa-panel-layout__item-content";

      for (let i = header ? 1 : 0; i < item.childNodes.length; i++) {
        content.appendChild(item.childNodes[i]);
      }

      if (header) {
        header.insertAdjacentElement("afterend", content);
      } else {
        item.prepend(content);
      }
    }

    let resizeHandle = item.querySelector(".sa-panel-layout__resize-handle") as HTMLElement;
    if (!resizeHandle) {
      resizeHandle = document.createElement("div");
      resizeHandle.className = "sa-panel-layout__resize-handle";
      item.appendChild(resizeHandle);
    }
    panel.resizeHandle = resizeHandle;

    header.addEventListener("mousedown", panel.dragHandler);
    resizeHandle.addEventListener("mousedown", panel.resizeHandler);

    this.panels.push(panel);
    return panel;
  }

  startDrag (panel: IPanelLayoutItemConfig, e): void {
    const element = panel.element;
    element.style.zIndex = (this.zIndexCounter++).toString();
    element.classList.add("dragging");

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = panel.x;
    const startTop = panel.y;

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const gridDx = Math.round(dx / PanelLayoutEngine.GRID_SIZE);
      const gridDy = Math.round(dy / PanelLayoutEngine.GRID_SIZE);

      let newX = startLeft + gridDx;
      let newY = startTop + gridDy;

      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      const maxX = Math.floor(this.container.offsetWidth / PanelLayoutEngine.GRID_SIZE) - panel.width;
      newX = Math.min(newX, maxX);

      panel.x = newX;
      panel.y = newY;

      this.updatePanelStyle(panel);
      this.updateCoordsDisplay(panel);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      element.classList.remove("dragging");

      const containerGridWidth = Math.floor(this.container.offsetWidth / PanelLayoutEngine.GRID_SIZE);
      panel.relativeX = panel.x / containerGridWidth;
      panel.relativeWidth = panel.width / containerGridWidth;

      if (this.moveCallback) {
        const order = this.panels.map(p => p.id);
        this.moveCallback(order);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  startResize(panel: IPanelLayoutItemConfig, e): void {
    const element = panel.element;
    element.style.zIndex = (this.zIndexCounter++).toString();
    element.classList.add("resizing");

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = panel.width;
    const startHeight = panel.height;

    const onMouseMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const gridDw = Math.round(dx / PanelLayoutEngine.GRID_SIZE);
      const gridDh = Math.round(dy / PanelLayoutEngine.GRID_SIZE);

      let newWidth = startWidth + gridDw;
      let newHeight = startHeight + gridDh;

      newWidth = Math.max(1, newWidth);
      newHeight = Math.max(1, newHeight);

      const maxWidth = Math.floor(this.container.offsetWidth / PanelLayoutEngine.GRID_SIZE) - panel.x;
      newWidth = Math.min(newWidth, maxWidth);

      panel.width = newWidth;
      panel.height = newHeight;

      this.updatePanelStyle(panel);
      this.updateCoordsDisplay(panel);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      element.classList.remove("resizing");

      const containerGridWidth = Math.floor(this.container.offsetWidth / PanelLayoutEngine.GRID_SIZE);
      panel.relativeX = panel.x / containerGridWidth;
      panel.relativeWidth = panel.width / containerGridWidth;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  updatePanelStyle(panel: IPanelLayoutItemConfig): void {
    const { element, x, y, width, height } = panel;
    element.style.left = `${x * PanelLayoutEngine.GRID_SIZE}px`;
    element.style.top = `${y * PanelLayoutEngine.GRID_SIZE}px`;
    element.style.width = `${width * PanelLayoutEngine.GRID_SIZE}px`;
    element.style.height = `${height * PanelLayoutEngine.GRID_SIZE}px`;
  }

  updateCoordsDisplay(panel: IPanelLayoutItemConfig): void {
    const coordsElement = panel.element.querySelector(".sa-panel-layout__item-coords");
    if (coordsElement) {
      coordsElement.textContent = `${panel.x},${panel.y} | ${panel.width}×${panel.height}`;
    }
  }

  adjustPanelsToContainer(): void {
    const containerGridWidth = Math.floor(this.container.offsetWidth / PanelLayoutEngine.GRID_SIZE);

    this.panels.forEach(panel => {
      panel.x = Math.round(panel.relativeX * containerGridWidth);
      panel.width = Math.round(panel.relativeWidth * containerGridWidth);

      const maxX = containerGridWidth - panel.width;
      if (panel.x > maxX) {
        panel.x = Math.max(0, maxX);
      }

      this.updatePanelStyle(panel);
      this.updateCoordsDisplay(panel);
    });
  }

  positionPanels(): void {
    const itemsPerRow = PanelLayoutEngine.DEFAULT_COL_COUNT;
    const fullGridWidth = Math.floor(this.container.offsetWidth / PanelLayoutEngine.GRID_SIZE);
    const containerGridWidth = fullGridWidth - fullGridWidth % itemsPerRow;
    const itemWidth = Math.ceil(containerGridWidth / itemsPerRow) - 1;
    const defaultItemHeight = 10;

    this.panels.forEach((panel, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;

      panel.x = col * (itemWidth + 1);
      panel.y = row * (defaultItemHeight + 1);
      panel.width = itemWidth;
      panel.height = defaultItemHeight;

      panel.relativeX = panel.x / containerGridWidth;
      panel.relativeWidth = panel.width / containerGridWidth;

      this.updatePanelStyle(panel);
      this.updateCoordsDisplay(panel);
    });
  }

  addPanel(title = "New Panel"): IPanelLayoutItemConfig {
    const panel = document.createElement("div");
    panel.className = "sa-panel-layout__layout-item";
    panel.dataset.id = `panel-${Date.now()}`;
    panel.dataset.title = title;

    this.container.appendChild(panel);
    const wrappedPanel = this.wrapItem(panel);

    this.positionPanels();

    return wrappedPanel;
  }

  resetLayout(): void {
    this.positionPanels();
  }

  exportLayout() {
    return this.panels.map(panel => ({
      id: panel.id,
      title: panel.element.dataset.title,
      x: panel.x,
      y: panel.y,
      width: panel.width,
      height: panel.height,
      relativeX: panel.relativeX,
      relativeWidth: panel.relativeWidth
    }));
  }

  importLayout(layout: Array<any>): void {
    this.panels = layout.map(item => {
      const panel = document.createElement("div");
      panel.className = "sa-panel-layout__layout-item";
      panel.dataset.id = item.id || `panel-${Date.now()}`;
      panel.dataset.title = item.title || "Imported Panel";

      this.container.appendChild(panel);
      const wrappedPanel = this.wrapItem(panel);

      wrappedPanel.x = item.x || 0;
      wrappedPanel.y = item.y || 0;
      wrappedPanel.width = item.width || 1;
      wrappedPanel.height = item.height || 1;
      wrappedPanel.relativeX = item.relativeX || 0;
      wrappedPanel.relativeWidth = item.relativeWidth || 0;

      this.updatePanelStyle(wrappedPanel);
      this.updateCoordsDisplay(wrappedPanel);

      return wrappedPanel;
    });
    this.positionPanels();
  }

  constructor(allowed: boolean, private _itemSelector: string, private dragEnabled = true) {
    super(allowed, _itemSelector, dragEnabled);
  }

  protected startCore(container: HTMLElement): void {
    this.container = container;
    this.originalContainerWidth = container.offsetWidth;

    container.classList.add("sa-panel-layout__container");
    container.style.position = "relative";

    let gridOverlay = container.querySelector(".sa-panel-layout__grid-overlay");
    if (!gridOverlay) {
      gridOverlay = document.createElement("div");
      gridOverlay.className = "sa-panel-layout__grid-overlay";
      container.appendChild(gridOverlay);
    }

    const items = container.querySelectorAll(this._itemSelector);
    items.forEach(item => {
      this.wrapItem(item as HTMLElement);
    });

    if(typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => {
        this.adjustPanelsToContainer();
      });
      this.resizeObserver.observe(container);
    }

    this.positionPanels();
  }
  protected stopCore(): void {
    this.container.classList.remove("sa-panel-layout__container");
    this.container = undefined;
    this.container = undefined;
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    this.panels.forEach(panel => {
      panel.header.removeEventListener("mousedown", panel.dragHandler);
      panel.resizeHandle.removeEventListener("mousedown", panel.resizeHandler);
    });

    this.panels = [];
  }
  protected updateCore(): void {
    this.panels.forEach(panel => {
      const content = panel.element.querySelector(".sa-question__content") as HTMLElement;
      if(content) {
        panel.height = Math.ceil(content.getBoundingClientRect().height / PanelLayoutEngine.GRID_SIZE) + 4;
        panel.width = Math.ceil(content.getBoundingClientRect().width / PanelLayoutEngine.GRID_SIZE) + 2;
        // panel.x = Math.ceil(content.getBoundingClientRect().x / PanelLayoutEngine.GRID_SIZE);
        // panel.y = Math.ceil(content.getBoundingClientRect().y / PanelLayoutEngine.GRID_SIZE);
        panel.relativeX = panel.x / Math.floor(this.container.offsetWidth / PanelLayoutEngine.GRID_SIZE);
        panel.relativeWidth = panel.width / Math.floor(this.container.offsetWidth / PanelLayoutEngine.GRID_SIZE);
        this.updatePanelStyle(panel);
        this.updateCoordsDisplay(panel);
      }
    });
  }

  add(elements: Array<HTMLElement>, options?: any) {
  }
  remove(elements: Array<HTMLElement>, options?: any) {
  }

  destroy(): void {
    this.stop();
  }
}
