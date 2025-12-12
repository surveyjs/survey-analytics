var json = {
  "elements": [
    {
      "type": "radiogroup",
      "name": "product_discovering",
      "title": "How did you first discover our product?",
      "choices": [
        "Search engine",
        "GitHub",
        "Friend or colleague",
        {
          "value": "Redit",
          "text": "Reddit"
        },
        "Medium",
        "Twitter",
        "Facebook"
      ]
    },
    {
      "type": "radiogroup",
      "name": "useproduct",
      "title": "Do you currently use our libraries?",
      "isRequired": true,
      "choices": ["Yes", "No"]
    },
    {
      "type": "checkbox",
      "name": "uselibraries",
      "title": "Which libraries do you use?",
      "choices": [
        {
          "text": "Form Library",
          "value": "Survey Library (Runner)"
        }, {
          "text": "Survey Creator",
          "value": "Survey Creator (Designer)"
        }
      ]
    },
    {
      "type": "rating",
      "name": "nps_score",
      "title": "How likely are you to recommend our product to a friend or colleague?"
    }, {
      "type": "radiogroup",
      "name": "product_recommend",
      "title": "Have you recommended our product to anyone?",
      "choices": ["Yes", "No"]
    }, {
      "type": "checkbox",
      "name": "javascript_frameworks",
      "title": "Which JavaScript frameworks do you use?",
      "showOtherItem": true,
      "choices": [
        "React",
        "Angular",
        "jQuery",
        "Vue",
        "Meteor",
        "Ember",
        "Backbone",
        "Knockout",
        "Aurelia",
        "Polymer",
        "Mithril"
      ]
    }, {
      "type": "checkbox",
      "name": "backend_language",
      "title": "Which web backend programming languages do you use?",
      "showOtherItem": true,
      "choices": [
        "Java",
        "Python",
        "Node.js",
        "Go",
        "Django", {
          "value": "Asp.net",
          "text": "ASP.NET"
        },
        "Ruby"
      ]
    }, {
      "type": "checkbox",
      "name": "supported_devices",
      "title": "Which device types do you need to support?",
      "isRequired": true,
      "choices": [
        "Desktop", {
          "value": "Tablete",
          "text": "Tablet"
        },
        "Mobile"
      ]
    }
  ]
};
const survey = new Survey.Model(json);
const npsQuestionNames = ["product_recommend", "nps_score"];
const customerSegmentationQuestionNames = ["useproduct", "product_discovering", "uselibraries"];
const frameworksQuestionNames = ["javascript_frameworks", "backend_language", "supported_devices"];
let vizPanels = [];
function createVizPanels(data, ...args) {
  const panels = [];
  args.forEach((questions) => {
    panels.push(new SurveyAnalytics.VisualizationPanel(questions, data));
  });
  return panels;
}
function renderVizPanels(panels) {
  for (let i = 0; i < panels.length; i++) {
    const node = document.getElementById(`vizPanel${
      i + 1
    }`);
    panels[i].render(node);
    document
      .getElementById(`loadingIndicator${
        i + 1
      }`)
      .style
      .display = "none";
  }
}

var timer = undefined;
var isUpdating = false;
var currMin = undefined;
var currMax = undefined;
function createValsUpdater(parent, vizPanel, data) {
  return function() {
    var sliders = parent.getElementsByTagName("input");
    var slide1 = parseFloat(sliders[0].value);
    var slide2 = parseFloat(sliders[1].value);
    if(slide1 > slide2)
      { var tmp = slide2; slide2 = slide1; slide1 = tmp; }
    currMin = slide1;
    currMax = slide2;
    // var currData = data.filter(function(item) {
    //   return item.HappendAt >= currMin && item.HappendAt <= currMax;
    // });
    var displayElement = parent.getElementsByClassName("rangeValues")[0];
    displayElement.innerHTML = new Date(slide1).toLocaleDateString() + " - " + new Date(slide2).toLocaleDateString();
    displayElement = parent.getElementsByClassName("rangeValuesCount")[0];
    displayElement.innerHTML = vizPanel.dataProvider.filteredData.length + " item(s)";
    if(isUpdating) {
      return;
    }
    if(timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
    timer = setTimeout(function() {
      isUpdating = true;
      vizPanel.setFilter("HappendAt", { start: slide1, end: slide2 });
      timer = undefined;
      isUpdating = false;
    }, 100);
  }
}
function setupDateRange(vizPanel, data) {
  vizPanel.registerToolbarItem("dateRange", (toolbar) => {
    var itemRoot = undefined;
    if (data.length > 10 && !!data[0].HappendAt) {
      var min = data[0].HappendAt;
      var max = data[data.length-1].HappendAt;
      itemRoot = document.createElement("div");
      itemRoot.style.display = "inline-block";
      itemRoot.innerHTML = `<div class="range-slider">
        <span class="rangeValues"></span>
        <input value="` + currMin + `" min="` + min + `" max="` + max + `" type="range">
        <input value="` + currMax + `" min="` + min + `" max="` + max + `" type="range">
        <div class="rangeValuesCount"></div>
      </div>`;
      toolbar.appendChild(itemRoot);
      var slider1 = itemRoot.children[0].children[1];
      var slider2 = itemRoot.children[0].children[2];
      slider1.oninput = createValsUpdater(itemRoot.children[0], vizPanel, data);
      slider1.oninput();      
      slider2.oninput = createValsUpdater(itemRoot.children[0], vizPanel, data);
      slider2.oninput();      
    }
    return itemRoot;
  });
}
fetch("https://api.surveyjs.io/private/surveys/nps/").then(response => response.json()).then(data => {
  data.Data.forEach(function(item) {
    item.HappendAt = Date.parse(item.HappendAt);
  });
  data.Data.sort(function(d1, d2) {
    return d1.HappendAt > d2.HappendAt;
  });
  currMin = data.Data[0].HappendAt;
  currMax = data.Data[data.Data.length-1].HappendAt;

  const allQuestions = survey.getAllQuestions();
  const customerSegmentationQuestions = allQuestions.filter(question => customerSegmentationQuestionNames.indexOf(question.name) > -1);
  const npsQuestions = allQuestions.filter(question => npsQuestionNames.indexOf(question.name) > -1);
  const frameworksQuestions = allQuestions.filter(question => frameworksQuestionNames.indexOf(question.name) > -1);
  vizPanels = createVizPanels(data.Data, customerSegmentationQuestions, npsQuestions, frameworksQuestions);
  setupDateRange(vizPanels[0], data.Data);
  renderVizPanels(vizPanels);
});
function openTabNo(evt, number) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document
    .getElementById(`tab${number}`)
    .style
    .display = "block";
  const vizPanel = vizPanels[number - 1];
  if (vizPanel) {
    vizPanel.refresh();
  }
  evt.currentTarget.className += " active";
}
window.openTabNo = openTabNo;
document.getElementsByClassName("tablinks")[0].click();