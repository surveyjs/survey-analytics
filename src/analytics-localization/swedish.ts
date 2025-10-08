import { setupLocale } from "../localizationManager";

export var swedishStrings = {
  // "Group By Me"
  groupButton: "Gruppera av mig",
  // "Ungroup By Me"
  ungroupButton: "Avgruppera av mig",
  // "Select Me"
  selectButton: "Välj mig",
  // "Hide column"
  hideColumn: "Göm kolumn",
  // "Show column"
  showColumn: "Visa kolumn",
  // "Make column private"
  makePrivateColumn: "Gör kolumn privat",
  // "Make column public"
  makePublicColumn: "Gör kolumn offentlig",
  // "Move to Detail"
  moveToDetail: "Flytta till detalj",
  // "Show as Column"
  showAsColumn: "Visa som kolumn",
  // "Search..."
  filterPlaceholder: "Sök...",
  // "Remove rows"
  removeRows: "Ta bort rader",
  // "Show"
  showLabel: "Visa",
  // "entries"
  entriesLabel: "poster",
  // "Texts in table"
  visualizer_text: "Texter i tabell",
  // "Wordcloud"
  visualizer_wordcloud: "Ordmoln",
  // "Histogram"
  visualizer_histogram: "Histogram",
  // "Average"
  visualizer_number: "Genomsnitt",
  // "Table"
  visualizer_choices: "Tabell",
  // "Chart"
  visualizer_selectBase: "Diagram",
  // "Chart"
  visualizer_matrix: "Diagram",
  // "Bar"
  chartType_bar: "Stapel",
  // "Vertical Bar"
  chartType_vbar: "Vertikal stapel",
  // "Stacked Bar"
  chartType_stackedbar: "Staplad stapel",
  // "Doughnut"
  chartType_doughnut: "Ring",
  // "Pie"
  chartType_pie: "Cirkel",
  // "Scatter"
  chartType_scatter: "Punkt",
  // "Gauge"
  chartType_gauge: "Mätare",
  // "Bullet"
  chartType_bullet: "Bullet",
  // "Line"
  chartType_line: "Linje",
  // "Radar"
  chartType_radar: "Radar",
  // "Hide"
  hideButton: "Göm",
  // "Make private"
  makePrivateButton: "Gör privat",
  // "Make public"
  makePublicButton: "Gör offentlig",
  // "Show"
  showButton: "Visa",
  // "Filter"
  filter: "Filter",
  // "Reset Filter"
  resetFilter: "Återställ filter",
  // "Change Locale"
  changeLocale: "Ändra språk",
  // "Clear"
  clearButton: "Rensa",
  // "Choose question to show..."
  addElement: "Välj fråga att visa...",
  // "Default Order"
  defaultOrder: "Standard ordning",
  // "Ascending"
  ascOrder: "Stigande",
  // "Descending"
  descOrder: "Fallande",
  // "Show minor columns"
  showMinorColumns: "Visa mindre kolumner",
  // "Actions"
  actionsColumn: "Åtgärder",
  // "Other items and comments"
  otherCommentTitle: "Övriga objekt och kommentarer",
  // "Show percentages"
  showPercentages: "Visa procent",
  // "Hide percentages"
  hidePercentages: "Göm procent",
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Excel",
  // "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Ladda ner diagram som PNG-fil",
  // "Hide empty answers"
  hideEmptyAnswers: "Göm tomma svar",
  // "Show empty answers"
  showEmptyAnswers: "Visa tomma svar",
  // "All answers"
  "topNValueText-1": "Alla svar",
  // "Top 5 answers"
  topNValueText5: "Topp 5 svar",
  // "Top 10 answers"
  topNValueText10: "Topp 10 svar",
  // "Top 20 answers"
  topNValueText20: "Topp 20 svar",
  // "Hide missing answers"
  hideMissingAnswers: "Göm saknade svar",
  // "Show missing answers"
  showMissingAnswers: "Visa saknade svar",
  // "Missing answers"
  missingAnswersLabel: "Saknade svar",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Detta frågetyp är inte visualiserad ännu",
  // "There are no results yet"
  noResults: "Det finns inga resultat ännu",
  // "Per Values"
  showPerValues: "Per värden",
  // "Per Columns"
  showPerColumns: "Per kolumner",
  // "Answer"
  answer: "Svar",
  // "Correct answer: "
  correctAnswer: "Rätt svar: ",
  // "Percent"
  percent: "Procent",
  // "Percentage"
  percentage: "Procent",
  // "Chart"
  statistics_chart: "Diagram",
  // "Responses"
  responses: "Svar",
  // "NPS"
  visualizer_nps: "NPS",
  // [Auto-translated] "Chart"
  visualizer_boolean: "Diagram",
  // [Auto-translated] "Table"
  visualizer_options: "Bord",
  // "NPS"
  npsScore: "NPS",
  // "Promoters"
  npsPromoters: "Promotorer",
  // "Passives"
  npsPassives: "Passiva",
  // "Detractors"
  npsDetractors: "Kritiker",
  // "Category (X Axis):"
  axisXSelectorTitle: "X-axel:",
  // "Legend (Series):"
  axisYSelectorTitle: "Y-axel:",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segment:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Grupper:",
  // [Auto-translated] "Not selected"
  notSelected: "Inte valt",
  // [Auto-translated] "Default"
  intervalMode_default: "Standard",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Årtionden",
  // [Auto-translated] "Years"
  intervalMode_years: "År",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Bostad",
  // [Auto-translated] "Months"
  intervalMode_months: "Månader",
  // [Auto-translated] "Days"
  intervalMode_days: "Dagar",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Sed",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Bil",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Mellanrum:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Visa individuella värden",
  // [Auto-translated] "Show running totals"
  runningTotals: "Visa löpande totaler",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Jämför perioder",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Visa tidslinjen",
  // [Auto-translated] "None"
  noneAggregateText: "Ingen",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Aggregat:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "Året slutar med"
};

setupLocale({ localeCode: "sv", strings: swedishStrings, nativeName: "Svenska" });