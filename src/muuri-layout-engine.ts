import Muuri from "muuri";
import { LayoutEngine } from "./layout-engine";

export class MuuriLayoutEngine extends LayoutEngine {
  private _muuri: any = undefined;
  private _layoutingTimer: any = undefined;

  constructor(allowed: boolean, private _selector: string, private dragEnabled = true) {
    super(allowed);
  }

  protected startCore(container: HTMLElement) {
    this._muuri = new Muuri(container, {
      dragStartPredicate: {
        handle: ".sa-question__header--draggable",
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
    if(!this._muuri) return;
    if(this._layoutingTimer !== undefined) {
      clearTimeout(this._layoutingTimer);
    }
    this._layoutingTimer = setTimeout(() => {
      this._layoutingTimer = undefined;
      if(!this._muuri) return;
      this._muuri.refreshItems();
      this._muuri.layout();
    }, 10);
  }

  add(elements: Array<HTMLElement>, options?: any) {
    if(this._allowed)this._muuri.add(elements, options);
  }
  remove(elements: Array<HTMLElement>, options?: any) {
    if(this._allowed)this._muuri.remove(elements, options);
  }
}
