import { Question, SurveyModel, Event } from "survey-core";
import { IVisualizerOptions, ToolbarItemType, VisualizerBase } from "./visualizerBase";
import { IVisualizationPanelOptions, VisualizationPanel } from "./visualizationPanel";
import { DataProvider, GetDataFn } from "./dataProvider";
import { createVisualizerDescription, IVisualizerDescription } from "./visualizerDescription";
import { LayoutEngine } from "./layout-engine";
import { IDashboardTheme } from "./theme";
import { IState } from "./config";
import { DatePeriodEnum, DateRangeTuple, IDateRangeChangedOptions } from "./utils/dateRangeModel";

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

export function getVisualizerDescriptions(visualizers: Array<string | IVisualizerOptions>, questions: Question[] = []): Array<Question | IVisualizerDescription> {
  if(!visualizers || visualizers.length === 0) {
    return questions;
  }

  const items: Array<Question | IVisualizerDescription> = [];
  for(const v of visualizers) {
    if(typeof v === "string") {
      const q = questions.find((q) => q.name === v || q.valueName === v);
      if(q) {
        items.push(q);
      } else {
        // If no matching question is found, create a simple visualizer description
        // or throw an error?
      }
    } else if(!!v && typeof v === "object") {
      const question = questions.filter(q => q.name === v.dataField)[0];
      const vd = createVisualizerDescription(v, question);
      items.push(vd);
    }
  }

  return items;
}

export class Dashboard extends VisualizerBase {
  private readonly _options: IVisualizationPanelOptions;
  private _panel: VisualizationPanel;
  private _data: any[];
  private _questions: Question[];
  private _visualizers: any;

  public onDateRangeChanged = new Event<(sender: Dashboard, options: IDateRangeChangedOptions) => any, Dashboard, any>();

  constructor(options: IDashboardOptions) {
    super(null, options?.data ?? [], {}, "dashboard");

    this._data = options.data ?? [];
    this._questions = options.questions ?? [];
    this._visualizers = options.visualizers ?? [];

    this._options = {
      ...options
    };
    delete (this._options as any).data;
    delete (this._options as any).questions;
    delete (this._options as any).visualizers;

    const visualizerDescriptions = getVisualizerDescriptions(
      this._visualizers,
      this._questions,
    );

    this._panel = new VisualizationPanel(visualizerDescriptions, this._data, this._options);
    this._panel.onStateChanged.add((sender, options) => {
      this.onStateChanged.fire(this, options);
    });
    this._panel.onDateRangeChanged.add((sender, options) => {
      this.onDateRangeChanged.fire(this, options);
    });
    this._panel.showToolbar = options.showToolbar ?? true;
  }

  public registerToolbarItem(
    name: string,
    creator: (toolbar?: HTMLDivElement) => HTMLElement,
    type: ToolbarItemType,
    index: number = 100,
    groupIndex: number = 0
  ): void {
    this._panel.registerToolbarItem(name, creator, type, index, groupIndex);
  }

  public get state(): IState {
    return this.panel.getState();
  }
  public set state(newState: IState) {
    this.panel.state = newState;
  }

  public get locale(): string {
    return this.panel.locale;
  }
  public set locale(newLocale: string) {
    this.panel.locale = newLocale;
  }

  get panel(): VisualizationPanel {
    return this._panel;
  }

  public render(targetElement: HTMLElement | string, isRoot = true) {
    this._panel.render(targetElement, true);
  }

  updateData(data: Array<{ [index: string]: any }> | GetDataFn): void {
    this._panel.updateData(data);
  }

  public applyTheme(theme: IDashboardTheme): void {
    this._panel.applyTheme(theme);
  }

  destroy(): void {
    this._panel.destroy();
    super.destroy();
  }
}
