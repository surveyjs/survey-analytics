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
  width?: string | number;
}

export interface ITableState {
  locale: string;
  elements: ITableColumn[];
  pageSize: number;
}
