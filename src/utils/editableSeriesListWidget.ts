import { DocumentHelper } from ".";
import { IDropdownItemOption } from "./dropdownBase";
import { localization } from "../localizationManager";
import { IAxisDescription, SeriesAggregation } from "../axisDescription";

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
  /** When provided, returns extra action buttons for each item (e.g. "Move to second axis"). Called at render time. */
  getItemExtraButtons?: () => (item: IAxisDescription, index: number) => IEditableSeriesListItemAction[];
}

const getLegendLabel = (i: number) => (localization.getString("seriesListLegendSeries") || "Legend (series) {0}").replace("{0}", String(i + 1));
const valuesLabel = localization.getString("seriesListValuesLabel") || "Values";
const removeText = localization.getString("seriesListRemove") || "Remove";
const addText = localization.getString("seriesListAdd") || "Add";

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
    this.options.onChange(this.items.slice());
  }

  public removeAt(index: number): void {
    if(this.items.length <= 1) return;
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

    this.items.forEach((item, index) => {
      const card = DocumentHelper.createElement("div", "sa-series-list__card");
      card.appendChild(DocumentHelper.createElement("div", "sa-series-list__card-label", { textContent: getLegendLabel(index) }));

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
      dataNameDropdown.classList.add("sa-series-list__dropdown");
      card.appendChild(dataNameDropdown);

      card.appendChild(DocumentHelper.createElement("div", "sa-series-list__values-label", { textContent: valuesLabel }));

      const valuesRow = DocumentHelper.createElement("div", "sa-series-list__values-row");

      const valueNameOptions = () => [{ value: "", text: placeholder() }].concat(this.options.getOptions());
      const valueNameDropdown = DocumentHelper.createDropdown({
        options: valueNameOptions,
        isSelected: (opt) => (item.valueName ?? item.dataName) === opt.value,
        handler: (value) => this.setItemAt(index, { valueName: value || "" }),
        placeholder: placeholder(),
        resetHandler: () => this.setItemAt(index, { valueName: "" }),
      });
      valueNameDropdown.classList.add("sa-series-list__dropdown", "sa-series-list__dropdown--value");
      valuesRow.appendChild(valueNameDropdown);

      const aggregationDropdown = DocumentHelper.createDropdown({
        options: this.aggregationOptions,
        isSelected: (opt) => item.aggregation === opt.value,
        handler: (value) => this.setItemAt(index, { aggregation: (value || "count") as SeriesAggregation }),
      });
      aggregationDropdown.classList.add("sa-series-list__dropdown", "sa-series-list__dropdown--aggregation");
      valuesRow.appendChild(aggregationDropdown);

      card.appendChild(valuesRow);

      const extraButtons = this.options.getItemExtraButtons?.();
      if(extraButtons) {
        const actions = extraButtons(item, index);
        actions.forEach((action) => {
          const btn = DocumentHelper.createButton(action.onClick, action.text, "sa-series-list__action-button");
          card.appendChild(btn);
        });
      }

      if(this.items.length > 1 && index > 0) {
        const removeBtn = DocumentHelper.createButton(
          () => this.removeAt(index),
          removeText,
          "sa-series-list__remove-button"
        );
        card.appendChild(removeBtn);
      }

      this.listContainer.appendChild(card);
    });

    const max = this.options.maxSeriesCount;
    const canAdd = max === undefined || this.items.length < max;
    if(canAdd) {
      this.addBtn = DocumentHelper.createButton(() => this.addItem(), addText, "sa-series-list__add-button");
      this.listContainer.appendChild(this.addBtn);
    }
  }
}