import { DocumentHelper } from "./documentHelper";
import { SideBarItemCreators } from "../sideBarItemCreators";
import { localization } from "../localizationManager";
import "./sidebar.scss";

/**
 * Options for the sidebar widget (toolbar button + sliding panel).
 */
export interface ISidebarOptions {
  /** Panel title shown in the header */
  title: string;
  /**
   * Array of sidebar item entries (creator + optional groupIndex). Items with different groupIndex are separated by a divider.
   * For backward compatibility, a plain array of creator functions is also accepted (all items are treated as one group).
   */
  itemCreators: SideBarItemCreators;
  /** SVG icon name for the toolbar button (e.g. "settings_24x24"). */
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

    const iconName = this.options.buttonIcon ?? "settings_24x24";
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

  private getSideBarToolbarItemCreators(): Array<any> {
    const fromCreators = this.options.itemCreators;
    const creatorEntries = Object.keys(fromCreators).map((name) => ({ name, ...fromCreators[name] }));
    creatorEntries.sort((a, b) => {
      const groupA = a.groupIndex ?? 0;
      const groupB = b.groupIndex ?? 0;
      if(groupA !== groupB) return groupA - groupB;
      return (a.index ?? 0) - (b.index ?? 0);
    });
    return creatorEntries.map((entry) => ({
      creator: entry.creator,
      groupIndex: entry.groupIndex,
    }));
  }

  private ensurePanel(): void {
    if(this.panelElement) return;

    const panelClassName = this.options.panelClassName ?? "sa-sidebar";
    this.panelElement = DocumentHelper.createElement("div", panelClassName) as HTMLDivElement;
    this.panelElement.addEventListener("click", (e) => e.stopPropagation());

    const header = DocumentHelper.createElement("div", panelClassName + "-header");
    header.appendChild(DocumentHelper.createElement("div", panelClassName + "-title", { textContent: this.options.title }));

    const closeBtn = DocumentHelper.createElement("button", panelClassName + "-close", { type: "button" });
    closeBtn.setAttribute("aria-label", localization.getString("close"));
    closeBtn.appendChild(DocumentHelper.createSvgElement("close-16x16"));
    closeBtn.addEventListener("click", () => this.close());
    this.panelElement.appendChild(closeBtn);

    this.contentContainer = DocumentHelper.createElement("div", panelClassName + "-content") as HTMLDivElement;
    this.panelElement.appendChild(this.contentContainer);
    this.contentContainer.appendChild(header);
    this.contentContainer.appendChild(this.createDivider());

    const entries = this.getSideBarToolbarItemCreators() || [];
    let prevGroupIndex: number | undefined = undefined;
    entries.forEach((entry) => {
      const groupIndex = entry.groupIndex ?? 0;
      if(prevGroupIndex !== undefined && groupIndex !== prevGroupIndex) {
        this.contentContainer!.appendChild(this.createDivider());
      }
      const el = entry.creator(this.contentContainer!);
      if(el) {
        prevGroupIndex = groupIndex;
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

  private createDivider(): HTMLElement {
    const dividerElement = DocumentHelper.createElement("div", "sa-sidebar-divider");
    const line1 = DocumentHelper.createElement("div", "sa-line-1");
    dividerElement.appendChild(line1);
    const line2 = DocumentHelper.createElement("div", "sa-line-2");
    line1.appendChild(line2);
    return dividerElement;
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

  destroy(): void {
    this.close();
    if(this.backdropElement?.parentElement) {
      this.backdropElement.parentElement.removeChild(this.backdropElement);
      this.backdropElement = null;
    }
    this.destroyPanel();
    this.contentContainer = null;
    this.buttonElement = null;
  }

  destroyPanel() {
    if(this.panelElement?.parentElement) {
      this.panelElement.parentElement.removeChild(this.panelElement);
      this.panelElement = null;
    }
  }
}
