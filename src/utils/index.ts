export class ToolbarHelper {
  public static createSelector(
    options: Array<{ value: string; text: string }>,
    isSelected: (option: { value: string; text: string }) => boolean,
    hander: (e: any) => void
  ) {
    const selectWrapper = document.createElement("div");
    selectWrapper.className = "sa-question__select-wrapper";
    const select = document.createElement("select");
    select.className = "sa-question__select";
    options.forEach((option) => {
      let optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.text = option.text;
      optionElement.selected = isSelected(option);
      select.appendChild(optionElement);
    });
    select.onchange = hander;
    selectWrapper.appendChild(select);
    return selectWrapper;
  }
  public static createButton(
    handler: (e: any) => void,
    text = "",
    cssClass = ""
  ) {
    const button = document.createElement("span");
    button.className = "sa-toolbar__button " + cssClass;
    button.innerText = text;
    button.onclick = handler;
    return button;
  }
}

export class DocumentHelper {
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
    const btn = document.createElement("button");
    btn.className = "sa-table__svg-button";
    btn.appendChild(DocumentHelper.createSvgElement(path));
    return btn;
  }

  public static createBtn(caption: string): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.className = "sa-table__btn sa-table__btn--small sa-table__btn--gray";
    btn.innerHTML = caption;
    return btn;
  }

  public static createInput(
    className: string,
    placeholder = "",
    defaultValue = ""
  ): HTMLInputElement {
    var el = document.createElement("input");
    el.className = className;
    el.placeholder = placeholder;
    el.defaultValue = defaultValue;
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
