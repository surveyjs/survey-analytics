// declare module "survey-analytics/survey.analytics.datatables";

// Dependencies for this module:
//   ../../survey-core

import { Event } from "survey-core";
import { Question } from "survey-core";
import { SurveyModel } from "survey-core";

import "./localization/farsi";
import "./localization/french";
import "./localization/norwegian";
import "./localization/portuguese";
import "./localization/russian";
import "./localization/dutch";

export var localization: {
    currentLocaleValue: string,
    defaultLocaleValue: string,
    locales: {
        [index: string]: any,
    },
    localeNames: {
        [index: string]: any,
    },
    supportedLocales: any[],
    currentLocale: string,
    defaultLocale: string,
    getString: (strName: string) => any,
    getLocales: () => Array<string>,
};
export var surveyStrings: {
    groupButton: string,
    ungroupButton: string,
    selectButton: string,
    hideColumn: string,
    showColumn: string,
    makePrivateColumn: string,
    makePublicColumn: string,
    moveToDetail: string,
    showAsColumn: string,
    filterPlaceholder: string,
    removeRows: string,
    showLabel: string,
    entriesLabel: string,
    visualizer_text: string,
    visualizer_wordcloud: string,
    visualizer_histogram: string,
    visualizer_number: string,
    chartType_bar: string,
    chartType_stackedbar: string,
    chartType_doughnut: string,
    chartType_pie: string,
    chartType_scatter: string,
    chartType_gauge: string,
    chartType_bullet: string,
    hideButton: string,
    makePrivateButton: string,
    makePublicButton: string,
    showButton: string,
    filter: string,
    resetFilter: string,
    changeLocale: string,
    clearButton: string,
    addElement: string,
    defaultOrder: string,
    ascOrder: string,
    descOrder: string,
    showMinorColumns: string,
    otherCommentTitle: string,
    showPercentages: string,
    hidePercentages: string,
    pdfDownloadCaption: string,
    xlsxDownloadCaption: string,
    csvDownloadCaption: string,
    saveDiagramAsPNG: string,
    hideEmptyAnswers: string,
    showEmptyAnswers: string,
    "topNValueText-1": string,
    topNValueText5: string,
    topNValueText10: string,
    topNValueText20: string,
    noVisualizerForQuestion: string,
    noResults: string,
    showPerValues: string,
    showPerColumns: string,
};

interface DataTablesOptions extends ITableOptions {
    buttons: boolean | string[] | any[] | any;
    dom: string;
    orderFixed: Array<number | string> | Array<Array<number | string>> | object;
    rowGroup: boolean | any;
    headerCallback: any;
}
export class DataTables extends Table {
    datatableApi: any;
    currentPageNumber: number;
    /**
      * The event is fired columns configuration has been changed.
      * <br/> sender the datatables adapter
      * <br/> options.survey current survey
      * @see getColumns
      */
    onColumnsReorder: Event<(sender: DataTables, options: any) => any, any>;
    static initJQuery($: any): void;
    static set haveCommercialLicense(val: boolean);
    constructor(survey: SurveyModel, data: Array<Object>, options: DataTablesOptions, _columns?: Array<ITableColumn>);
    destroy(): void;
    setColumnVisibility(columnName: string, isVisible: boolean): void;
    setColumnLocation(columnName: string, location: QuestionLocation): void;
    applyFilter(value: string): void;
    applyColumnFilter(columnName: string, value: string): void;
    sortByColumn(columnName: string, direction: string): void;
    setPageSize(value: number): void;
    setPageNumber(value: number): void;
    getPageNumber(): number;
    render(targetNode: HTMLElement): void;
    getColumns(): Array<any>;
    layout(): void;
}
export class DatatablesRow extends TableRow {
    protected table: Table;
    protected extensionsContainer: HTMLElement;
    protected detailsContainer: HTMLElement;
    constructor(table: Table, extensionsContainer: HTMLElement, detailsContainer: HTMLElement, _innerRow: any);
    get innerRow(): any;
    getElement(): HTMLElement;
    getRowData(): HTMLElement;
    getDataPosition(): number;
    remove(): void;
}

