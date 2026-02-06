
// var json = JSON.parse(jsonStr);
const json = {
  "locale": "fr",
  "elements": [
    {
      "type": "dropdown",
      "name": "satisfaction",
      "title": {
        "default": "How satisfied are you with our product?",
        "fr": "Êtes-vous satisfait du produit?",
        "es": "¿Qué tan satisfecho estás con nuestro producto?"
      },
      "choices": [
        {
          "value": 0,
          "text": {
            "default": "Not satisfied",
            "fr": "Pas satisfait",
            "es": "No satisfecho"
          }
        },
        {
          "value": 1,
          "text": {
            "default": "Satisfied",
            "fr": "Satisfait",
            "es": "Satisfecho"
          }
        },
        {
          "value": 2,
          "text": {
            "default": "Completely satisfied",
            "fr": "Complètement satisfait",
            "es": "Completamente satisfecho"
          }
        }
      ]
    },
    {
      "type": "dropdown",
      "name": "recommendation",
      "title": {
        "default": "How likely are you to recommend our product to a friend or colleague?",
        "fr": "Quelle est la probabilité que vous recommandiez notre produit à un ami ou un collègue ?",
        "es": "¿Qué probabilidades hay de que recomiende nuestro producto a un amigo o colega?"
      },
      "choices": [
        {
          "value": 1,
          "text": {
            "default": "I won't recommend",
            "fr": "Je ne recommanderai pas",
            "es": "No lo recomendaré"
          }
        },
        {
          "value": 2,
          "text": {
            "default": "Unlikely",
            "fr": "Je ne le recommanderais pas",
            "es": "Yo no lo recomendaría"
          }
        },
        {
          "value": 3,
          "text": {
            "default": "Possibly",
            "fr": "Je pourrais le recommander",
            "es": "Podría recomendarlo"
          }
        },
        {
          "value": 4,
          "text": {
            "default": "Likely",
            "fr": "Très probablement à recommander",
            "es": "Lo más probable es que lo recomienden"
          }
        },
        {
          "value": 5,
          "text": {
            "default": "I will recommend",
            "fr": "Je le recommande vivement",
            "es": "Lo recomiendo altamente"
          }
        }
      ]
    }
  ]
};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function generateData() {
  const data = [];
  for (let index = 0; index < 100; index++) {
    data.push({
      satisfaction: randomIntFromInterval(0, 2),
      recommendation: randomIntFromInterval(0, 5)
    });
  }
  return data;
}
const dataFromServer = generateData();

const survey = new Survey.Model(json);

    const vizPanel = new SurveyAnalyticsApexcharts.VisualizationPanel(
        survey.getAllQuestions(),
        dataFromServer,
        { 
            allowHideQuestions: false,
            survey: survey 
        }
    );
    
    
    // vizPanel.render("surveyDashboardContainer");

vizPanel.render(document.getElementById("summaryContainer"));
