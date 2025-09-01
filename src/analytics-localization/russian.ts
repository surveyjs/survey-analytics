import { setupLocale } from "../localizationManager";

export var russianStrings = {
  // "Group By Me"
  groupButton: "Сгруппировать",
  // "Ungroup By Me"
  ungroupButton: "Разгруппировать",
  // "Select Me"
  selectButton: "Выбрать",
  // "Hide column"
  hideColumn: "Скрыть столбец",
  // "Show column"
  showColumn: "Показать столбец",
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
  // "Texts in table"
  visualizer_text: "Таблица",
  // "Wordcloud"
  visualizer_wordcloud: "Облако тэгов",
  // "Histogram"
  visualizer_histogram: "Гистограмма",
  // "Average"
  visualizer_number: "Среднее значение",
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
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Excel",
  // "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "Скачать диаграмму в формате PNG",
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
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "Категория (ось X):",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "Легенда (Серия):",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "Сегментов:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "Группы:",
  // [Auto-translated] "Not selected"
  notSelected: "Не выбрано"
};

setupLocale({ localeCode: "ru", strings: russianStrings, nativeName: "Русский" });