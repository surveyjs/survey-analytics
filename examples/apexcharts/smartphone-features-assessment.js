const json = {
  "title": "Smartphone Feature Experience Assessment",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "rating",
          "name": "overall-satisfaction",
          "title": "How satisfied are you with your smartphone overall?",
          "minRateDescription": "Very dissatisfied",
          "maxRateDescription": "Very satisfied"
        },
        {
          "type": "ranking",
          "name": "smartphone-features",
          "title": "Please rank the following smartphone features from the most important to the least",
          "choices": [
            "Long battery life",
            "Plenty of storage capacity",
            "High-quality camera",
            "Powerful CPU",
            "Large screen size",
            "High durability",
            "Low price"
          ]
        },
        {
          "type": "checkbox",
          "name": "upgrade-reasons",
          "title": "Which reasons would motivate you to upgrade your phone?",
          "choices": [
            "Better camera",
            "Longer battery life",
            "Faster performance",
            "More storage",
            "Better display",
            "5G support",
            "New features",
            "Lower price"
          ]
        }
      ]
    }
  ]
}
;
var survey = new Survey.SurveyModel(json);

const sampleData = [
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "Low price",
      "Powerful CPU",
      "Plenty of storage capacity",
      "Long battery life",
      "High-quality camera",
      "Large screen size",
      "High durability"
    ],
    "upgrade-reasons": [
      "New features",
      "Lower price"
    ]
  },
  {
    "overall-satisfaction": 3,
    "smartphone-features": [
      "High durability",
      "Large screen size",
      "Powerful CPU",
      "Plenty of storage capacity",
      "Long battery life",
      "High-quality camera",
      "Low price"
    ],
    "upgrade-reasons": [
      "Longer battery life",
      "Better display"
    ]
  },
  {
    "overall-satisfaction": 5,
    "smartphone-features": [
      "High-quality camera",
      "Long battery life",
      "Low price",
      "Large screen size",
      "Plenty of storage capacity",
      "High durability",
      "Powerful CPU"
    ],
    "upgrade-reasons": [
      "Better camera",
      "5G support"
    ]
  },
  {
    "overall-satisfaction": 5,
    "smartphone-features": [
      "Powerful CPU",
      "High durability",
      "Low price",
      "Plenty of storage capacity",
      "Long battery life",
      "Large screen size",
      "High-quality camera"
    ],
    "upgrade-reasons": [
      "New features",
      "Longer battery life"
    ]
  },
  {
    "overall-satisfaction": 2,
    "smartphone-features": [
      "Plenty of storage capacity",
      "Long battery life",
      "Large screen size",
      "High-quality camera",
      "Powerful CPU",
      "Low price",
      "High durability"
    ],
    "upgrade-reasons": [
      "Better camera",
      "Longer battery life"
    ]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "Powerful CPU",
      "High-quality camera",
      "High durability",
      "Low price",
      "Long battery life",
      "Plenty of storage capacity",
      "Large screen size"
    ],
    "upgrade-reasons": ["Better camera", "New features"]
  },
  {
    "overall-satisfaction": 3,
    "smartphone-features": [
      "Low price",
      "High durability",
      "Large screen size",
      "Long battery life",
      "Powerful CPU",
      "High-quality camera",
      "Plenty of storage capacity"
    ],
    "upgrade-reasons": ["More storage", "Better display"]
  },
  {
    "overall-satisfaction": 5,
    "smartphone-features": [
      "High-quality camera",
      "Long battery life",
      "Powerful CPU",
      "Large screen size",
      "Low price",
      "High durability",
      "Plenty of storage capacity"
    ],
    "upgrade-reasons": ["5G support"]
  },
  {
    "overall-satisfaction": 2,
    "smartphone-features": [
      "Long battery life",
      "High durability",
      "Low price",
      "High-quality camera",
      "Plenty of storage capacity",
      "Powerful CPU",
      "Large screen size"
    ],
    "upgrade-reasons": ["Faster performance", "Longer battery life"]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "Large screen size",
      "Plenty of storage capacity",
      "Long battery life",
      "Low price",
      "High-quality camera",
      "Powerful CPU",
      "High durability"
    ],
    "upgrade-reasons": ["New features", "More storage"]
  },
  {
    "overall-satisfaction": 1,
    "smartphone-features": [
      "Low price",
      "Large screen size",
      "High-quality camera",
      "Powerful CPU",
      "High durability",
      "Plenty of storage capacity",
      "Long battery life"
    ],
    "upgrade-reasons": ["Better camera", "Better display", "5G support"]
  },
  {
    "overall-satisfaction": 5,
    "smartphone-features": [
      "Plenty of storage capacity",
      "Long battery life",
      "Large screen size",
      "Powerful CPU",
      "High-quality camera",
      "High durability",
      "Low price"
    ],
    "upgrade-reasons": ["Better camera"]
  },
  {
    "overall-satisfaction": 3,
    "smartphone-features": [
      "Long battery life",
      "Low price",
      "High-quality camera",
      "High durability",
      "Powerful CPU",
      "Large screen size",
      "Plenty of storage capacity"
    ],
    "upgrade-reasons": ["New features"]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "High durability",
      "Powerful CPU",
      "High-quality camera",
      "Large screen size",
      "Long battery life",
      "Plenty of storage capacity",
      "Low price"
    ],
    "upgrade-reasons": ["Faster performance", "More storage"]
  },
  {
    "overall-satisfaction": 2,
    "smartphone-features": [
      "High-quality camera",
      "Large screen size",
      "Low price",
      "High durability",
      "Long battery life",
      "Powerful CPU",
      "Plenty of storage capacity"
    ],
    "upgrade-reasons": ["Better display"]
  },
  {
    "overall-satisfaction": 5,
    "smartphone-features": [
      "Powerful CPU",
      "Long battery life",
      "High durability",
      "Plenty of storage capacity",
      "High-quality camera",
      "Large screen size",
      "Low price"
    ],
    "upgrade-reasons": ["New features", "5G support"]
  },
  {
    "overall-satisfaction": 3,
    "smartphone-features": [
      "Powerful CPU",
      "Low price",
      "High durability",
      "Long battery life",
      "Plenty of storage capacity",
      "High-quality camera",
      "Large screen size"
    ],
    "upgrade-reasons": ["Better camera"]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "High durability",
      "Low price",
      "Powerful CPU",
      "Large screen size",
      "High-quality camera",
      "Plenty of storage capacity",
      "Long battery life"
    ],
    "upgrade-reasons": ["Better display", "New features"]
  },
  {
    "overall-satisfaction": 1,
    "smartphone-features": [
      "High-quality camera",
      "Powerful CPU",
      "Long battery life",
      "Plenty of storage capacity",
      "Low price",
      "High durability",
      "Large screen size"
    ],
    "upgrade-reasons": ["Faster performance", "More storage"]
  },
  {
    "overall-satisfaction": 2,
    "smartphone-features": [
      "Low price",
      "High durability",
      "Plenty of storage capacity",
      "Powerful CPU",
      "Large screen size",
      "Long battery life",
      "High-quality camera"
    ],
    "upgrade-reasons": ["New features"]
  },
  {
    "overall-satisfaction": 5,
    "smartphone-features": [
      "High-quality camera",
      "Large screen size",
      "Long battery life",
      "Plenty of storage capacity",
      "High durability",
      "Low price",
      "Powerful CPU"
    ],
    "upgrade-reasons": ["Better camera", "Better display"]
  },
  {
    "overall-satisfaction": 3,
    "smartphone-features": [
      "Low price",
      "Plenty of storage capacity",
      "Powerful CPU",
      "Large screen size",
      "High-quality camera",
      "Long battery life",
      "High durability"
    ],
    "upgrade-reasons": ["More storage"]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "Large screen size",
      "High durability",
      "Long battery life",
      "High-quality camera",
      "Plenty of storage capacity",
      "Powerful CPU",
      "Low price"
    ],
    "upgrade-reasons": ["Better display"]
  },
  {
    "overall-satisfaction": 2,
    "smartphone-features": [
      "Plenty of storage capacity",
      "Powerful CPU",
      "Low price",
      "High-quality camera",
      "Long battery life",
      "Large screen size",
      "High durability"
    ],
    "upgrade-reasons": ["Longer battery life", "Faster performance"]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "High-quality camera",
      "Powerful CPU",
      "Large screen size",
      "Long battery life",
      "Plenty of storage capacity",
      "Low price",
      "High durability"
    ],
    "upgrade-reasons": ["Better camera", "5G support"]
  },
  {
    "overall-satisfaction": 5,
    "smartphone-features": [
      "Plenty of storage capacity",
      "Long battery life",
      "High durability",
      "Low price",
      "Powerful CPU",
      "Large screen size",
      "High-quality camera"
    ],
    "upgrade-reasons": ["New features"]
  },
  {
    "overall-satisfaction": 3,
    "smartphone-features": [
      "High-quality camera",
      "Plenty of storage capacity",
      "Low price",
      "Long battery life",
      "Powerful CPU",
      "High durability",
      "Large screen size"
    ],
    "upgrade-reasons": ["More storage", "Better display"]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "Powerful CPU",
      "Long battery life",
      "Low price",
      "Plenty of storage capacity",
      "High durability",
      "High-quality camera",
      "Large screen size"
    ],
    "upgrade-reasons": ["Better camera"]
  },
  {
    "overall-satisfaction": 2,
    "smartphone-features": [
      "Large screen size",
      "Long battery life",
      "High durability",
      "Powerful CPU",
      "Low price",
      "High-quality camera",
      "Plenty of storage capacity"
    ],
    "upgrade-reasons": ["New features", "Faster performance"]
  },
  {
    "overall-satisfaction": 5,
    "smartphone-features": [
      "High durability",
      "Powerful CPU",
      "Plenty of storage capacity",
      "Long battery life",
      "High-quality camera",
      "Large screen size",
      "Low price"
    ],
    "upgrade-reasons": ["Better display"]
  },
  {
    "overall-satisfaction": 3,
    "smartphone-features": [
      "Long battery life",
      "Powerful CPU",
      "Plenty of storage capacity",
      "Low price",
      "High-quality camera",
      "High durability",
      "Large screen size"
    ],
    "upgrade-reasons": ["Better camera", "More storage"]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "Large screen size",
      "High-quality camera",
      "Low price",
      "Long battery life",
      "High durability",
      "Powerful CPU",
      "Plenty of storage capacity"
    ],
    "upgrade-reasons": ["5G support"]
  },
  {
    "overall-satisfaction": 1,
    "smartphone-features": [
      "Powerful CPU",
      "Long battery life",
      "High-quality camera",
      "Low price",
      "Large screen size",
      "High durability",
      "Plenty of storage capacity"
    ],
    "upgrade-reasons": ["Faster performance"]
  },
  {
    "overall-satisfaction": 2,
    "smartphone-features": [
      "Low price",
      "Large screen size",
      "Long battery life",
      "High-quality camera",
      "Plenty of storage capacity",
      "High durability",
      "Powerful CPU"
    ],
    "upgrade-reasons": ["Better camera", "More storage"]
  },
  {
    "overall-satisfaction": 5,
    "smartphone-features": [
      "High durability",
      "High-quality camera",
      "Long battery life",
      "Powerful CPU",
      "Plenty of storage capacity",
      "Large screen size",
      "Low price"
    ],
    "upgrade-reasons": ["Better display", "New features"]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "Low price",
      "Plenty of storage capacity",
      "High durability",
      "High-quality camera",
      "Large screen size",
      "Long battery life",
      "Powerful CPU"
    ],
    "upgrade-reasons": ["More storage"]
  },
  {
    "overall-satisfaction": 3,
    "smartphone-features": [
      "Powerful CPU",
      "Long battery life",
      "Low price",
      "Large screen size",
      "High-quality camera",
      "High durability",
      "Plenty of storage capacity"
    ],
    "upgrade-reasons": ["5G support"]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "High durability",
      "Long battery life",
      "Large screen size",
      "Powerful CPU",
      "Plenty of storage capacity",
      "High-quality camera",
      "Low price"
    ],
    "upgrade-reasons": ["Better camera", "Better display"]
  },
  {
    "overall-satisfaction": 2,
    "smartphone-features": [
      "High-quality camera",
      "Powerful CPU",
      "Plenty of storage capacity",
      "Low price",
      "Large screen size",
      "High durability",
      "Long battery life"
    ],
    "upgrade-reasons": ["New features"]
  },
  {
    "overall-satisfaction": 5,
    "smartphone-features": [
      "Powerful CPU",
      "High-quality camera",
      "Plenty of storage capacity",
      "High durability",
      "Large screen size",
      "Low price",
      "Long battery life"
    ],
    "upgrade-reasons": ["Better camera"]
  },
  {
    "overall-satisfaction": 4,
    "smartphone-features": [
      "Long battery life",
      "Large screen size",
      "High durability",
      "Powerful CPU",
      "Low price",
      "Plenty of storage capacity",
      "High-quality camera"
    ],
    "upgrade-reasons": ["Better display", "5G support"]
  }
];

function randomTimestamp(days = 100) {
  const now = Date.now();
  const past = now - days * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past)).toISOString();
}

const dataFromServer = sampleData.map(item => ({
  ...item,
  timestamp: randomTimestamp()
}));

var dashboard = new SurveyAnalyticsApexcharts.Dashboard({
  questions: survey.getAllQuestions(),
  data: dataFromServer,
  dateFieldName: "timestamp",
  visualizers: [
    {
        dataField: "overall-satisfaction",
        type: "gauge",
        // availableTypes: ["gauge", "bullet"]
    },
    {
        dataField: "smartphone-features",
        type: "radar",
        allowChangeType: false
    },
    "upgrade-reasons"
  ]
  }
);

dashboard.render(document.getElementById("dashboardContainer"));
