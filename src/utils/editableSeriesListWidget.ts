import { DocumentHelper } from ".";
import { IDropdownItemOption } from "./dropdownBase";
import { localization } from "../localizationManager";
import { IAxisDescription, SeriesAggregation } from "../axisDescription";

import "./editableSeriesListWidget.scss";

const placeholder = () => localization.getString("notSelected") || "Select...";

export interface IEditableSeriesListItemAction {
  text: string;
  onClick: () => void;
}

export interface IEditableSeriesListOptions {
  title: string;
  items: Array<IAxisDescription>;
  getOptions: () => Array<IDropdownItemOption>;
  onChange: (items: IAxisDescription[]) => void;
  maxSeriesCount?: number;
  getItemExtraButtons?: () => (item: IAxisDescription, index: number) => IEditableSeriesListItemAction[];
}

const getLegendLabel = (i: number) => (localization.getString("seriesListLegendSeries") || "Legend (series) {0}").replace("{0}", String(i + 1));
const valuesLabel = localization.getString("seriesListValuesLabel") || "Values";
const removeText = localization.getString("seriesListRemove") || "Remove";
const addText = localization.getString("seriesListAdd") || "Add Series";

function getDefaultAggregationOptions(): Array<IDropdownItemOption> {
  return [
    { value: "count", text: localization.getString("aggregationCount") || "Count" },
    { value: "sum", text: localization.getString("aggregationSum") || "Sum" },
    // { value: "average", text: localization.getString("aggregationAverage") || "Average" },
  ];
}

function getDefaultItem(): IAxisDescription {
  return { dataName: "", valueName: "", aggregation: "count" };
}

export class EditableSeriesListWidget {
  addBtn: HTMLDivElement;
  private root: HTMLDivElement;
  private listContainer: HTMLDivElement;
  private items: IAxisDescription[];
  private aggregationOptions = getDefaultAggregationOptions();

  constructor(private options: IEditableSeriesListOptions) {
    let list = options.items && options.items.length > 0
      ? options.items.map(item => ({
        dataName: item.dataName ?? "",
        valueName: item.valueName ?? item.dataName ?? "",
        aggregation: (item.aggregation ?? "count") as SeriesAggregation,
      }))
      : [getDefaultItem()];
    const max = options.maxSeriesCount;
    this.items = max !== undefined && list.length > max ? list.slice(0, max) : list;
    this.root = DocumentHelper.createElement("div", "sa-series-list") as HTMLDivElement;
    this.listContainer = DocumentHelper.createElement("div", "sa-series-list__items") as HTMLDivElement;
    this.root.appendChild(DocumentHelper.createElement("div", "sa-series-list__title", { textContent: options.title }));
    this.root.appendChild(this.listContainer);
  }

  render(): HTMLDivElement {
    this.renderItems();
    return this.root;
  }

  private notifyChange(): void {
    this.options.onChange(this.items.slice().filter(item => !!item.dataName));
  }

  public removeAt(index: number): void {
    if(this.items.length === 0) return;
    this.items.splice(index, 1);
    this.notifyChange();
    this.renderItems();
  }

  private addItem(): void {
    this.items.push(getDefaultItem());
    this.notifyChange();
    this.renderItems();
  }

  public setItemAt(index: number, patch: Partial<IAxisDescription>): void {
    this.items[index] = { ...this.items[index], ...patch };
    this.notifyChange();
    this.renderItems();
  }

  public setItems(items: IAxisDescription[]): void {
    this.items = items.slice();
    this.renderItems();
  }

  public refresh(): void {
    this.renderItems();
  }

  private renderItems(): void {
    this.listContainer.innerHTML = "";

    const list = (!this.items || this.items.length === 0) ? [getDefaultItem()] : this.items;
    list.forEach((item, index) => {
      this.createCardElement(index, item);
    });

    const max = this.options.maxSeriesCount;
    const canAdd = max === undefined || this.items.length < max;
    if(canAdd) {

      this.addBtn = this.createAddButton();
      this.listContainer.appendChild(this.addBtn);
    }
  }

