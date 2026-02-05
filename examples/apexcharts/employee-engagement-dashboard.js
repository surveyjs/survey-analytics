const json = {
  "title": "Employee Engagement Survey",
  "description": "Your feedback helps us improve workplace culture, productivity, and overall employee satisfaction.",
  "completedHtml": "<h3>Thank you for your feedback!</h3><p>Your responses have been recorded.</p>",
  "pages": [
    {
      "name": "page_job_satisfaction",
      "title": "Job Satisfaction",
      "elements": [
        {
          "type": "rating",
          "name": "overall_satisfaction",
          "title": "Overall, how satisfied are you with your job?",
          "minRateDescription": "Very dissatisfied",
          "maxRateDescription": "Very satisfied"
        },
        {
          "type": "rating",
          "name": "role_clarity",
          "title": "How clear are you about what is expected from your role?",
          "minRateDescription": "Not clear",
          "maxRateDescription": "Very clear"
        },
        {
          "type": "comment",
          "name": "job_satisfaction_comments",
          "title": "What is the one thing that would most improve your job satisfaction?"
        }
      ]
    },
    {
      "name": "page_work_environment",
      "title": "Work Environment",
      "elements": [
        {
          "type": "rating",
          "name": "work_life_balance",
          "title": "How would you rate your work–life balance?",
          "minRateDescription": "Poor",
          "maxRateDescription": "Excellent"
        },
        {
          "type": "matrix",
          "name": "environment_ratings",
          "title": "Please rate the following aspects:",
          "columns": [
            {
              "value": 1,
              "text": "Strongly disagree"
            },
            {
              "value": 2,
              "text": "Disagree"
            },
            {
              "value": 3,
              "text": "Neutral"
            },
            {
              "value": 4,
              "text": "Agree"
            },
            {
              "value": 5,
              "text": "Strongly agree"
            }
          ],
          "rows": [
            {
              "value": "safe_environment",
              "text": "I feel physically safe at work."
            },
            {
              "value": "respectful_culture",
              "text": "People treat each other with respect."
            },
            {
              "value": "tools_and_resources",
              "text": "I have the tools and resources I need to work effectively."
            }
          ]
        }
      ]
    },
    {
      "name": "page_management",
      "title": "Leadership & Management",
      "elements": [
        {
          "type": "matrix",
          "name": "leadership_effectiveness",
          "title": "Please rate your agreement with the following statements:",
          "columns": [
            {
              "value": 1,
              "text": "Strongly disagree"
            },
            {
              "value": 2,
              "text": "Disagree"
            },
            {
              "value": 3,
              "text": "Neutral"
            },
            {
              "value": 4,
              "text": "Agree"
            },
            {
              "value": 5,
              "text": "Strongly agree"
            }
          ],
          "rows": [
            {
              "value": "feedback_quality",
              "text": "I receive helpful feedback from my manager."
            },
            {
              "value": "manager_support",
              "text": "My manager supports my professional growth."
            },
            {
              "value": "communication",
              "text": "Leadership communicates effectively."
            },
            {
              "value": "trust",
              "text": "I trust my manager."
            }
          ]
        },
        {
          "type": "comment",
          "name": "management_comments",
          "title": "Do you have any suggestions for management?"
        }
      ]
    },
    {
      "name": "page_growth_recognition",
      "title": "Growth, Development & Recognition",
      "elements": [
        {
          "type": "rating",
          "name": "recognition",
          "title": "How satisfied are you with the recognition you receive for your work?",
          "minRateDescription": "Not satisfied",
          "maxRateDescription": "Very satisfied"
        },
        {
          "type": "rating",
          "name": "career_growth",
          "title": "How confident are you in your opportunities for career growth?",
          "minRateDescription": "Not confident",
          "maxRateDescription": "Very confident"
        },
        {
          "type": "checkbox",
          "name": "development_programs",
          "title": "Which professional development opportunities would you be interested in?",
          "choices": [
            "Training programs",
            "Mentorship",
            "Leadership workshops",
            "Cross-team projects",
            "Skill certification programs"
          ]
        }
      ]
    },
    {
      "name": "page_final",
      "title": "Final Thoughts",
      "elements": [
        {
          "type": "comment",
          "name": "anything_else",
          "title": "Is there anything else you would like to share?"
        }
      ]
    }
  ]
};
var survey = new Survey.SurveyModel(json);

