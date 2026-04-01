import { setupLocale } from "../localizationManager";

export var norwegianStrings = {
  // "Group By Me"
  groupButton: "Grupper",
  // "Ungroup By Me"
  ungroupButton: "Opphev gruppering",
  // "Select Me"
  selectButton: "Velg",
  // [Auto-translated] "Column reorder"
  columnReorder: "Kolonneomorganisering",
  // "Hide column"
  hideColumn: "Skjul kolonne",
  // "Show column"
  showColumn: "Vis kolonne",
  // [Auto-translated] "Columns"
  columns: "Søyler",
  // "Make column private"
  makePrivateColumn: "Gjør kolonne privat",
  // "Make column public"
  makePublicColumn: "Gjør kolonne offentlig",
  // "Move to Detail"
  moveToDetail: "Flytt til detaljert visning",
  // "Show as Column"
  showAsColumn: "Vis som kolonne",
  // "Search..."
  filterPlaceholder: "Søk...",
  // "Remove rows"
  removeRows: "Fjern rader",
  // "Show"
  showLabel: "Vis",
  // "entries"
  entriesLabel: "oppføringer",
  // [Auto-translated] "Entries on Page:"
  entriesOnPageLabel: "Oppføringer på siden:",
  // "Texts in table"
  visualizer_text: "Tabellvisning",
  // "Wordcloud"
  visualizer_wordcloud: "Ordsky",
  // [Auto-translated] "Histogram"
  visualizer_histogram: "Histogram",
  // "Average"
  visualizer_number: "Gjennomsnitt",
  // [Auto-translated] "Average"
  visualizer_average: "Gjennomsnitt",
  // "Table"
  visualizer_choices: "Bord",
  // "Chart"
  visualizer_selectBase: "Sjøkart",
  // [Auto-translated] "Chart"
  visualizer_matrix: "Sjøkart",
  // [Auto-translated] "Bar"
  chartType_bar: "Bar",
  // "Vertical Bar"
  chartType_vbar: "Vertikal stolpe",
  // "Stacked Bar"
  chartType_stackedbar: "Stablet stolpediagram",
  // "Doughnut"
  chartType_doughnut: "Hjuldiagram",
  // "Pie"
  chartType_pie: "Sektordiagram",
  // "Scatter"
  chartType_scatter: "Punktdiagram",
  // "Gauge"
  chartType_gauge: "Målediagram",
  // "Bullet"
  chartType_bullet: "Kulediagram",
  // [Auto-translated] "Line"
  chartType_line: "Linje",
  // [Auto-translated] "Radar"
  chartType_radar: "Radar",
  // [Auto-translated] "Histogram"
  chartType_histogram: "Histogram",
  // [Auto-translated] "Vertical Histogram"
  chartType_vhistogram: "Vertikalt histogram",
  // [Auto-translated] "Stacked Histogram"
  chartType_stackedhistogram: "Stablet histogram",
  // "Hide"
  hideButton: "Skjul",
  // "Make private"
  makePrivateButton: "Gjør privat",
  // "Make public"
  makePublicButton: "Gjør offentlig",
  // "Show"
  showButton: "Vis",
  // [Auto-translated] "Filter"
  filter: "Filter",
  // "Reset Filter"
  resetFilter: "Nullstill filter",
  // "Change Locale"
  changeLocale: "Bytt språk",
  // "Clear"
  clearButton: "Tøm",
  // "Choose question to show..."
  addElement: "Velg spørsmål...",
  // [Auto-translated] "All questions"
  allQuestions: "Alle spørsmål",
  // [Auto-translated] "Select all"
  selectAll: "Velg alle",
  // [Auto-translated] "Clear selection"
  clearSelection: "Klart utvalg",
  // "Default Order"
  defaultOrder: "Standard",
  // "Ascending"
  ascOrder: "Stigende",
  // "Descending"
  descOrder: "Synkende",
  // "Show minor columns"
  showMinorColumns: "Vis mindre kolonner",
  // [Auto-translated] "Actions"
  actionsColumn: "Handlinger",
  // "Other items and comments"
  otherCommentTitle: "Annet og kommentarer",
  // "Show percentages"
  showPercentages: "Vis prosenter",
  // "Hide percentages"
  hidePercentages: "Skjul prosenter",
  // [Auto-translated] "Export As..."
  exportAs: "Eksporter som...",
  // [Auto-translated] "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Overgå",
  // [Auto-translated] "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Last ned plott som en PNG-fil",
  // [Auto-translated] "response(s)"
  responsesText: "Respons(er)",
  // [Auto-translated] "No data"
  noData: "Ingen data",
  // [Auto-translated] "Select date range..."
  selectDateRange: "Velg datointervall...",
  // [Auto-translated] "Include today"
  includeToday: "Inkluder i dag",
  // [Auto-translated] "Custom"
  reportingPeriodCustom: "Skikk",
  // [Auto-translated] "Last 7 days"
  reportingPeriodLast7days: "De siste 7 dagene",
  // [Auto-translated] "Last 14 days"
  reportingPeriodLast14days: "De siste 14 dagene",
  // [Auto-translated] "Last 28 days"
  reportingPeriodLast28days: "De siste 28 dagene",
  // [Auto-translated] "Last 30 days"
  reportingPeriodLast30days: "De siste 30 dagene",
  // [Auto-translated] "Last week (starts Monday)"
  reportingPeriodLastWeekMon: "Forrige uke (starter mandag)",
  // [Auto-translated] "Last week (starts Sunday)"
  reportingPeriodLastWeekSun: "Forrige uke (starter søndag)",
  // [Auto-translated] "Last month"
  reportingPeriodLastMonth: "Forrige måned",
  // [Auto-translated] "Last quarter"
  reportingPeriodLastQuarter: "Siste kvartal",
  // [Auto-translated] "Last year"
  reportingPeriodLastYear: "I fjor",
  // [Auto-translated] "This week to date (starts Sunday)"
  reportingPeriodWtdSun: "Denne uken til dags dato (starter søndag)",
  // [Auto-translated] "This week to date (starts Monday)"
  reportingPeriodWtdMon: "Denne uken til dags dato (starter mandag)",
  // [Auto-translated] "This month to date"
  reportingPeriodMtd: "Denne måneden til dags dato",
  // [Auto-translated] "This quarter to date"
  reportingPeriodQtd: "Dette kvartalet til dags dato",
  // [Auto-translated] "This year to date"
  reportingPeriodYtd: "I år til dags dato",
  // "Hide empty answers"
  hideEmptyAnswers: "Skjul tomme svar",
  // "Show empty answers"
  showEmptyAnswers: "Vis tomme svar",
  // "All answers"
  "topNValueText-1": "Alle svar",
  // "Top 5 answers"
  topNValueText5: "Topp 5 svar",
  // "Top 10 answers"
  topNValueText10: "Topp 10 svar",
  // "Top 20 answers"
  topNValueText20: "Topp 20 svar",
  // "Hide missing answers"
  hideMissingAnswers: "Skjul manglende svar",
  // "Show missing answers"
  showMissingAnswers: "Vis manglende svar",
  // "Missing answers"
  missingAnswersLabel: "Mangler svar",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Denne spørsmålstypen er ikke visualisert ennå",
  // "There are no results yet"
  noResults: "Det er ingen resultater ennå",
  // "Per Values"
  showPerValues: "Per verdier",
  // "Per Columns"
  showPerColumns: "Per kolonner",
  // "Answer"
  answer: "Svare",
  // "Correct answer: "
  correctAnswer: "Riktig svar: ",
  // "Percent"
  percent: "Prosent",
  // [Auto-translated] "Percentage"
  percentage: "Prosent",
  // [Auto-translated] "Chart"
  statistics_chart: "Sjøkart",
  // "Responses"
  responses: "Svar",
  // [Auto-translated] "NPS"
  visualizer_nps: "NPS",
  // [Auto-translated] "Chart"
  visualizer_boolean: "Sjøkart",
  // [Auto-translated] "Table"
  visualizer_options: "Bord",
  // [Auto-translated] "NPS"
  npsScore: "NPS",
  // [Auto-translated] "Promoters"
  npsPromoters: "Arrangører",
  // [Auto-translated] "Passives"
  npsPassives: "Passive",
  // [Auto-translated] "Detractors"
  npsDetractors: "Motstandere",
  // [Auto-translated] "Category (X Axis)"
  axisXSelectorTitle: "Kategori (X-akse)",
  // [Auto-translated] "Legend (Series)"
  axisYSelectorTitle: "Legend (serie)",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmenter:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Grupper:",
  // [Auto-translated] "Second Y axis"
  secondYAxisToggleTitle: "Andre Y-akse",
  // [Auto-translated] "Select a data field..."
  selectDataField: "Velg et datafelt...",
  // [Auto-translated] "Default"
  intervalMode_default: "Standard",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Tiår",
  // [Auto-translated] "Years"
  intervalMode_years: "År",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Kvartaler",
  // [Auto-translated] "Months"
  intervalMode_months: "Måneder",
  // [Auto-translated] "Days"
  intervalMode_days: "Dager",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Skikk",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Auto",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Intervaller:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Vis individuelle verdier",
  // [Auto-translated] "Show running totals"
  runningTotals: "Vis løpende totaler",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Sammenlign perioder",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Vis tidslinje",
  // [Auto-translated] "None"
  noneAggregateText: "Ingen",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Samlet:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "Året avsluttes med",
  // [Auto-translated] "Series {0}"
  seriesListSeries: "Serie {0}",
  // [Auto-translated] "Values"
  seriesListValuesLabel: "Verdier",
  // [Auto-translated] "Remove"
  seriesListRemove: "Fjern",
  // [Auto-translated] "Add Series"
  seriesListAdd: "Legg til serier",
  // [Auto-translated] "Move to second axis"
  seriesListMoveToSecondAxis: "Flytt til andre akse",
  // [Auto-translated] "Move to first axis"
  seriesListMoveToFirstAxis: "Flytt til første akse",
  // [Auto-translated] "Count"
  aggregationCount: "Greve",
  // [Auto-translated] "Sum"
  aggregationSum: "Sum",
  // [Auto-translated] "Average"
  aggregationAverage: "Gjennomsnitt",
  // [Auto-translated] "Close"
  close: "Lukk"
};

setupLocale({ localeCode: "no", strings: norwegianStrings, nativeName: "Norsk" });