import { DocumentHelper } from ".";
import "./sidebar.scss";

/**
 * Options for the sidebar widget (toolbar button + sliding panel).
 */
export interface ISidebarOptions {
  /** Panel title shown in the header */
  title: string;
  /**
   * Array of functions that create toolbar items. Each function receives a container and returns an HTMLElement to be appended to the panel content.
   */
  toolbarItemCreators: Array<(container: HTMLDivElement) => HTMLElement>;
  /** SVG icon name for the toolbar button (e.g. "more-24x24"). */
  buttonIcon?: string;
  /** Accessible title for the toolbar button. */
  buttonTitle?: string;
  /** Optional CSS class for the panel root. */
  panelClassName?: string;
}

const SIDEBAR_OPEN_CLASS = "sa-sidebar--opened";
const SIDEBAR_BACKDROP_CLASS = "sa-sidebar-backdrop";

/**
 * Widget that renders a toolbar button which opens a sidebar (sliding) panel.
 * The panel is rendered on the side (e.g. right), shows a title with close button, and renders content from toolbarItemCreators.
 */
export class SidebarWidget {
  private options: ISidebarOptions;
  private buttonElement: HTMLDivElement | null = null;
  private panelElement: HTMLDivElement | null = null;
  private backdropElement: HTMLDivElement | null = null;
  private contentContainer: HTMLDivElement | null = null;

  constructor(options: ISidebarOptions) {
    this.options = options;
  }

  /**
   * Renders the toolbar button. When clicked, opens the sidebar panel.
   * @param _toolbar - Optional toolbar container (for API compatibility with toolbar item creators).
   * @returns The button element to be placed in the toolbar.
   */
  render(_toolbar?: HTMLDivElement): HTMLDivElement {
    this.buttonElement = DocumentHelper.createElement("div", "sa-toolbar__button sa-toolbar__button-with-icon sa-sidebar-trigger") as HTMLDivElement;
    this.buttonElement.setAttribute("role", "button");
    this.buttonElement.setAttribute("tabindex", "0");
    this.buttonElement.setAttribute("aria-label", this.options.buttonTitle || this.options.title);
    this.buttonElement.setAttribute("aria-expanded", "false");

    if(this.options.buttonTitle) {
      this.buttonElement.title = this.options.buttonTitle;
    }

    const iconName = this.options.buttonIcon ?? "more-24x24";
    const iconWrap = DocumentHelper.createElement("div", "sa-toolbar__button-icon");
    iconWrap.appendChild(DocumentHelper.createSvgElement(iconName));
    this.buttonElement.appendChild(iconWrap);

    this.buttonElement.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    this.buttonElement.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggle();
      }
    });

    return this.buttonElement;
  }

  private ensurePanel(): void {
    if(this.panelElement) return;

    const panelClassName = this.options.panelClassName ?? "sa-sidebar";
    this.panelElement = DocumentHelper.createElement("div", panelClassName) as HTMLDivElement;
    this.panelElement.addEventListener("click", (e) => e.stopPropagation());

    const header = DocumentHelper.createElement("div", panelClassName + "-header");
    header.appendChild(DocumentHelper.createElement("div", panelClassName + "-title", { textContent: this.options.title }));

    const closeBtn = DocumentHelper.createElement("button", panelClassName + "-close", { type: "button" });
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.appendChild(DocumentHelper.createSvgElement("close-16x16"));
    closeBtn.addEventListener("click", () => this.close());
    header.appendChild(closeBtn);

    this.panelElement.appendChild(header);

    this.contentContainer = DocumentHelper.createElement("div", panelClassName + "-content") as HTMLDivElement;
    this.panelElement.appendChild(this.contentContainer);

    const creators = this.options.toolbarItemCreators || [];
    creators.forEach((creator) => {
      const el = creator(this.contentContainer!);
      if(el) {
        this.contentContainer!.appendChild(el);
      }
    });

    this.buttonElement.closest(".sa-visualizer-wrapper").appendChild(this.panelElement);
  }

  private ensureBackdrop(): void {
    if(this.backdropElement) return;
    this.backdropElement = DocumentHelper.createElement("div", SIDEBAR_BACKDROP_CLASS) as HTMLDivElement;
    this.backdropElement.setAttribute("aria-hidden", "true");
    this.backdropElement.addEventListener("click", (e) => {
      if(e.target === this.backdropElement) {
        this.close();
      }
    });

    this.buttonElement.closest(".sa-visualizer-wrapper").appendChild(this.backdropElement);
  }

  open(): void {
    this.ensurePanel();
    this.ensureBackdrop();
    if(this.panelElement) {
      this.panelElement.classList.add(SIDEBAR_OPEN_CLASS);
    }
    if(this.backdropElement) {
      this.backdropElement.classList.add(SIDEBAR_OPEN_CLASS);
    }
    if(this.buttonElement) {
      this.buttonElement.setAttribute("aria-expanded", "true");
    }
  }

  close(): void {
    if(this.panelElement) {
      this.panelElement.classList.remove(SIDEBAR_OPEN_CLASS);
    }
    if(this.backdropElement) {
      this.backdropElement.classList.remove(SIDEBAR_OPEN_CLASS);
    }
    if(this.buttonElement) {
      this.buttonElement.setAttribute("aria-expanded", "false");
    }
  }

  toggle(): void {
    if(this.panelElement?.classList.contains(SIDEBAR_OPEN_CLASS)) {
      this.close();
    } else {
      this.open();
    }
  }

  get isOpen(): boolean {
    return !!this.panelElement?.classList.contains(SIDEBAR_OPEN_CLASS);
  }

  /**
   * Destroys the widget: closes the panel, removes backdrop and panel from DOM.
   */
  destroy(): void {
    this.close();
    if(this.backdropElement?.parentElement) {
      this.backdropElement.parentElement.removeChild(this.backdropElement);
      this.backdropElement = null;
    }
    if(this.panelElement?.parentElement) {
      this.panelElement.parentElement.removeChild(this.panelElement);
      this.panelElement = null;
    }
    this.contentContainer = null;
    this.buttonElement = null;
  }
}
