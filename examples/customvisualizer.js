// Register the custom question type
// Lets the question collects two values - min and max
// Question value is an object like { min: 3, max: 9 }
Survey.Serializer.addClass("custom-question", [], null, "text");

// Custom visualizer finds min and max values across all the answers on this question and shows them
function CustomVisualizer(question, data) {
  var self = this;
  self.question = question;
  self.data = data;
  self.toolbarItemCreators = {};

  var getData = function() {
    var result = [Number.MAX_VALUE, Number.MIN_VALUE];

    self.data.forEach(function(row) {
      var rowValue = row[self.question.name];
      if (!!rowValue) {
        if(rowValue.min < result[0]) {
          result[0] = rowValue.min;
        }
        if(rowValue.max > result[1]) {
          result[1] = rowValue.max;
        }
      }
    });

    return result;
  };

  var renderContent = function(contentContainer) {
    var data2render = getData();
    var minEl = SurveyAnalytics.DocumentHelper.createElement("div", "");
    var minTextEl = SurveyAnalytics.DocumentHelper.createElement("span", "", {innerText: "Min: "});
    var minValEl = SurveyAnalytics.DocumentHelper.createElement("span", "", {innerText: data2render[0]});
    minEl.appendChild(minTextEl);
    minEl.appendChild(minValEl);
    contentContainer.appendChild(minEl);
    var maxEl = SurveyAnalytics.DocumentHelper.createElement("div", "");
    var maxTextEl = SurveyAnalytics.DocumentHelper.createElement("span", "", {innerText: "Max: "});
    var maxValEl = SurveyAnalytics.DocumentHelper.createElement("span", "", {innerText: data2render[1]});
    maxEl.appendChild(maxTextEl);
    maxEl.appendChild(maxValEl);
    contentContainer.appendChild(maxEl);
  };

  return {
    name: "minMaxVisualizer",
    render: function(targetElement) {
      self.targetElement = targetElement || self.targetElement;
  
      var toolbarNodeContainer = SurveyAnalytics.DocumentHelper.createElement("div", "");
      var contentContainer =  SurveyAnalytics.DocumentHelper.createElement("div", "sa-visualizer__content");
  
      renderContent(contentContainer);
  
      var toolbar = SurveyAnalytics.DocumentHelper.createElement("div", "sa-toolbar");
      toolbarNodeContainer.appendChild(toolbar);
      SurveyAnalytics.VisualizerBase.prototype.createToolbarItems.apply(self, [toolbar]);

      self.targetElement.appendChild(toolbarNodeContainer);
      self.targetElement.appendChild(contentContainer);
    },
    registerToolbarItem: function(itemName, creator) {
        SurveyAnalytics.VisualizerBase.prototype.registerToolbarItem.apply(self, [itemName, creator]);
    },
    update: function(data) {
        self.data = data;
    },
    destroy: function() {
        self.targetElement.innerHTML = "";
    }
  };
}

// Register custom visualizer for the given question type
SurveyAnalytics.VisualizationManager.registerVisualizer("custom-question", CustomVisualizer);
// Set localized title of this visualizer
SurveyAnalytics.localization.locales["en"]["visualizer_minMaxVisualizer"] = "Min/Max Values";

// Custom visualizer finds min value across all the answers on this question and shows it
function CustomMinVisualizer(question, data) {
    var self = this;
    self.question = question;
    self.data = data;
    self.toolbarItemCreators = {};
  
    var getData = function() {
      var result = Number.MAX_VALUE;
  
      self.data.forEach(function(row) {
        var rowValue = row[self.question.name];
        if (!!rowValue) {
          if(rowValue.min < result) {
            result = rowValue.min;
          }
        }
      });
  
      return result;
    };
  
    var renderContent = function(contentContainer) {
      var data2render = getData();
      var minEl = SurveyAnalytics.DocumentHelper.createElement("div", "");
      var minTextEl = SurveyAnalytics.DocumentHelper.createElement("span", "", {innerText: "Min: "});
      var minValEl = SurveyAnalytics.DocumentHelper.createElement("span", "", {innerText: data2render});
      minEl.appendChild(minTextEl);
      minEl.appendChild(minValEl);
      contentContainer.appendChild(minEl);
    };
  
    return {
      name: "minVisualizer",
      render: function(targetElement) {
        self.targetElement = targetElement || self.targetElement;
    
        var toolbarNodeContainer = SurveyAnalytics.DocumentHelper.createElement("div", "");
        var contentContainer = SurveyAnalytics.DocumentHelper.createElement("div", "sa-visualizer__content");
    
        renderContent(contentContainer);
    
        var toolbar = SurveyAnalytics.DocumentHelper.createElement("div", "sa-toolbar");
        toolbarNodeContainer.appendChild(toolbar);
        SurveyAnalytics.VisualizerBase.prototype.createToolbarItems.apply(self, [toolbar]);
  
        self.targetElement.appendChild(toolbarNodeContainer);
        self.targetElement.appendChild(contentContainer);
      },
      registerToolbarItem: function(itemName, creator) {
          SurveyAnalytics.VisualizerBase.prototype.registerToolbarItem.apply(self, [itemName, creator]);
      },
      update: function(data) {
        self.data = data;
      },
      destroy: function() {
        self.targetElement.innerHTML = "";
      }
    };
}

// Register the second custom visualizer for the given question type
SurveyAnalytics.VisualizationManager.registerVisualizer("custom-question", CustomMinVisualizer);
// Set localized title of this visualizer
SurveyAnalytics.localization.locales["en"]["visualizer_minVisualizer"] = "Min Value Only";