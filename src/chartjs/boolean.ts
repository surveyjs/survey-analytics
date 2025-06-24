// import { ChartJSSelectBase } from "./selectBase";
// import { ChartConfiguration } from "chart.js";

// export class BooleanVisualizer extends ChartJSSelectBase {
//   public render(data: any[]): void {
//     const trueCount = data.filter(item => item === true).length;
//     const falseCount = data.filter(item => item === false).length;

//     const config: ChartConfiguration = {
//       type: "doughnut",
//       data: {
//         labels: ["True", "False"],
//         datasets: [{
//           data: [trueCount, falseCount],
//           backgroundColor: ["#4CAF50", "#F44336"],
//           borderWidth: 2
//         }]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             position: "bottom"
//           },
//           title: {
//             display: true,
//             text: "Boolean Distribution"
//           }
//         }
//       }
//     };

//     this.createChart(config);
//   }
// }