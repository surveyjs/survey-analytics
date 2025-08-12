import { glc } from "survey-core";
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
      if (!!titleText) {
        selectWrapper.insertBefore(titleElement, select);
      } else if (titleElement.parentElement === selectWrapper) {
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

  public static createButton(
    handler: (e: any) => void,
    text = "",
    className = "sa-toolbar__button"
  ) {
    const button = DocumentHelper.createElement("span", className, {
      innerText: text,
      onclick: handler,
    });
    return button;
  }

  public static createElement(
    tagName: string,
    className: string = "",
    attrs?: any
  ): HTMLElement {
    var el = document.createElement(tagName);
    el.className = className;
    if (!!attrs) {
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

  public static createSvgButton(path: string): HTMLButtonElement {
    const btn = <HTMLButtonElement>(
      DocumentHelper.createElement("button", "sa-table__svg-button")
    );
    btn.appendChild(DocumentHelper.createSvgElement(path));
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
      if (state === "first") {
        state = "second";
        button.title = text2;
        button.removeChild(svg1);
        button.appendChild(svg2);
        handler2(e);
      } else if (state === "second") {
        state = "first";
        button.title = text1;
        button.removeChild(svg2);
        button.appendChild(svg1);
        handler1(e);
      }
    };

    if (state === "first") {
      button.title = text1;
      button.appendChild(svg1);
    } else if ((state = "second")) {
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
}

export var options = {
  runningInBrowser: typeof window.URL.createObjectURL === "function",
};

export function allowDomRendering() {
  return options.runningInBrowser;
}

function getLicenseText(): string {
  const d: any = !!glc ? glc(1) : false;
  if (!!d && d.toLocaleDateString) return localization.getString("license2").replace("{date}", d.toLocaleDateString());
  return localization.getString("license");
}

export function createCommercialLicenseLink() {
  const container = DocumentHelper.createElement("div", "sa-commercial");
  const link = DocumentHelper.createElement("a", "sa-commercial__text", {
    href: "https://www.surveyjs.io/Buy",
    target: "_blank",
  });
  const containerSpan = DocumentHelper.createElement("span", "");
  const icon = DocumentHelper.createSvgElement("noncommercial");
  const textSpan = DocumentHelper.createElement(
    "span",
    "sa-commercial__product",
    { innerText: getLicenseText() }
  );
  container.appendChild(link).appendChild(containerSpan);
  containerSpan.appendChild(icon);
  containerSpan.appendChild(textSpan);
  return container;
}

export function createLoadingIndicator() {
  const container = DocumentHelper.createElement("div", "sa-data-loading-indicator-panel");
  const loadingIndicator = DocumentHelper.createElement("div", "sa-data-loading-indicator");
  loadingIndicator.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_17928_11482)">
          <path d="M32 64C14.36 64 0 49.65 0 32C0 14.35 14.36 0 32 0C49.64 0 64 14.35 64 32C64 49.65 49.64 64 32 64ZM32 4C16.56 4 4 16.56 4 32C4 47.44 16.56 60 32 60C47.44 60 60 47.44 60 32C60 16.56 47.44 4 32 4Z" fill="#E5E5E5"></path>
          <path d="M53.2101 55.2104C52.7001 55.2104 52.1901 55.0104 51.8001 54.6204C51.0201 53.8404 51.0201 52.5704 51.8001 51.7904C57.0901 46.5004 60.0001 39.4704 60.0001 31.9904C60.0001 24.5104 57.0901 17.4804 51.8001 12.1904C51.0201 11.4104 51.0201 10.1404 51.8001 9.36039C52.5801 8.58039 53.8501 8.58039 54.6301 9.36039C60.6701 15.4004 64.0001 23.4404 64.0001 31.9904C64.0001 40.5404 60.6701 48.5704 54.6301 54.6204C54.2401 55.0104 53.7301 55.2104 53.2201 55.2104H53.2101Z" fill="#19B394"></path>
        </g>
        <defs>
          <clipPath id="clip0_17928_11482">
            <rect width="64" height="64" fill="white"></rect>
          </clipPath>
        </defs>
      </svg>
      `;
  container.appendChild(loadingIndicator);
  return container;
}

export class DataHelper {
  public static zipArrays(...arrays: any[]): any[][] {
    let zipArray: any[] = [];
    for (let i = 0; i < arrays[0].length; i++) {
      zipArray[i] = [];
      arrays.forEach((arr) => {
        zipArray[i].push(arr[i]);
      });
    }
    return zipArray;
  }

  public static unzipArrays(zipArray: any[][]): any[][] {
    let arrays: any[][] = [];
    zipArray.forEach((value, i) => {
      value.forEach((val, j) => {
        if (!arrays[j]) arrays[j] = [];
        arrays[j][i] = val;
      });
    });
    return arrays;
  }
  public static sortDictionary(
    keys: any[],
    values: any[],
    desc: boolean
  ): { keys: any[], values: any[] } {
    let dictionary = this.zipArrays(keys, values);
    let comparator = (a: any[], b: any[], asc: boolean = true) => {
      let result = a[1] < b[1] ? 1 : a[1] == b[1] ? 0 : -1;
      return asc ? result : result * -1;
    };
    dictionary.sort((a: any[], b: any[]) => {
      return desc ? comparator(a, b, false) : comparator(a, b);
    });
    let keysAndValues = this.unzipArrays(dictionary);
    return { keys: keysAndValues[0], values: keysAndValues[1] };
  }

  public static toPercentage(value: number, maxValue: number) {
    return (value / maxValue) * 100;
  }
}

export function createLinksContainer(
  links: Array<{ name: string, content: any }>
): HTMLElement {
  const linksContainer = DocumentHelper.createElement("div");
  links.forEach((link) => {
    linksContainer.appendChild(
      DocumentHelper.createElement("a", "", {
        innerText: link.name,
        download: link.name,
        href: link.content,
      })
    );
  });
  return linksContainer;
}

export function createImagesContainer(
  links: Array<{ name: string, content: any }>
): HTMLElement {
  const linksContainer = DocumentHelper.createElement("div");
  links.forEach((link) => {
    linksContainer.appendChild(
      DocumentHelper.createElement("img", "", {
        alt: link.name,
        src: link.content,
      })
    );
  });
  return linksContainer;
}

export function toPrecision(value: number, precision = 2): number {
  const base = Math.pow(10, precision);
  return Math.round(base * value) / base;
}
