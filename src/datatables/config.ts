export interface ITableColumn {
    name: string;
    displayName: string;
    dataType: "Text" | "FileLink" | "Image";
    visibility: "Visible" | "Invisible" | "PublicInvisible";
    location: "Column" | "Row";
}

// export interface ITableColumns {
//     columns: Array<ITableColumn>;
// }
