import { setupLocale } from "../localizationManager";

export var norwegianStrings = {
  // "Group By Me"
  groupButton: "Grupper",
  // "Ungroup By Me"
  ungroupButton: "Opphev gruppering",
  // "Select Me"
  selectButton: "Velg",
  // "Hide column"
  hideColumn: "Skjul kolonne",
  // "Show column"
  showColumn: "Vis kolonne",
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
  // "Texts in table"
  visualizer_text: "Tabellvisning",
  // "Wordcloud"
  visualizer_wordcloud: "Ordsky",
  // "Histogram"
  visualizer_histogram: "Histogram",
  // "Average"
  visualizer_number: "Gjennomsnitt",
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
  // "Hide"
  hideButton: "Skjul",
  // "Make private"
  makePrivateButton: "Gjør privat",
  // "Make public"
  makePublicButton: "Gjør offentlig",
  // "Show"
  showButton: "Vis",
  // "Filter"
  filter: "Filter",
  // "Reset Filter"
  resetFilter: "Nullstill filter",
  // "Change Locale"
  changeLocale: "Bytt språk",
  // "Clear"
  clearButton: "Tøm",
  // "Choose question to show..."
  addElement: "Velg spørsmål...",
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
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Overgå",
  // "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Last ned plott som en PNG-fil",
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
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "Kategori (X-akse):",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "Legende (serie):",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmenter:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Grupper:",
  // [Auto-translated] "Not selected"
  notSelected: "Ikke valgt"
};

setupLocale({ localeCode: "no", strings: norwegianStrings, nativeName: "Norsk" });