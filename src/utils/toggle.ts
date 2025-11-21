import { DocumentHelper } from ".";

import "./toggle.scss";

export class ToggleWidget {
  private toggleElement: HTMLElement;
  private isActive: boolean;

  public container: HTMLElement;

  constructor(private toggleHandler: (options: { isActive: boolean }) => void, private text?: string | Function, initialState = false) {
    this.isActive = initialState;
    this.createWidget();
    this.bindEvents();
  }

  get title(): string {
    return !!this.text && (typeof this.text == "string" ? this.text : this.text());
  }

  createWidget() {
    this.container = DocumentHelper.createElement("div", "sa-toggle-container");
    this.toggleElement = DocumentHelper.createElement("div", "sa-toggle-element");
    this.toggleElement.setAttribute("tabindex", "0");
    this.toggleElement.setAttribute("role", "switch");
    this.toggleElement.setAttribute("aria-checked", this.isActive + "");
    this.toggleElement.setAttribute("aria-label", this.title);

    const statusText = DocumentHelper.createElement("div", "sa-toggle-text");
    statusText.textContent = this.title;

    this.toggleElement.appendChild(DocumentHelper.createElement("div", "sa-toggle-handle"));
    this.container.appendChild(this.toggleElement);
    this.container.appendChild(statusText);

    this.updateView();
  }

  bindEvents() {
    this.container.addEventListener("click", () => {
      this.toggle();
    });

    this.toggleElement.addEventListener("keydown", (e) => {
      if(e.key === " " || e.key === "Enter") {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    this.isActive = !this.isActive;
    this.updateView();
    this.toggleHandler({ isActive: this.isActive });
  }

  updateView() {
    if(this.isActive) {
      this.toggleElement.classList.add("active");
      this.toggleElement.setAttribute("aria-checked", "true");
    } else {
      this.toggleElement.classList.remove("active");
      this.toggleElement.setAttribute("aria-checked", "false");
    }
  }

  setState(state) {
    if(this.isActive !== state) {
      this.isActive = state;
      this.updateView();
    }
  }
}