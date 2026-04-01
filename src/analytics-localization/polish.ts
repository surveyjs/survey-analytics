import { setupLocale } from "../localizationManager";

export var plStrings = {
  // "Group By Me"
  groupButton: "Grupuj według mnie",
  // "Ungroup By Me"
  ungroupButton: "Rozgrupuj według mnie",
  // "Select Me"
  selectButton: "Wybierz",
  // [Auto-translated] "Column reorder"
  columnReorder: "Przekształcenie kolumn",
  // "Hide column"
  hideColumn: "Ukryj kolumnę",
  // "Show column"
  showColumn: "Pokaż kolumnę",
  // [Auto-translated] "Columns"
  columns: "Kolumny",
  // "Make column private"
  makePrivateColumn: "Uczyń kolumnę prywatną",
  // "Make column public"
  makePublicColumn: "Uczyń kolumnę publiczną",
  // "Move to Detail"
  moveToDetail: "Przenieś do szczegółów",
  // "Show as Column"
  showAsColumn: "Pokaż jako kolumnę",
  // "Search..."
  filterPlaceholder: "Szukaj...",
  // "Remove rows"
  removeRows: "Usuń wiersze",
  // "Show"
  showLabel: "Pokaż",
  // "entries"
  entriesLabel: "wejścia",
  // [Auto-translated] "Entries on Page:"
  entriesOnPageLabel: "Wpisy na stronie:",
  // "Texts in table"
  visualizer_text: "Teksty w tabeli",
  // "Wordcloud"
  visualizer_wordcloud: "Chmura słów",
  // [Auto-translated] "Histogram"
  visualizer_histogram: "Histogram",
  // "Average"
  visualizer_number: "Średnia",
  // [Auto-translated] "Average"
  visualizer_average: "Średnia",
  // "Table"
  visualizer_choices: "Tabela",
  // "Chart"
  visualizer_selectBase: "Wykres",
  // "Chart"
  visualizer_matrix: "Wykres",
  // "Bar"
  chartType_bar: "Słupkowy",
  // "Vertical Bar"
  chartType_vbar: "Słupkowy pionowy",
  // "Stacked Bar"
  chartType_stackedbar: "Słupkowy skumulowany",
  // "Doughnut"
  chartType_doughnut: "Oponka",
  // "Pie"
  chartType_pie: "Tarta",
  // "Scatter"
  chartType_scatter: "Rozrzut",
  // "Gauge"
  chartType_gauge: "Skala",
  // "Bullet"
  chartType_bullet: "Pocisk",
  // [Auto-translated] "Line"
  chartType_line: "Linia",
  // [Auto-translated] "Radar"
  chartType_radar: "Radar",
  // [Auto-translated] "Histogram"
  chartType_histogram: "Histogram",
  // [Auto-translated] "Vertical Histogram"
  chartType_vhistogram: "Histogram pionowy",
  // [Auto-translated] "Stacked Histogram"
  chartType_stackedhistogram: "Histogram ułożony",
  // "Hide"
  hideButton: "Ukryj",
  // "Make private"
  makePrivateButton: "Uczyń prywatnym",
  // "Make public"
  makePublicButton: "Uczyń publicznym",
  // "Show"
  showButton: "Pokaż",
  // "Filter"
  filter: "Filtruj",
  // "Reset Filter"
  resetFilter: "Resetuj filtr",
  // "Change Locale"
  changeLocale: "Zmień lokalizację",
  // "Clear"
  clearButton: "Wyczyść",
  // "Choose question to show..."
  addElement: "Wybierz pytanie do pokazania...",
  // [Auto-translated] "All questions"
  allQuestions: "Wszystkie pytania",
  // [Auto-translated] "Select all"
  selectAll: "Wybierz wszystkie",
  // [Auto-translated] "Clear selection"
  clearSelection: "Jasny wybór",
  // "Default Order"
  defaultOrder: "Domyślne sortowanie",
  // "Ascending"
  ascOrder: "Rosnąco",
  // "Descending"
  descOrder: "Malejąco",
  // "Show minor columns"
  showMinorColumns: "Pokaż mniejsze kolumny",
  // [Auto-translated] "Actions"
  actionsColumn: "Akcje",
  // "Other items and comments"
  otherCommentTitle: "Inne elementy i komentarze",
  // "Show percentages"
  showPercentages: "Pokaż procenty",
  // "Hide percentages"
  hidePercentages: "Ukryj procenty",
  // [Auto-translated] "Export As..."
  exportAs: "Eksportuj jako...",
  // [Auto-translated] "PDF"
  pdfDownloadCaption: "PDF",
  // [Auto-translated] "Excel"
  xlsxDownloadCaption: "Excel",
  // [Auto-translated] "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Pobierz diagram jako PNG",
  // [Auto-translated] "response(s)"
  responsesText: "Odpowiedź(y)",
  // [Auto-translated] "No data"
  noData: "Brak danych",
  // [Auto-translated] "Select date range..."
  selectDateRange: "Wybierz przedział dat...",
  // [Auto-translated] "Include today"
  includeToday: "Uwzględnić dziś",
  // [Auto-translated] "Custom"
  reportingPeriodCustom: "Zwyczaj",
  // [Auto-translated] "Last 7 days"
  reportingPeriodLast7days: "Ostatnie 7 dni",
  // [Auto-translated] "Last 14 days"
  reportingPeriodLast14days: "Ostatnie 14 dni",
  // [Auto-translated] "Last 28 days"
  reportingPeriodLast28days: "Ostatnie 28 dni",
  // [Auto-translated] "Last 30 days"
  reportingPeriodLast30days: "Ostatnie 30 dni",
  // [Auto-translated] "Last week (starts Monday)"
  reportingPeriodLastWeekMon: "W zeszłym tygodniu (zaczyna się w poniedziałek)",
  // [Auto-translated] "Last week (starts Sunday)"
  reportingPeriodLastWeekSun: "W zeszłym tygodniu (zaczyna się w niedzielę)",
  // [Auto-translated] "Last month"
  reportingPeriodLastMonth: "W zeszłym miesiącu",
  // [Auto-translated] "Last quarter"
  reportingPeriodLastQuarter: "Ostatnia kwarta",
  // [Auto-translated] "Last year"
  reportingPeriodLastYear: "W zeszłym roku",
  // [Auto-translated] "This week to date (starts Sunday)"
  reportingPeriodWtdSun: "W tym tygodniu do dziś (zaczyna się w niedzielę)",
  // [Auto-translated] "This week to date (starts Monday)"
  reportingPeriodWtdMon: "Od tej pory w tym tygodniu (zaczyna się w poniedziałek)",
  // [Auto-translated] "This month to date"
  reportingPeriodMtd: "Do tej pory w tym miesiącu",
  // [Auto-translated] "This quarter to date"
  reportingPeriodQtd: "Ten kwartał do dziś",
  // [Auto-translated] "This year to date"
  reportingPeriodYtd: "W tym roku do dziś",
  // "Hide empty answers"
  hideEmptyAnswers: "Ukryj puste odpowiedzi",
  // "Show empty answers"
  showEmptyAnswers: "Pokaż puste odpowiedzi",
  // "All answers"
  "topNValueText-1": "Wszystkie odpowiedzi",
  // "Top 5 answers"
  topNValueText5: "Pierwsze 5 odpowiedzi",
  // "Top 10 answers"
  topNValueText10: "Pierwsze 10 odpowiedzi",
  // "Top 20 answers"
  topNValueText20: "Pierwsze 20 odpowiedzi",
  // "Hide missing answers"
  hideMissingAnswers: "Ukryj nieodpowiedziane pytania",
  // "Show missing answers"
  showMissingAnswers: "Pokaż nieodpowiedziane pytania",
  // "Missing answers"
  missingAnswersLabel: "Nieodpowiedziane pytania",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Ten typ pytania nie został jeszcze zwizualizowany",
  // "There are no results yet"
  noResults: "Nie ma jeszcze wyników",
  // "Per Values"
  showPerValues: "Według wartości",
  // "Per Columns"
  showPerColumns: "Według kolumn",
  // "Answer"
  answer: "Odpowiedź",
  // "Correct answer: "
  correctAnswer: "Odpowiedź poprawna: ",
  // "Percent"
  percent: "Procent",
  // [Auto-translated] "Percentage"
  percentage: "Procent",
  // [Auto-translated] "Chart"
  statistics_chart: "Wykres",
  // "Responses"
  responses: "Odpowiedzi",
  // [Auto-translated] "NPS"
  visualizer_nps: "Wskaźnik NPS",
  // [Auto-translated] "Chart"
  visualizer_boolean: "Wykres",
  // [Auto-translated] "Table"
  visualizer_options: "Stół",
  // [Auto-translated] "NPS"
  npsScore: "Wskaźnik NPS",
  // [Auto-translated] "Promoters"
  npsPromoters: "Promotorów",
  // [Auto-translated] "Passives"
  npsPassives: "Passives",
  // [Auto-translated] "Detractors"
  npsDetractors: "Przeciwników",
  // [Auto-translated] "Category (X Axis)"
  axisXSelectorTitle: "Kategoria (oś X)",
  // [Auto-translated] "Legend (Series)"
  axisYSelectorTitle: "Legenda (seria)",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmenty:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Grupy:",
  // [Auto-translated] "Second Y axis"
  secondYAxisToggleTitle: "Druga oś Y",
  // [Auto-translated] "Select a data field..."
  selectDataField: "Wybierz pole danych...",
  // [Auto-translated] "Default"
  intervalMode_default: "Domyślny",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Dziesięciolecia",
  // [Auto-translated] "Years"
  intervalMode_years: "Lata",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Kwartałów",
  // [Auto-translated] "Months"
  intervalMode_months: "Miesiące",
  // [Auto-translated] "Days"
  intervalMode_days: "Dni",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Zwyczaj",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Automatycznie",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Odstępach czasu:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Pokaż poszczególne wartości",
  // [Auto-translated] "Show running totals"
  runningTotals: "Pokazywanie sum bieżących",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Porównywanie okresów",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Wyświetl oś czasu",
  // [Auto-translated] "None"
  noneAggregateText: "Żaden",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Kruszywo:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "Rok kończy się na",
  // [Auto-translated] "Series {0}"
  seriesListSeries: "{0} serii",
  // [Auto-translated] "Values"
  seriesListValuesLabel: "Wartości",
  // [Auto-translated] "Remove"
  seriesListRemove: "Usuń",
  // [Auto-translated] "Add Series"
  seriesListAdd: "Dodaj serię",
  // [Auto-translated] "Move to second axis"
  seriesListMoveToSecondAxis: "Przesunięcie na drugą oś",
  // [Auto-translated] "Move to first axis"
  seriesListMoveToFirstAxis: "Przesunięcie się na pierwszą oś",
  // [Auto-translated] "Count"
  aggregationCount: "Hrabia",
  // [Auto-translated] "Sum"
  aggregationSum: "Suma",
  // [Auto-translated] "Average"
  aggregationAverage: "Średnia",
  // [Auto-translated] "Close"
  close: "Zamknij"
};

setupLocale({ localeCode: "pl", strings: plStrings, nativeName: "Polski" });