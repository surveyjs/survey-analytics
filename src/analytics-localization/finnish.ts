import { setupLocale } from "../localizationManager";

export var finnishStrings = {
  // "Group By Me"
  groupButton: "Erottele minulla",
  // "Ungroup By Me"
  ungroupButton: "Poista erottele minulla",
  // "Select Me"
  selectButton: "Valitse minut",
  // "Hide column"
  hideColumn: "Piilota sarake",
  // "Show column"
  showColumn: "Näytä sarake",
  // "Make column private"
  makePrivateColumn: "Merkitse sarake yksityiseksi",
  // "Make column public"
  makePublicColumn: "Merkitse sarake julkiseksi",
  // "Move to Detail"
  moveToDetail: "Siirrä yksityiskohtiin",
  // "Show as Column"
  showAsColumn: "Näytä sarakkeena",
  // "Search..."
  filterPlaceholder: "Etsi...",
  // "Remove rows"
  removeRows: "Poista rivejä",
  // "Show"
  showLabel: "Näytä",
  // "entries"
  entriesLabel: "vastauksia",
  // "Texts in table"
  visualizer_text: "Tekstitaulukko",
  // "Wordcloud"
  visualizer_wordcloud: "Sanapilvi",
  // "Histogram"
  visualizer_histogram: "Histogrammi",
  // "Average"
  visualizer_number: "Keskiarvo",
  // "Table"
  visualizer_choices: "Taulukko",
  // "Chart"
  visualizer_selectBase: "Kuvaaja",
  // "Chart"
  visualizer_matrix: "Kuvaaja",
  // "Bar"
  chartType_bar: "Pylväs",
  // "Vertical Bar"
  chartType_vbar: "Vaakapyöväs",
  // "Stacked Bar"
  chartType_stackedbar: "Pinottu pylväs",
  // "Doughnut"
  chartType_doughnut: "Donitsi",
  // "Pie"
  chartType_pie: "Piirakka",
  // "Scatter"
  chartType_scatter: "Hajonta",
  // "Gauge"
  chartType_gauge: "Mittari",
  // "Bullet"
  chartType_bullet: "Luoti",
  // "Line"
  chartType_line: "Viiva",
  // [Auto-translated] "Radar"
  chartType_radar: "Tutka",
  // "Hide"
  hideButton: "Piilota",
  // "Make private"
  makePrivateButton: "Merkise yksityiseksi",
  // "Make public"
  makePublicButton: "Merkitse julkiseksi",
  // "Show"
  showButton: "Näytä",
  // "Filter"
  filter: "Rajaa",
  // "Reset Filter"
  resetFilter: "Nollaa Rajaus",
  // "Change Locale"
  changeLocale: "Vaihda kieli",
  // "Clear"
  clearButton: "Nollaa",
  // "Choose question to show..."
  addElement: "Valitse näytettävä kysymys...",
  // "Default Order"
  defaultOrder: "Oletusjärjestys",
  // "Ascending"
  ascOrder: "Nouseva",
  // "Descending"
  descOrder: "Laskeva",
  // "Show minor columns"
  showMinorColumns: "Näytä alasarakkeet",
  // [Auto-translated] "Actions"
  actionsColumn: "Toimet",
  // "Other items and comments"
  otherCommentTitle: "Muut asiat ja kommentit",
  // "Show percentages"
  showPercentages: "Näytä prosentit",
  // "Hide percentages"
  hidePercentages: "Piilota prosentit",
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Excel",
  // "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Lataa kuvaaja PNG kuvana",
  // "Hide empty answers"
  hideEmptyAnswers: "Piilota tyhjät vastaukset",
  // "Show empty answers"
  showEmptyAnswers: "Näytä tyhjät vastaukset",
  // "All answers"
  "topNValueText-1": "Kaikki vastaukset",
  // "Top 5 answers"
  topNValueText5: "Top 5 vastaukset",
  // "Top 10 answers"
  topNValueText10: "Top 10 vastaukset",
  // "Top 20 answers"
  topNValueText20: "Top 20 vastaukset",
  // "Hide missing answers"
  hideMissingAnswers: "Piilota puuttuvat vastaukset",
  // "Show missing answers"
  showMissingAnswers: "Näytä puuttuvat vastaukset",
  // "Missing answers"
  missingAnswersLabel: "Puuttuvat vastaukset",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Tätä kysymystyyppiä ei voida visualisoida.",
  // "There are no results yet"
  noResults: "Ei vielä tuloksia",
  // "Per Values"
  showPerValues: "Näytä arvottain",
  // "Per Columns"
  showPerColumns: "Näytä sarakkeittain",
  // "Answer"
  answer: "Vastaus",
  // "Correct answer: "
  correctAnswer: "Oikea vastaus: ",
  // "Percent"
  percent: "Prosentti",
  // "Percentage"
  percentage: "Prosenttiyksikkö",
  // "Chart"
  statistics_chart: "Kuvaaja",
  // "Responses"
  responses: "Vastaukset",
  // "NPS"
  visualizer_nps: "NPS",
  // "NPS"
  npsScore: "NPS",
  // "Promoters"
  npsPromoters: "Suosittelija",
  // "Passives"
  npsPassives: "Passiivinen",
  // "Detractors"
  npsDetractors: "Arvostelija",
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "Luokka (X-akseli):",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "Legenda (sarja):",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmentit:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Ryhmät:",
  // [Auto-translated] "Not selected"
  notSelected: "Ei valittu"
};

setupLocale({ localeCode: "fi", strings: finnishStrings, nativeName: "Suomi" });
