const json = {
  "title": "Household Income and Demographics Survey",
  "description": "This survey collects information about household income, demographics, and employment for statistical research purposes.",
  "pages": [
    {
      "name": "household_info",
      "title": "Household Information",
      "elements": [
        {
          "type": "text",
          "name": "household_head_age",
          "title": "Age of the head of household",
          "inputType": "number",
          "min": 16,
          "max": 120
        },
        {
          "type": "dropdown",
          "name": "household_size",
          "title": "Number of people in the household",
          "choicesMin": 1,
          "choicesMax": 10
        },
        {
          "type": "dropdown",
          "name": "region",
          "title": "State",
          "choices": [
            "Alabama", "Alaska", "Arizona", "Arkansas",
            "California", "Colorado", "Connecticut",
            "Delaware", "Florida", "Georgia", "Hawaii",
            "Idaho", "Illinois", "Indiana", "Iowa",
            "Kansas", "Kentucky", "Louisiana", "Maine",
            "Maryland", "Massachusetts", "Michigan",
            "Minnesota", "Mississippi", "Missouri",
            "Montana", "Nebraska", "Nevada", "New Hampshire",
            "New Jersey", "New Mexico", "New York",
            "North Carolina", "North Dakota", "Ohio",
            "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
            "South Carolina", "South Dakota", "Tennessee", "Texas",
            "Utah", "Vermont", "Virginia", "Washington",
            "West Virginia", "Wisconsin", "Wyoming"
          ]
        },
        {
          "type": "dropdown",
          "name": "education_level",
          "title": "Highest education level of the head of household",
          "choices": [
            "No formal education",
            "Primary education",
            "Secondary education",
            "Bachelor's degree",
            "Master's degree or higher"
          ]
        }
      ]
    },
    {
      "name": "employment_info",
      "title": "Employment Information",
      "elements": [
        {
          "type": "radiogroup",
          "name": "employment_status",
          "title": "Employment status of the head of household",
          "choices": [
            "Employed full-time",
            "Employed part-time",
            "Self-employed",
            "Unemployed",
            "Retired"
          ]
        },
        {
          "type": "text",
          "name": "annual_income",
          "title": "Total annual household income (in USD)",
          "inputType": "number",
          "min": 0
        }
      ]
    },
    {
      "name": "additional_info",
      "title": "Additional Information",
      "elements": [
        {
          "type": "checkbox",
          "name": "income_sources",
          "title": "Sources of household income",
          "description": "(select all that apply)",
          "choices": [
            "Salary / Wages",
            "Business income",
            "Pension / Retirement",
            "Government assistance",
            "Investments / Dividends"
          ],
          "showOtherItem": true,
          "otherText": "Other (specify)"
        }
      ]
    }
  ],
  "headerView": "advanced"
};
const dataFromServer = [
  {
    "household_head_age": 32,
    "household_size": 5,
    "region": "Montana",
    "education_level": "Bachelor's degree",
    "employment_status": "Retired",
    "annual_income": 40952,
    "income_sources": [
      "Government assistance"
    ]
  },
  {
    "household_head_age": 46,
    "household_size": 7,
    "region": "Florida",
    "education_level": "Master's degree or higher",
    "employment_status": "Employed part-time",
    "annual_income": 142990,
    "income_sources": [
      "other"
    ],
    "income_sources-Comment": "Crowdfunding / donations"
  },
  {
    "household_head_age": 71,
    "household_size": 7,
    "region": "Georgia",
    "education_level": "Primary education",
    "employment_status": "Self-employed",
    "annual_income": 25480,
    "income_sources": [
      "other",
      "Pension / Retirement"
    ],
    "income_sources-Comment": "Tips / commissions"
  },
  {
    "household_head_age": 73,
    "household_size": 6,
    "region": "Kentucky",
    "education_level": "No formal education",
    "employment_status": "Employed part-time",
    "annual_income": 137472,
    "income_sources": [
      "Pension / Retirement",
      "Salary / Wages",
      "Government assistance"
    ]
  },
  {
    "household_head_age": 50,
    "household_size": 2,
    "region": "Iowa",
    "education_level": "Master's degree or higher",
    "employment_status": "Employed part-time",
    "annual_income": 94307,
    "income_sources": [
      "other"
    ],
    "income_sources-Comment": "Scholarships / stipends"
  },
  {
    "household_head_age": 73,
    "household_size": 4,
    "region": "Oregon",
    "education_level": "Secondary education",
    "employment_status": "Employed part-time",
    "annual_income": 33955,
    "income_sources": [
      "other",
      "Investments / Dividends",
      "Business income"
    ],
    "income_sources-Comment": "Capital gains"
  },
  {
    "household_head_age": 25,
    "household_size": 1,
    "region": "Nevada",
    "education_level": "Primary education",
    "employment_status": "Employed full-time",
    "annual_income": 144993,
    "income_sources": [
      "Pension / Retirement"
    ]
  },
  {
    "household_head_age": 46,
    "household_size": 4,
    "region": "Utah",
    "education_level": "Master's degree or higher",
    "employment_status": "Retired",
    "annual_income": 49839,
    "income_sources": [
      "Business income",
      "other"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 20,
    "household_size": 7,
    "region": "Oregon",
    "education_level": "Bachelor's degree",
    "employment_status": "Self-employed",
    "annual_income": 102059,
    "income_sources": [
      "Salary / Wages"
    ]
  },
  {
    "household_head_age": 81,
    "household_size": 4,
    "region": "Illinois",
    "education_level": "No formal education",
    "employment_status": "Employed part-time",
    "annual_income": 118933,
    "income_sources": [
      "other"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 29,
    "household_size": 3,
    "region": "Maryland",
    "education_level": "Bachelor's degree",
    "employment_status": "Retired",
    "annual_income": 110535,
    "income_sources": [
      "Pension / Retirement"
    ]
  },
  {
    "household_head_age": 30,
    "household_size": 2,
    "region": "Connecticut",
    "education_level": "No formal education",
    "employment_status": "Self-employed",
    "annual_income": 48908,
    "income_sources": [
      "Government assistance",
      "Business income"
    ]
  },
  {
    "household_head_age": 84,
    "household_size": 6,
    "region": "Tennessee",
    "education_level": "Bachelor's degree",
    "employment_status": "Self-employed",
    "annual_income": 68780,
    "income_sources": [
      "Salary / Wages",
      "other",
      "Business income"
    ],
    "income_sources-Comment": "Royalties"
  },
  {
    "household_head_age": 79,
    "household_size": 4,
    "region": "Virginia",
    "education_level": "No formal education",
    "employment_status": "Unemployed",
    "annual_income": 20118,
    "income_sources": [
      "Business income",
      "Government assistance",
      "Investments / Dividends"
    ]
  },
  {
    "household_head_age": 39,
    "household_size": 4,
    "region": "Maryland",
    "education_level": "Secondary education",
    "employment_status": "Employed full-time",
    "annual_income": 124043,
    "income_sources": [
      "Salary / Wages"
    ]
  },
  {
    "household_head_age": 52,
    "household_size": 5,
    "region": "Alaska",
    "education_level": "Bachelor's degree",
    "employment_status": "Retired",
    "annual_income": 126593,
    "income_sources": [
      "Investments / Dividends"
    ]
  },
  {
    "household_head_age": 40,
    "household_size": 2,
    "region": "South Carolina",
    "education_level": "No formal education",
    "employment_status": "Employed full-time",
    "annual_income": 175551,
    "income_sources": [
      "Government assistance",
      "Business income"
    ]
  },
  {
    "household_head_age": 79,
    "household_size": 3,
    "region": "Illinois",
    "education_level": "Secondary education",
    "employment_status": "Self-employed",
    "annual_income": 69519,
    "income_sources": [
      "Government assistance"
    ]
  },
  {
    "household_head_age": 26,
    "household_size": 1,
    "region": "Wyoming",
    "education_level": "Bachelor's degree",
    "employment_status": "Unemployed",
    "annual_income": 34760,
    "income_sources": [
      "Investments / Dividends",
      "Government assistance"
    ]
  },
  {
    "household_head_age": 31,
    "household_size": 2,
    "region": "Montana",
    "education_level": "Bachelor's degree",
    "employment_status": "Retired",
    "annual_income": 100332,
    "income_sources": [
      "Investments / Dividends"
    ]
  },
  {
    "household_head_age": 21,
    "household_size": 7,
    "region": "Hawaii",
    "education_level": "Secondary education",
    "employment_status": "Employed part-time",
    "annual_income": 199485,
    "income_sources": [
      "Government assistance",
      "Business income"
    ]
  },
  {
    "household_head_age": 54,
    "household_size": 4,
    "region": "North Carolina",
    "education_level": "Bachelor's degree",
    "employment_status": "Unemployed",
    "annual_income": 96045,
    "income_sources": [
      "other"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 75,
    "household_size": 2,
    "region": "Pennsylvania",
    "education_level": "No formal education",
    "employment_status": "Employed full-time",
    "annual_income": 191024,
    "income_sources": [
      "Government assistance"
    ]
  },
  {
    "household_head_age": 35,
    "household_size": 5,
    "region": "Indiana",
    "education_level": "Bachelor's degree",
    "employment_status": "Employed part-time",
    "annual_income": 61400,
    "income_sources": [
      "Salary / Wages",
      "other",
      "Business income"
    ],
    "income_sources-Comment": "Royalties"
  },
  {
    "household_head_age": 50,
    "household_size": 8,
    "region": "Missouri",
    "education_level": "Bachelor's degree",
    "employment_status": "Self-employed",
    "annual_income": 52082,
    "income_sources": [
      "Business income",
      "Pension / Retirement",
      "Salary / Wages"
    ]
  },
  {
    "household_head_age": 45,
    "household_size": 4,
    "region": "Wyoming",
    "education_level": "Primary education",
    "employment_status": "Unemployed",
    "annual_income": 75507,
    "income_sources": [
      "Salary / Wages"
    ]
  },
  {
    "household_head_age": 76,
    "household_size": 2,
    "region": "Missouri",
    "education_level": "Secondary education",
    "employment_status": "Retired",
    "annual_income": 90392,
    "income_sources": [
      "Pension / Retirement",
      "Government assistance",
      "other"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 53,
    "household_size": 6,
    "region": "New York",
    "education_level": "Secondary education",
    "employment_status": "Retired",
    "annual_income": 185922,
    "income_sources": [
      "other",
      "Business income",
      "Salary / Wages"
    ],
    "income_sources-Comment": "Scholarships / stipends"
  },
  {
    "household_head_age": 75,
    "household_size": 8,
    "region": "Kentucky",
    "education_level": "No formal education",
    "employment_status": "Unemployed",
    "annual_income": 104055,
    "income_sources": [
      "other",
      "Investments / Dividends",
      "Government assistance"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 52,
    "household_size": 7,
    "region": "Idaho",
    "education_level": "Primary education",
    "employment_status": "Employed part-time",
    "annual_income": 142592,
    "income_sources": [
      "Pension / Retirement",
      "Business income"
    ]
  },
  {
    "household_head_age": 27,
    "household_size": 8,
    "region": "North Dakota",
    "education_level": "Secondary education",
    "employment_status": "Retired",
    "annual_income": 109247,
    "income_sources": [
      "Government assistance"
    ]
  },
  {
    "household_head_age": 72,
    "household_size": 5,
    "region": "Kentucky",
    "education_level": "No formal education",
    "employment_status": "Employed full-time",
    "annual_income": 174444,
    "income_sources": [
      "other",
      "Pension / Retirement"
    ],
    "income_sources-Comment": "Agricultural / farming income"
  },
  {
    "household_head_age": 33,
    "household_size": 7,
    "region": "Michigan",
    "education_level": "Primary education",
    "employment_status": "Employed full-time",
    "annual_income": 193752,
    "income_sources": [
      "Salary / Wages"
    ]
  },
  {
    "household_head_age": 65,
    "household_size": 7,
    "region": "Indiana",
    "education_level": "Bachelor's degree",
    "employment_status": "Unemployed",
    "annual_income": 92578,
    "income_sources": [
      "Investments / Dividends",
      "Salary / Wages",
      "other"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 75,
    "household_size": 1,
    "region": "Alabama",
    "education_level": "No formal education",
    "employment_status": "Employed part-time",
    "annual_income": 143485,
    "income_sources": [
      "Government assistance"
    ]
  },
  {
    "household_head_age": 46,
    "household_size": 8,
    "region": "Florida",
    "education_level": "Primary education",
    "employment_status": "Self-employed",
    "annual_income": 139901,
    "income_sources": [
      "Salary / Wages"
    ]
  },
  {
    "household_head_age": 76,
    "household_size": 1,
    "region": "Alaska",
    "education_level": "Secondary education",
    "employment_status": "Unemployed",
    "annual_income": 150903,
    "income_sources": [
      "Pension / Retirement"
    ]
  },
  {
    "household_head_age": 40,
    "household_size": 7,
    "region": "North Carolina",
    "education_level": "Bachelor's degree",
    "employment_status": "Employed full-time",
    "annual_income": 38558,
    "income_sources": [
      "Investments / Dividends"
    ]
  },
  {
    "household_head_age": 64,
    "household_size": 2,
    "region": "Alaska",
    "education_level": "No formal education",
    "employment_status": "Employed full-time",
    "annual_income": 97138,
    "income_sources": [
      "other",
      "Investments / Dividends"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 83,
    "household_size": 7,
    "region": "Colorado",
    "education_level": "Primary education",
    "employment_status": "Retired",
    "annual_income": 26982,
    "income_sources": [
      "Salary / Wages",
      "Business income"
    ]
  },
  {
    "household_head_age": 40,
    "household_size": 8,
    "region": "Ohio",
    "education_level": "Bachelor's degree",
    "employment_status": "Self-employed",
    "annual_income": 177414,
    "income_sources": [
      "Investments / Dividends",
      "Pension / Retirement",
      "Business income"
    ]
  },
  {
    "household_head_age": 78,
    "household_size": 8,
    "region": "West Virginia",
    "education_level": "Primary education",
    "employment_status": "Retired",
    "annual_income": 65204,
    "income_sources": [
      "other",
      "Salary / Wages",
      "Pension / Retirement"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 48,
    "household_size": 8,
    "region": "Massachusetts",
    "education_level": "No formal education",
    "employment_status": "Retired",
    "annual_income": 91062,
    "income_sources": [
      "Salary / Wages",
      "Government assistance",
      "Business income"
    ]
  },
  {
    "household_head_age": 52,
    "household_size": 2,
    "region": "Oklahoma",
    "education_level": "Secondary education",
    "employment_status": "Self-employed",
    "annual_income": 66033,
    "income_sources": [
      "Business income",
      "other",
      "Pension / Retirement"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 41,
    "household_size": 1,
    "region": "Pennsylvania",
    "education_level": "Bachelor's degree",
    "employment_status": "Retired",
    "annual_income": 175730,
    "income_sources": [
      "Salary / Wages",
      "Business income"
    ]
  },
  {
    "household_head_age": 57,
    "household_size": 2,
    "region": "North Carolina",
    "education_level": "Primary education",
    "employment_status": "Unemployed",
    "annual_income": 46744,
    "income_sources": [
      "Investments / Dividends",
      "Government assistance"
    ]
  },
  {
    "household_head_age": 31,
    "household_size": 5,
    "region": "New Hampshire",
    "education_level": "Primary education",
    "employment_status": "Self-employed",
    "annual_income": 145655,
    "income_sources": [
      "Salary / Wages",
      "other",
      "Government assistance"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 22,
    "household_size": 6,
    "region": "Connecticut",
    "education_level": "Primary education",
    "employment_status": "Retired",
    "annual_income": 20157,
    "income_sources": [
      "Salary / Wages",
      "other",
      "Business income"
    ],
    "income_sources-Comment": "Freelance gigs"
  },
  {
    "household_head_age": 70,
    "household_size": 4,
    "region": "Vermont",
    "education_level": "Bachelor's degree",
    "employment_status": "Employed part-time",
    "annual_income": 106633,
    "income_sources": [
      "Pension / Retirement"
    ]
  },
  {
    "household_head_age": 41,
    "household_size": 4,
    "region": "Kentucky",
    "education_level": "Master's degree or higher",
    "employment_status": "Retired",
    "annual_income": 40600,
    "income_sources": [
      "Government assistance"
    ]
  }
];

var survey = new Survey.SurveyModel(json);

const vizPanel = new SurveyAnalyticsApexcharts.Dashboard({
  data: dataFromServer,
  visualizers: [{
    type: "pivot",
    questions: survey.getAllQuestions(),
    // maxSeriesCount: 2
  //   categoryField: "question2",
  //   seriesFields: ["question1", "question3"]
  }],
  legendPosition: "top",
});
vizPanel.render(document.getElementById("summaryContainer"));

