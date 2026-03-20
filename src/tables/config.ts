import { Question } from "survey-core";
import { ITable } from "./table-interfaces";

export enum QuestionLocation {
  Column,
  Row,
}
export enum ColumnDataType {
  Text,
  FileLink,
  Image,
}

export interface ICellData {
  question: Question;
  displayValue: any;
}

export interface IColumnData {
  name: string;
  displayName: string;
  dataType: ColumnDataType;
  isVisible: boolean;
  isPublic: boolean;
  location: QuestionLocation;
  width?: string | number;
  isComment?: boolean;
}
export interface IColumn extends IColumnData {
  visibleIndex?: number;
  fromJSON(json: any): void;
  getCellData(table: ITable, data: any): ICellData;
}

export interface ITableState {
  locale?: string;
  elements?: IColumnData[];
  pageSize?: number;
}

export interface IPermission {
  name: string;
  isPublic: boolean;
}
