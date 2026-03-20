
// var json = JSON.parse(jsonStr);
var json = {
    "title": "Years of Change: How University Life Shapes Student Diet and Activity",
    "pages": [
        {
            "name": "consent",
            "title": "Informed Consent Form",
            "elements": [
                {
                    "type": "html",
                    "name": "consent_text",
                    "visible": false,
                    "html": "<h3>Online   Survey</h3><p><strong>Title of the Study:</strong> Years of Change: How University Life Shapes Student Diet and Activity<br><strong>Principal Investigator:</strong> Prof. Reema Tayyem<br><strong>Institutional Affiliation:</strong> Qatar University<br><strong>College/Department:</strong> College of Health Sciences, Dept of Nutrition Sciences<br><strong>Email:</strong> reema.tayyem@qu.edu.qa<br><strong>Phone:</strong> 44037505</p><p><strong>Purpose and Nature of the Research:</strong> You are invited to take part in a research study that aims to explore how students’ dietary habits, physical activity, and other lifestyle behaviors change during their time at university. This study will help identify trends and challenges faced by students and provide insights for improving student well-being.</p><p><strong>Study Description:</strong> If you agree to participate, you will be asked to complete a one-time questionnaire. The survey will ask about your eating habits, physical activity, stress, sleep, and related lifestyle factors. The survey takes approximately 20–25 minutes to complete and can be done online or in person.</p><p><strong>Inclusion and Exclusion Criteria:</strong><ul><li>You may participate if you are:<br>- An undergraduate student currently enrolled at Qatar University who speaks English.<br>- Aged 18 years or older.</li><li>You will not be eligible to participate if you:<br>- Are not currently enrolled as an undergraduate student at Qatar University and do not speak English.</li></ul></p><p><strong>Number of Participants:</strong> Approximately 500–550 students will be invited to participate in this study.</p><p><strong>Risks and Discomforts:</strong> There are no risks associated with this study. You may feel slightly uncomfortable answering personal questions about your lifestyle habits. You may skip any questions you do not want to answer. Your participation is voluntary and will not affect your academic standing, your grades, or your relationship with your instructors.</p><p><strong>Benefits:</strong> You will not receive any academic benefits or compensation for participating. However, you may gain personal insight into your own lifestyle, and your participation will contribute to improving future student support services.</p><p><strong>Your Rights as a Participant:</strong><ul><li>You may choose to participate or not.</li><li>You may withdraw at any time without giving a reason and without penalty.</li></ul></p><p><strong>Injury and Safety Statement:</strong> This study does not involve any physical procedures or clinical risks. In the unlikely event that any discomfort arises, you may contact the principal investigator or the Qatar University Research Ethics Office.</p><p><strong>Time Commitment and Compensation:</strong> Participation will take approximately 20–25 minutes. There is no monetary or academic compensation.</p><p><strong>Costs:</strong> There are no costs to you for participating in this research.</p><p><strong>Withdrawal Policy:</strong> You may withdraw from the study at any point, without explanation or consequence. Please note that you may withdraw from the study at any time before submitting your responses, without the need to provide any explanation and without any consequences. However, once your responses are submitted, they cannot be withdrawn. This is because all data will be de-identified, and no names or personal identification numbers will be recorded or linked to your answers.</p><p><strong>Results Availability:</strong> Study results may be shared in academic publications or presentations in aggregate (group-level) form. Individual data will remain confidential.</p><p><strong>Fate of Data:</strong> Your responses will be anonymous and used for future studies. Data will be stored securely for up to 5 years.</p><p><strong>Confidentiality:</strong> All data will be kept strictly confidential and anonymous. No identifying information will be collected or published.</p><p><strong>Access to Data:</strong> The research team, QU IRB Office, and MOPH will have access to the data. The results will not be available to the participants.</p><p><strong>Contact Information:</strong><br>Principal Investigator: Prof. Reema Tayyem, Qatar University<br>Email: reema.tayyem@qu.edu.qa, Phone: 44037505<br>Qatar University IRB Office: Email: QU-IRB@qu.edu.qa, Phone: 4403-5307</p><p><strong>Ethical Approval:</strong> This study has been reviewed and approved by the Qatar University Institutional Review Board (IRB), approval number: [Insert IRB #].</p><hr><p><strong>Consent Declaration:</strong><br>By starting to answer the questions, I confirm that:<ul><li>I have read and understood the information provided above.</li><li>I voluntarily agree to participate in this study.</li><li>I can withdraw from the study before submitting my responses.</li></ul></p>"
                },
                {
                    "type": "text",
                    "name": "question1",
                    "title": "Student Assistant Name",
                    "description": "Please enter the name of the student assistant who conducted this survey",
                    "isRequired": true
                },
                {
                    "type": "checkbox",
                    "name": "consent_given",
                    "title": "Please confirm your consent to begin the survey",
                    "isRequired": true,
                    "choices": [
                        "I agree to participate"
                    ]
                }
            ]
        },
        {
            "name": "demographics",
            "title": "Section A: Demographics",
            "elements": [
                {
                    "type": "text",
                    "name": "weight",
                    "title": "Current body weight (kg)",
                    "isRequired": true
                },
                {
                    "type": "text",
                    "name": "height",
                    "title": "Height (cm)",
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "gender",
                    "title": "What is your gender?",
                    "isRequired": true,
                    "choices": [
                        "Male",
                        "Female"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "age_group",
                    "title": "What is your age (in years)?",
                    "isRequired": true,
                    "choices": [
                        "18-20 years",
                        "21-24 years",
                        "25-27 years",
                        "More than 27 years"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "nationality",
                    "title": "What is your nationality?",
                    "isRequired": true,
                    "choices": [
                        "Qatari",
                        "Non‑Qatari"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "academic_year",
                    "title": "Current academic year at university",
                    "isRequired": true,
                    "choices": [
                        "1st",
                        "2nd",
                        "3rd",
                        "4th or higher"
                    ]
                },
                {
                    "type": "dropdown",
                    "name": "college",
                    "title": "College or field of study",
                    "isRequired": true,
                    "choices": [
                        "Arts and Sciences",
                        "Business and Economics",
                        "Education",
                        "Engineering",
                        "Health Sciences",
                        "Law",
                        "Medicine",
                        "Pharmacy",
                        "Sharia and Islamic Studies",
                        "Dental Medicine"
                    ],
                    "showOtherItem": true
                },
                {
                    "type": "text",
                    "name": "department",
                    "title": "Department (if applicable)"
                },
                {
                    "type": "radiogroup",
                    "name": "gpa",
                    "title": "Your GPA",
                    "choices": [
                        "Excellent (3.7 - 4.0)",
                        "Very Good (3.3 - 3.6)",
                        "Good (3.0 - 3.2)",
                        "Average/Acceptable (2.5 - 2.9)",
                        "Below 2.0"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "living_arrangement",
                    "title": "Living arrangement during university",
                    "isRequired": true,
                    "choices": [
                        "With family",
                        "In university dorms",
                        "Off‑campus with roommates",
                        "Alone"
                    ],
                    "showOtherItem": true
                }
            ]
        },
        {
            "name": "dietary",
            "title": "Section B: Dietary Habits",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "diet_before",
                    "title": "Overall diet before joining university",
                    "isRequired": true,
                    "choices": [
                        "Healthy and balanced",
                        "Moderately healthy",
                        "Unhealthy",
                        "I don't know"
                    ]
                },
                {
                    "type": "checkbox",
                    "name": "diet_changes",
                    "title": "How has your diet changed since starting university?",
                    "isRequired": true,
                    "choices": [
                        "I eat more fast food",
                        "I skip more meals",
                        "I eat more late at night",
                        "I cook more at home",
                        "I try to eat healthier",
                        "No change"
                    ],
                    "showOtherItem": true
                },
                {
                    "type": "radiogroup",
                    "name": "full_meals",
                    "title": "How many full meals do you eat per day on average?",
                    "isRequired": true,
                    "choices": [
                        "1",
                        "2",
                        "3",
                        "More than 3"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "snacks_per_day",
                    "title": "How many snacks do you usually eat per day?",
                    "isRequired": true,
                    "choices": [
                        "1",
                        "2",
                        "3",
                        "More than 3"
                    ]
                },
                {
                    "type": "checkbox",
                    "name": "consume_regularly",
                    "title": "Which of the following do you consume regularly?",
                    "isRequired": true,
                    "choices": [
                        "Fruits and vegetables",
                        "Fast food",
                        "Processed snacks",
                        "Soft drinks",
                        "Tea / Coffee",
                        "Energy drinks"
                    ]
                },
                {
                    "type": "checkbox",
                    "name": "eating_reasons",
                    "title": "Main reasons for choosing what to eat (select top 3)",
                    "isRequired": true,
                    "choices": [
                        "Price",
                        "Convenience / Time",
                        "Taste",
                        "Health",
                        "Religious or cultural rules",
                        "Peer influence",
                        "Availability on campus"
                    ],
                    "maxSelectedChoices": 3
                },
                {
                    "type": "radiogroup",
                    "name": "diet_pattern",
                    "title": "Do you follow any specific dietary pattern?",
                    "isRequired": true,
                    "choices": [
                        "None",
                        "Vegetarian",
                        "Ketogenic",
                        "Gluten‑free"
                    ],
                    "showOtherItem": true
                },
                {
                    "type": "text",
                    "name": "skip_breakfast_days",
                    "title": "I skip breakfast ___ days/week",
                    "isRequired": true
                },
                {
                    "type": "text",
                    "name": "home_cooked_days",
                    "title": "I eat home-cooked meals ___ days/week",
                    "isRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "breakfast_frequency",
                    "title": "Do you usually eat breakfast before morning activities?",
                    "isRequired": true,
                    "choices": [
                        "Yes, daily",
                        "Sometimes",
                        "Rarely",
                        "Never"
                    ]
                },
                {
                    "type": "text",
                    "name": "meals_outside_per_week",
                    "title": "How many times per week do you eat meals prepared outside your home?",
                    "isRequired": true,
                    "inputType": "number"
                }
            ]
        },
        {
            "name": "activity_sleep_digital",
            "title": "Sections C, D & E: Activity, Sleep & Digital",
            "elements": [
                {
                    "type": "text",
                    "name": "active_days_per_week",
                    "title": "Days/week with ≥30 min moderate‑vigorous activity",
                    "isRequired": true,
                    "inputType": "number"
                },
                {
                    "type": "checkbox",
                    "name": "activity_types",
                    "title": "Which types of physical activity did you regularly engage in (before starting university)?",
                    "isRequired": true,
                    "choices": [
                        "Walking",
                        "Running",
                        "Gym/ weightlifting",
                        "Gym – cardio",
                        "Team sports",
                        "Yoga/Pilates",
                        "Swimming"
                    ],
                    "showOtherItem": true,
                    "showNoneItem": true
                },
                {
                    "type": "text",
                    "name": "sitting_hours",
                    "title": "Average hours per day sitting",
                    "isRequired": true,
                    "inputType": "number"
                },
                {
                    "type": "radiogroup",
                    "name": "activity_before",
                    "title": "How physically active were you before starting university?",
                    "isRequired": true,
                    "choices": [
                        "Very active",
                        "Moderately active",
                        "Rarely active",
                        "Not active at all"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "activity_now",
                    "title": "How physically active are you now as a university student?",
                    "isRequired": true,
                    "choices": [
                        "More active",
                        "Same",
                        "Less active than before"
                    ]
                },
                {
                    "type": "checkbox",
                    "name": "current_activities",
                    "title": "Which types of physical activity do you regularly engage in now (after joining university)?",
                    "isRequired": true,
                    "choicesFromQuestion": "activity_types",
                    "choices": [
                        "Walking",
                        "Gym workouts",
                        "Sports",
                        "Yoga / stretching",
                        "None"
                    ],
                    "showOtherItem": true,
                    "showNoneItem": true
                },
                {
                    "type": "checkbox",
                    "name": "activity_barriers",
                    "title": "Barriers preventing more activity",
                    "isRequired": true,
                    "choices": [
                        "Lack of time",
                        "Lack of motivation",
                        "Lack of facilities",
                        "Cultural or religious concerns",
                        "Health issues",
                        "Weather conditions",
                        "Not interested in exercise"
                    ],
                    "showOtherItem": true
                },
                {
                    "type": "radiogroup",
                    "name": "sleep_weekday",
                    "title": "How many hours of sleep do you get during the week?",
                    "isRequired": true,
                    "choices": [
                        "Less than 5",
                        "5‑6",
                        "7‑8",
                        "More than 8"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "sleep_weekend",
                    "title": "How many hours of sleep do you get during the weekend?",
                    "isRequired": true,
                    "choices": [
                        "Less than 5",
                        "5‑6",
                        "7‑8",
                        "More than 8"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "sleep_difficulty",
                    "title": "How often do you experience difficulty falling or staying asleep?",
                    "isRequired": true,
                    "choices": [
                        "Never",
                        "Sometimes",
                        "Often",
                        "Always"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "feel_restored",
                    "title": "How often do you feel well-rested when you wake up?",
                    "isRequired": true,
                    "choices": [
                        "Always",
                        "Often",
                        "Sometimes",
                        "Rarely",
                        "Never"
                    ]
                },
                {
                    "type": "text",
                    "name": "screen_hours_nonacademic",
                    "title": "Non‑academic digital device use (hours/day)",
                    "isRequired": true,
                    "inputType": "number"
                },
                {
                    "type": "checkbox",
                    "name": "digital_purposes",
                    "title": "For what reasons do you use digital devices (non‑academic)?",
                    "isRequired": true,
                    "choices": [
                        "Social media",
                        "Video streaming",
                        "Gaming",
                        "Messaging",
                        "Online shopping"
                    ],
                    "showOtherItem": true
                }
            ]
        },
        {
            "name": "mental_substance_impact",
            "title": "Sections F, G & H: Mental Health, Substance Use, Impact",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "stress_frequency",
                    "title": "In the past month, have often have you felt stressed?",
                    "isRequired": true,
                    "choices": [
                        "Never",
                        "Occasionally",
                        "Frequently",
                        "Almost always"
                    ]
                },
                {
                    "type": "checkbox",
                    "name": "stress_sources",
                    "title": "What are your major sources of stress? (Select all that apply)",
                    "isRequired": true,
                    "choices": [
                        "Academic workload",
                        "Financial issues",
                        "Family problems",
                        "Social relationships",
                        "Physical health",
                        "Mental health"
                    ],
                    "showOtherItem": true
                },
                {
                    "type": "checkbox",
                    "name": "stress_management",
                    "title": "Which methods do you use to manage stress?",
                    "isRequired": true,
                    "choices": [
                        "Physical activity",
                        "Meditation/Prayer",
                        "Talking to friends/family",
                        "Counseling/Therapy",
                        "Engaging in hobbies",
                        "I do not use any method"
                    ],
                    "showOtherItem": true
                },
                {
                    "type": "radiogroup",
                    "name": "smoke_cig",
                    "title": "Do you smoke cigarettes?",
                    "isRequired": true,
                    "choices": [
                        "No",
                        "Occasionally",
                        "Daily",
                        "Weekly"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "smoke_vape",
                    "title": "Do you use electronic cigarettes or vape devices?",
                    "isRequired": true,
                    "choices": [
                        "No",
                        "Occasionally",
                        "Daily",
                        "Weekly"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "use_shisha",
                    "title": "Do you use Shisha (Hookah)?",
                    "isRequired": true,
                    "choices": [
                        "No",
                        "Occasionally",
                        "Daily",
                        "Weekly"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "caffeine_use",
                    "title": "How often consume caffeinated beverages?",
                    "isRequired": true,
                    "choices": [
                        "Never",
                        {
                            "value": "More than 5 cups/day",
                            "text": "Occasionally"
                        },
                        "1–2 cups/day",
                        "3–4 cups/day",
                        "More than 4 cups/day"
                    ]
                },
                {
                    "type": "checkbox",
                    "name": "university_stress_effect",
                    "title": "How does university stress affect your eating habits and/ or physical activity?",
                    "isRequired": true,
                    "choices": [
                        "I eat more when stressed",
                        "I eat less when stressed",
                        "I stop exercising when stressed",
                        "No noticeable effect"
                    ],
                    "showOtherItem": true
                },
                {
                    "type": "radiogroup",
                    "name": "uni_support_programs",
                    "title": "Does the university offer any services or facilities that support a healthy lifestyle (e.g., gym, healthy food options, counseling)?",
                    "isRequired": true,
                    "choices": [
                        "Yes - and I use them",
                        "Yes - but I don’t use them",
                        "No / Not sure"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "uni_encouragement",
                    "title": "Do you think university life makes it easier or harder to maintain healthy habits?",
                    "isRequired": true,
                    "choices": [
                        "Easier – it supports healthy habits",
                        "Harder – it makes it more difficult",
                        "No difference",
                        "Not sure"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "schedule_effect",
                    "title": "How did your university schedule affect your eating habits?",
                    "isRequired": true,
                    "choices": [
                        "More regular",
                        "Less regular",
                        "No change"
                    ]
                }
            ]
        },
        {
            "name": "perception_culture_open",
            "title": "Sections I, J & Open‑Ended",
            "elements": [
                {
                    "type": "matrix",
                    "name": "habit_changes",
                    "title": "Compared to Year 1, how have the following changed?",
                    "isRequired": true,
                    "columns": [
                        {
                            "value": 1,
                            "text": "Much Worse"
                        },
                        {
                            "value": 2,
                            "text": "Worse"
                        },
                        {
                            "value": 3,
                            "text": "No Change"
                        },
                        {
                            "value": 4,
                            "text": "Improved"
                        },
                        {
                            "value": 5,
                            "text": "Much Improved"
                        }
                    ],
                    "rows": [
                        {
                            "value": "eating_habits",
                            "text": "Eating habits"
                        },
                        {
                            "value": "physical_activity",
                            "text": "Physical activity"
                        },
                        {
                            "value": "sleep_quality",
                            "text": "Sleep quality"
                        },
                        {
                            "value": "stress_levels",
                            "text": "Stress levels"
                        },
                        {
                            "value": "social_engagement",
                            "text": "Social engagement"
                        },
                        {
                            "value": "time_management",
                            "text": "Time management"
                        }
                    ],
                    "eachRowRequired": true
                },
                {
                    "type": "radiogroup",
                    "name": "culture_influence",
                    "title": "Do your cultural or religious practices influence your diet or activity?",
                    "isRequired": true,
                    "choices": [
                        "Yes – strongly",
                        "Yes – somewhat",
                        "No",
                        "Prefer not to say"
                    ]
                },
                {
                    "type": "checkbox",
                    "name": "peer_social_pressure",
                    "title": "Social/peer pressures that influence you",
                    "isRequired": true,
                    "choices": [
                        "I eat or skip meals to fit in",
                        "I work out because my friends do",
                        "No – I make my own choices"
                    ],
                    "showOtherItem": true
                },
                {
                    "type": "comment",
                    "name": "open_q1",
                    "title": "In what ways has university life changed the way you eat and move?",
                    "isRequired": true
                },
                {
                    "type": "comment",
                    "name": "open_q2",
                    "title": "What cultural or personal values affect your health habits?",
                    "isRequired": true
                }
            ]
        },
        {
            "name": "ffq",
            "title": "Food Frequency Questionnaire (FFQ)",
            "elements": [
                {
                    "type": "matrixdropdown",
                    "name": "ffq_items",
                    "title": "Please recall whether you ate these food items in the past 12 months and estimate the frequency and average edible amount.",
                    "columns": [
                        {
                            "name": "Frequency",
                            "title": "Frequency",
                            "cellType": "radiogroup",
                            "isRequired": true,
                            "showInMultipleColumns": true,
                            "choices": [
                                "Never",
                                "Times per day",
                                "Times per week",
                                "Times per month",
                                "Times per year"
                            ],
                            "allowClear": true
                        },
                        {
                            "name": "times",
                            "title": "How many times?",
                            "cellType": "text"
                        }
                    ],
                    "rows": [
                        "White bread: Arabic/Iranian/Pita/Lebanese/Toast",
                        "Staple Food Brown bread: Arabic/Iranian/Pita/Lebanese/Toast",
                        "Chapati or Burrata",
                        "Other bread",
                        "Zaatar fatayer",
                        "White rice",
                        "Biryani",
                        "Wheat flour",
                        "Oats",
                        "Pasta",
                        "Asian noodle",
                        "Vegetables, canned (mixed)",
                        "Vegetables, raw",
                        "Green salad (average)",
                        "Salads (chef, Caesar, Greek)",
                        "Potatoes and products - French fries",
                        "Potato",
                        "Potato chips",
                        "Canned fruits",
                        "Dried fruits (dates)",
                        "Fresh fruits",
                        "Full fat milk",
                        "Low fat milk",
                        "Yogurt",
                        "Cheese",
                        "Meat - Beef",
                        "Meat - Lamb",
                        "Meat - Poultry",
                        "Meat - Mixed dish (meat + vegetables)",
                        "Meat - Offal",
                        "Fish and seafood (grilled or boiled)",
                        "Fish and seafood (fried)",
                        "Chicken Eggs - Chicken Eggs",
                        "Beans, Chickpeas, Fava Beans, Lentils, Seeds (average)",
                        "Salted nuts",
                        "Unsalted nuts",
                        "Raw nuts",
                        "Roasted nuts",
                        "Falafel",
                        "Khanfaroosh",
                        "Al Harees",
                        "Balaleet",
                        "Luqaimat",
                        "Thareed",
                        "Machboos",
                        "Muhallabiya",
                        "Madhrooba",
                        "Saloona",
                        "Rice Muhammar or Baranyoosh",
                        "Sago",
                        "Biscuits",
                        "Cakes",
                        "Arabic sweets (average)",
                        "Chocolate",
                        "Ice cream",
                        "Soups/starters",
                        "Pies",
                        "Pizza",
                        "Hamburger",
                        "Croissant",
                        "Breakfast cereal",
                        "Fruit juices (bottled)",
                        "Fruit juices (fresh)",
                        "Karak",
                        "Tea",
                        "Herbal tea",
                        "Coffee",
                        "Arabic coffee",
                        "Soda",
                        "Diet soda"
                    ]
                },
                {
                    "type": "radiogroup",
                    "name": "ffq_other_foods",
                    "title": "Are there any other foods and/or beverages you usually eat at least once per week?",
                    "isRequired": true,
                    "choices": [
                        "Yes",
                        "No"
                    ]
                },
                {
                    "type": "matrixdynamic",
                    "name": "other_foods",
                    "visibleIf": "{ffq_other_foods} = 'Yes'",
                    "title": "If yes, please specify:",
                    "columns": [
                        {
                            "name": "other_item",
                            "title": "Food/Beverage",
                            "cellType": "text",
                            "isRequired": true
                        },
                        {
                            "name": "serving_size",
                            "title": "Serving Size",
                            "cellType": "text"
                        },
                        {
                            "name": "servings_per_week",
                            "title": "Servings/Week",
                            "cellType": "text"
                        }
                    ],
                    "rowCount": 1,
                    "addRowText": "Add Item",
                    "removeRowText": "Remove"
                }
            ]
        }
    ],
    "widthMode": "responsive",
    "headerView": "advanced"
}; // surveyInfo[0].survey_config_json;
var survey = new Survey.SurveyModel(json);

var data = []; //dataInfo.map(item => item.response_json);

function getPaginatedData({ offset, limit, filter, sort }) {
  console.log(JSON.stringify(filter));
  console.log(JSON.stringify(sort));
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: data.slice(offset, offset + limit), totalCount: data.length });
    }, 1);
  });
}

// var surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
//   survey,
//   data,
// );
var surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  tableData,
);

surveyAnalyticsTabulator.render("tabulatorContainer");
