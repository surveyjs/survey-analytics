import { setupLocale } from "../localizationManager";

export var spanishStrings = {
  // "Group By Me"
  groupButton: "Grupo Por Mí",
  // "Ungroup By Me"
  ungroupButton: "Desagrupar por mí",
  // "Select Me"
  selectButton: "Seleccionarme",
  // "Hide column"
  hideColumn: "Ocultar columna",
  // "Show column"
  showColumn: "Mostrar columna",
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
  // "Texts in table"
  visualizer_text: "Textos en tabla",
  // "Wordcloud"
  visualizer_wordcloud: "Wordcloud",
  // "Histogram"
  visualizer_histogram: "Histograma",
  // "Average"
  visualizer_number: "Promedio",
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
  // "Pie"
  chartType_pie: "Pie",
  // "Scatter"
  chartType_scatter: "Dispersión",
  // "Gauge"
  chartType_gauge: "Gauge",
  // "Bullet"
  chartType_bullet: "Bullet",
  // [Auto-translated] "Line"
  chartType_line: "Línea",
  // [Auto-translated] "Radar"
  chartType_radar: "Radar",
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
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Excel",
  // "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Descargar el gráfico como png",
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
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "Categoría (eje X):",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "Leyenda (Serie):",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmentos:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Grupos:",
  // [Auto-translated] "Not selected"
  notSelected: "No seleccionado",
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
  groupedYearsAxisTitle: "El año termina con"
};

setupLocale({ localeCode: "es", strings: spanishStrings, nativeName: "Español" });