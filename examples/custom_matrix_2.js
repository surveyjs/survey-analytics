function CustomVisualizer(question, data) {
  function renderHeader(table, visualizer) {
    var header = document.createElement("tr");
    header.appendChild(document.createElement("th"));
    visualizer.valuesSource().forEach(function (value) {
      th = document.createElement("th");
      th.innerHTML = value.text;
      header.appendChild(th);
    });
    table.appendChild(header);
  }

  function renderRows(table, visualizer) {
    var data = visualizer.getData();
    visualizer.getSeriesLabels().forEach(function (label, rowIndex) {
      var tr = document.createElement("tr");
      var rowLabel = document.createElement("td");
      rowLabel.innerHTML = label;
      tr.appendChild(rowLabel);
      var sum = 0;
      data.forEach(function (colRow) {
        sum += colRow[rowIndex];
      });
      visualizer.valuesSource().forEach(function (_, columnIndex) {
        var cell = document.createElement("td");
        cell.innerHTML =
          data[columnIndex][rowIndex] +
          "(" +
          Math.round((data[columnIndex][rowIndex] / sum) * 100) +
          "%)";
        tr.appendChild(cell);
      });
      table.appendChild(tr);
    });
  }

  var renderContent = function (contentContainer, visualizer) {
    var table = document.createElement("table");
    table.className = "sa__matrix-table";
    renderHeader(table, visualizer);
    renderRows(table, visualizer);
    contentContainer.appendChild(table);
  };

  var matrixVis = new SurveyAnalytics.Matrix(
    question,
    data,
    {
      renderContent: renderContent,
    },
    "matrix_table"
  );
  return matrixVis;
}

SurveyAnalytics.VisualizationManager.registerVisualizer(
  "matrix",
  CustomVisualizer
);
