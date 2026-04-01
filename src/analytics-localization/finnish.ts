import { setupLocale } from "../localizationManager";

export var finnishStrings = {
  // "Group By Me"
  groupButton: "Erottele minulla",
  // "Ungroup By Me"
  ungroupButton: "Poista erottele minulla",
  // "Select Me"
  selectButton: "Valitse minut",
  // [Auto-translated] "Column reorder"
  columnReorder: "Sarakkeiden uudelleenjärjestely",
  // "Hide column"
  hideColumn: "Piilota sarake",
  // "Show column"
  showColumn: "Näytä sarake",
  // [Auto-translated] "Columns"
  columns: "Pylväät",
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
  // [Auto-translated] "Entries on Page:"
  entriesOnPageLabel: "Merkinnät sivulla:",
  // "Texts in table"
  visualizer_text: "Tekstitaulukko",
  // "Wordcloud"
  visualizer_wordcloud: "Sanapilvi",
  // "Histogram"
  visualizer_histogram: "Histogrammi",
  // "Average"
  visualizer_number: "Keskiarvo",
  // [Auto-translated] "Average"
  visualizer_average: "Keskiarvo",
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
  // [Auto-translated] "Histogram"
  chartType_histogram: "Histogrammi",
  // [Auto-translated] "Vertical Histogram"
  chartType_vhistogram: "Pystysuora histogrammi",
  // [Auto-translated] "Stacked Histogram"
  chartType_stackedhistogram: "Pinottu histogrammi",
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
  // [Auto-translated] "All questions"
  allQuestions: "Kaikki kysymykset",
  // [Auto-translated] "Select all"
  selectAll: "Valitse kaikki",
  // [Auto-translated] "Clear selection"
  clearSelection: "Selkeä valinta",
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
  // [Auto-translated] "Export As..."
  exportAs: "Vienti nimellä...",
  // [Auto-translated] "PDF"
  pdfDownloadCaption: "PDF",
  // [Auto-translated] "Excel"
  xlsxDownloadCaption: "Excel",
  // [Auto-translated] "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Lataa kuvaaja PNG kuvana",
  // [Auto-translated] "response(s)"
  responsesText: "Vastaukset(t)",
  // [Auto-translated] "No data"
  noData: "Ei dataa",
  // [Auto-translated] "Select date range..."
  selectDateRange: "Valitse päivämääräväli...",
  // [Auto-translated] "Include today"
  includeToday: "Sisällytä tänään",
  // [Auto-translated] "Custom"
  reportingPeriodCustom: "Tapana",
  // [Auto-translated] "Last 7 days"
  reportingPeriodLast7days: "Viimeiset 7 päivää",
  // [Auto-translated] "Last 14 days"
  reportingPeriodLast14days: "Viimeiset 14 päivää",
  // [Auto-translated] "Last 28 days"
  reportingPeriodLast28days: "Viimeiset 28 päivää",
  // [Auto-translated] "Last 30 days"
  reportingPeriodLast30days: "Viimeiset 30 päivää",
  // [Auto-translated] "Last week (starts Monday)"
  reportingPeriodLastWeekMon: "Viime viikko (alkaa maanantaina)",
  // [Auto-translated] "Last week (starts Sunday)"
  reportingPeriodLastWeekSun: "Viime viikko (alkaa sunnuntaina)",
  // [Auto-translated] "Last month"
  reportingPeriodLastMonth: "Viime kuussa",
  // [Auto-translated] "Last quarter"
  reportingPeriodLastQuarter: "Viimeinen neljännes",
  // [Auto-translated] "Last year"
  reportingPeriodLastYear: "Viime vuonna",
  // [Auto-translated] "This week to date (starts Sunday)"
  reportingPeriodWtdSun: "Tällä viikolla tähän mennessä (alkaa sunnuntaina)",
  // [Auto-translated] "This week to date (starts Monday)"
  reportingPeriodWtdMon: "Tällä viikolla tähän mennessä (alkaa maanantaina)",
  // [Auto-translated] "This month to date"
  reportingPeriodMtd: "Tästä kuukaudesta tähän päivään asti",
  // [Auto-translated] "This quarter to date"
  reportingPeriodQtd: "Tämä neljännesvuosi tähän mennessä",
  // [Auto-translated] "This year to date"
  reportingPeriodYtd: "Tänä vuonna tähän päivään asti",
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
  // [Auto-translated] "NPS"
  visualizer_nps: "NPS",
  // [Auto-translated] "Chart"
  visualizer_boolean: "Kaavio",
  // [Auto-translated] "Table"
  visualizer_options: "Taulukko",
  // [Auto-translated] "NPS"
  npsScore: "NPS",
  // "Promoters"
  npsPromoters: "Suosittelija",
  // "Passives"
  npsPassives: "Passiivinen",
  // "Detractors"
  npsDetractors: "Arvostelija",
  // [Auto-translated] "Category (X Axis)"
  axisXSelectorTitle: "Kategoria (X-akseli)",
  // [Auto-translated] "Legend (Series)"
  axisYSelectorTitle: "Legend (sarja)",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmentit:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Ryhmät:",
  // [Auto-translated] "Second Y axis"
  secondYAxisToggleTitle: "Toinen Y-akseli",
  // [Auto-translated] "Select a data field..."
  selectDataField: "Valitse tietokenttä...",
  // [Auto-translated] "Default"
  intervalMode_default: "Laiminlyönti",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Vuosikymmeniä",
  // [Auto-translated] "Years"
  intervalMode_years: "Vuosia",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Neljäsosaa",
  // [Auto-translated] "Months"
  intervalMode_months: "Kuukautta",
  // [Auto-translated] "Days"
  intervalMode_days: "Päivää",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Tapa",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Auto",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Välein:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Näytä yksittäiset arvot",
  // [Auto-translated] "Show running totals"
  runningTotals: "Näytä juoksevat kokonaismäärät",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Vertaile kausia",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Näytä aikajana",
  // [Auto-translated] "None"
  noneAggregateText: "Ei lainkaan",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Aggregaatti:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "Vuosi päättyy",
  // [Auto-translated] "Series {0}"
  seriesListSeries: "Kausi {0}",
  // [Auto-translated] "Values"
  seriesListValuesLabel: "Arvot",
  // [Auto-translated] "Remove"
  seriesListRemove: "Poista",
  // [Auto-translated] "Add Series"
  seriesListAdd: "Add Series",
  // [Auto-translated] "Move to second axis"
  seriesListMoveToSecondAxis: "Siirtyminen toiselle akselille",
  // [Auto-translated] "Move to first axis"
  seriesListMoveToFirstAxis: "Siirtyminen ensimmäiselle akselille",
  // [Auto-translated] "Count"
  aggregationCount: "Kreivi",
  // [Auto-translated] "Sum"
  aggregationSum: "Summa",
  // [Auto-translated] "Average"
  aggregationAverage: "Keskiarvo",
  // [Auto-translated] "Close"
  close: "Sulje"
};

setupLocale({ localeCode: "fi", strings: finnishStrings, nativeName: "Suomi" });