const data = [
  {
    "overall_satisfaction": 4,
    "role_clarity": 2,
    "job_satisfaction_comments": "Better communication is needed.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 5,
      "tools_and_resources": 1
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 4,
      "communication": 1,
      "trust": 2
    },
    "recognition": 3,
    "career_growth": 5,
    "development_programs": [
      "Mentorship",
      "Cross-team projects"
    ],
    "management_comments": "Workload can be heavy at times.",
    "anything_else": "Better communication is needed."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 2,
    "job_satisfaction_comments": "Could use more support from management.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 3,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 5,
      "communication": 2,
      "trust": 1
    },
    "recognition": 1,
    "career_growth": 3,
    "development_programs": [
      "Training programs",
      "Leadership workshops",
      "Skill certification programs"
    ],
    "management_comments": "I enjoy the team and the projects.",
    "anything_else": "I enjoy the team and the projects."
  },
  {
    "overall_satisfaction": 1,
    "role_clarity": 5,
    "job_satisfaction_comments": "",
    "work_life_balance": 5,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 3,
      "tools_and_resources": 1
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 3,
      "communication": 5,
      "trust": 3
    },
    "recognition": 4,
    "career_growth": 4,
    "development_programs": [],
    "management_comments": "Everything is going well.",
    "anything_else": "Better communication is needed."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 3,
    "job_satisfaction_comments": "Could use more support from management.",
    "work_life_balance": 4,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 5,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 1,
      "manager_support": 3,
      "communication": 5,
      "trust": 3
    },
    "recognition": 5,
    "career_growth": 1,
    "development_programs": [
      "Skill certification programs",
      "Training programs",
      "Cross-team projects"
    ],
    "management_comments": "Better communication is needed.",
    "anything_else": "I enjoy the team and the projects."
  },
  {
    "overall_satisfaction": 1,
    "role_clarity": 1,
    "job_satisfaction_comments": "",
    "work_life_balance": 1,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 3,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 5,
      "communication": 4,
      "trust": 1
    },
    "recognition": 5,
    "career_growth": 4,
    "development_programs": [],
    "management_comments": "",
    "anything_else": "More training opportunities would help."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 3,
    "job_satisfaction_comments": "Would appreciate more flexibility.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 2,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 5,
      "manager_support": 2,
      "communication": 3,
      "trust": 1
    },
    "recognition": 2,
    "career_growth": 4,
    "development_programs": [
      "Leadership workshops",
      "Mentorship"
    ],
    "management_comments": "I enjoy the team and the projects.",
    "anything_else": "More training opportunities would help."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 3,
    "job_satisfaction_comments": "Would appreciate more flexibility.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 4,
      "tools_and_resources": 4
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 2,
      "communication": 4,
      "trust": 2
    },
    "recognition": 2,
    "career_growth": 5,
    "development_programs": [
      "Skill certification programs"
    ],
    "management_comments": "More training opportunities would help.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 1,
    "role_clarity": 2,
    "job_satisfaction_comments": "Everything is going well.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 5,
      "respectful_culture": 5,
      "tools_and_resources": 4
    },
    "leadership_effectiveness": {
      "feedback_quality": 1,
      "manager_support": 5,
      "communication": 4,
      "trust": 5
    },
    "recognition": 1,
    "career_growth": 4,
    "development_programs": [
      "Leadership workshops"
    ],
    "management_comments": "Workload can be heavy at times.",
    "anything_else": "Workload can be heavy at times."
  },
  {
    "overall_satisfaction": 1,
    "role_clarity": 1,
    "job_satisfaction_comments": "Better communication is needed.",
    "work_life_balance": 5,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 3,
      "tools_and_resources": 1
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 2,
      "communication": 1,
      "trust": 1
    },
    "recognition": 1,
    "career_growth": 1,
    "development_programs": [
      "Leadership workshops",
      "Skill certification programs",
      "Mentorship"
    ],
    "management_comments": "Could use more support from management.",
    "anything_else": "More training opportunities would help."
  },
  {
    "overall_satisfaction": 3,
    "role_clarity": 4,
    "job_satisfaction_comments": "I enjoy the team and the projects.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 1,
      "respectful_culture": 2,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 5,
      "communication": 4,
      "trust": 4
    },
    "recognition": 3,
    "career_growth": 2,
    "development_programs": [
      "Cross-team projects",
      "Skill certification programs",
      "Training programs"
    ],
    "management_comments": "Better communication is needed.",
    "anything_else": "I enjoy the team and the projects."
  },
  {
    "overall_satisfaction": 5,
    "role_clarity": 3,
    "job_satisfaction_comments": "Would appreciate more flexibility.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 4,
      "respectful_culture": 1,
      "tools_and_resources": 4
    },
    "leadership_effectiveness": {
      "feedback_quality": 1,
      "manager_support": 2,
      "communication": 3,
      "trust": 3
    },
    "recognition": 1,
    "career_growth": 3,
    "development_programs": [
      "Leadership workshops",
      "Cross-team projects"
    ],
    "management_comments": "Everything is going well.",
    "anything_else": "Would appreciate more flexibility."
  },
  {
    "overall_satisfaction": 3,
    "role_clarity": 3,
    "job_satisfaction_comments": "I enjoy the team and the projects.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 5,
      "tools_and_resources": 3
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 3,
      "communication": 2,
      "trust": 3
    },
    "recognition": 5,
    "career_growth": 3,
    "development_programs": [],
    "management_comments": "",
    "anything_else": ""
  },
  {
    "overall_satisfaction": 3,
    "role_clarity": 3,
    "job_satisfaction_comments": "Would appreciate more flexibility.",
    "work_life_balance": 5,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 4,
      "tools_and_resources": 3
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 1,
      "communication": 2,
      "trust": 1
    },
    "recognition": 3,
    "career_growth": 3,
    "development_programs": [
      "Mentorship",
      "Training programs",
      "Skill certification programs"
    ],
    "management_comments": "Would appreciate more flexibility.",
    "anything_else": "More training opportunities would help."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 5,
    "job_satisfaction_comments": "Better communication is needed.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 4,
      "respectful_culture": 4,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 1,
      "communication": 4,
      "trust": 3
    },
    "recognition": 2,
    "career_growth": 2,
    "development_programs": [],
    "management_comments": "Workload can be heavy at times.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 2,
    "job_satisfaction_comments": "Workload can be heavy at times.",
    "work_life_balance": 1,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 1,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 1,
      "communication": 1,
      "trust": 4
    },
    "recognition": 4,
    "career_growth": 1,
    "development_programs": [],
    "management_comments": "Everything is going well.",
    "anything_else": "Would appreciate more flexibility."
  },
  {
    "overall_satisfaction": 1,
    "role_clarity": 4,
    "job_satisfaction_comments": "Would appreciate more flexibility.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 5,
      "respectful_culture": 4,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 4,
      "communication": 3,
      "trust": 3
    },
    "recognition": 2,
    "career_growth": 3,
    "development_programs": [
      "Cross-team projects",
      "Training programs"
    ],
    "management_comments": "Would appreciate more flexibility.",
    "anything_else": "Workload can be heavy at times."
  },
  {
    "overall_satisfaction": 3,
    "role_clarity": 3,
    "job_satisfaction_comments": "",
    "work_life_balance": 5,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 4,
      "tools_and_resources": 4
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 5,
      "communication": 4,
      "trust": 1
    },
    "recognition": 2,
    "career_growth": 4,
    "development_programs": [
      "Cross-team projects",
      "Mentorship",
      "Skill certification programs"
    ],
    "management_comments": "Everything is going well.",
    "anything_else": "Everything is going well."
  },
  {
    "overall_satisfaction": 5,
    "role_clarity": 4,
    "job_satisfaction_comments": "Could use more support from management.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 1,
      "respectful_culture": 3,
      "tools_and_resources": 4
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 4,
      "communication": 5,
      "trust": 5
    },
    "recognition": 3,
    "career_growth": 2,
    "development_programs": [
      "Cross-team projects",
      "Training programs"
    ],
    "management_comments": "Better communication is needed.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 2,
    "job_satisfaction_comments": "I enjoy the team and the projects.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 5,
      "respectful_culture": 1,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 5,
      "manager_support": 2,
      "communication": 2,
      "trust": 2
    },
    "recognition": 5,
    "career_growth": 2,
    "development_programs": [],
    "management_comments": "More training opportunities would help.",
    "anything_else": "I enjoy the team and the projects."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 5,
    "job_satisfaction_comments": "Could use more support from management.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 5,
      "respectful_culture": 4,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 3,
      "communication": 1,
      "trust": 4
    },
    "recognition": 3,
    "career_growth": 4,
    "development_programs": [
      "Skill certification programs",
      "Leadership workshops"
    ],
    "management_comments": "Could use more support from management.",
    "anything_else": "Everything is going well."
  },
  {
    "overall_satisfaction": 3,
    "role_clarity": 4,
    "job_satisfaction_comments": "I enjoy the team and the projects.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 2,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 2,
      "communication": 2,
      "trust": 2
    },
    "recognition": 4,
    "career_growth": 3,
    "development_programs": [],
    "management_comments": "",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 2,
    "job_satisfaction_comments": "More training opportunities would help.",
    "work_life_balance": 4,
    "environment_ratings": {
      "safe_environment": 1,
      "respectful_culture": 2,
      "tools_and_resources": 1
    },
    "leadership_effectiveness": {
      "feedback_quality": 1,
      "manager_support": 4,
      "communication": 2,
      "trust": 5
    },
    "recognition": 3,
    "career_growth": 3,
    "development_programs": [
      "Skill certification programs",
      "Mentorship",
      "Leadership workshops"
    ],
    "management_comments": "Would appreciate more flexibility.",
    "anything_else": "Workload can be heavy at times."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 2,
    "job_satisfaction_comments": "I enjoy the team and the projects.",
    "work_life_balance": 1,
    "environment_ratings": {
      "safe_environment": 5,
      "respectful_culture": 5,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 5,
      "communication": 1,
      "trust": 5
    },
    "recognition": 4,
    "career_growth": 4,
    "development_programs": [
      "Skill certification programs"
    ],
    "management_comments": "More training opportunities would help.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 3,
    "job_satisfaction_comments": "",
    "work_life_balance": 5,
    "environment_ratings": {
      "safe_environment": 1,
      "respectful_culture": 1,
      "tools_and_resources": 4
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 5,
      "communication": 5,
      "trust": 3
    },
    "recognition": 4,
    "career_growth": 2,
    "development_programs": [
      "Training programs",
      "Leadership workshops",
      "Cross-team projects"
    ],
    "management_comments": "Could use more support from management.",
    "anything_else": "Would appreciate more flexibility."
  },
  {
    "overall_satisfaction": 3,
    "role_clarity": 4,
    "job_satisfaction_comments": "Workload can be heavy at times.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 1,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 4,
      "communication": 5,
      "trust": 3
    },
    "recognition": 1,
    "career_growth": 3,
    "development_programs": [
      "Mentorship",
      "Training programs"
    ],
    "management_comments": "Would appreciate more flexibility.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 4,
    "job_satisfaction_comments": "More training opportunities would help.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 1,
      "respectful_culture": 4,
      "tools_and_resources": 1
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 3,
      "communication": 3,
      "trust": 1
    },
    "recognition": 3,
    "career_growth": 2,
    "development_programs": [],
    "management_comments": "Could use more support from management.",
    "anything_else": "I enjoy the team and the projects."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 1,
    "job_satisfaction_comments": "Could use more support from management.",
    "work_life_balance": 1,
    "environment_ratings": {
      "safe_environment": 5,
      "respectful_culture": 4,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 5,
      "manager_support": 4,
      "communication": 5,
      "trust": 5
    },
    "recognition": 4,
    "career_growth": 1,
    "development_programs": [
      "Mentorship",
      "Training programs",
      "Cross-team projects"
    ],
    "management_comments": "",
    "anything_else": "Everything is going well."
  },
  {
    "overall_satisfaction": 1,
    "role_clarity": 1,
    "job_satisfaction_comments": "I enjoy the team and the projects.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 4,
      "respectful_culture": 1,
      "tools_and_resources": 1
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 3,
      "communication": 2,
      "trust": 4
    },
    "recognition": 3,
    "career_growth": 5,
    "development_programs": [],
    "management_comments": "Could use more support from management.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 4,
    "job_satisfaction_comments": "Workload can be heavy at times.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 5,
      "respectful_culture": 5,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 5,
      "manager_support": 1,
      "communication": 4,
      "trust": 5
    },
    "recognition": 4,
    "career_growth": 4,
    "development_programs": [
      "Leadership workshops",
      "Mentorship",
      "Cross-team projects"
    ],
    "management_comments": "I enjoy the team and the projects.",
    "anything_else": "I enjoy the team and the projects."
  },
  {
    "overall_satisfaction": 5,
    "role_clarity": 1,
    "job_satisfaction_comments": "Better communication is needed.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 5,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 1,
      "manager_support": 4,
      "communication": 5,
      "trust": 3
    },
    "recognition": 4,
    "career_growth": 3,
    "development_programs": [
      "Cross-team projects",
      "Training programs",
      "Mentorship"
    ],
    "management_comments": "Better communication is needed.",
    "anything_else": "More training opportunities would help."
  },
  {
    "overall_satisfaction": 5,
    "role_clarity": 3,
    "job_satisfaction_comments": "Could use more support from management.",
    "work_life_balance": 4,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 3,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 4,
      "communication": 3,
      "trust": 3
    },
    "recognition": 1,
    "career_growth": 5,
    "development_programs": [
      "Training programs"
    ],
    "management_comments": "More training opportunities would help.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 3,
    "job_satisfaction_comments": "I enjoy the team and the projects.",
    "work_life_balance": 1,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 2,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 3,
      "communication": 2,
      "trust": 4
    },
    "recognition": 3,
    "career_growth": 3,
    "development_programs": [],
    "management_comments": "Would appreciate more flexibility.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 1,
    "role_clarity": 5,
    "job_satisfaction_comments": "More training opportunities would help.",
    "work_life_balance": 5,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 5,
      "tools_and_resources": 4
    },
    "leadership_effectiveness": {
      "feedback_quality": 1,
      "manager_support": 4,
      "communication": 3,
      "trust": 5
    },
    "recognition": 2,
    "career_growth": 1,
    "development_programs": [
      "Cross-team projects"
    ],
    "management_comments": "Better communication is needed.",
    "anything_else": "I enjoy the team and the projects."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 1,
    "job_satisfaction_comments": "I enjoy the team and the projects.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 4,
      "respectful_culture": 4,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 5,
      "communication": 1,
      "trust": 3
    },
    "recognition": 5,
    "career_growth": 1,
    "development_programs": [
      "Mentorship",
      "Cross-team projects"
    ],
    "management_comments": "I enjoy the team and the projects.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 4,
    "job_satisfaction_comments": "Workload can be heavy at times.",
    "work_life_balance": 1,
    "environment_ratings": {
      "safe_environment": 1,
      "respectful_culture": 3,
      "tools_and_resources": 3
    },
    "leadership_effectiveness": {
      "feedback_quality": 1,
      "manager_support": 3,
      "communication": 1,
      "trust": 3
    },
    "recognition": 2,
    "career_growth": 2,
    "development_programs": [
      "Mentorship",
      "Cross-team projects"
    ],
    "management_comments": "Everything is going well.",
    "anything_else": ""
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 5,
    "job_satisfaction_comments": "Would appreciate more flexibility.",
    "work_life_balance": 4,
    "environment_ratings": {
      "safe_environment": 4,
      "respectful_culture": 5,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 5,
      "manager_support": 4,
      "communication": 4,
      "trust": 1
    },
    "recognition": 2,
    "career_growth": 4,
    "development_programs": [
      "Skill certification programs"
    ],
    "management_comments": "Everything is going well.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 3,
    "job_satisfaction_comments": "Would appreciate more flexibility.",
    "work_life_balance": 4,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 3,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 5,
      "manager_support": 3,
      "communication": 5,
      "trust": 5
    },
    "recognition": 1,
    "career_growth": 3,
    "development_programs": [],
    "management_comments": "Everything is going well.",
    "anything_else": "Better communication is needed."
  },
  {
    "overall_satisfaction": 5,
    "role_clarity": 5,
    "job_satisfaction_comments": "",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 1,
      "respectful_culture": 5,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 4,
      "communication": 5,
      "trust": 4
    },
    "recognition": 2,
    "career_growth": 2,
    "development_programs": [
      "Cross-team projects"
    ],
    "management_comments": "Workload can be heavy at times.",
    "anything_else": "Workload can be heavy at times."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 3,
    "job_satisfaction_comments": "Better communication is needed.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 3,
      "tools_and_resources": 1
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 4,
      "communication": 1,
      "trust": 1
    },
    "recognition": 5,
    "career_growth": 4,
    "development_programs": [
      "Cross-team projects",
      "Mentorship",
      "Skill certification programs"
    ],
    "management_comments": "I enjoy the team and the projects.",
    "anything_else": "Would appreciate more flexibility."
  },
  {
    "overall_satisfaction": 3,
    "role_clarity": 5,
    "job_satisfaction_comments": "I enjoy the team and the projects.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 5,
      "tools_and_resources": 1
    },
    "leadership_effectiveness": {
      "feedback_quality": 1,
      "manager_support": 4,
      "communication": 1,
      "trust": 3
    },
    "recognition": 3,
    "career_growth": 4,
    "development_programs": [
      "Training programs"
    ],
    "management_comments": "",
    "anything_else": "Everything is going well."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 5,
    "job_satisfaction_comments": "",
    "work_life_balance": 1,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 2,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 1,
      "communication": 4,
      "trust": 5
    },
    "recognition": 3,
    "career_growth": 1,
    "development_programs": [
      "Mentorship"
    ],
    "management_comments": "Workload can be heavy at times.",
    "anything_else": "Everything is going well."
  },
  {
    "overall_satisfaction": 5,
    "role_clarity": 1,
    "job_satisfaction_comments": "I enjoy the team and the projects.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 4,
      "respectful_culture": 3,
      "tools_and_resources": 3
    },
    "leadership_effectiveness": {
      "feedback_quality": 4,
      "manager_support": 3,
      "communication": 4,
      "trust": 3
    },
    "recognition": 2,
    "career_growth": 3,
    "development_programs": [
      "Skill certification programs",
      "Leadership workshops"
    ],
    "management_comments": "Better communication is needed.",
    "anything_else": "Would appreciate more flexibility."
  },
  {
    "overall_satisfaction": 3,
    "role_clarity": 2,
    "job_satisfaction_comments": "Could use more support from management.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 1,
      "respectful_culture": 3,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 3,
      "communication": 2,
      "trust": 5
    },
    "recognition": 2,
    "career_growth": 5,
    "development_programs": [
      "Leadership workshops"
    ],
    "management_comments": "Better communication is needed.",
    "anything_else": "I enjoy the team and the projects."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 4,
    "job_satisfaction_comments": "",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 1,
      "respectful_culture": 1,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 5,
      "manager_support": 1,
      "communication": 1,
      "trust": 1
    },
    "recognition": 3,
    "career_growth": 3,
    "development_programs": [
      "Mentorship"
    ],
    "management_comments": "Would appreciate more flexibility.",
    "anything_else": "Could use more support from management."
  },
  {
    "overall_satisfaction": 4,
    "role_clarity": 1,
    "job_satisfaction_comments": "More training opportunities would help.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 4,
      "respectful_culture": 2,
      "tools_and_resources": 3
    },
    "leadership_effectiveness": {
      "feedback_quality": 5,
      "manager_support": 1,
      "communication": 4,
      "trust": 1
    },
    "recognition": 4,
    "career_growth": 3,
    "development_programs": [
      "Leadership workshops"
    ],
    "management_comments": "Workload can be heavy at times.",
    "anything_else": "I enjoy the team and the projects."
  },
  {
    "overall_satisfaction": 1,
    "role_clarity": 3,
    "job_satisfaction_comments": "More training opportunities would help.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 1,
      "respectful_culture": 1,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 2,
      "communication": 5,
      "trust": 5
    },
    "recognition": 2,
    "career_growth": 1,
    "development_programs": [
      "Training programs",
      "Leadership workshops",
      "Cross-team projects"
    ],
    "management_comments": "Workload can be heavy at times.",
    "anything_else": "Everything is going well."
  },
  {
    "overall_satisfaction": 2,
    "role_clarity": 5,
    "job_satisfaction_comments": "Everything is going well.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 2,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 4,
      "communication": 5,
      "trust": 3
    },
    "recognition": 3,
    "career_growth": 3,
    "development_programs": [
      "Training programs",
      "Skill certification programs"
    ],
    "management_comments": "Workload can be heavy at times.",
    "anything_else": "I enjoy the team and the projects."
  },
  {
    "overall_satisfaction": 5,
    "role_clarity": 5,
    "job_satisfaction_comments": "Would appreciate more flexibility.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 3,
      "tools_and_resources": 5
    },
    "leadership_effectiveness": {
      "feedback_quality": 3,
      "manager_support": 4,
      "communication": 1,
      "trust": 2
    },
    "recognition": 1,
    "career_growth": 5,
    "development_programs": [],
    "management_comments": "Would appreciate more flexibility.",
    "anything_else": "Better communication is needed."
  },
  {
    "overall_satisfaction": 1,
    "role_clarity": 4,
    "job_satisfaction_comments": "Workload can be heavy at times.",
    "work_life_balance": 2,
    "environment_ratings": {
      "safe_environment": 2,
      "respectful_culture": 5,
      "tools_and_resources": 4
    },
    "leadership_effectiveness": {
      "feedback_quality": 2,
      "manager_support": 2,
      "communication": 1,
      "trust": 4
    },
    "recognition": 5,
    "career_growth": 2,
    "development_programs": [
      "Cross-team projects"
    ],
    "management_comments": "Everything is going well.",
    "anything_else": "Better communication is needed."
  },
  {
    "overall_satisfaction": 5,
    "role_clarity": 2,
    "job_satisfaction_comments": "Better communication is needed.",
    "work_life_balance": 3,
    "environment_ratings": {
      "safe_environment": 3,
      "respectful_culture": 3,
      "tools_and_resources": 2
    },
    "leadership_effectiveness": {
      "feedback_quality": 5,
      "manager_support": 5,
      "communication": 3,
      "trust": 5
    },
    "recognition": 4,
    "career_growth": 3,
    "development_programs": [
      "Skill certification programs"
    ],
    "management_comments": "More training opportunities would help.",
    "anything_else": "Could use more support from management."
  }
];

var dashboard = new SurveyAnalyticsApexcharts.Dashboard({
      questions: survey.getAllQuestions(),
      data: data,
      showToolbar: false,
      dateFieldName: "timestamp",
      visualizers: [
          {
              dataField: "overall_satisfaction",
              type: "gauge"
          },
          {
              dataField: "recognition",
              type: "gauge"
          },
          {
              type: "bar",
              dataField: "role_clarity",
              answersOrder: "desc"
          },
          // "role_clarity",
          "work_life_balance",
          {
              dataField: "environment_ratings",
              type: "stackedbar",
              legendPosition: "bottom"
          },
          {
              dataField: "leadership_effectiveness",
              type: "stackedbar",
              legendPosition: "bottom"
          },
          "career_growth",
          "development_programs",
          "job_satisfaction_comments",
          "management_comments",
          "anything_else"
      ]
  }
);

dashboard.render(document.getElementById("summaryContainer"));
