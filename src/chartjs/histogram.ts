// import { ChartJSSelectBase } from "./selectBase";
// import { ChartConfiguration } from "chart.js";

// export class HistogramVisualizer extends ChartJSSelectBase {
//   public render(data: number[], bins: number = 10): void {
//     const min = Math.min(...data);
//     const max = Math.max(...data);
//     const binSize = (max - min) / bins;

//     const binData = new Array(bins).fill(0);
//     const labels = [];

//     for (let i = 0; i < bins; i++) {
//       const binStart = min + i * binSize;
//       const binEnd = min + (i + 1) * binSize;
//       labels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
//     }

//     data.forEach(value => {
//       const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
//       binData[binIndex]++;
//     });

//     const config: ChartConfiguration = {
//       type: "bar",
//       data: {
//         labels: labels,
//         datasets: [{
//           label: "Frequency",
//           data: binData,
//           backgroundColor: "rgba(54, 162, 235, 0.5)",
//           borderColor: "rgba(54, 162, 235, 1)",
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true,
//             title: {
//               display: true,
//               text: "Frequency"
//             }
//           },
//           x: {
//             title: {
//               display: true,
//               text: "Value Range"
//             }
//           }
//         },
//         plugins: {
//           title: {
//             display: true,
//             text: "Histogram"
//           }
//         }
//       }
//     };

//     this.createChart(config);
//   }
// }