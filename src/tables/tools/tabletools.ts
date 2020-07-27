import { Table } from "../table";

interface ITableTool {
  location: string;
  name: string;
  visibleIndex: number;
  render: (table: Table, opt: any) => HTMLElement;
}

export class TableTools {
  constructor(protected targetNode: HTMLElement, protected table: Table) {}
  protected location: string;
  protected options: any = {};
  public static actions: {
    [location: string]: Array<ITableTool>;
  } = {};

  public render() {
    var actions = TableTools.actions[this.location];
    if (!!actions) {
      actions = this.sortTools(actions);
      actions.forEach((tool) => {
        this.targetNode.appendChild(tool.render(this.table, this.options));
      });
    }
  }

  public static registerTool(tool: ITableTool) {
    if (!this.actions[tool.location]) this.actions[tool.location] = [];
    this.actions[tool.location].push(tool);
  }

  public static findTool(location: string, actionName: string): ITableTool {
    if (!this.actions[location]) return null;
    var tool = this.actions[location].filter(function (tool: ITableTool) {
      return tool.name == actionName;
    })[0];
    return tool || null;
  }

  private sortTools(tools: Array<ITableTool>) {
    if (!Array.isArray(tools)) return;
    return []
      .concat(tools.filter((tool) => tool.visibleIndex >= 0))
      .sort((firstTool, secondTool) => {
        return firstTool.visibleIndex - secondTool.visibleIndex;
      });
  }
}
