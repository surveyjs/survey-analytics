export enum ElementVisibility {
  Visible,
  Invisible,
  PublicInvisible,
}

export interface IVisualizerPanelElement {
  name: string;
  displayName: string;
  visibility: ElementVisibility;
  type?: string;
}

export interface IState {
  locale?: string;
  elements?: IVisualizerPanelElement[];
}

export interface IPermission {
  name: string;
  visibility: ElementVisibility;
}
