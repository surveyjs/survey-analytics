import { Question } from "survey-core";
import { IVisualizerOptions, VisualizerBase } from "./visualizerBase";
import { chartConfig, getChartTypes, getVisualizerTypes } from "./chartConfig";
import { IVisualizerTypeDescriptor, VisualizationManager } from "./visualizationManager";
import { PanelElement } from "./visualizationPanel";
import { AlternativeVisualizersWrapper } from "./alternativeVizualizersWrapper";

export interface IDashboardItem extends IVisualizerTypeDescriptor {
  chartType?: string;
  availableTypes?: any;
  questionName?: string;
  dataName?: string;
  displayValueName?: string;
  title?: string;
  options?: { [index: string]: any };
}

export function createDashboardItem(vOptions: IVisualizerOptions, question: Question): DashboardItem {
  const inputType = vOptions.type || (vOptions.availableTypes || [])[0];
  let visualizerType;
  let chartType;
  let visualizerTypes;
  let availableTypes;

  if(!!question) {
    const qType = question.getType();
    const vType = qType === "text" ? (<any>question).inputType : qType;
    visualizerTypes = VisualizationManager.getVisualizerNamesByType(vType);
    if(qType === "text" && (<any>question).inputType) {
      visualizerTypes = VisualizationManager.getVisualizerNamesByType((<any>question).inputType, qType);
    }

    availableTypes = {};
    visualizerTypes.forEach(vt => {
      let vct = availableTypes[vt];
      if(vct === undefined) {
        vct = [];
        availableTypes[vt] = vct;
      }
      if(VisualizerBase.chartAdapterType) {
        let chartTypes = VisualizerBase.chartAdapterType.getChartTypesByVisualizerType(vt);
        if(!!vOptions.availableTypes && vOptions.availableTypes.length > 0) {
          chartTypes = chartTypes.filter(chType => (vOptions.availableTypes || []).indexOf(chType) !== -1 || chType === vOptions.type);
        }
        chartTypes.forEach(chType => {
          vct.push(chType);
          if(chType === inputType && !visualizerType) {
            visualizerType = vt;
            chartType = chType;
          }
        });
      }
    });
    Object.keys(availableTypes).forEach(key => {
      if(availableTypes[key].length === 0) {
        delete availableTypes[key];
        visualizerTypes.splice(visualizerTypes.indexOf(key), 1);
      }
    });
    if(!visualizerType && !!inputType) {
      visualizerType = inputType;
      if(visualizerTypes.indexOf(visualizerType) === -1) {
        visualizerTypes.push(visualizerType);
      }
    }
    if(!visualizerType) {
      visualizerTypes = VisualizationManager.getVisualizerNamesByType(vType);
      visualizerType = visualizerTypes[0];
    }
  } else {
    const config = chartConfig[inputType];
    visualizerType = config?.visualizerType || inputType;
    chartType = config?.chartType;
    visualizerTypes = getVisualizerTypes(vOptions.availableTypes);
    availableTypes = getChartTypes(vOptions.availableTypes);
  }
  const dashboardItem = new DashboardItem(visualizerType, vOptions.question || question, vOptions, availableTypes);
  dashboardItem.type = inputType || dashboardItem.availableTypes[0];
  dashboardItem.chartType = chartType;
  dashboardItem.visualizerTypes = visualizerTypes;
  dashboardItem.dataName = vOptions.dataField;
  dashboardItem.title = vOptions.title;
  if(!dashboardItem.question) {
    dashboardItem.question = {
      name: dashboardItem.name,
      valueName: dashboardItem.dataName,
      title: vOptions.title,
      displayValueName: vOptions.displayValueName,
      waitForQuestionIsReady: () => {
        return new Promise<void>((resolve) => resolve());
      }
    } as any;
  }

  const rootOptions = Object.keys(dashboardItem);
  Object.keys(vOptions).forEach((key) => {
    if(!(key in rootOptions)) {
      dashboardItem.options[key] = vOptions[key];
    }
  });
  return dashboardItem;
}

export class DashboardItem extends PanelElement implements IDashboardItem {
  private _type: string;
  private _dataName: string;

