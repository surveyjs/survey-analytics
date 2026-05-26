import { localization } from "../localizationManager";

export class DocumentHelper {
  public static createSelector(
    options: Array<{ value: string, text: string }> | Function,
    isSelected: (option: { value: string, text: string }) => boolean,
    handler: (e: any) => void,
    title?: string | Function
  ) {
    const selectWrapper = document.createElement("div");
    selectWrapper.className = "sa-question__select-wrapper";
    const titleElement = DocumentHelper.createElement("span", "sa-question__select-title");
    const select = document.createElement("select");
    select.className = "sa-question__select";
    const updateTitle = () => {
      const titleText = !!title && (typeof title == "string" ? title : title());
      titleElement.innerText = titleText;
      if(!!titleText) {
        selectWrapper.insertBefore(titleElement, select);
      } else if(titleElement.parentElement === selectWrapper) {
        selectWrapper.removeChild(titleElement);
      }
    };
    select.onchange = handler;
    selectWrapper.appendChild(select);
    const updateOptions = () => {
      select.innerHTML = "";
      const optionsSource = options || [];
      const optionItems = Array.isArray(optionsSource) ? optionsSource : optionsSource();
      optionItems.forEach((option) => {
        let optionElement = DocumentHelper.createElement("option", "", {
          value: option.value,
          text: option.text,
          selected: isSelected(option),
        });
        select.appendChild(optionElement);
      });
    };
    selectWrapper["__updateSelect"] = () => {
      updateTitle();
      updateOptions();
    };
    selectWrapper["__updateSelect"]();
    return selectWrapper;
  }

  /**
   * Destroys dropdown and removes all event handlers
   * @param {HTMLElement} dropdownElement - Root dropdown element
   */
  public static destroyDropdown(dropdownElement: any) {
    if(dropdownElement && dropdownElement._handleClickOutside) {
      document.removeEventListener("click", dropdownElement._handleClickOutside);
      dropdownElement._handleClickOutside = null;
    }
    if(dropdownElement && dropdownElement.parentNode) {
      dropdownElement.parentNode.removeChild(dropdownElement);
    }
  }

  // public static createButton(
  //   handler: (e: any) => void,
  //   text = "",
  //   className = "sa-toolbar__button"
  // ) {
  //   const button = DocumentHelper.createElement("span", className, {
  //     innerText: text,
  //     onclick: handler,
  //   });
  //   return button;
  // }

  public static createButton(
    handler: (e:any) => void,
    text = "",
    className = "sa-toolbar__button",
    icon?: string
  ): HTMLDivElement {
    const buttonElement = document.createElement("div");
    buttonElement.className = className + (icon ? " " + className + "-with-icon" : "");
    buttonElement.setAttribute("role", "button");
    buttonElement.setAttribute("tabindex", "0");

    if(icon) {
      const svgElement = document.createElement("div");
      svgElement.className = className + "-icon";
      svgElement.appendChild(DocumentHelper.createSvgElement(icon));
      buttonElement.appendChild(svgElement);
    }
    const buttonText = document.createElement("span");
    buttonText.className = className + "-text";
    buttonText.textContent = text;
    buttonElement.appendChild(buttonText);

    (buttonElement as any).setText = function(newText) {
      buttonText.textContent = newText;
    };

    buttonElement.addEventListener("click", function(e) {
      handler(e);
    });

    buttonElement.addEventListener("keydown", function(e) {
      if(e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler(e);
      }
    });

    return buttonElement;
  }

  public static setStyles(element: HTMLElement, styles: Record<string, any>): void {
    if(!element || !styles) return;

    Object.keys(styles).forEach(property => {
      element.style.setProperty(property, styles[property]);
    });
  }

  public static removeStyles(element: HTMLElement, properties: string[]): void {
    if(!element || !properties) return;

    properties.forEach(property => {
      element.style.removeProperty(property);
    });
  }

  public static createElement(
    tagName: string,
    className: string = "",
    attrs?: any
  ): HTMLElement {
    var el = document.createElement(tagName);
    if(!!className) {
      el.className = className;
    }
    if(!!attrs) {
      Object.keys(attrs).forEach(function (key) {
        (<any>el)[key] = attrs[key];
      });
    }
    return el;
  }

  public static createSvgElement(path: string): SVGSVGElement {
    const svgElem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const useElem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use"
    );
    useElem.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      "#sa-svg-" + path
    );
    svgElem.appendChild(useElem);
    return svgElem;
  }

  public static createSvgButton(path: string, title?: string): HTMLButtonElement {
    const btn = <HTMLButtonElement>(
      DocumentHelper.createElement("button", "sa-table__svg-button")
    );
    btn.appendChild(DocumentHelper.createSvgElement(path));
    if(title) {
      btn.title = title;
    }
    return btn;
  }

  public static createSvgToggleButton(
    svgPath1: string,
    svPpath2: string,
    text1: string,
    text2: string,
    handler1: (e: any) => any,
    handler2: (e: any) => any,
    state = "first",
    className = "sa-toolbar__button sa-toolbar__svg-button"
  ): HTMLElement {
    const svg1 = DocumentHelper.createSvgElement(svgPath1);
    const svg2 = DocumentHelper.createSvgElement(svPpath2);
    const button = DocumentHelper.createElement("button", className);

    const toggle = (e: any) => {
      if(state === "first") {
        state = "second";
        button.title = text2;
        button.removeChild(svg1);
        button.appendChild(svg2);
        handler2(e);
      } else if(state === "second") {
        state = "first";
        button.title = text1;
        button.removeChild(svg2);
        button.appendChild(svg1);
        handler1(e);
      }
    };

    if(state === "first") {
      button.title = text1;
      button.appendChild(svg1);
    } else if((state = "second")) {
      button.title = text2;
      button.appendChild(svg2);
    }

    button.onclick = toggle;

    return button;
  }

  public static createInput(
    className: string,
    placeholder = "",
    defaultValue = ""
  ): HTMLInputElement {
    var el = <HTMLInputElement>DocumentHelper.createElement(
      "input",
      className,
      {
        placeholder: placeholder,
        defaultValue: defaultValue,
      }
    );
    return el;
  }

  public static createTextEditor(options: { showIcon?: boolean, placeholder?: string, className?: string, inputValue?: string, onchange?: (val) => void } = {}): HTMLElement {
    const {
      className = "sa-table-filter",
      placeholder = localization.getString("filterPlaceholder"),
      inputValue = "",
      showIcon = true,
    } = options;

    const editor = document.createElement("div");
    editor.className = className;

    if(showIcon) {
      const iconContainer = DocumentHelper.createElement("div", className + "_icon");
      const searchIcon = DocumentHelper.createSvgElement("search-24x24");

      iconContainer.appendChild(searchIcon);
      editor.appendChild(iconContainer);
    }

    const input = <HTMLInputElement>DocumentHelper.createElement("input", className + "_input",
      {
        placeholder: placeholder,
        defaultValue: inputValue,
      }
    );
    input.onchange = (e) => {
      if(!!options.onchange) {
        options.onchange(input.value);
      }
    };

    editor.appendChild(input);
    return editor;
  }
}
