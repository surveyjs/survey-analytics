import { setupLocale } from "../localizationManager";

export var frenchStrings = {
  // "Group By Me"
  groupButton: "Grouper",
  // "Ungroup By Me"
  ungroupButton: "Dissocier",
  // "Select Me"
  selectButton: "Sélectionner",
  // "Hide column"
  hideColumn: "Masquer la colonne",
  // "Show column"
  showColumn: "Afficher la colonne",
  // "Make column private"
  makePrivateColumn: "Rendre la colonne privée",
  // "Make column public"
  makePublicColumn: "Rendre la colonne publique",
  // "Move to Detail"
  moveToDetail: "Déplacer vers détails",
  // "Show as Column"
  showAsColumn: "Afficher en colonne",
  // "Search..."
  filterPlaceholder: "Rechercher...",
  // "Remove rows"
  removeRows: "Supprimer les lignes",
  // "Show"
  showLabel: "Afficher",
  // "entries"
  entriesLabel: "entrées",
  // "Texts in table"
  visualizer_text: "Textes dans le tableau",
  // "Wordcloud"
  visualizer_wordcloud: "Nuage de mots",
  // "Histogram"
  visualizer_histogram: "Histogramme",
  // "Average"
  visualizer_number: "Moyenne",
  // "Table"
  visualizer_choices: "Table",
  // "Chart"
  visualizer_selectBase: "Graphique",
  // [Auto-translated] "Chart"
  visualizer_matrix: "Graphique",
  // [Auto-translated] "Bar"
  chartType_bar: "Barre",
  // "Vertical Bar"
  chartType_vbar: "Barre verticale",
  // "Stacked Bar"
  chartType_stackedbar: "Barres empilées",
  // "Doughnut"
  chartType_doughnut: "Anneau",
  // "Pie"
  chartType_pie: "Secteurs",
  // "Scatter"
  chartType_scatter: "Nuage de points",
  // "Gauge"
  chartType_gauge: "Cadran",
  // "Bullet"
  chartType_bullet: "Bulles",
  // [Auto-translated] "Line"
  chartType_line: "Ligne",
  // [Auto-translated] "Radar"
  chartType_radar: "Radar",
  // "Hide"
  hideButton: "Masquer",
  // "Make private"
  makePrivateButton: "Rendre privé",
  // "Make public"
  makePublicButton: "Rendre publique",
  // "Show"
  showButton: "Afficher",
  // "Filter"
  filter: "Filtre",
  // "Reset Filter"
  resetFilter: "Réinitialiser le Filtre",
  // "Change Locale"
  changeLocale: "Changer les paramètres régionaux",
  // "Clear"
  clearButton: "Rafraichir",
  // "Choose question to show..."
  addElement: "Choisir la question à afficher...",
  // "Default Order"
  defaultOrder: "Ordre par défaut",
  // "Ascending"
  ascOrder: "Ascendant",
  // "Descending"
  descOrder: "Descendant",
  // "Show minor columns"
  showMinorColumns: "Afficher les colonnes mineures",
  // [Auto-translated] "Actions"
  actionsColumn: "Actions",
  // "Other items and comments"
  otherCommentTitle: "Autres éléments et commentaires",
  // "Show percentages"
  showPercentages: "Afficher les pourcentages",
  // "Hide percentages"
  hidePercentages: "Masquer les pourcentages",
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Fichier Excel",
  // "CSV"
  csvDownloadCaption: "Fichier CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Sauvegarder en PNG",
  // "Hide empty answers"
  hideEmptyAnswers: "Masquer les réponses vides",
  // "Show empty answers"
  showEmptyAnswers: "Afficher les réponses vides",
  // "All answers"
  "topNValueText-1": "Toutes les réponses",
  // "Top 5 answers"
  topNValueText5: "Top 5 des réponses",
  // "Top 10 answers"
  topNValueText10: "Top 10 des réponses",
  // "Top 20 answers"
  topNValueText20: "Top 20 des réponses",
  // "Hide missing answers"
  hideMissingAnswers: "Masquer les réponses manquantes",
  // "Show missing answers"
  showMissingAnswers: "Afficher les réponses manquantes",
  // "Missing answers"
  missingAnswersLabel: "Réponses manquantes",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Ce type de question n'est pas encore visualisé",
  // "There are no results yet"
  noResults: "Il n'y a pas encore de résultats",
  // "Per Values"
  showPerValues: "Par valeur",
  // "Per Columns"
  showPerColumns: "Par colonne",
  // "Answer"
  answer: "Réponse",
  // "Correct answer: "
  correctAnswer: "Réponse correcte: ",
  // "Percent"
  percent: "Pourcentage",
  // [Auto-translated] "Percentage"
  percentage: "Pourcentage",
  // [Auto-translated] "Chart"
  statistics_chart: "Graphique",
  // "Responses"
  responses: "Réponses",
  // [Auto-translated] "NPS"
  visualizer_nps: "Le NPS",
  // [Auto-translated] "Chart"
  visualizer_boolean: "Graphique",
  // [Auto-translated] "Table"
  visualizer_options: "Table",
  // [Auto-translated] "NPS"
  npsScore: "Le NPS",
  // [Auto-translated] "Promoters"
  npsPromoters: "Promoteurs",
  // [Auto-translated] "Passives"
  npsPassives: "Passifs",
  // [Auto-translated] "Detractors"
  npsDetractors: "Détracteurs",
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "Catégorie (axe X) :",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "Légende (série) :",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segments:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Groupes:",
  // [Auto-translated] "Not selected"
  notSelected: "Non sélectionné",
  // [Auto-translated] "Default"
  intervalMode_default: "Par défaut",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Décennies",
  // [Auto-translated] "Years"
  intervalMode_years: "Années",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Trimestres",
  // [Auto-translated] "Months"
  intervalMode_months: "Mois",
  // [Auto-translated] "Days"
  intervalMode_days: "Jours",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Personnalisé",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Auto",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Intervalles:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Afficher les valeurs individuelles",
  // [Auto-translated] "Show running totals"
  runningTotals: "Afficher les totaux cumulés",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Comparer les périodes",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Voir la chronologie",
  // [Auto-translated] "None"
  noneAggregateText: "Aucun",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Agrégat:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "L’exercice se termine avec"
};

setupLocale({ localeCode: "fr", strings: frenchStrings, nativeName: "Français" });
