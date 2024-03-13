const Muuri = require("muuri");

/**
 * A base class used to implement custom layout engines or integrate third-party layout engines with SurveyJS Dashboard.
 */
export class LayoutEngine {
  constructor(protected _allowed: boolean) { }

  protected startCore(container: HTMLElement) { }
  protected stopCore() { }
  protected updateCore() { }

  get allowed() {
    return this._allowed;
  }

  /**
   * Enables the dynamic layout in a given HTML element.
   *
   * This method should arrange visualization items based on the available screen space and allow users to reorder them via drag and drop.
   */
  start(container: HTMLElement) {
    if (this._allowed) {
      this.startCore(container);
    }
  }
  /**
   * Disables the dynamic layout.
   */
  stop() {
    if (this._allowed) {
      this.stopCore();
    }
  }
  /**
   * Updates the dynamic layout.
   */
  update() {
    if (this._allowed) {
      this.updateCore();
    }
  }

  add(elements: Array<HTMLElement>, options?: any) { }
  remove(elements: Array<HTMLElement>, options?: any) { }

  onMoveCallback: (order: Array<string>) => void;

  destroy() {
    this.stop();
  }
}

export class MuuriLayoutEngine extends LayoutEngine {
  private _muuri: any = undefined;
  private _layoutingTimer: any = undefined;

  constructor(allowed: boolean, private _selector: string, private dragEnabled = true) {
    super(allowed);
  }

  protected startCore(container: HTMLElement) {
    this._muuri = new Muuri(container, {
      dragStartPredicate: {
        handle: ".sa-question__title--draggable",
      },
      items: this._selector,
      dragEnabled: this.dragEnabled,
    });
    this._muuri.on(
      "dragReleaseEnd",
      (item: any) => {
        const newOrder = item.getGrid().getItems().map(gridItem => gridItem.getElement().dataset.question);
        this.onMoveCallback && this.onMoveCallback(newOrder);
      }
    );
  }
  protected stopCore() {
    this._muuri.off("dragReleaseEnd");
    this._muuri.destroy();
    this._muuri = undefined;
  }
  protected updateCore() {
    if (this._layoutingTimer !== undefined) {
      clearTimeout(this._layoutingTimer);
    }
    this._layoutingTimer = setTimeout(() => {
      this._layoutingTimer = undefined;
      this._muuri.refreshItems();
      this._muuri.layout();
    }, 10);
  }

  add(elements: Array<HTMLElement>, options?: any) {
    if (this._allowed) this._muuri.add(elements, options);
  }
  remove(elements: Array<HTMLElement>, options?: any) {
    if (this._allowed) this._muuri.remove(elements, options);
  }
}
