window.URL.createObjectURL = jest.fn();
import { SurveyModel, QuestionMatrixDropdownModel } from "survey-core";
import { VisualizationMatrixDropdown } from "../../src/visualizationMatrixDropdown";
import { SelectBasePlotly } from "../../src/plotly/selectBase";
import { PlotlySetup } from "../../src/plotly/setup";
import { VisualizationPanel } from "../../src/visualizationPanel";

test("null ref #394", () => {
  var survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "matrixdropdown",
            "name": "q1",
            "columns": [
              {
                "name": "Colonne 1",
                "title": "Nombre de fois",
                "choices": [
                  {
                    "value": "0",
                    "text": "Jamais ou moins d'une fois par mois",
                  },
                  {
                    "value": "1",
                    "text": "1 fois"
                  },
                  {
                    "value": "2",
                    "text": "2 fois"
                  },
                ],
              },
              {
                "name": "Colonne 2",
                "title": "Par jour, semaine ou mois",
                "choices": [
                  {
                    "value": "Z",
                    "text": "Jamais ou moins d'une fois par mois",
                  },
                  {
                    "value": "J",
                    "text": "Par jour",
                  },
                ],
              }
            ],
            "rows": [
              {
                "value": "Row1",
                "text": "Row 1:"
              }
            ]
          }
        ],
      }
    ]
  });
  const matrixDropdown: QuestionMatrixDropdownModel = survey.getQuestionByName("q1") as any;
  const sbp = new SelectBasePlotly(matrixDropdown.columns[0].templateQuestion, []); // keep it to register visualizer
  const matrixVisualizer = new VisualizationMatrixDropdown(matrixDropdown, []);
  const innerVisPanel = matrixVisualizer["_matrixDropdownVisualizer"] as VisualizationPanel;
  const selectBase = innerVisPanel.getVisualizer("Colonne 1") as SelectBasePlotly;
  try {
    var plotlyOptions = PlotlySetup.setup("bar", selectBase);
    expect(plotlyOptions).toBeDefined();
  } catch (e) {
    expect(e).toBeUndefined();
  }
});