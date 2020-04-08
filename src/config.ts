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

export enum ColumnVisibility {
  Visible,
  Invisible,
  PublicInvisible,
}
export enum QuestionLocation {
  Column,
  Row,
}
export enum ColumnDataType {
  Text,
  FileLink,
  Image,
}

export interface ITableColumn {
  name: string;
  displayName: string;
  dataType: ColumnDataType;
  visibility: ColumnVisibility;
  location: QuestionLocation;
}
