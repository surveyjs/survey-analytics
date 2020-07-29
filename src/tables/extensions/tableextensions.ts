import { Table } from "../table";

interface ITableExtension {
  location: string;
  name: string;
  visibleIndex: number;
  render: (table: Table, opt: any) => HTMLElement;
}

export class TableExtensions {
  constructor(protected targetNode: HTMLElement, protected table: Table) {}
  protected location: string;
  protected options: any = {};
  private static extensions: {
    [location: string]: Array<ITableExtension>;
  } = {};

  public render() {
    var extensions = TableExtensions.extensions[this.location];
    if (!!extensions) {
      extensions = this.sortExtensions(extensions);
      extensions.forEach((extension) => {
        if (!!extension.render) {
          var action = extension.render(this.table, this.options);
          if (!!action) {
            this.targetNode.appendChild(action);
          }
        }
      });
    }
  }

  public static registerExtension(extension: ITableExtension) {
    if (!this.extensions[extension.location])
      this.extensions[extension.location] = [];
    this.extensions[extension.location].push(extension);
  }

  public static findExtension(
    location: string,
    actionName: string
  ): ITableExtension {
    if (!this.extensions[location]) return null;
    var extension = this.extensions[location].filter(function (
      extension: ITableExtension
    ) {
      return extension.name == actionName;
    })[0];
    return extension || null;
  }

  private sortExtensions(extensions: Array<ITableExtension>) {
    if (!Array.isArray(extensions)) return;
    return []
      .concat(extensions.filter((extension) => extension.visibleIndex >= 0))
      .sort((firstExtension, secondExtension) => {
        return firstExtension.visibleIndex - secondExtension.visibleIndex;
      });
  }
}
