import { CategoryScale, Chart, registerables } from "chart.js";

Chart.register(...registerables);

export { ChartJSSelectBase } from "./selectBase";
export { ChartJSSetup } from "./setup";