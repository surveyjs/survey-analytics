import { Question } from "survey-core";
import { IVisualizerOptions, VisualizerBase } from "./visualizerBase";
import { chartConfig, getChartTypes, getVisualizerTypes } from "./chartConfig";
import { VisualizationManager } from "./visualizationManager";
import { IVisualizerPanelRenderedElement, PanelElement } from "./visualizationPanel";
import { AlternativeVisualizersWrapper } from "./alternativeVizualizersWrapper";

export interface IDashboardItem extends IVisualizerPanelRenderedElement {
  dataName: string;
  type?: string;
  availableTypes?: string[];
  title?: string;
  allowChangeType?: boolean;
  options?: { [index: string]: any };
}

export class DashboardItem extends PanelElement implements IDashboardItem {
  private _visualizerType: string;
  private _availableTypes: { [index: string]: string[] };
  private _type: string;
  private _dataName: string;

  constructor(public readonly options: IVisualizerOptions, public question?: Question) {
    super(options?.name || question?.name || options?.dataField, question?.title || options?.title);
    this.initialize();
  }

  private initialize() {
    const requestedDashboardItemType = this.options.type || (this.options.availableTypes || [])[0];

    if(!!this.question) {
      const qType = this.question.getType();
      const vType = qType === "text" ? (<any>this.question).inputType : qType;
      this.visualizerTypes = VisualizationManager.getVisualizerNamesByType(vType);
      if(qType === "text" && (<any>this.question).inputType) {
        this.visualizerTypes = VisualizationManager.getVisualizerNamesByType((<any>this.question).inputType, qType);
      }

      this._availableTypes = {};
      this.visualizerTypes.forEach(vt => {
        let vct = this._availableTypes[vt];
        if(vct === undefined) {
          vct = [];
          this._availableTypes[vt] = vct;
        }
        if(VisualizerBase.chartAdapterType) {
          let chartTypes = VisualizerBase.chartAdapterType.getChartTypesByVisualizerType(vt);
          if(!!this.options.availableTypes && this.options.availableTypes.length > 0) {
            chartTypes = chartTypes.filter(chType => (this.options.availableTypes || []).indexOf(chType) !== -1 || chType === this.options.type);
          }
          chartTypes.forEach(chType => {
            vct.push(chType);
            if(chType === requestedDashboardItemType && !this._visualizerType) {
              this._visualizerType = vt;
              this.chartType = chType;
            }
          });
        }
      });
      Object.keys(this._availableTypes).forEach(key => {
        if(this._availableTypes[key].length === 0) {
          delete this._availableTypes[key];
          this.visualizerTypes.splice(this.visualizerTypes.indexOf(key), 1);
        }
      });
      if(!this._visualizerType && !!requestedDashboardItemType) {
        this._visualizerType = requestedDashboardItemType;
        if(this.visualizerTypes.indexOf(this._visualizerType) === -1) {
          this.visualizerTypes.push(this._visualizerType);
        }
      }
      if(!this._visualizerType) {
        this.visualizerTypes = VisualizationManager.getVisualizerNamesByType(vType);
        this._visualizerType = this.visualizerTypes[0];
      }
    } else {
      const config = chartConfig[requestedDashboardItemType];
      this._visualizerType = config?.visualizerType || requestedDashboardItemType;
      this.chartType = config?.chartType;
      this.visualizerTypes = getVisualizerTypes(this.options.availableTypes);
      this._availableTypes = getChartTypes(this.options.availableTypes);
    }
    this._type = requestedDashboardItemType || this.availableTypes[0];
    this._dataName = this.options.dataField;
    this.title = this.options.title;
    if(!this.question) {
      this.question = {
        name: this.name,
        valueName: this.dataName,
        title: this.options.title,
        displayValueName: this.options.displayValueName,
        waitForQuestionIsReady: () => {
          return new Promise<void>((resolve) => resolve());
        }
      } as any;
    }
  }

  private getDataName() {
    return this.question?.valueName || this.question?.name || this.questionName || this.name;
  }

  protected getStateProperties(): string[] {
    return ["type"].concat(super.getStateProperties());
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