  private createCardElement(index: number, item: IAxisDescription) {
    const card = DocumentHelper.createElement("div", "sa-series-settings");

    const legendContainer = DocumentHelper.createElement("div", "sa-series-settings__legend-container");
    const legend = DocumentHelper.createElement("div", "sa-series-settings__legend");
    const legendInnerContainer = DocumentHelper.createElement("div", "sa-series-settings__legend-inner");
    const legendText = DocumentHelper.createElement("div", "sa-series-settings__legend-text", {
      textContent: getLegendLabel(index),
    });
    legendInnerContainer.appendChild(legendText);
    legend.appendChild(legendInnerContainer);

    const legendControls = DocumentHelper.createElement("div", "sa-series-settings__legend-controls");

    const dataNameOptions = () => [{ value: "", text: placeholder() }].concat(this.options.getOptions());
    const dataNameDropdown = DocumentHelper.createDropdown({
      options: dataNameOptions,
      isSelected: (opt) => item.dataName === opt.value,
      handler: (value) => {
        const newDataName = value || "";
        const patch: Partial<IAxisDescription> = { dataName: newDataName };
        if(!newDataName || !item.valueName) {
          patch.valueName = newDataName;
        }
        this.setItemAt(index, patch);
      },
      placeholder: placeholder(),
      resetHandler: () => this.setItemAt(index, { dataName: "" }),
    });
    const legendDropdownWrapper = DocumentHelper.createElement("div", "sa-series-settings__dropdown sa-series-settings__dropdown--legend");
    legendDropdownWrapper.appendChild(dataNameDropdown);
    legendControls.appendChild(legendDropdownWrapper);

    legendContainer.appendChild(legend);
    legendContainer.appendChild(legendControls);

    const valuesContainer = DocumentHelper.createElement("div", "sa-series-settings__values-container");

    const valuesLabelContainer = DocumentHelper.createElement("div", "sa-series-settings__values-label");
    const valuesLabelInner = DocumentHelper.createElement("div", "sa-series-settings__values-label-inner");
    const valuesLabelText = DocumentHelper.createElement("div", "sa-series-settings__values-label-text", {
      textContent: valuesLabel,
    });
    valuesLabelInner.appendChild(valuesLabelText);
    valuesLabelContainer.appendChild(valuesLabelInner);

    const valuesControls = DocumentHelper.createElement("div", "sa-series-settings__values-controls");

    const valueNameOptions = () => [{ value: "", text: placeholder() }].concat(this.options.getOptions());
    const valueNameDropdown = DocumentHelper.createDropdown({
      options: valueNameOptions,
      isSelected: (opt) => (item.valueName ?? item.dataName) === opt.value,
      handler: (value) => this.setItemAt(index, { valueName: value || "" }),
      placeholder: placeholder(),
      resetHandler: () => this.setItemAt(index, { valueName: "" }),
    });
    const valueDropdownWrapper = DocumentHelper.createElement("div", "sa-series-settings__dropdown sa-series-settings__dropdown--value");
    valueDropdownWrapper.appendChild(valueNameDropdown);

    const aggregationDropdown = DocumentHelper.createDropdown({
      options: this.aggregationOptions,
      isSelected: (opt) => item.aggregation === opt.value,
      handler: (value) => this.setItemAt(index, { aggregation: (value || "count") as SeriesAggregation }),
    });
    const aggregationDropdownWrapper = DocumentHelper.createElement("div", "sa-series-settings__dropdown sa-series-settings__dropdown--aggregation");
    aggregationDropdownWrapper.appendChild(aggregationDropdown);

    valuesControls.appendChild(valueDropdownWrapper);
    valuesControls.appendChild(aggregationDropdownWrapper);

    valuesContainer.appendChild(valuesLabelContainer);
    valuesContainer.appendChild(valuesControls);

    card.appendChild(legendContainer);
    card.appendChild(valuesContainer);

    const extraButtonsFactory = this.options.getItemExtraButtons?.();
    const canRemove = this.items.length > 1 && index > 0;
    if(extraButtonsFactory || canRemove) {
      const actionsFrame = DocumentHelper.createElement("div", "sa-series-settings__actions");

      if(extraButtonsFactory) {
        const actions = extraButtonsFactory(item, index);
        actions.forEach((action) => {
          const btn = DocumentHelper.createButton(action.onClick, action.text, "sa-series-settings__action-button");
          actionsFrame.appendChild(btn);
        });
      }

      if(canRemove) {
        const removeBtn = DocumentHelper.createButton(
          () => this.removeAt(index),
          removeText,
          "sa-series-settings__remove-button"
        );
        actionsFrame.appendChild(removeBtn);
      }

      card.appendChild(actionsFrame);
    }

    this.listContainer.appendChild(card);
  }

  private createAddButton(): HTMLDivElement {
    const addBtn = DocumentHelper.createElement("div", "sa-series-list__add-button") as HTMLDivElement;
    addBtn.addEventListener("click", () => this.addItem());

    const box = DocumentHelper.createElement("div", "sa-series-list__add-button-box");
    const plus = DocumentHelper.createSvgElement("plus-24x24");
    plus.classList.add("sa-series-list__add-button-icon");

    const label = DocumentHelper.createElement("div", "sa-series-list__add-button-label");
    const caption = DocumentHelper.createElement("div", "sa-series-list__add-button-caption", { textContent: addText });
    label.appendChild(caption);

    box.appendChild(plus);
    box.appendChild(label);
    addBtn.appendChild(box);
    return addBtn;
  }
}