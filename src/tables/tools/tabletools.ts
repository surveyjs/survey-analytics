import { Table } from "../table";

export class TableTools {
  constructor(
    protected targetNode: HTMLElement,
    protected table: Table,
    protected actions: string[] = []
  ) {}
  protected location: string;
  protected options: any = {};
  public static actions: {
    [location: string]: {
      [actionName: string]: (table: Table, opt: any) => HTMLElement;
    };
  } = {};

  public render() {
    if (!this.actions) return;
    this.actions.forEach((actionName: string) => {
      var actionCreator = TableTools.actions[this.location][actionName];
      if (!!actionCreator) {
        this.targetNode.appendChild(
          TableTools.actions[this.location][actionName](
            this.table,
            this.options
          )
        );
      }
    });
  }

  public static registerTool(
    location: string,
    actionName: string,
    actionCreator: (table: Table, opt: any) => HTMLElement
  ) {
    if (!this.actions[location]) this.actions[location] = {};
    this.actions[location][actionName] = actionCreator;
  }
}
