import { IVisualizerOptions, ToolbarItemType, VisualizerBase } from "./visualizerBase";
import { IVisualizationPanelOptions, VisualizationPanel } from "./visualizationPanel";
import { DataProvider, GetDataFn } from "./dataProvider";
import { IVisualizerDescription } from "./visualizerDescription";
import { Question, SurveyModel } from "survey-core";
import { LayoutEngine } from "./layout-engine";
import { IDashboardTheme } from "./theme";
import { chartConfig, getChartTypes, getVisualizerTypes } from "./chartConfig";
import { IState } from "./config";

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
      const type = v.type || v.availableTypes[0];
      const question = questions.filter(q => q.name === v.dataField)[0];
      const config = chartConfig[type];
      const vd = {
        visualizerType: config?.visualizerType || type,
        visualizerTypes: getVisualizerTypes(v.availableTypes),
        availableTypes: getChartTypes(v.availableTypes),
        dataName: v.dataField,
        title: v.title,
        chartType: config?.chartType,
        question: question,
        options: {}
      } as IVisualizerDescription;

      const rootOptions = Object.keys(vd);
      Object.keys(v).forEach((key) => {
        if(!(key in rootOptions)) {
          vd.options[key] = v[key];
        }
      });
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
    this._panel.showToolbar = options.showToolbar;
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

  public renderContent(container: HTMLElement): void {
    this._panel.render(container);
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
