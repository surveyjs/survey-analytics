export class DocumentHelper {
  public static createSelector(
    options: Array<{ value: string; text: string }>,
    isSelected: (option: { value: string; text: string }) => boolean,
    handler: (e: any) => void
  ) {
    const selectWrapper = document.createElement("div");
    selectWrapper.className = "sa-question__select-wrapper";
    const select = document.createElement("select");
    select.className = "sa-question__select";
    options.forEach((option) => {
      let optionElement = DocumentHelper.createElement("option", "", {
        value: option.value,
        text: option.text,
        selected: isSelected(option),
      });
      select.appendChild(optionElement);
    });
    select.onchange = handler;
    selectWrapper.appendChild(select);
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

    button.title = text1;
    button.appendChild(svg1);
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

export class DataHelper {
  public static zipArrays(first: any[], second: any[]): any[][] {
    let zipArray: any[] = [];
    for (let i = 0; i < Math.min(first.length, second.length); i++) {
      zipArray[i] = [first[i], second[i]];
    }
    return zipArray;
  }

  public static unzipArrays(
    zipArray: any[][]
  ): { first: any[]; second: any[] } {
    let twoArrays: any = { first: [], second: [] };
    zipArray.forEach((value, i) => {
      twoArrays.first[i] = value[0];
      twoArrays.second[i] = value[1];
    });
    return twoArrays;
  }
  public static sortDictionary(
    keys: any[],
    values: any[],
    desc: boolean
  ): { keys: any[]; values: any[] } {
    let dictionary = this.zipArrays(keys, values);
    let comparator = (a: any[], b: any[], asc: boolean = true) => {
      let result = a[1] < b[1] ? 1 : a[1] == b[1] ? 0 : -1;
      return asc ? result : result * -1;
    };
    dictionary.sort((a: any[], b: any[]) => {
      return desc ? comparator(a, b, false) : comparator(a, b);
    });
    let keysAndValues = this.unzipArrays(dictionary);
    return { keys: keysAndValues.first, values: keysAndValues.second };
  }

  public static toPercentage(value: number, maxValue: number) {
    return (value / maxValue) * 100;
  }
}
