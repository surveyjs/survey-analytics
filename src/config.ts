export interface IVisualizerPanelElement {
  name: string;
  displayName: string;
  isVisible: boolean;
  isPublic: boolean;
  type?: string;
}

export interface IState {
  locale?: string;
  elements?: IVisualizerPanelElement[];
}

export interface IPermission {
  name: string;
  isPublic: boolean;
}
