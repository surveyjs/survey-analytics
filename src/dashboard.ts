import { Question, SurveyModel, Event } from "survey-core";
import { IVisualizerOptions, VisualizerBase } from "./visualizerBase";
import { VisualizationPanel } from "./visualizationPanel";
import { DataProvider, GetDataFn } from "./dataProvider";
import { createDashboardItem, DashboardItem, IDashboardItem } from "./dashboard-item";
import { LayoutEngine } from "./layout-engine";
import { DatePeriodEnum, DateRangeTuple } from "./utils/dateRangeModel";
import { VisualizerFactory } from "./visualizerFactory";

export interface IDashboardOptions {
  data?: any[];
  questions?: Question[];
  visualizers?: Array<string | IVisualizerOptions>;

  survey?: SurveyModel;
  dataProvider?: DataProvider;
  allowHideQuestions?: boolean;
  allowDynamicLayout?: boolean;
  allowDragDrop?: boolean;
  layoutEngine?: LayoutEngine;
  stripHtmlFromTitles?: boolean;
  showToolbar?: boolean;

  dateFieldName?: string;
  datePeriod?: DatePeriodEnum;
  availableDatePeriods?: DatePeriodEnum[];
  dateRange?: DateRangeTuple;
  showAnswerCount?: boolean;
  showDatePanel?: boolean;

  [key: string]: any;
}

export class Dashboard extends VisualizationPanel<DashboardItem> {
  constructor(private readonly _options: IDashboardOptions) {
    super(_options.questions ?? [], _options?.data ?? [], _options, _options.visualizers ?? [] as any, true, "dashboard");
  }

  protected buildVisualizer(element: DashboardItem, questions: Array<Question>) {
    const visualizerOptions = Object.assign({}, this.options);
    const dataName = element.dataName;
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
    element.visualizer = visualizer;
  }

  protected createElement(source: any | Question): DashboardItem {
    if(source instanceof Question) {
      const dashboardItem = createDashboardItem({} as any, source);
      dashboardItem.question = source;
      return dashboardItem;
    } else {
      const dashboardItem = createDashboardItem(source, undefined);
      return dashboardItem;
    }
  }

  protected buildElements(questions: Question[], visualizers: Array<any>): Array<DashboardItem> {
    if(!visualizers || visualizers.length === 0) {
      return (questions || []).map((question) => this.createElement(question));
    }

    const items: Array<DashboardItem> = [];
    for(const v of visualizers) {
      if(typeof v === "string") {
        const q = questions.find((q) => q.name === v || q.valueName === v);
        if(q) {
          items.push(this.createElement(q));
        } else {
        // If no matching question is found, create a simple visualizer description
        // or throw an error?
        }
      } else if(!!v && typeof v === "object") {
        const descriptor = Object.assign({}, v);
        let question = questions.filter(q => q.name === v.dataField)[0];
        if(typeof descriptor.question === "string") {
          question = questions.find((q) => q.name === descriptor.question || q.valueName === descriptor.question);
        }
        if(!descriptor.name) {
          descriptor.name = this.getVisualizerName();
        }
        const vd = createDashboardItem(descriptor, question);
        items.push(vd);
      }
    }
    return items;
  }

  public get items(): DashboardItem[] {
    return this._elements;
  }
  public findItem(name: string): DashboardItem | undefined {
    return this.getElement(name) as DashboardItem;
  }
  public addItem(item: DashboardItem | IDashboardItem | Question): DashboardItem {
    let dashboardItem: DashboardItem;
    if(item instanceof DashboardItem) {
      dashboardItem = item;
    } else if("visualizerType" in item) {
      dashboardItem = new DashboardItem(item.visualizerType, item.question, item.options);
    } else if(item instanceof Question) {
      dashboardItem = new DashboardItem(item.name, item);
    }
    return dashboardItem;
  }
  public removeItem(item: DashboardItem | string) {
    const dashboardItem = typeof item === "string" ? this.findItem(item) : item;
    if(!!dashboardItem) {
    }
  }
}
