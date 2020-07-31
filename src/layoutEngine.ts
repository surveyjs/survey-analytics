const Muuri = require("muuri");

export class LayoutEngine {
  constructor(protected _allowed: boolean) {}

  protected startCore(container: HTMLElement) {}
  protected stopCore() {}
  protected updateCore() {}

  get allowed() {
    return this._allowed;
  }

  start(container: HTMLElement) {
    if (this._allowed) {
      this.startCore(container);
    }
  }
  stop() {
    if (this._allowed) {
      this.stopCore();
    }
  }
  update() {
    if (this._allowed) {
      this.updateCore();
    }
  }

  add(elements: Array<HTMLElement>) {}
  remove(elements: Array<HTMLElement>) {}

  onMoveCallback: (fromIndex: number, toIndex: number) => void;

  destroy() {
    this.stop();
  }
}

export class MuuriLayoutEngine extends LayoutEngine {
  private _muuri: any = undefined;
  private _layoutingTimer: any = undefined;

  constructor(allowed: boolean, private _selector: string) {
    super(allowed);
  }

  protected startCore(container: HTMLElement) {
    this._muuri = new Muuri(container, {
      items: this._selector,
      dragEnabled: true,
    });
    this._muuri.on(
      "move",
      (data: any) =>
        this.onMoveCallback && this.onMoveCallback(data.fromIndex, data.toIndex)
    );
  }
  protected stopCore() {
    this._muuri.off("move");
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

  add(elements: Array<HTMLElement>) {
    this._muuri.add(elements);
  }
  remove(elements: Array<HTMLElement>) {
    this._muuri.remove(elements);
  }
}
