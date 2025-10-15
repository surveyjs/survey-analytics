import { setupLocale } from "../localizationManager";

export var germanStrings = {
  // "Group By Me"
  groupButton: "Gruppieren",
  // "Ungroup By Me"
  ungroupButton: "Gruppierung aufheben",
  // "Select Me"
  selectButton: "Mich auswählen",
  // "Hide column"
  hideColumn: "Spalte ausblenden",
  // "Show column"
  showColumn: "Spalte einblenden",
  // "Make column private"
  makePrivateColumn: "Spalte privat machen",
  // "Make column public"
  makePublicColumn: "Spalte veröffentlichen",
  // "Move to Detail"
  moveToDetail: "in Details verschieben",
  // "Show as Column"
  showAsColumn: "Als Spalte anzeigen",
  // "Search..."
  filterPlaceholder: "Suche...",
  // "Remove rows"
  removeRows: "Zeilen entfernen",
  // "Show"
  showLabel: "Anzeigen",
  // "entries"
  entriesLabel: "Einträge",
  // "Texts in table"
  visualizer_text: "Texte in Tabellenform",
  // "Wordcloud"
  visualizer_wordcloud: "Wordcloud",
  // "Histogram"
  visualizer_histogram: "Histogramm",
  // "Average"
  visualizer_number: "Durchschnitt",
  // "Table"
  visualizer_choices: "Tabelle",
  // "Chart"
  visualizer_selectBase: "Diagrammtyp",
  // [Auto-translated] "Chart"
  visualizer_matrix: "Diagramm",
  // "Bar"
  chartType_bar: "Balkendiagramm",
  // "Vertical Bar"
  chartType_vbar: "Balkendiagramm vertikal",
  // "Stacked Bar"
  chartType_stackedbar: "Gestapeltes Balkendiagramm",
  // "Doughnut"
  chartType_doughnut: "Donut-Diagramm",
  // "Pie"
  chartType_pie: "Kreisdiagramm",
  // "Scatter"
  chartType_scatter: "Punktediagramm",
  // "Gauge"
  chartType_gauge: "Pegeldiagramm",
  // "Bullet"
  chartType_bullet: "Aufzählungsdiagramm",
  // [Auto-translated] "Line"
  chartType_line: "Linie",
  // [Auto-translated] "Radar"
  chartType_radar: "Radar",
  // "Hide"
  hideButton: "Ausblenden",
  // "Make private"
  makePrivateButton: "Privat machen",
  // "Make public"
  makePublicButton: "Öffentlich machen",
  // "Show"
  showButton: "Anzeigen",
  // "Filter"
  filter: "Filter",
  // "Reset Filter"
  resetFilter: "Filter zurücksetzen",
  // "Change Locale"
  changeLocale: "Lokalisierung ändern",
  // "Clear"
  clearButton: "Einstellungen löschen",
  // "Choose question to show..."
  addElement: "Wählen Sie eine Frage, um zu zeigen...",
  // "Default Order"
  defaultOrder: "Standardreihenfolge",
  // "Ascending"
  ascOrder: "Aufsteigend",
  // "Descending"
  descOrder: "Absteigend",
  // "Show minor columns"
  showMinorColumns: "Kleinere Spalten anzeigen",
  // [Auto-translated] "Actions"
  actionsColumn: "Aktionen",
  // "Other items and comments"
  otherCommentTitle: "Andere Punkte und Kommentare",
  // "Show percentages"
  showPercentages: "Prozentsätze anzeigen",
  // "Hide percentages"
  hidePercentages: "Prozentsätze ausblenden",
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Excel",
  // "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Diagramm als PNG herunterladen",
  // "Hide empty answers"
  hideEmptyAnswers: "Leere Antworten ausblenden",
  // "Show empty answers"
  showEmptyAnswers: "Leere Antworten anzeigen",
  // "All answers"
  "topNValueText-1": "Alle Antworten",
  // "Top 5 answers"
  topNValueText5: "Top 5 Antworten",
  // "Top 10 answers"
  topNValueText10: "Top 10 Antworten",
  // "Top 20 answers"
  topNValueText20: "Top 20 Antworten",
  // "Hide missing answers"
  hideMissingAnswers: "Fehlende Antworten ausblenden",
  // "Show missing answers"
  showMissingAnswers: "Fehlende Antworten anzeigen",
  // "Missing answers"
  missingAnswersLabel: "Fehlende Antworten",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Für diesen Fragetyp gibt es noch keine Visualisierung.",
  // "There are no results yet"
  noResults: "Es liegen noch keine Ergebnisse vor",
  // "Per Values"
  showPerValues: "Pro Wert",
  // "Per Columns"
  showPerColumns: "Pro Spalte",
  // "Answer"
  answer: "Antwort",
  // "Correct answer: "
  correctAnswer: "Korrekte Antwort: ",
  // "Percent"
  percent: "Prozent",
  // [Auto-translated] "Percentage"
  percentage: "Prozentsatz",
  // [Auto-translated] "Chart"
  statistics_chart: "Diagramm",
  // "Responses"
  responses: "Antworten",
  // "NPS"
  visualizer_nps: "NPS",
  // [Auto-translated] "Chart"
  visualizer_boolean: "Diagramm",
  // "Table"
  visualizer_options: "Tabelle",
  // "NPS"
  npsScore: "NPS",
  // "Promoters"
  npsPromoters: "Promotoren",
  // "Passives"
  npsPassives: "Passive",
  // "Detractors"
  npsDetractors: "Detraktoren",
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "Kategorie (X-Achse):",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "Legende (Serie):",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmente:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Gruppen:",
  // [Auto-translated] "Not selected"
  notSelected: "Nicht ausgewählt",
  // [Auto-translated] "Default"
  intervalMode_default: "Vorgabe",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Dekaden",
  // [Auto-translated] "Years"
  intervalMode_years: "Jahre",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Quartier",
  // [Auto-translated] "Months"
  intervalMode_months: "Monate",
  // [Auto-translated] "Days"
  intervalMode_days: "Tage",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Gewohnheit",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Auto",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Intervalle:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Einzelne Werte anzeigen",
  // [Auto-translated] "Show running totals"
  runningTotals: "Laufende Summen anzeigen",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Zeiträume vergleichen",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Zeitleiste anzeigen",
  // [Auto-translated] "None"
  noneAggregateText: "Nichts",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Aggregat:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "Das Jahr endet mit"
};

setupLocale({ localeCode: "de", strings: germanStrings, nativeName: "Deutsch" });