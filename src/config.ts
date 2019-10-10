export enum ElementVisibility { Visible = "Visible", Invisible = "Invisible", PublicInvisible = "PublicInvisible" }

export interface IVisualizerPanelElement {
    name: string;
    displayName: string;
    visibility: ElementVisibility;
    type?: string;
}
