/**
 * A base class used to implement custom layout engines or integrate third-party layout engines with SurveyJS Dashboard.
 * @since 3.0.0
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
   * @since 3.0.0
   */
  start(container: HTMLElement) {
    if(this._allowed) {
      this.startCore(container);
    }
  }
  /**
   * Disables the dynamic layout.
   * @since 3.0.0
   */
  stop() {
    if(this._allowed) {
      this.stopCore();
    }
  }
  /**
   * Updates the dynamic layout.
   * @since 3.0.0
   */
  update() {
    if(this._allowed) {
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
