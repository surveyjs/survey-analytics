// import { ChartJSSelectBase } from "./selectBase";
// import { ChartConfiguration } from "chart.js";

// export class RatingVisualizer extends ChartJSSelectBase {
//   public render(data: number[], maxRating: number = 5): void {
//     const ratingCounts = new Array(maxRating).fill(0);

//     data.forEach(rating => {
//       if (rating >= 1 && rating <= maxRating) {
//         ratingCounts[rating - 1]++;
//       }
//     });

//     const config: ChartConfiguration = {
//       type: "bar",
//       data: {
//         labels: Array.from({ length: maxRating }, (_, i) => `${i + 1} Star${i === 0 ? "" : "s"}`),
//         datasets: [{
//           label: "Rating Distribution",
//           data: ratingCounts,
//           backgroundColor: "rgba(255, 206, 86, 0.5)",
//           borderColor: "rgba(255, 206, 86, 1)",
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
//               text: "Count"
//             }
//           },
//           x: {
//             title: {
//               display: true,
//               text: "Rating"
//             }
//           }
//         },
//         plugins: {
//           title: {
//             display: true,
//             text: "Rating Distribution"
//           }
//         }
//       }
//     };

//     this.createChart(config);
//   }
// }