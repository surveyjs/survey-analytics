import { Question, SurveyModel, Event } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { IVisualizationPanelOptions, VisualizationPanel } from "./visualizationPanel";
import { DashboardItem, IDashboardItemOptions } from "./dashboard-item";
import { VisualizerFactory } from "./visualizerFactory";
import { IVisualizerPanelElement } from "./config";

export interface IDashboardOptions extends IVisualizationPanelOptions {
  items?: Array<string | IDashboardItemOptions>;
  questions?: Question[];
  data?: any[];
}

export class Dashboard extends VisualizationPanel<DashboardItem> {
  constructor(private readonly _options: IDashboardOptions) {
    super(_options.questions ?? [], _options?.data ?? [], _options, _options.items ?? [] as any, true, "dashboard");
  }

  protected buildVisualizer(element: DashboardItem, questions: Array<Question>) {
    const visualizerOptions = Object.assign({}, this.options);
    const dataName = element.dataField;
    if(!!element.chartType) {
      visualizerOptions[dataName] = Object.assign({},
        visualizerOptions[dataName] || {},
        {
          chartType: element.chartType,
          availableTypes: element.availableTypes
        }
      );
    }
    if(visualizerOptions.dataProvider === undefined) {
      visualizerOptions.dataProvider = this.dataProvider;
    }
    let visualizer: VisualizerBase = VisualizerFactory.createVisualizer(element, this.data, visualizerOptions);
    if(!visualizer) {
      return;
    }
    this.setupVisualizer(visualizer, element.question);
    element.visualizerInstance = visualizer;
  }

  protected createElement(element: IVisualizerPanelElement, question?: Question): DashboardItem {
    return new DashboardItem(element as any || {}, question);
  }

  public get items(): DashboardItem[] {
    return this._elements;
  }
  public getItem(name: string): DashboardItem | undefined {
    return this.getElement(name) as DashboardItem;
  }
  public addItem(item: DashboardItem | IDashboardItemOptions | Question): DashboardItem {
    let dashboardItem: DashboardItem;
    if(item instanceof DashboardItem) {
      dashboardItem = item;
    } else if("visualizerType" in item) {
      dashboardItem = new DashboardItem(item as any, item.question);
    } else if(item instanceof Question) {
      dashboardItem = new DashboardItem({} as any, item);
    }
    if(!!dashboardItem) {
      this.addElement(dashboardItem);
    }
    return dashboardItem;
  }
  public removeItem(item: DashboardItem | string) {
    if(!!item) {
      this.removeElement(item);
    }
  }
}
