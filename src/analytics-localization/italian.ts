import { setupLocale } from "../localizationManager";

export var italianStrings = {
  // "Group By Me"
  groupButton: "Raggruppa",
  // "Ungroup By Me"
  ungroupButton: "Dividi",
  // "Select Me"
  selectButton: "Selezionami",
  // [Auto-translated] "Column reorder"
  columnReorder: "Riordino delle colonne",
  // "Hide column"
  hideColumn: "Nascondi colonna",
  // "Show column"
  showColumn: "Mostra colonna",
  // [Auto-translated] "Columns"
  columns: "Colonne",
  // "Make column private"
  makePrivateColumn: "Rendi la colonna privata",
  // "Make column public"
  makePublicColumn: "Rendi la colonna pubblica",
  // "Move to Detail"
  moveToDetail: "Sposta in Dettaglio",
  // "Show as Column"
  showAsColumn: "Mostra come Colonna",
  // "Search..."
  filterPlaceholder: "Cerca...",
  // "Remove rows"
  removeRows: "Rimuovi righe",
  // "Show"
  showLabel: "Mostra",
  // "entries"
  entriesLabel: "voci",
  // [Auto-translated] "Entries on Page:"
  entriesOnPageLabel: "Voci sulla pagina:",
  // "Texts in table"
  visualizer_text: "Parole in tabella",
  // "Wordcloud"
  visualizer_wordcloud: "Nuvola di parole",
  // "Histogram"
  visualizer_histogram: "Istogramma",
  // "Average"
  visualizer_number: "Media",
  // [Auto-translated] "Average"
  visualizer_average: "Media",
  // "Table"
  visualizer_choices: "Tabella",
  // "Chart"
  visualizer_selectBase: "Grafico",
  // [Auto-translated] "Chart"
  visualizer_matrix: "Tabella",
  // [Auto-translated] "Bar"
  chartType_bar: "Bar",
  // "Vertical Bar"
  chartType_vbar: "Grafico a barre verticali",
  // "Stacked Bar"
  chartType_stackedbar: "Grafico a barre sovrapposte",
  // "Doughnut"
  chartType_doughnut: "Grafico a ciambella",
  // "Pie"
  chartType_pie: "Grafico a torta",
  // "Scatter"
  chartType_scatter: "Grafico a dispersione",
  // "Gauge"
  chartType_gauge: "Grafico Gauge",
  // "Bullet"
  chartType_bullet: "Punto",
  // [Auto-translated] "Line"
  chartType_line: "Linea",
  // [Auto-translated] "Radar"
  chartType_radar: "Radar",
  // [Auto-translated] "Histogram"
  chartType_histogram: "Istogramma",
  // [Auto-translated] "Vertical Histogram"
  chartType_vhistogram: "Istogramma verticale",
  // [Auto-translated] "Stacked Histogram"
  chartType_stackedhistogram: "Istogramma impilato",
  // "Hide"
  hideButton: "Nascondi",
  // "Make private"
  makePrivateButton: "Rendi privato",
  // "Make public"
  makePublicButton: "Rendi pubblico",
  // "Show"
  showButton: "Mostra",
  // "Filter"
  filter: "Filtro",
  // "Reset Filter"
  resetFilter: "Cancella filtro",
  // "Change Locale"
  changeLocale: "Cambia lingua",
  // "Clear"
  clearButton: "Cancella",
  // "Choose question to show..."
  addElement: "Scegli la domanda da mostrare...",
  // [Auto-translated] "All questions"
  allQuestions: "Tutte le domande",
  // [Auto-translated] "Select all"
  selectAll: "Seleziona tutti",
  // [Auto-translated] "Clear selection"
  clearSelection: "Selezione chiara",
  // "Default Order"
  defaultOrder: "Ordine di Default",
  // "Ascending"
  ascOrder: "Ascendente",
  // "Descending"
  descOrder: "Discendente",
  // "Show minor columns"
  showMinorColumns: "Mostra colonne secondarie",
  // [Auto-translated] "Actions"
  actionsColumn: "Azioni",
  // "Other items and comments"
  otherCommentTitle: "Altri punti e commenti",
  // "Show percentages"
  showPercentages: "Mostra percentuali",
  // "Hide percentages"
  hidePercentages: "Nascondi percentuali",
  // [Auto-translated] "Export As..."
  exportAs: "Esporta come...",
  // [Auto-translated] "PDF"
  pdfDownloadCaption: "PDF",
  // [Auto-translated] "Excel"
  xlsxDownloadCaption: "Excel",
  // [Auto-translated] "CSV"
  csvDownloadCaption: "CSV",
  // [Auto-translated] "Export as PDF"
  pdfDownloadHint: "Esporta come PDF",
  // [Auto-translated] "Export as Excel"
  xlsxDownloadHint: "Esporta come Excel",
  // [Auto-translated] "Export as CSV"
  csvDownloadHint: "Esportazione come CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Scarica il grafico in formato png",
  // [Auto-translated] "response(s)"
  responsesText: "Risposta/e",
  // [Auto-translated] "No data"
  noData: "Nessun dato",
  // [Auto-translated] "Select date range..."
  selectDateRange: "Seleziona l'intervallo di date...",
  // [Auto-translated] "Include today"
  includeToday: "Include oggi",
  // [Auto-translated] "Custom"
  reportingPeriodCustom: "Consuetudine",
  // [Auto-translated] "Last 7 days"
  reportingPeriodLast7days: "Ultimi 7 giorni",
  // [Auto-translated] "Last 14 days"
  reportingPeriodLast14days: "Ultimi 14 giorni",
  // [Auto-translated] "Last 28 days"
  reportingPeriodLast28days: "Ultimi 28 giorni",
  // [Auto-translated] "Last 30 days"
  reportingPeriodLast30days: "Ultimi 30 giorni",
  // [Auto-translated] "Last week (starts Monday)"
  reportingPeriodLastWeekMon: "La settimana scorsa (inizia lunedì)",
  // [Auto-translated] "Last week (starts Sunday)"
  reportingPeriodLastWeekSun: "La settimana scorsa (inizia domenica)",
  // [Auto-translated] "Last month"
  reportingPeriodLastMonth: "Il mese scorso",
  // [Auto-translated] "Last quarter"
  reportingPeriodLastQuarter: "Ultimo quarto",
  // [Auto-translated] "Last year"
  reportingPeriodLastYear: "L'anno scorso",
  // [Auto-translated] "This week to date (starts Sunday)"
  reportingPeriodWtdSun: "Questa settimana ad oggi (inizia domenica)",
  // [Auto-translated] "This week to date (starts Monday)"
  reportingPeriodWtdMon: "Questa settimana ad oggi (inizia lunedì)",
  // [Auto-translated] "This month to date"
  reportingPeriodMtd: "Questo mese fino ad oggi",
  // [Auto-translated] "This quarter to date"
  reportingPeriodQtd: "Questo trimestre fino ad oggi",
  // [Auto-translated] "This year to date"
  reportingPeriodYtd: "Quest'anno fino ad oggi",
  // "Hide empty answers"
  hideEmptyAnswers: "Nascondi risposte vuote",
  // "Show empty answers"
  showEmptyAnswers: "Mostra risposte vuote",
  // "All answers"
  "topNValueText-1": "Tutte le risposte",
  // "Top 5 answers"
  topNValueText5: "Top 5 risposte",
  // "Top 10 answers"
  topNValueText10: "Top 10 risposte",
  // "Top 20 answers"
  topNValueText20: "Top 20 risposte",
  // "Hide missing answers"
  hideMissingAnswers: "Nascondi le risposte mancanti",
  // "Show missing answers"
  showMissingAnswers: "Mostra le risposte mancanti",
  // "Missing answers"
  missingAnswersLabel: "Risposte mancanti",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Questo tipo di domanda non è ancora stato visualizzato",
  // "There are no results yet"
  noResults: "Non ci sono ancora risultati",
  // "Per Values"
  showPerValues: "Per Valori",
  // "Per Columns"
  showPerColumns: "Per Colonne",
  // "Answer"
  answer: "Risposta",
  // "Correct answer: "
  correctAnswer: "Risposta esatta: ",
  // "Percent"
  percent: "Percentuale",
  // [Auto-translated] "Percentage"
  percentage: "Percentuale",
  // [Auto-translated] "Chart"
  statistics_chart: "Tabella",
  // "Responses"
  responses: "Risposte",
  // [Auto-translated] "Total responses"
  totalResponses: "Risposte totali",
  // [Auto-translated] "NPS"
  visualizer_nps: "Rete nazionale di dati",
  // [Auto-translated] "Chart"
  visualizer_boolean: "Tabella",
  // [Auto-translated] "Table"
  visualizer_options: "Tavolo",
  // [Auto-translated] "NPS"
  npsScore: "Rete nazionale di dati",
  // [Auto-translated] "Promoters"
  npsPromoters: "Promotori",
  // [Auto-translated] "Passives"
  npsPassives: "Passivi",
  // [Auto-translated] "Detractors"
  npsDetractors: "Detrattori",
  // [Auto-translated] "Category (X Axis)"
  axisXSelectorTitle: "Categoria (asse X)",
  // [Auto-translated] "Legend (Series)"
  axisYSelectorTitle: "Legend (serie)",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmenti:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Gruppi:",
  // [Auto-translated] "Secondary Y axis"
  secondYAxisToggleTitle: "Secondo asse Y",
  // [Auto-translated] "Select a data field..."
  selectDataField: "Seleziona un campo dati...",
  // [Auto-translated] "Default"
  intervalMode_default: "Default",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Decenni",
  // [Auto-translated] "Years"
  intervalMode_years: "Anni",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Quarti",
  // [Auto-translated] "Months"
  intervalMode_months: "Mesi",
  // [Auto-translated] "Days"
  intervalMode_days: "Giorni",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Costume",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Automatico",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Intervalli:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Mostra i singoli valori",
  // [Auto-translated] "Show running totals"
  runningTotals: "Mostra totali parziali",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Confronta i periodi",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Visualizza la timeline",
  // [Auto-translated] "None"
  noneAggregateText: "Nessuno",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Aggregato:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "L'anno si chiude con",
  // [Auto-translated] "Series {0}"
  seriesListSeries: "Serie {0}",
  // [Auto-translated] "Values"
  seriesListValuesLabel: "Valori",
  // [Auto-translated] "Remove"
  seriesListRemove: "Rimuovere",
  // [Auto-translated] "Add Series"
  seriesListAdd: "Aggiungi serie",
  // [Auto-translated] "Move to second axis"
  seriesListMoveToSecondAxis: "Spostarsi al secondo asse",
  // [Auto-translated] "Move to first axis"
  seriesListMoveToFirstAxis: "Spostamento al primo asse",
  // [Auto-translated] "Count"
  aggregationCount: "Conte",
  // [Auto-translated] "Sum"
  aggregationSum: "Somma",
  // [Auto-translated] "Average"
  aggregationAverage: "Media",
  // [Auto-translated] "Close"
  close: "Chiudi"
};

setupLocale({ localeCode: "it", strings: italianStrings, nativeName: "Italiano" });