  constructor(private _visualizerType: string, public question?: Question, public options?: IVisualizerOptions, private _availableTypes?: { [index: string]: string[] }) {
    super(options?.name || question?.name || options?.dataField, question?.title || options?.title);
  }

  private getDataName() {
    return this.question?.valueName || this.question?.name || this.questionName || this.name;
  }

  /**
   * The `changeType` method is called to update the visualizer and chart type accordingly.
   *
   * The `changeType` method checks the available types for the current visualizer and updates the
   * visualizer and chart type if the new type is valid. This ensures that the dashboard item always
   * has a valid type that is compatible with the available visualizers.
   */
  private changeType(newType: string) {
    let newVisualizerType: string;
    let newChartType: string;
    for(const vt in this._availableTypes || {}) {
      if(this._availableTypes[vt].indexOf(newType) !== -1) {
        newVisualizerType = vt;
        newChartType = newType;
        break;
      }
    }
    if(newVisualizerType && newChartType) {
      this.visualizerType = newVisualizerType;
      // this.chartType = newChartType;
      let currentVisualizer = this.visualizer;
      if(currentVisualizer instanceof AlternativeVisualizersWrapper) {
        currentVisualizer = currentVisualizer.getVisualizer();
      }
      if(currentVisualizer && typeof currentVisualizer["setChartType"] === "function") {
        currentVisualizer["setChartType"](newChartType);
      }
    }
    this._type = newType;
  }

  get visualizerType(): string {
    return this._visualizerType;
  }
  set visualizerType(value: string) {
    if(this._visualizerType !== value) {
      this._visualizerType = value;
      if(this.visualizer instanceof AlternativeVisualizersWrapper) {
        this.visualizer.setVisualizer(value);
        // this._type = this.chartType;
        let currentVisualizer = this.visualizer.getVisualizer();
        if(!!currentVisualizer) {
          this._type = (currentVisualizer as any).chartType;
        }
      }
    }
  }
  visualizerTypes?: string[];
  chartType?: string;
  // get chartType(): string | undefined {
  //   let currentVisualizer = this.visualizer;
  //   if(currentVisualizer instanceof AlternativeVisualizersWrapper) {
  //     currentVisualizer = currentVisualizer.getVisualizer();
  //   }
  //   if(!!currentVisualizer) {
  //     return (currentVisualizer as any).chartType;
  //   }
  //   if(this._availableTypes && this._availableTypes[this.visualizerType] && this._availableTypes[this.visualizerType].length > 0) {
  //     return this._availableTypes[this.visualizerType][0];
  //   }
  //   return undefined;
  // }
  // set chartType(value: string) {
  //   if(!!value && value !== this._type) {
  //     let currentVisualizer = this.visualizer;
  //     if(currentVisualizer instanceof AlternativeVisualizersWrapper) {
  //       currentVisualizer = currentVisualizer.getVisualizer();
  //     }
  //     if(currentVisualizer && typeof currentVisualizer["setChartType"] === "function") {
  //       currentVisualizer["setChartType"](value);
  //     }
  //     this._type = value;
  //   }
  // }
  questionName?: string;
  displayValueName?: string;

  /** Gets the available types for the dashboard item. */
  get availableTypes(): string[] {
    const at = [];
    for(const key in this._availableTypes || {}) {
      at.push(...(this._availableTypes[key] || []));
    }
    return at;
  }
  /**
   * Gets or sets the type of the dashboard item.
   *
   * The `type` property represents the current type of the dashboard item. When setting a new type,
   * the private `changeType` method is called to update the visualizer and chart type accordingly.
   */
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    if(this._type !== value) {
      this.changeType(value);
    }
  }
  /** Gets or sets the data name for the dashboard item. */
  get dataName(): string | undefined {
    return this._dataName || this.getDataName();
  }
  set dataName(value: string | undefined) {
    this._dataName = value;
  }
  /** Gets or sets the title of the dashboard item. */
  get title(): string {
    return this.displayName;
  }
  set title(value: string) {
    this.displayName = value;
  }
}
