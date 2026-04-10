import { setupLocale } from "../localizationManager";

export var portugueseStrings = {
  // "Group By Me"
  groupButton: "Agrupar Por Mim",
  // "Ungroup By Me"
  ungroupButton: "Desagrupar Por Mim",
  // "Select Me"
  selectButton: "Selecionar",
  // [Auto-translated] "Column reorder"
  columnReorder: "Reordenação das colunas",
  // "Hide column"
  hideColumn: "Esconder coluna",
  // "Show column"
  showColumn: "Mostrar coluna",
  // [Auto-translated] "Columns"
  columns: "Colunas",
  // "Make column private"
  makePrivateColumn: "Tornar coluna privada",
  // "Make column public"
  makePublicColumn: "Tornar coluna pública",
  // "Move to Detail"
  moveToDetail: "Mover para Detalhes",
  // "Show as Column"
  showAsColumn: "Mostrar como Coluna",
  // "Search..."
  filterPlaceholder: "Pesquisar...",
  // "Remove rows"
  removeRows: "Remover linhas",
  // "Show"
  showLabel: "Mostrar",
  // "entries"
  entriesLabel: "entradas",
  // [Auto-translated] "Entries on Page:"
  entriesOnPageLabel: "Entradas na página:",
  // "Texts in table"
  visualizer_text: "Textos em tabela",
  // "Wordcloud"
  visualizer_wordcloud: "Nuvem de palavras",
  // "Histogram"
  visualizer_histogram: "Histograma",
  // "Average"
  visualizer_number: "Média",
  // [Auto-translated] "Average"
  visualizer_average: "Média",
  // "Table"
  visualizer_choices: "Tabela",
  // "Chart"
  visualizer_selectBase: "Gráfico",
  // [Auto-translated] "Chart"
  visualizer_matrix: "Gráfico",
  // [Auto-translated] "Bar"
  chartType_bar: "Barra",
  // "Vertical Bar"
  chartType_vbar: "Barra vertical",
  // "Stacked Bar"
  chartType_stackedbar: "Barra Empilhada",
  // "Doughnut"
  chartType_doughnut: "Rosca",
  // "Pie"
  chartType_pie: "Tarte",
  // "Scatter"
  chartType_scatter: "Lastro",
  // "Gauge"
  chartType_gauge: "Escala",
  // "Bullet"
  chartType_bullet: "Bala",
  // [Auto-translated] "Line"
  chartType_line: "Linha",
  // [Auto-translated] "Radar"
  chartType_radar: "Radar",
  // [Auto-translated] "Histogram"
  chartType_histogram: "Histograma",
  // [Auto-translated] "Vertical Histogram"
  chartType_vhistogram: "Histograma vertical",
  // [Auto-translated] "Stacked Histogram"
  chartType_stackedhistogram: "Histograma Empilhado",
  // "Hide"
  hideButton: "Esconder",
  // "Make private"
  makePrivateButton: "Tornar privado",
  // "Make public"
  makePublicButton: "Tornar público",
  // "Show"
  showButton: "Mostrar",
  // "Filter"
  filter: "Filtrar",
  // "Reset Filter"
  resetFilter: "Restaurar Filtro",
  // "Change Locale"
  changeLocale: "Mudar Localização",
  // "Clear"
  clearButton: "Limpar",
  // "Choose question to show..."
  addElement: "Escolher questão para mostrar...",
  // [Auto-translated] "All questions"
  allQuestions: "Todas as perguntas",
  // [Auto-translated] "Select all"
  selectAll: "Selecionar todos",
  // [Auto-translated] "Clear selection"
  clearSelection: "Seleção clara",
  // "Default Order"
  defaultOrder: "Ordenação Padrão",
  // "Ascending"
  ascOrder: "Ascendente",
  // "Descending"
  descOrder: "Descendente",
  // "Show minor columns"
  showMinorColumns: "Mostrar colunas menores",
  // [Auto-translated] "Actions"
  actionsColumn: "Ações",
  // "Other items and comments"
  otherCommentTitle: "Outros itens e comentários",
  // "Show percentages"
  showPercentages: "Mostrar percentuais",
  // "Hide percentages"
  hidePercentages: "Esconder percentuais",
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
  csvDownloadHint: "Exportação como CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Baixar diagrama como PNG",
  // [Auto-translated] "response(s)"
  responsesText: "Resposta(s)",
  // [Auto-translated] "No data"
  noData: "Sem dados",
  // [Auto-translated] "Select date range..."
  selectDateRange: "Selecione o intervalo de datas...",
  // [Auto-translated] "Include today"
  includeToday: "Incluir hoje",
  // [Auto-translated] "Custom"
  reportingPeriodCustom: "Costume",
  // [Auto-translated] "Last 7 days"
  reportingPeriodLast7days: "Últimos 7 dias",
  // [Auto-translated] "Last 14 days"
  reportingPeriodLast14days: "Últimos 14 dias",
  // [Auto-translated] "Last 28 days"
  reportingPeriodLast28days: "Últimos 28 dias",
  // [Auto-translated] "Last 30 days"
  reportingPeriodLast30days: "Últimos 30 dias",
  // [Auto-translated] "Last week (starts Monday)"
  reportingPeriodLastWeekMon: "Semana passada (começa na segunda-feira)",
  // [Auto-translated] "Last week (starts Sunday)"
  reportingPeriodLastWeekSun: "Semana passada (começa no domingo)",
  // [Auto-translated] "Last month"
  reportingPeriodLastMonth: "No mês passado",
  // [Auto-translated] "Last quarter"
  reportingPeriodLastQuarter: "Último quarto",
  // [Auto-translated] "Last year"
  reportingPeriodLastYear: "Ano passado",
  // [Auto-translated] "This week to date (starts Sunday)"
  reportingPeriodWtdSun: "Esta semana até agora (começa no domingo)",
  // [Auto-translated] "This week to date (starts Monday)"
  reportingPeriodWtdMon: "Esta semana até agora (começa na segunda-feira)",
  // [Auto-translated] "This month to date"
  reportingPeriodMtd: "Este mês até agora",
  // [Auto-translated] "This quarter to date"
  reportingPeriodQtd: "Este trimestre até o momento",
  // [Auto-translated] "This year to date"
  reportingPeriodYtd: "Este ano até agora",
  // "Hide empty answers"
  hideEmptyAnswers: "Esconder perguntas vazias",
  // "Show empty answers"
  showEmptyAnswers: "Mostrar perguntas vazias",
  // "All answers"
  "topNValueText-1": "Todas as respostas",
  // "Top 5 answers"
  topNValueText5: "Primeiras 5 respostas",
  // "Top 10 answers"
  topNValueText10: "Primeiras 10 respostas",
  // "Top 20 answers"
  topNValueText20: "Primeiras 20 respostas",
  // "Hide missing answers"
  hideMissingAnswers: "Ocultar perguntas não respondidas",
  // "Show missing answers"
  showMissingAnswers: "Mostrar perguntas não respondidas",
  // "Missing answers"
  missingAnswersLabel: "Perguntas não respondidas",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Este tipo de pergunta ainda não foi visualizada",
  // "There are no results yet"
  noResults: "Ainda não possui resultados",
  // "Per Values"
  showPerValues: "Por valores",
  // "Per Columns"
  showPerColumns: "Por colunas",
  // "Answer"
  answer: "Resposta",
  // "Correct answer: "
  correctAnswer: "Resposta correta: ",
  // "Percent"
  percent: "Percentagem",
  // [Auto-translated] "Percentage"
  percentage: "Porcentagem",
  // [Auto-translated] "Chart"
  statistics_chart: "Gráfico",
  // "Responses"
  responses: "Respostas",
  // [Auto-translated] "Total responses"
  totalResponses: "Total de respostas",
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
  npsPassives: "Passivos",
  // [Auto-translated] "Detractors"
  npsDetractors: "Detratores",
  // [Auto-translated] "Category (X Axis)"
  axisXSelectorTitle: "Categoria (eixo X)",
  // [Auto-translated] "Legend (Series)"
  axisYSelectorTitle: "Lenda (Série)",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Segmentos:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Grupos:",
  // [Auto-translated] "Secondary Y axis"
  secondYAxisToggleTitle: "Segundo eixo Y",
  // [Auto-translated] "Select a data field..."
  selectDataField: "Selecione um campo de dados...",
  // [Auto-translated] "Default"
  intervalMode_default: "Inadimplência",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Décadas",
  // [Auto-translated] "Years"
  intervalMode_years: "Anos",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Quartos",
  // [Auto-translated] "Months"
  intervalMode_months: "Meses",
  // [Auto-translated] "Days"
  intervalMode_days: "Dias",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Costume",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Automático",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Intervalos:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Mostrar valores individuais",
  // [Auto-translated] "Show running totals"
  runningTotals: "Mostrar totais acumulados",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Comparar períodos",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Ver linha do tempo",
  // [Auto-translated] "None"
  noneAggregateText: "Nenhum",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Agregado:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "O ano termina com",
  // [Auto-translated] "Series {0}"
  seriesListSeries: "Série {0}",
  // [Auto-translated] "Values"
  seriesListValuesLabel: "Valores",
  // [Auto-translated] "Remove"
  seriesListRemove: "Remover",
  // [Auto-translated] "Add Series"
  seriesListAdd: "Adicionar Série",
  // [Auto-translated] "Move to second axis"
  seriesListMoveToSecondAxis: "Mover-se para o segundo eixo",
  // [Auto-translated] "Move to first axis"
  seriesListMoveToFirstAxis: "Mover-se para o primeiro eixo",
  // [Auto-translated] "Count"
  aggregationCount: "Conde",
  // [Auto-translated] "Sum"
  aggregationSum: "Soma",
  // [Auto-translated] "Average"
  aggregationAverage: "Média",
  // [Auto-translated] "Close"
  close: "Fechar",
  // [Auto-translated] "K"
  thousandsSuffix: "K",
  // [Auto-translated] "M"
  millionsSuffix: "M",
  // [Auto-translated] "B"
  billionsSuffix: "B"
};

setupLocale({ localeCode: "pt", strings: portugueseStrings, nativeName: "Português" });