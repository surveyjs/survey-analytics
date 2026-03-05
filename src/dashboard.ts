import { Question, SurveyModel, Event } from "survey-core";
import { IVisualizerOptions, ToolbarItemType, VisualizerBase } from "./visualizerBase";
import { IVisualizationPanelOptions, VisualizationPanel } from "./visualizationPanel";
import { DataProvider, GetDataFn } from "./dataProvider";
import { createVisualizerDescription, IVisualizerDescription } from "./visualizerDescription";
import { LayoutEngine } from "./layout-engine";
import { DatePeriodEnum, DateRangeTuple } from "./utils/dateRangeModel";

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

export class Dashboard extends VisualizationPanel {
  constructor(private readonly _options: IDashboardOptions) {
    super(getVisualizerDescriptions(_options.visualizers ?? [], _options.questions ?? []), _options?.data ?? [], _options, undefined, true, "dashboard");
  }
}
