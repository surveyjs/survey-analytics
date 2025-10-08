import { setupLocale } from "../localizationManager";

export var plStrings = {
  // "Group By Me"
  groupButton: "Grupuj według mnie",
  // "Ungroup By Me"
  ungroupButton: "Rozgrupuj według mnie",
  // "Select Me"
  selectButton: "Wybierz",
  // "Hide column"
  hideColumn: "Ukryj kolumnę",
  // "Show column"
  showColumn: "Pokaż kolumnę",
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
  // "Texts in table"
  visualizer_text: "Teksty w tabeli",
  // "Wordcloud"
  visualizer_wordcloud: "Chmura słów",
  // "Histogram"
  visualizer_histogram: "Histogram",
  // "Average"
  visualizer_number: "Średnia",
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
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Excel",
  // "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Pobierz diagram jako PNG",
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
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "Kategoria (oś X):",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "Legenda (seria):",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmenty:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Grupy:",
  // [Auto-translated] "Not selected"
  notSelected: "Nie wybrano",
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
  groupedYearsAxisTitle: "Rok kończy się na"
};

setupLocale({ localeCode: "pl", strings: plStrings, nativeName: "Polski" });