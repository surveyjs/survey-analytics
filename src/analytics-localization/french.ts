import { setupLocale } from "../localizationManager";

export var frenchStrings = {
  // "Group By Me"
  groupButton: "Grouper",
  // "Ungroup By Me"
  ungroupButton: "Dissocier",
  // "Select Me"
  selectButton: "Sélectionner",
  // [Auto-translated] "Column reorder"
  columnReorder: "Réorganisation des colonnes",
  // "Hide column"
  hideColumn: "Masquer la colonne",
  // "Show column"
  showColumn: "Afficher la colonne",
  // [Auto-translated] "Columns"
  columns: "Colonnes",
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
  // [Auto-translated] "Entries on Page:"
  entriesOnPageLabel: "Entrées sur la page :",
  // "Texts in table"
  visualizer_text: "Textes dans le tableau",
  // "Wordcloud"
  visualizer_wordcloud: "Nuage de mots",
  // "Histogram"
  visualizer_histogram: "Histogramme",
  // "Average"
  visualizer_number: "Moyenne",
  // [Auto-translated] "Average"
  visualizer_average: "Moyenne",
  // [Auto-translated] "Table"
  visualizer_choices: "Tableau",
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
  // [Auto-translated] "Histogram"
  chartType_histogram: "Histogramme",
  // [Auto-translated] "Vertical Histogram"
  chartType_vhistogram: "Histogramme vertical",
  // [Auto-translated] "Stacked Histogram"
  chartType_stackedhistogram: "Histogramme empilé",
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
  // [Auto-translated] "All questions"
  allQuestions: "Toutes les questions",
  // [Auto-translated] "Select all"
  selectAll: "Sélectionner tout",
  // [Auto-translated] "Clear selection"
  clearSelection: "Sélection claire",
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
  // [Auto-translated] "Export As..."
  exportAs: "Exporte comme...",
  // [Auto-translated] "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Fichier Excel",
  // "CSV"
  csvDownloadCaption: "Fichier CSV",
  // [Auto-translated] "Export as PDF"
  pdfDownloadHint: "Export en PDF",
  // [Auto-translated] "Export as Excel"
  xlsxDownloadHint: "Exporter sous Excel",
  // [Auto-translated] "Export as CSV"
  csvDownloadHint: "Exportation en CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Sauvegarder en PNG",
  // [Auto-translated] "response(s)"
  responsesText: "Réponse(s)",
  // [Auto-translated] "No data"
  noData: "Aucune donnée",
  // [Auto-translated] "Select date range..."
  selectDateRange: "Sélectionnez la plage de dates...",
  // [Auto-translated] "Include today"
  includeToday: "Incluez aujourd’hui",
  // [Auto-translated] "Custom"
  reportingPeriodCustom: "Coutumes",
  // [Auto-translated] "Last 7 days"
  reportingPeriodLast7days: "Les 7 derniers jours",
  // [Auto-translated] "Last 14 days"
  reportingPeriodLast14days: "Les 14 derniers jours",
  // [Auto-translated] "Last 28 days"
  reportingPeriodLast28days: "Derniers 28 jours",
  // [Auto-translated] "Last 30 days"
  reportingPeriodLast30days: "30 derniers jours",
  // [Auto-translated] "Last week (starts Monday)"
  reportingPeriodLastWeekMon: "La semaine dernière (commence lundi)",
  // [Auto-translated] "Last week (starts Sunday)"
  reportingPeriodLastWeekSun: "La semaine dernière (commence dimanche)",
  // [Auto-translated] "Last month"
  reportingPeriodLastMonth: "Le mois dernier",
  // [Auto-translated] "Last quarter"
  reportingPeriodLastQuarter: "Dernier quart-temps",
  // [Auto-translated] "Last year"
  reportingPeriodLastYear: "L’année dernière",
  // [Auto-translated] "This week to date (starts Sunday)"
  reportingPeriodWtdSun: "Cette semaine à ce jour (commence dimanche)",
  // [Auto-translated] "This week to date (starts Monday)"
  reportingPeriodWtdMon: "Cette semaine à ce jour (commence lundi)",
  // [Auto-translated] "This month to date"
  reportingPeriodMtd: "Ce mois-ci à ce jour",
  // [Auto-translated] "This quarter to date"
  reportingPeriodQtd: "Ce trimestre à ce jour",
  // [Auto-translated] "This year to date"
  reportingPeriodYtd: "Cette année à ce jour",
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
  // [Auto-translated] "Total responses"
  totalResponses: "Réponses totales",
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
  // [Auto-translated] "Category (X Axis)"
  axisXSelectorTitle: "Catégorie (axe des X)",
  // [Auto-translated] "Legend (Series)"
  axisYSelectorTitle: "Légende (Série)",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segments:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Groupes:",
  // [Auto-translated] "Secondary Y axis"
  secondYAxisToggleTitle: "Deuxième axe Y",
  // [Auto-translated] "Select a data field..."
  selectDataField: "Sélectionnez un champ de données...",
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
  groupedYearsAxisTitle: "L’exercice se termine avec",
  // [Auto-translated] "Series {0}"
  seriesListSeries: "Saison {0}",
  // [Auto-translated] "Values"
  seriesListValuesLabel: "Valeurs",
  // [Auto-translated] "Remove"
  seriesListRemove: "Retirer",
  // [Auto-translated] "Add Series"
  seriesListAdd: "Ajouter des séries",
  // [Auto-translated] "Move to second axis"
  seriesListMoveToSecondAxis: "Passage au deuxième axe",
  // [Auto-translated] "Move to first axis"
  seriesListMoveToFirstAxis: "Passage au premier axe",
  // [Auto-translated] "Count"
  aggregationCount: "Comte",
  // [Auto-translated] "Sum"
  aggregationSum: "Somme",
  // [Auto-translated] "Average"
  aggregationAverage: "Moyenne",
  // [Auto-translated] "Close"
  close: "Fermer",
  // [Auto-translated] "K"
  thousandsSuffix: "K",
  // [Auto-translated] "M"
  millionsSuffix: "M",
  // [Auto-translated] "B"
  billionsSuffix: "Md"
};

setupLocale({ localeCode: "fr", strings: frenchStrings, nativeName: "Français" });
