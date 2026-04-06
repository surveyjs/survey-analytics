// Simulated list of all 200+ countries (in real scenario, this would be 1000+ items from a REST endpoint)
var allCountries = [
  { value: "AFG", text: "Afghanistan" },
  { value: "ALB", text: "Albania" },
  { value: "DZA", text: "Algeria" },
  { value: "AND", text: "Andorra" },
  { value: "AGO", text: "Angola" },
  { value: "ATG", text: "Antigua and Barbuda" },
  { value: "ARG", text: "Argentina" },
  { value: "ARM", text: "Armenia" },
  { value: "AUS", text: "Australia" },
  { value: "AUT", text: "Austria" },
  { value: "AZE", text: "Azerbaijan" },
  { value: "BHS", text: "Bahamas" },
  { value: "BHR", text: "Bahrain" },
  { value: "BGD", text: "Bangladesh" },
  { value: "BRB", text: "Barbados" },
  { value: "BLR", text: "Belarus" },
  { value: "BEL", text: "Belgium" },
  { value: "BLZ", text: "Belize" },
  { value: "BEN", text: "Benin" },
  { value: "BTN", text: "Bhutan" },
  { value: "BOL", text: "Bolivia" },
  { value: "BIH", text: "Bosnia and Herzegovina" },
  { value: "BWA", text: "Botswana" },
  { value: "BRA", text: "Brazil" },
  { value: "BRN", text: "Brunei" },
  // ... imagine 175+ more countries here
  { value: "FRA", text: "France" },  // Around item 75
  // ... more countries
  { value: "ZWE", text: "Zimbabwe" }  // Last item (item 195+)
];

// Only the first 25 countries are loaded initially (simulating lazy loading)
var initialChoices = allCountries.slice(0, 25);

// Survey definition with lazy loading enabled
var json = {
  elements: [
    {
      type: "dropdown",
      name: "country",
      title: "Which country are you from?",
      choicesLazyLoadEnabled: true,
      choicesLazyLoadPageSize: 25,
      choices: initialChoices
    }
  ]
};

// Response data contains values across the full range, not just the first 25
var data = [
  { country: "ALB" },      // Albania - in first 25
  { country: "ALB" },      // Albania - in first 25
  { country: "ATG" },      // Antigua and Barbuda - in first 25
  { country: "FRA" },      // France - NOT in first 25 (around item 75)
  { country: "FRA" },      // France - NOT in first 25
  { country: "FRA" },      // France - NOT in first 25
  { country: "ZWE" },      // Zimbabwe - NOT in first 25 (last item)
  { country: "ZWE" }       // Zimbabwe - NOT in first 25
];

// Create survey and visualizer
var survey = new Survey.SurveyModel(json);

// Simulate lazy loading callback (in real scenario, this would call a REST endpoint)
survey.onChoicesLazyLoad.add(function (sender, options) {
  // Simulate server response with paginated results
  var start = options.skip || 0;
  var end = start + (options.take || 25);
  var items = allCountries.slice(start, end);
  options.setItems(items, allCountries.length);
});

var options = {
  allowShowPercentages: true,
  showPercentages: true,
  allowHideEmptyAnswers: true,
  allowTopNAnswers: true
};

// Create visualization
var visPanel = new SurveyAnalytics.VisualizationPanel(
  [survey.getQuestionByName("country")],
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));

// Log information to console
console.log("Total countries available:", allCountries.length);
console.log("Initially loaded choices:", initialChoices.length);
console.log("Unique values in response data:", [...new Set(data.map(d => d.country))]);
console.log("The visualizer will show ONLY the values that appear in the response data (ALB, ATG, FRA, ZWE),");
console.log("not all 25 initially loaded choices. This keeps the visualization focused on actual responses.");
