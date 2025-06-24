// import { ChartJSSelectBase } from "./selectBase";
// import { ChartConfiguration } from "chart.js";

// export class RankingVisualizer extends ChartJSSelectBase {
//   public render(data: any[], options: string[]): void {
//     const optionCounts = options.map(option =>
//       data.filter(item => item === option).length
//     );

//     const config: ChartConfiguration = {
//       type: "bar",
//       data: {
//         labels: options,
//         datasets: [{
//           label: "Ranking",
//           data: optionCounts,
//           backgroundColor: "rgba(75, 192, 192, 0.5)",
//           borderColor: "rgba(75, 192, 192, 1)",
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         indexAxis: "y",
//         scales: {
//           x: {
//             beginAtZero: true,
//             title: {
//               display: true,
//               text: "Count"
//             }
//           },
//           y: {
//             title: {
//               display: true,
//               text: "Options"
//             }
//           }
//         },
//         plugins: {
//           title: {
//             display: true,
//             text: "Ranking Results"
//           }
//         }
//       }
//     };

//     this.createChart(config);
//   }
// }