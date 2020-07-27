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
  public static actions: {
    [location: string]: Array<ITableExtension>;
  } = {};

  public render() {
    var actions = TableExtensions.actions[this.location];
    if (!!actions) {
      actions = this.sortExtensions(actions);
      actions.forEach((extension) => {
        this.targetNode.appendChild(extension.render(this.table, this.options));
      });
    }
  }

  public static registerExtension(extension: ITableExtension) {
    if (!this.actions[extension.location])
      this.actions[extension.location] = [];
    this.actions[extension.location].push(extension);
  }

  public static findExtension(
    location: string,
    actionName: string
  ): ITableExtension {
    if (!this.actions[location]) return null;
    var extension = this.actions[location].filter(function (
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
