import { setupLocale } from "../localizationManager";

export var russianStrings = {
  // "Group By Me"
  groupButton: "Сгруппировать",
  // "Ungroup By Me"
  ungroupButton: "Разгруппировать",
  // "Select Me"
  selectButton: "Выбрать",
  // [Auto-translated] "Column reorder"
  columnReorder: "Изменение порядка столбцов",
  // "Hide column"
  hideColumn: "Скрыть столбец",
  // "Show column"
  showColumn: "Показать столбец",
  // [Auto-translated] "Columns"
  columns: "Колонки",
  // "Make column private"
  makePrivateColumn: "Сделать столбец приватным",
  // "Make column public"
  makePublicColumn: "Сделать столбец публичным",
  // "Move to Detail"
  moveToDetail: "Спрятать в раскрывающуюся секцию",
  // "Show as Column"
  showAsColumn: "Показать как столбец",
  // "Search..."
  filterPlaceholder: "Поиск...",
  // "Remove rows"
  removeRows: "Удалить строки",
  // "Show"
  showLabel: "Показать",
  // "entries"
  entriesLabel: "записей",
  // [Auto-translated] "Entries on Page:"
  entriesOnPageLabel: "Записи на странице:",
  // "Texts in table"
  visualizer_text: "Таблица",
  // "Wordcloud"
  visualizer_wordcloud: "Облако тэгов",
  // "Histogram"
  visualizer_histogram: "Гистограмма",
  // "Average"
  visualizer_number: "Среднее значение",
  // [Auto-translated] "Average"
  visualizer_average: "Средний показатель",
  // "Table"
  visualizer_choices: "Таблица",
  // "Chart"
  visualizer_selectBase: "Диаграмма",
  // "Chart"
  visualizer_matrix: "Диаграмма",
  // "Bar"
  chartType_bar: "Столбчатая диаграмма",
  // "Vertical Bar"
  chartType_vbar: "Вертикальная столбчатая диаграмма",
  // "Stacked Bar"
  chartType_stackedbar: "Столбчатая диаграмма с накоплением",
  // "Doughnut"
  chartType_doughnut: "Кольцевая диаграмма",
  // "Pie"
  chartType_pie: "Круговая диаграмма",
  // "Scatter"
  chartType_scatter: "Точечная диаграмма",
  // "Gauge"
  chartType_gauge: "Измерительная диаграмма",
  // "Bullet"
  chartType_bullet: "Маркированная диаграмма",
  // [Auto-translated] "Line"
  chartType_line: "Линия",
  // [Auto-translated] "Radar"
  chartType_radar: "Радар",
  // [Auto-translated] "Histogram"
  chartType_histogram: "Гистограмма",
  // [Auto-translated] "Vertical Histogram"
  chartType_vhistogram: "Вертикальная гистограмма",
  // [Auto-translated] "Stacked Histogram"
  chartType_stackedhistogram: "Сложенная гистограмма",
  // "Hide"
  hideButton: "Скрыть",
  // "Make private"
  makePrivateButton: "Сделать приватным",
  // "Make public"
  makePublicButton: "Сделать публичным",
  // "Show"
  showButton: "Показать",
  // "Filter"
  filter: "Фильтр",
  // "Reset Filter"
  resetFilter: "Очистить фильтр",
  // "Change Locale"
  changeLocale: "Сменить язык",
  // "Clear"
  clearButton: "Очистить",
  // "Choose question to show..."
  addElement: "Выберите вопрос...",
  // [Auto-translated] "All questions"
  allQuestions: "Все вопросы",
  // [Auto-translated] "Select all"
  selectAll: "Выберите все",
  // [Auto-translated] "Clear selection"
  clearSelection: "Чистый выбор",
  // "Default Order"
  defaultOrder: "Порядок по умолчанию",
  // "Ascending"
  ascOrder: "Сортировать по возрастанию",
  // "Descending"
  descOrder: "Сортировать по убыванию",
  // "Show minor columns"
  showMinorColumns: "Показать второстепенные столбцы",
  // [Auto-translated] "Actions"
  actionsColumn: "Действия",
  // "Other items and comments"
  otherCommentTitle: "Другое и комментарии",
  // "Show percentages"
  showPercentages: "Показать проценты",
  // "Hide percentages"
  hidePercentages: "Скрыть проценты",
  // [Auto-translated] "Export As..."
  exportAs: "Экспортировать как...",
  // [Auto-translated] "PDF"
  pdfDownloadCaption: "PDF",
  // [Auto-translated] "Excel"
  xlsxDownloadCaption: "Excel",
  // [Auto-translated] "CSV"
  csvDownloadCaption: "CSV",
  // [Auto-translated] "Export as PDF"
  pdfDownloadHint: "Экспорт в формате PDF",
  // [Auto-translated] "Export as Excel"
  xlsxDownloadHint: "Экспорт в Excel",
  // [Auto-translated] "Export as CSV"
  csvDownloadHint: "Экспорт в формате CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Скачать диаграмму в формате PNG",
  // [Auto-translated] "response(s)"
  responsesText: "Ответ(ы)",
  // [Auto-translated] "No data"
  noData: "Нет данных",
  // [Auto-translated] "Select date range..."
  selectDateRange: "Выберите диапазон дат...",
  // [Auto-translated] "Include today"
  includeToday: "Включить сегодняшний день",
  // [Auto-translated] "Custom"
  reportingPeriodCustom: "Обычай",
  // [Auto-translated] "Last 7 days"
  reportingPeriodLast7days: "Последние 7 дней",
  // [Auto-translated] "Last 14 days"
  reportingPeriodLast14days: "Последние 14 дней",
  // [Auto-translated] "Last 28 days"
  reportingPeriodLast28days: "Последние 28 дней",
  // [Auto-translated] "Last 30 days"
  reportingPeriodLast30days: "Последние 30 дней",
  // [Auto-translated] "Last week (starts Monday)"
  reportingPeriodLastWeekMon: "На прошлой неделе (начинается в понедельник)",
  // [Auto-translated] "Last week (starts Sunday)"
  reportingPeriodLastWeekSun: "На прошлой неделе (начинается в воскресенье)",
  // [Auto-translated] "Last month"
  reportingPeriodLastMonth: "В прошлом месяце",
  // [Auto-translated] "Last quarter"
  reportingPeriodLastQuarter: "Последняя четверть",
  // [Auto-translated] "Last year"
  reportingPeriodLastYear: "В прошлом году",
  // [Auto-translated] "This week to date (starts Sunday)"
  reportingPeriodWtdSun: "С этой недели (начинается в воскресенье)",
  // [Auto-translated] "This week to date (starts Monday)"
  reportingPeriodWtdMon: "С этой недели на данный момент (начинается в понедельник)",
  // [Auto-translated] "This month to date"
  reportingPeriodMtd: "С этого месяца на сегодняшний день",
  // [Auto-translated] "This quarter to date"
  reportingPeriodQtd: "За этот квартал на сегодняшний день",
  // [Auto-translated] "This year to date"
  reportingPeriodYtd: "С этого года на сегодняшний день",
  // "Hide empty answers"
  hideEmptyAnswers: "Скрыть пустые ответы",
  // "Show empty answers"
  showEmptyAnswers: "Показать пустые ответы",
  // "All answers"
  "topNValueText-1": "Все ответы",
  // "Top 5 answers"
  topNValueText5: "Первые 5 ответов",
  // "Top 10 answers"
  topNValueText10: "Первые 10 ответов",
  // "Top 20 answers"
  topNValueText20: "Первые 20 ответов",
  // "Hide missing answers"
  hideMissingAnswers: "Скрыть отсутствующие ответы",
  // "Show missing answers"
  showMissingAnswers: "Показать отсутствующие ответы",
  // "Missing answers"
  missingAnswersLabel: "Отсутствующие ответы",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "Этот тип вопроса не поддерживается",
  // "There are no results yet"
  noResults: "Результаты отсутствуют",
  // "Per Values"
  showPerValues: "По значениям",
  // "Per Columns"
  showPerColumns: "По столбцам",
  // "Answer"
  answer: "Ответ",
  // "Correct answer: "
  correctAnswer: "Правильный ответ: ",
  // "Percent"
  percent: "процентов",
  // [Auto-translated] "Percentage"
  percentage: "Процент",
  // [Auto-translated] "Chart"
  statistics_chart: "Диаграмма",
  // "Responses"
  responses: "ответов",
  // [Auto-translated] "Total responses"
  totalResponses: "Общее количество ответов",
  // [Auto-translated] "NPS"
  visualizer_nps: "NPS",
  // [Auto-translated] "Chart"
  visualizer_boolean: "Диаграмма",
  // [Auto-translated] "Table"
  visualizer_options: "Стол",
  // [Auto-translated] "NPS"
  npsScore: "NPS",
  // [Auto-translated] "Promoters"
  npsPromoters: "Промоутеров",
  // [Auto-translated] "Passives"
  npsPassives: "Пассивные способности",
  // [Auto-translated] "Detractors"
  npsDetractors: "Критики",
  // [Auto-translated] "Category (X Axis)"
  axisXSelectorTitle: "Категория (ось X)",
  // [Auto-translated] "Legend (Series)"
  axisYSelectorTitle: "Легенда (серия)",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Сегментов:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Группы:",
  // [Auto-translated] "Secondary Y axis"
  secondYAxisToggleTitle: "Вторая ось Y",
  // [Auto-translated] "Select a data field..."
  selectDataField: "Выберите поле данных...",
  // [Auto-translated] "Default"
  intervalMode_default: "По умолчанию",
  // [Auto-translated] "Decades"
  intervalMode_decades: "Десятилетий",
  // [Auto-translated] "Years"
  intervalMode_years: "Годы",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "Квартира",
  // [Auto-translated] "Months"
  intervalMode_months: "Месяцы",
  // [Auto-translated] "Days"
  intervalMode_days: "Дни недели",
  // [Auto-translated] "Custom"
  intervalMode_custom: "Обычай",
  // [Auto-translated] "Auto"
  intervalMode_auto: "Авто",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "Интервалы:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "Отображение отдельных значений",
  // [Auto-translated] "Show running totals"
  runningTotals: "Показать промежуточные итоги",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "Сравнение периодов",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "Просмотр временной шкалы",
  // [Auto-translated] "None"
  noneAggregateText: "Никакой",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "Совокупность:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "Год заканчивается с",
  // [Auto-translated] "Series {0}"
  seriesListSeries: "Серия {0}",
  // [Auto-translated] "Values"
  seriesListValuesLabel: "Ценности",
  // [Auto-translated] "Remove"
  seriesListRemove: "Удалить",
  // [Auto-translated] "Add Series"
  seriesListAdd: "Серия Add",
  // [Auto-translated] "Move to second axis"
  seriesListMoveToSecondAxis: "Переход ко второй оси",
  // [Auto-translated] "Move to first axis"
  seriesListMoveToFirstAxis: "Переход к первой оси",
  // [Auto-translated] "Count"
  aggregationCount: "Граф",
  // [Auto-translated] "Sum"
  aggregationSum: "Сумма",
  // [Auto-translated] "Average"
  aggregationAverage: "Средний показатель",
  // [Auto-translated] "Close"
  close: "Закрыть"
};

setupLocale({ localeCode: "ru", strings: russianStrings, nativeName: "Русский" });