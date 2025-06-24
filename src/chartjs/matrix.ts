// import { ChartJSSelectBase } from "./selectBase";
// import { ChartConfiguration } from "chart.js";

// export class MatrixVisualizer extends ChartJSSelectBase {
//   public render(data: any[], columns: string[]): void {
//     const datasets = columns.map((column, index) => ({
//       label: column,
//       data: data.map(row => row[column] || 0),
//       backgroundColor: `hsl(${(index * 360) / columns.length}, 70%, 50%)`,
//       borderColor: `hsl(${(index * 360) / columns.length}, 70%, 40%)`,
//       borderWidth: 1
//     }));

//     const config: ChartConfiguration = {
//       type: "bar",
//       data: {
//         labels: data.map((_, index) => `Row ${index + 1}`),
//         datasets: datasets
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true,
//             title: {
//               display: true,
//               text: "Value"
//             }
//           },
//           x: {
//             title: {
//               display: true,
//               text: "Rows"
//             }
//           }
//         },
//         plugins: {
//           title: {
//             display: true,
//             text: "Matrix Visualization"
//           }
//         }
//       }
//     };

//     this.createChart(config);
//   }
// }