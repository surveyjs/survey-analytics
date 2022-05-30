function CustomVisualizer(question, data) {
  var self = this;
  self.question = question;
  self.data = data;
  self.toolbarItemCreators = {};

  function getQuestionData() {
    var data = [];
    self.data.forEach((result) => {
      if (!!result[question.name]) data.push(result[question.name]);
    });
    return data;
  }

  function renderHeader(table) {
    const question = self.question;
    var header = document.createElement("tr");
    question.rows.forEach((row) => {
      var value = Survey.ItemValue.getTextOrHtmlByValue(
        question.rows,
        row.value
      );
      var th = document.createElement("th");
      th.innerHTML = value;
      header.appendChild(th);
    });
    table.appendChild(header);
  }

  function renderRows(table) {
    const data = getQuestionData();
    if (self.question.rows.length > 1) {
      data.forEach((result) => {
        var tr = document.createElement("tr");
        self.question.rows.forEach((row) => {
          var rowValue = row.value;
          var cell = document.createElement("td");
          if (!!result[rowValue])
            cell.innerHTML = Survey.ItemValue.getTextOrHtmlByValue(
              self.question.columns,
              result[rowValue]
            );
          else cell.innerText = "Not answered";
          tr.appendChild(cell);
        });
        table.appendChild(tr);
      });
    }
  }

  var renderContent = function (contentContainer) {
    var table = document.createElement("table");
    table.className = "sa__matrix-table";
    renderHeader(table);
    renderRows(table);
    contentContainer.appendChild(table);
  };

  return {
    name: "matrix_table",
    render: function (targetElement) {
      self.targetElement = targetElement || self.targetElement;

      var toolbarNodeContainer = document.createElement("div");
      var contentContainer = document.createElement("div");
      contentContainer.className = "sa-visualizer__content";

      renderContent(contentContainer);

      var toolbar = document.createElement("div");
      toolbar.className = "sa-toolbar";
      toolbarNodeContainer.appendChild(toolbar);
      SurveyAnalytics.VisualizerBase.prototype.createToolbarItems.apply(self, [
        toolbar,
      ]);

      self.targetElement.appendChild(toolbarNodeContainer);
      self.targetElement.appendChild(contentContainer);
    },

    registerToolbarItem: function (itemName, creator) {
      SurveyAnalytics.VisualizerBase.prototype.registerToolbarItem.apply(self, [
        itemName,
        creator,
      ]);
    },

    updateData: function (data) {
      self.data = data;
    },
    destroy: function () {
      self.targetElement.innerHTML = "";
    },
  };
}

SurveyAnalytics.VisualizationManager.registerVisualizer(
  "matrix",
  CustomVisualizer
);
