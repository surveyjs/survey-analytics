export enum ColumnVisibility { Visible = "Visible", Invisible = "Invisible", PublicInvisible = "PublicInvisible" }
export enum QuestionLocation { Column = "Column", Row = "Row" }
export enum ColumnDataType { Text = "Text", FileLink = "FileLink", Image = "Image" }

export interface ITableColumn {
    name: string;
    displayName: string;
    dataType: ColumnDataType;
    visibility: ColumnVisibility;
    location: QuestionLocation;
}

// export interface ITableColumns {
//     columns: Array<ITableColumn>;
// }
