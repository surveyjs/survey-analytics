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
  isVisible: boolean;
  isPublic: boolean;
  location: QuestionLocation;
  width?: string | number;
}

export interface ITableState {
  locale?: string;
  elements?: ITableColumn[];
  pageSize?: number;
}

export interface IPermission {
  name: string;
  isPublic: boolean;
}