export interface ITableOptions {
        [index: string]: any;
        /**
            * Set this property to true to render column headings using question names
            */
        useNamesAsTitles?: boolean;
        /**
            * Use this event to change the display value of question in table.
            * <br/> `sender` - the table object that fires the event.
            * <br/> `options.question` - the question obect for which event is fired.
            * <br/> `options.displayValue` - the question display value. You can change this option before it is displayed in the table.
            */
        onGetQuestionValue?: (options: {
                question: Question,
                displayValue: any,
        }) => void;
}
export abstract class Table {
        protected survey: SurveyModel;
        protected data: Array<Object>;
        protected options: ITableOptions;
        protected _columns: Array<ITableColumn>;
        static showFilesAsImages: boolean;
        static haveCommercialLicense: boolean;
        protected tableData: any;
        protected extensions: TableExtensions;
        constructor(survey: SurveyModel, data: Array<Object>, options?: ITableOptions, _columns?: Array<ITableColumn>);
        protected renderResult: HTMLElement;
        protected currentPageSize: number;
        protected currentPageNumber: number;
        protected _rows: TableRow[];
        protected isColumnReorderEnabled: boolean;
        onColumnsVisibilityChanged: Event<(sender: Table, options: any) => any, any>;
        onColumnsLocationChanged: Event<(sender: Table, options: any) => any, any>;
        onRowRemoved: Event<(sender: Table, options: any) => any, any>;
        renderDetailActions: (container: HTMLElement, row: TableRow) => HTMLElement;
        getData(): Object[];
        abstract applyFilter(value: string): void;
        abstract applyColumnFilter(columnName: string, value: string): void;
        abstract sortByColumn(columnName: string, direction: string): void;
        render(targetNode: HTMLElement): void;
        enableColumnReorder(): void;
        disableColumnReorder(): void;
        getPageNumber(): number;
        setPageNumber(value: number): void;
        getPageSize(): number;
        setPageSize(value: number): void;
        getCreatedRows(): TableRow[];
        clearCreatedRows(): void;
        protected buildColumns: (survey: SurveyModel) => ITableColumn[];
        isColumnVisible(column: ITableColumn): boolean;
        get columns(): Array<ITableColumn>;
        set columns(columns: Array<ITableColumn>);
        protected initTableData(data: Array<any>): void;
        moveColumn(from: number, to: number): void;
        setColumnLocation(columnName: string, location: QuestionLocation): void;
        getColumnByName(columnName: string): ITableColumn;
        setColumnVisibility(columnName: string, isVisible: boolean): void;
        setColumnWidth(columnName: string, width: string | number): void;
        removeRow(row: TableRow): void;
        /**
            * Returns current locale of the table.
            * If locales more than one, the language selection dropdown will be added in the toolbar
            */
        get locale(): string;
        /**
            * Sets locale for table.
            */
        set locale(newLocale: string);
        getLocales(): Array<string>;
        refresh(hard?: boolean): void;
        destroy(): void;
        get isRendered(): boolean;
        /**
            * Vizualization panel state getter.
            */
        get state(): ITableState;
        /**
            * Vizualization panel state setter.
            */
        set state(newState: ITableState);
        /**
            * Fires when table state changed.
            */
        onStateChanged: Event<(sender: Table, options: any) => any, any>;
        /**
            * Gets table permissions.
            */
        get permissions(): IPermission[];
        /**
            * Sets table permissions.
            */
        set permissions(permissions: IPermission[]);
        /**
            * Fires when permissions changed
            */
        onPermissionsChangedCallback: any;
}
export abstract class TableRow {
        protected table: Table;
        protected extensionsContainer: HTMLElement;
        protected detailsContainer: HTMLElement;
        constructor(table: Table, extensionsContainer: HTMLElement, detailsContainer: HTMLElement);
        details: Details;
        extensions: TableExtensions;
        onToggleDetails: Event<(sender: TableRow, options: any) => any, any>;
        /**
            * Returns row's html element
            */
        abstract getElement(): HTMLElement;
        /**
            * Returns data, which is displayed in the row.
            */
        abstract getRowData(): any;
        /**
            * Returns position of row in the table's data.
            */
        abstract getDataPosition(): number;
        protected isSelected: boolean;
        render(): void;
        openDetails(): void;
        closeDetails(): void;
        toggleDetails(): void;
        getIsSelected(): boolean;
        toggleSelect(): void;
        remove(): void;
        destroy(): void;
}

export enum QuestionLocation {
    Column = 0,
    Row = 1
}
export enum ColumnDataType {
    Text = 0,
    FileLink = 1,
    Image = 2
}
export interface ITableColumn {
    name: string;
    displayName: string;
    dataType: ColumnDataType;
    isVisible: boolean;
    isPublic: boolean;
    location: QuestionLocation;
    width?: string | number;
    isComment?: boolean;
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

export class Details {
    protected table: Table;
    protected targetNode: HTMLElement;
    constructor(table: Table, row: TableRow, targetNode: HTMLElement);
    protected location: string;
    open(): void;
    protected createShowAsColumnButton: (columnName: string) => HTMLElement;
    close(): void;
}

interface ITableExtension {
    location: string;
    name: string;
    visibleIndex: number;
    render: (table: Table, opt: any) => HTMLElement;
    destroy?: () => void;
}
export class TableExtensions {
  constructor(table: Table);
  render(targetNode: HTMLElement, location: string, options?: any): void;
  destroy(): void;
  static registerExtension(extension: ITableExtension): void;
  static unregisterExtension(location: string, actionName: string): void;
  static findExtension(location: string, actionName: string): ITableExtension;
}
