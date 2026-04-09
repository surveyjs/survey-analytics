import { setupLocale } from "../localizationManager";

export var dutchStrings = {
  // "Group By Me"
  groupButton: "Groeperen op",
  // "Ungroup By Me"
  ungroupButton: "Groepering verwijderen",
  // "Select Me"
  selectButton: "Selecteer mij",
  // [Auto-translated] "Column reorder"
  columnReorder: "Kolomherschikking",
  // "Hide column"
  hideColumn: "Kolom verbergen",
  // "Show column"
  showColumn: "Toon kolom",
  // [Auto-translated] "Columns"
  columns: "Kolommen",
  // "Make column private"
  makePrivateColumn: "Kolom privé maken",
  // "Make column public"
  makePublicColumn: "Maak kolom openbaar",
  // "Move to Detail"
  moveToDetail: "Ga naar detail",
  // "Show as Column"
  showAsColumn: "Weergeven als kolom",
  // "Search..."
  filterPlaceholder: "Zoeken...",
  // "Remove rows"
  removeRows: "Verwijder rijen",
  // "Show"
  showLabel: "Tonen",
  // "entries"
  entriesLabel: "inzendingen",
  // [Auto-translated] "Entries on Page:"
  entriesOnPageLabel: "Vermeldingen op pagina:",
  // "Texts in table"
  visualizer_text: "Teksten in tabel",
  // [Auto-translated] "Wordcloud"
  visualizer_wordcloud: "Wordcloud",
  // [Auto-translated] "Histogram"
  visualizer_histogram: "Histogram",
  // "Average"
  visualizer_number: "Gemiddeld",
  // [Auto-translated] "Average"
  visualizer_average: "Gemiddeld",
  // "Table"
  visualizer_choices: "Tabel",
  // "Chart"
  visualizer_selectBase: "Grafiek",
  // [Auto-translated] "Chart"
  visualizer_matrix: "Zeekaart",
  // [Auto-translated] "Bar"
  chartType_bar: "Bar",
  // "Vertical Bar"
  chartType_vbar: "Staafdiagram",
  // "Stacked Bar"
  chartType_stackedbar: "Staafdiagram (gestapeld)",
  // "Doughnut"
  chartType_doughnut: "Donut",
  // "Pie"
  chartType_pie: "Cirkeldiagram",
  // "Scatter"
  chartType_scatter: "Spreidingsdiagram",
  // "Gauge"
  chartType_gauge: "Meterdiagram",
  // "Bullet"
  chartType_bullet: "Kogelgrafiek",
  // [Auto-translated] "Line"
  chartType_line: "Lijn",
  // [Auto-translated] "Radar"
  chartType_radar: "Radar",
  // [Auto-translated] "Histogram"
  chartType_histogram: "Histogram",
  // [Auto-translated] "Vertical Histogram"
  chartType_vhistogram: "Verticale histogram",
  // [Auto-translated] "Stacked Histogram"
  chartType_stackedhistogram: "Gestapeld histogram",
  // "Hide"
  hideButton: "Verbergen",
  // "Make private"
  makePrivateButton: "Maak prive",
  // "Make public"
  makePublicButton: "Openbaar maken",
  // "Show"
  showButton: "Tonen",
  // [Auto-translated] "Filter"
  filter: "Filter",
  // "Reset Filter"
  resetFilter: "Filter resetten",
  // "Change Locale"
  changeLocale: "Wijzig de landinstelling",
  // "Clear"
  clearButton: "Wissen",
  // "Choose question to show..."
  addElement: "Kies een vraag om weer te geven ...",
  // [Auto-translated] "All questions"
  allQuestions: "Alle vragen",
  // [Auto-translated] "Select all"
  selectAll: "Selecteer alles",
  // [Auto-translated] "Clear selection"
  clearSelection: "Duidelijke selectie",
  // "Default Order"
  defaultOrder: "Standaardvolgorde",
  // "Ascending"
  ascOrder: "Oplopend",
  // "Descending"
  descOrder: "Aflopend",
  // "Show minor columns"
  showMinorColumns: "Toon kleine kolommen",
  // [Auto-translated] "Actions"
  actionsColumn: "Acties",
  // "Other items and comments"
  otherCommentTitle: "Andere items en opmerkingen",
  // "Show percentages"
  showPercentages: "Percentages weergeven",
  // "Hide percentages"
  hidePercentages: "Verberg percentages",
  // [Auto-translated] "Export As..."
  exportAs: "Exporteren als...",
  // [Auto-translated] "PDF"
  pdfDownloadCaption: "PDF",
  // [Auto-translated] "Excel"
  xlsxDownloadCaption: "Excel",
  // [Auto-translated] "CSV"
  csvDownloadCaption: "CSV",
  // [Auto-translated] "Export as PDF"
  pdfDownloadHint: "Exporteren als PDF",
  // [Auto-translated] "Export as Excel"
  xlsxDownloadHint: "Export als Excel",
  // [Auto-translated] "Export as CSV"
  csvDownloadHint: "Export als CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Download plot als PNG",
  // [Auto-translated] "response(s)"
  responsesText: "Reactie(s)",
  // [Auto-translated] "No data"
  noData: "Geen gegevens",
  // [Auto-translated] "Select date range..."
  selectDateRange: "Selecteer datumbereik...",
  // [Auto-translated] "Include today"
  includeToday: "Vandaag opnemen",
  // [Auto-translated] "Custom"
  reportingPeriodCustom: "Gewoonte",
  // [Auto-translated] "Last 7 days"
  reportingPeriodLast7days: "Laatste 7 dagen",
  // [Auto-translated] "Last 14 days"
  reportingPeriodLast14days: "Laatste 14 dagen",
  // [Auto-translated] "Last 28 days"
  reportingPeriodLast28days: "Laatste 28 dagen",
  // [Auto-translated] "Last 30 days"
  reportingPeriodLast30days: "Laatste 30 dagen",
  // [Auto-translated] "Last week (starts Monday)"
  reportingPeriodLastWeekMon: "Vorige week (begint maandag)",
  // [Auto-translated] "Last week (starts Sunday)"
  reportingPeriodLastWeekSun: "Vorige week (begint zondag)",
  // [Auto-translated] "Last month"
  reportingPeriodLastMonth: "Vorige maand",
  // [Auto-translated] "Last quarter"
  reportingPeriodLastQuarter: "Laatste kwart",
  // [Auto-translated] "Last year"
  reportingPeriodLastYear: "Vorig jaar",
  // [Auto-translated] "This week to date (starts Sunday)"
  reportingPeriodWtdSun: "Deze week tot nu toe (begint zondag)",
  // [Auto-translated] "This week to date (starts Monday)"
  reportingPeriodWtdMon: "Deze week tot nu toe (begint maandag)",
  // [Auto-translated] "This month to date"
  reportingPeriodMtd: "Deze maand tot nu toe",
  // [Auto-translated] "This quarter to date"
  reportingPeriodQtd: "Dit kwartaal tot nu toe",
  // [Auto-translated] "This year to date"
  reportingPeriodYtd: "Dit jaar tot nu toe",
  // "Hide empty answers"
  hideEmptyAnswers: "Verberg lege antwoorden",
  // "Show empty answers"
  showEmptyAnswers: "Toon lege antwoorden",
  // "All answers"
  "topNValueText-1": "Alle antwoorden",
  // "Top 5 answers"
  topNValueText5: "Top 5 antwoorden",
  // "Top 10 answers"
  topNValueText10: "Top 10 antwoorden",
  // "Top 20 answers"
  topNValueText20: "Top 20 antwoorden",
  // "Hide missing answers"
  hideMissingAnswers: "Ontbrekende antwoorden verbergen",
  // "Show missing answers"
  showMissingAnswers: "Ontbrekende antwoorden weergeven",
  // "Missing answers"
  missingAnswersLabel: "Ontbrekende antwoorden",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Dit vraagtype is nog niet gevisualiseerd",
  // "There are no results yet"
  noResults: "Er zijn nog geen resultaten",
  // "Per Values"
  showPerValues: "Per waarden",
  // "Per Columns"
  showPerColumns: "Per Kolommen",
  // "Answer"
  answer: "Antwoorden",
  // "Correct answer: "
  correctAnswer: "Goed antwoord: ",
  // "Percent"
  percent: "Procent",
  // [Auto-translated] "Percentage"
  percentage: "Percentage",
  // [Auto-translated] "Chart"
  statistics_chart: "Zeekaart",
  // "Responses"
  responses: "Reacties",
  // [Auto-translated] "Total responses"
  totalResponses: "Totaal aantal reacties",
  // [Auto-translated] "NPS"
  visualizer_nps: "NPS",
  // [Auto-translated] "Chart"
  visualizer_boolean: "Zeekaart",
  // [Auto-translated] "Table"
  visualizer_options: "Tafel",
  // [Auto-translated] "NPS"
  npsScore: "NPS",
  // [Auto-translated] "Promoters"
  npsPromoters: "Initiatiefnemers",
  // [Auto-translated] "Passives"
  npsPassives: "Passief personeel",
  // [Auto-translated] "Detractors"
  npsDetractors: "Tegenstanders",
  // [Auto-translated] "Category (X Axis)"
  axisXSelectorTitle: "Categorie (X-as)",
  // [Auto-translated] "Legend (Series)"
  axisYSelectorTitle: "Legend (serie)",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmenten:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Groepen:",
  // [Auto-translated] "Secondary Y axis"
  secondYAxisToggleTitle: "Tweede Y-as",
  // [Auto-translated] "Select a data field..."
  selectDataField: "Selecteer een dataveld...",
  // [Auto-translated] "Default"
  intervalMode_default: "Verstek",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Decennia",
  // [Auto-translated] "Years"
  intervalMode_years: "Jaren",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Vertrekken",
  // [Auto-translated] "Months"
  intervalMode_months: "Maanden",
  // [Auto-translated] "Days"
  intervalMode_days: "Dagen",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Gewoonte",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Auto",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Intervallen:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Toon individuele waarden",
  // [Auto-translated] "Show running totals"
  runningTotals: "Toon lopende totalen",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Vergelijk periodes",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Tijdlijn bekijken",
  // [Auto-translated] "None"
  noneAggregateText: "Geen",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Aggregaat:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "Het jaar eindigt met",
  // [Auto-translated] "Series {0}"
  seriesListSeries: "Serie {0}",
  // [Auto-translated] "Values"
  seriesListValuesLabel: "Waarden",
  // [Auto-translated] "Remove"
  seriesListRemove: "Verwijder",
  // [Auto-translated] "Add Series"
  seriesListAdd: "Toevoegen van series",
  // [Auto-translated] "Move to second axis"
  seriesListMoveToSecondAxis: "Verplaats naar de tweede as",
  // [Auto-translated] "Move to first axis"
  seriesListMoveToFirstAxis: "Verplaats naar de eerste as",
  // [Auto-translated] "Count"
  aggregationCount: "Graaf",
  // [Auto-translated] "Sum"
  aggregationSum: "Som",
  // [Auto-translated] "Average"
  aggregationAverage: "Gemiddeld",
  // [Auto-translated] "Close"
  close: "Sluit"
};

setupLocale({ localeCode: "nl", strings: dutchStrings, nativeName: "Nederlands" });