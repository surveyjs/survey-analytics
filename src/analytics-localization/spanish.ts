import { setupLocale } from "../localizationManager";

export var spanishStrings = {
  // "Group By Me"
  groupButton: "Grupo Por Mí",
  // "Ungroup By Me"
  ungroupButton: "Desagrupar por mí",
  // "Select Me"
  selectButton: "Seleccionarme",
  // [Auto-translated] "Column reorder"
  columnReorder: "Reordenamiento de columnas",
  // "Hide column"
  hideColumn: "Ocultar columna",
  // "Show column"
  showColumn: "Mostrar columna",
  // [Auto-translated] "Columns"
  columns: "Columnas",
  // "Make column private"
  makePrivateColumn: "Hacer que la columna sea privada",
  // "Make column public"
  makePublicColumn: "Hacer pública la columna",
  // "Move to Detail"
  moveToDetail: "Mover al detalle",
  // "Show as Column"
  showAsColumn: "Mostrar como columna",
  // "Search..."
  filterPlaceholder: "Buscar ...",
  // "Remove rows"
  removeRows: "Eliminar filas",
  // "Show"
  showLabel: "Mostrar",
  // "entries"
  entriesLabel: "Entradas",
  // [Auto-translated] "Entries on Page:"
  entriesOnPageLabel: "Entradas en la página:",
  // "Texts in table"
  visualizer_text: "Textos en tabla",
  // [Auto-translated] "Wordcloud"
  visualizer_wordcloud: "Nube de palabras",
  // "Histogram"
  visualizer_histogram: "Histograma",
  // "Average"
  visualizer_number: "Promedio",
  // [Auto-translated] "Average"
  visualizer_average: "Promedio",
  // "Table"
  visualizer_choices: "Mesa",
  // "Chart"
  visualizer_selectBase: "Gráfico",
  // [Auto-translated] "Chart"
  visualizer_matrix: "Gráfico",
  // [Auto-translated] "Bar"
  chartType_bar: "Barra",
  // "Vertical Bar"
  chartType_vbar: "Barra vertical",
  // "Stacked Bar"
  chartType_stackedbar: "Barra apilada",
  // "Doughnut"
  chartType_doughnut: "Donut",
  // [Auto-translated] "Pie"
  chartType_pie: "Pastel",
  // "Scatter"
  chartType_scatter: "Dispersión",
  // [Auto-translated] "Gauge"
  chartType_gauge: "Vía",
  // [Auto-translated] "Bullet"
  chartType_bullet: "Bala",
  // [Auto-translated] "Line"
  chartType_line: "Línea",
  // [Auto-translated] "Radar"
  chartType_radar: "Radar",
  // [Auto-translated] "Histogram"
  chartType_histogram: "Histograma",
  // [Auto-translated] "Vertical Histogram"
  chartType_vhistogram: "Histograma vertical",
  // [Auto-translated] "Stacked Histogram"
  chartType_stackedhistogram: "Histograma apilado",
  // "Hide"
  hideButton: "Ocultar",
  // "Make private"
  makePrivateButton: "Hacer privado",
  // "Make public"
  makePublicButton: "Hacer público",
  // "Show"
  showButton: "Mostrar",
  // "Filter"
  filter: "Filtro",
  // "Reset Filter"
  resetFilter: "Restablecer filtro",
  // "Change Locale"
  changeLocale: "Cambiar configuración regional",
  // "Clear"
  clearButton: "Borrar",
  // "Choose question to show..."
  addElement: "Elija la pregunta para mostrar ...",
  // [Auto-translated] "All questions"
  allQuestions: "Todas las preguntas",
  // [Auto-translated] "Select all"
  selectAll: "Seleccionar todo",
  // [Auto-translated] "Clear selection"
  clearSelection: "Selección clara",
  // "Default Order"
  defaultOrder: "Orden predeterminado",
  // "Ascending"
  ascOrder: "Ascendente",
  // "Descending"
  descOrder: "Descendente",
  // "Show minor columns"
  showMinorColumns: "Mostrar columnas secundarias",
  // [Auto-translated] "Actions"
  actionsColumn: "Acciones",
  // "Other items and comments"
  otherCommentTitle: "Otros elementos y comentarios",
  // "Show percentages"
  showPercentages: "Mostrar porcentajes",
  // "Hide percentages"
  hidePercentages: "Ocultar porcentajes",
  // [Auto-translated] "Export As..."
  exportAs: "Exportar como...",
  // [Auto-translated] "PDF"
  pdfDownloadCaption: "PDF",
  // [Auto-translated] "Excel"
  xlsxDownloadCaption: "Excel",
  // [Auto-translated] "CSV"
  csvDownloadCaption: "CSV",
  // [Auto-translated] "Export as PDF"
  pdfDownloadHint: "Exportar como PDF",
  // [Auto-translated] "Export as Excel"
  xlsxDownloadHint: "Exportar como Excel",
  // [Auto-translated] "Export as CSV"
  csvDownloadHint: "Exportación como CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Descargar el gráfico como png",
  // [Auto-translated] "response(s)"
  responsesText: "Respuesta(s)",
  // [Auto-translated] "No data"
  noData: "Sin datos",
  // [Auto-translated] "Select date range..."
  selectDateRange: "Seleccione el rango de fechas...",
  // [Auto-translated] "Include today"
  includeToday: "Incluye la actualidad",
  // [Auto-translated] "Custom"
  reportingPeriodCustom: "Costumbres",
  // [Auto-translated] "Last 7 days"
  reportingPeriodLast7days: "Últimos 7 días",
  // [Auto-translated] "Last 14 days"
  reportingPeriodLast14days: "Últimos 14 días",
  // [Auto-translated] "Last 28 days"
  reportingPeriodLast28days: "Últimos 28 días",
  // [Auto-translated] "Last 30 days"
  reportingPeriodLast30days: "Últimos 30 días",
  // [Auto-translated] "Last week (starts Monday)"
  reportingPeriodLastWeekMon: "La semana pasada (empieza el lunes)",
  // [Auto-translated] "Last week (starts Sunday)"
  reportingPeriodLastWeekSun: "La semana pasada (empieza el domingo)",
  // [Auto-translated] "Last month"
  reportingPeriodLastMonth: "El mes pasado",
  // [Auto-translated] "Last quarter"
  reportingPeriodLastQuarter: "Último cuarto",
  // [Auto-translated] "Last year"
  reportingPeriodLastYear: "El año pasado",
  // [Auto-translated] "This week to date (starts Sunday)"
  reportingPeriodWtdSun: "Esta semana hasta la fecha (empieza el domingo)",
  // [Auto-translated] "This week to date (starts Monday)"
  reportingPeriodWtdMon: "Esta semana hasta la fecha (empieza el lunes)",
  // [Auto-translated] "This month to date"
  reportingPeriodMtd: "Este mes hasta la fecha",
  // [Auto-translated] "This quarter to date"
  reportingPeriodQtd: "Este trimestre hasta la fecha",
  // [Auto-translated] "This year to date"
  reportingPeriodYtd: "Este año hasta la fecha",
  // "Hide empty answers"
  hideEmptyAnswers: "Ocultar respuestas vacías",
  // "Show empty answers"
  showEmptyAnswers: "Mostrar respuestas vacías",
  // "All answers"
  "topNValueText-1": "Todas las respuestas",
  // "Top 5 answers"
  topNValueText5: "Las 5 respuestas principales",
  // "Top 10 answers"
  topNValueText10: "Las 10 respuestas principales",
  // "Top 20 answers"
  topNValueText20: "20 respuestas principales",
  // "Hide missing answers"
  hideMissingAnswers: "Ocultar las respuestas que faltan",
  // "Show missing answers"
  showMissingAnswers: "Mostrar las respuestas que faltan",
  // "Missing answers"
  missingAnswersLabel: "Respuestas faltantes",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Este tipo de pregunta aún no se visualiza",
  // "There are no results yet"
  noResults: "Aún no hay resultados",
  // "Per Values"
  showPerValues: "Por valores",
  // "Per Columns"
  showPerColumns: "Por columnas",
  // "Answer"
  answer: "Respuesta",
  // "Correct answer: "
  correctAnswer: "Respuesta correcta: ",
  // "Percent"
  percent: "Por ciento",
  // [Auto-translated] "Percentage"
  percentage: "Porcentaje",
  // [Auto-translated] "Chart"
  statistics_chart: "Gráfico",
  // "Responses"
  responses: "Respuestas",
  // [Auto-translated] "Total responses"
  totalResponses: "Respuestas totales",
  // [Auto-translated] "NPS"
  visualizer_nps: "NPS",
  // [Auto-translated] "Chart"
  visualizer_boolean: "Gráfico",
  // [Auto-translated] "Table"
  visualizer_options: "Mesa",
  // [Auto-translated] "NPS"
  npsScore: "NPS",
  // [Auto-translated] "Promoters"
  npsPromoters: "Promotores",
  // [Auto-translated] "Passives"
  npsPassives: "Pasivos",
  // [Auto-translated] "Detractors"
  npsDetractors: "Detractores",
  // [Auto-translated] "Category (X Axis)"
  axisXSelectorTitle: "Categoría (eje X)",
  // [Auto-translated] "Legend (Series)"
  axisYSelectorTitle: "Leyenda (serie)",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmentos:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Grupos:",
  // [Auto-translated] "Secondary Y axis"
  secondYAxisToggleTitle: "Segundo eje Y",
  // [Auto-translated] "Select a data field..."
  selectDataField: "Seleccionar un campo de datos...",
  // [Auto-translated] "Default"
  intervalMode_default: "Predeterminado",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Décadas",
  // [Auto-translated] "Years"
  intervalMode_years: "Años",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Alojamiento",
  // [Auto-translated] "Months"
  intervalMode_months: "Meses",
  // [Auto-translated] "Days"
  intervalMode_days: "Días",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Costumbre",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Automático",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Intervalos:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Mostrar valores individuales",
  // [Auto-translated] "Show running totals"
  runningTotals: "Mostrar totales acumulados",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Comparar períodos",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Ver cronograma",
  // [Auto-translated] "None"
  noneAggregateText: "Ninguno",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Agregado:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "El año termina con",
  // [Auto-translated] "Series {0}"
  seriesListSeries: "Temporada {0}",
  // [Auto-translated] "Values"
  seriesListValuesLabel: "Valores",
  // [Auto-translated] "Remove"
  seriesListRemove: "Eliminar",
  // [Auto-translated] "Add Series"
  seriesListAdd: "Añadir series",
  // [Auto-translated] "Move to second axis"
  seriesListMoveToSecondAxis: "Pasar al segundo eje",
  // [Auto-translated] "Move to first axis"
  seriesListMoveToFirstAxis: "Pasar al primer eje",
  // [Auto-translated] "Count"
  aggregationCount: "Conde",
  // [Auto-translated] "Sum"
  aggregationSum: "Suma",
  // [Auto-translated] "Average"
  aggregationAverage: "Promedio",
  // [Auto-translated] "Close"
  close: "Cierre",
  // [Auto-translated] "K"
  thousandsSuffix: "K",
  // [Auto-translated] "M"
  millionsSuffix: "M",
  // [Auto-translated] "B"
  billionsSuffix: "B"
};

setupLocale({ localeCode: "es", strings: spanishStrings, nativeName: "Español" });