import { Tabulator } from "./tabulator";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import TabulatorTables from "tabulator-tables";
Tabulator.initTabulatorConstructor(TabulatorTables);
export * from "./tabulator";