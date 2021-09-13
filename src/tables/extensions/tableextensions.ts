import { Table } from "../table";

interface ITableExtension {
  location: string;
  name: string;
  visibleIndex: number;
  render: (table: Table, opt: any) => HTMLElement;
  destroy?: () => void;
}

export class TableExtensions {
  constructor(private table: Table) {}
  private static extensions: { [location: string]: Array<ITableExtension> } = {};
  private renderedExtensions: Array<ITableExtension> = [];

  public render(targetNode: HTMLElement, location: string, options?: any) {
    var extensions = TableExtensions.extensions[location];
    if (!!extensions) {
      extensions = this.sortExtensions(extensions);
      extensions.forEach((extension) => {
        if (!!extension.render) {
          var action = extension.render(this.table, options);
          if (!!action) {
            targetNode.appendChild(action);
            this.renderedExtensions.push(extension);
          }
        }
      });
    }
  }

  public destroy() {
    this.renderedExtensions.forEach((extension) => {
      if (!!extension.destroy) extension.destroy();
    });
    this.renderedExtensions = [];
  }

  public static registerExtension(extension: ITableExtension) {
    if (!this.extensions[extension.location])
      this.extensions[extension.location] = [];
    this.extensions[extension.location].push(extension);
  }

  private static removeExtension(extension: ITableExtension) {
    if(!extension) {
      return;
    }
    const extensions = TableExtensions.extensions[extension.location];
    const index = extensions.indexOf(extension);
    if(index >= 0) {
      extensions.splice(index, 1);
    }
  }

  public static unregisterExtension(
    location: string,
    actionName: string
  ) {
    if(!actionName) {
      return;
    }
    if(!!location) {
      const extension = TableExtensions.findExtension(location, actionName);
      TableExtensions.removeExtension(extension);
    } else {
      Object.keys(this.extensions).forEach((location:string) => TableExtensions.unregisterExtension(location, actionName));
    }
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
