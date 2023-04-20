export interface IVisualizerPanelElement {
  name: string;
  displayName: string;
  isVisible: boolean;
  isPublic: boolean;
  chartType?: string;
  answersOrder?: string;
  hideEmptyAnswers?: boolean;
  topN?: number;
}

export interface IState {
  locale?: string;
  elements?: IVisualizerPanelElement[];
}

export interface IPermission {
  name: string;
  isPublic: boolean;
}
