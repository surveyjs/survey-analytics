export class ToolbarHelper {
  public static createSelector(
    toolbar: HTMLDivElement,
    options: Array<{ value: string; text: string }>,
    isSelected: (option: { value: string; text: string }) => boolean,
    hander: (e: any) => void
  ) {
    const selectWrapper = document.createElement("div");
    selectWrapper.className = "sva-question__select-wrapper";
    const select = document.createElement("select");
    select.className = "sva-question__select";
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
    toolbar: HTMLDivElement,
    hander: (e: any) => void,
    text = "",
    cssClass = ""
  ) {
    const button = document.createElement("span");
    button.className = "sva-toolbar__button " + cssClass;
    button.innerText = text;
    button.onclick = hander;
    toolbar.appendChild(button);
    return button;
  }
}

export class ActionsHelper {
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
    btn.className = "sa-tabulator__svg-button";
    btn.appendChild(ActionsHelper.createSvgElement(path));
    return btn;
  }
  public static customFilter(data: any, filterParams: any) {
    var match = false;
    for (var key in data) {
      if (data[key].includes(filterParams.value)) {
        match = true;
      }
    }
    return match;
  }
}
