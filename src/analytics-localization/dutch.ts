import { setupLocale } from "../localizationManager";

export var dutchStrings = {
  // "Group By Me"
  groupButton: "Groeperen op",
  // "Ungroup By Me"
  ungroupButton: "Groepering verwijderen",
  // "Select Me"
  selectButton: "Selecteer mij",
  // "Hide column"
  hideColumn: "Kolom verbergen",
  // "Show column"
  showColumn: "Toon kolom",
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
  // "Texts in table"
  visualizer_text: "Teksten in tabel",
  // "Wordcloud"
  visualizer_wordcloud: "Wordcloud",
  // "Histogram"
  visualizer_histogram: "Histogram",
  // "Average"
  visualizer_number: "Gemiddeld",
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
  // "Hide"
  hideButton: "Verbergen",
  // "Make private"
  makePrivateButton: "Maak prive",
  // "Make public"
  makePublicButton: "Openbaar maken",
  // "Show"
  showButton: "Tonen",
  // "Filter"
  filter: "Filter",
  // "Reset Filter"
  resetFilter: "Filter resetten",
  // "Change Locale"
  changeLocale: "Wijzig de landinstelling",
  // "Clear"
  clearButton: "Wissen",
  // "Choose question to show..."
  addElement: "Kies een vraag om weer te geven ...",
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
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Excel",
  // "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Download plot als PNG",
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
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "Categorie (X-as):",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "Legende (serie):",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmenten:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Groepen:",
  // [Auto-translated] "Not selected"
  notSelected: "Niet geselecteerd"
};

setupLocale({ localeCode: "nl", strings: dutchStrings, nativeName: "Nederlands" });