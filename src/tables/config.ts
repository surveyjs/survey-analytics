import { Question, SurveyModel } from "survey-core";
import { ITableOptions, Table } from "./table";

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
export interface ITableColumnData {
  name: string;
  displayName: string;
  dataType: ColumnDataType;
  isVisible: boolean;
  isPublic: boolean;
  location: QuestionLocation;
  width?: string | number;
  isComment?: boolean;
}

export interface ITableColumn extends ITableColumnData {
  getCellData(survey: SurveyModel, data: any, table: Table, options: ITableOptions): ICellData;
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
