export class ToolbarHelper {
    public static createSelector(options: Array<{value: string, text: string}>, isSelected: (option: {value: string, text: string}) => boolean, hander: (e: any) => void) {
        const selectWrapper = document.createElement("div");
        selectWrapper.className = "sva-question__select-wrapper";
        const select = document.createElement("select");
        select.className = "sva-question__select";
        options.forEach(option => {
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
    public static createButton(hander: (e: any) => void, text = "", cssClass = "") {
        const button = document.createElement("span");
        button.className = "sva-toolbar__button " + cssClass;
        button.innerText = text;
        button.onclick = hander;
        return button;
    }
}
