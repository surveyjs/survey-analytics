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
