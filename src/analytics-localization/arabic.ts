import { setupLocale } from "../localizationManager";

export var arabicStrings = {
  // "Group By Me"
  groupButton: "زرار المجموعة",
  // "Ungroup By Me"
  ungroupButton: "تم التحديث من خلالى",
  // "Select Me"
  selectButton: "اختر",
  // "Hide column"
  hideColumn: "اخفاء العمود",
  // "Show column"
  showColumn: "اظهار",
  // "Make column private"
  makePrivateColumn: "أجعل العمود خاص",
  // "Make column public"
  makePublicColumn: "أجعل العمود عام",
  // "Move to Detail"
  moveToDetail: "انتقل إلى التفاصيل",
  // "Show as Column"
  showAsColumn: "إظهار كعمود",
  // "Search..."
  filterPlaceholder: "بحث...",
  // "Remove rows"
  removeRows: "حذف",
  // "Show"
  showLabel: "اظهار",
  // "entries"
  entriesLabel: "مدخلات",
  // "Texts in table"
  visualizer_text: "جداول",
  // "Wordcloud"
  visualizer_wordcloud: "كلمات",
  // "Histogram"
  visualizer_histogram: "الرسم البياني",
  // "Average"
  visualizer_number: "متوسط",
  // "Table"
  visualizer_choices: "جدول",
  // "Chart"
  visualizer_selectBase: "رسم بياني",
  // [Auto-translated] "Chart"
  visualizer_matrix: "جدول",
  // [Auto-translated] "Bar"
  chartType_bar: "بار",
  // "Vertical Bar"
  chartType_vbar: "شريط عمودي",
  // "Stacked Bar"
  chartType_stackedbar: "شريط مكدس",
  // "Doughnut"
  chartType_doughnut: "مخطط حلقي",
  // "Pie"
  chartType_pie: "مخطط دائري",
  // "Scatter"
  chartType_scatter: "مخطط التشتت",
  // "Gauge"
  chartType_gauge: "مخطط القياس",
  // "Bullet"
  chartType_bullet: "مخطط نقطي",
  // [Auto-translated] "Line"
  chartType_line: "سطر",
  // [Auto-translated] "Radar"
  chartType_radar: "رادار",
  // "Hide"
  hideButton: "اخفاء",
  // "Make private"
  makePrivateButton: "أجعل خاص",
  // "Make public"
  makePublicButton: "أجعل عام",
  // "Show"
  showButton: "اظهار",
  // "Filter"
  filter: "ترشح",
  // "Reset Filter"
  resetFilter: "إعادة تعيين",
  // "Change Locale"
  changeLocale: "تغيير اللغة",
  // "Clear"
  clearButton: "مسح",
  // "Choose question to show..."
  addElement: "اختر سؤالاً للعرض ...",
  // "Default Order"
  defaultOrder: "الترتيب الافتراضي",
  // "Ascending"
  ascOrder: "تصاعدى",
  // "Descending"
  descOrder: "تنازلى",
  // "Show minor columns"
  showMinorColumns: "إظهار الأعمدة الثانوية",
  // [Auto-translated] "Actions"
  actionsColumn: "الاجراءات",
  // "Other items and comments"
  otherCommentTitle: "بنود وتعليقات أخرى",
  // "Show percentages"
  showPercentages: "عرض النسب المئوية",
  // "Hide percentages"
  hidePercentages: "إخفاء النسب",
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Excel",
  // "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "تنزيل بصيغة png",
  // "Hide empty answers"
  hideEmptyAnswers: "إخفاء الإجابات الفارغة",
  // "Show empty answers"
  showEmptyAnswers: "إظهار الإجابات الفارغة",
  // "All answers"
  "topNValueText-1": "جميع الإجابات",
  // "Top 5 answers"
  topNValueText5: "أهم 5 إجابات",
  // "Top 10 answers"
  topNValueText10: "أفضل 10 إجابات",
  // "Top 20 answers"
  topNValueText20: "أفضل 20 إجابة",
  // "Hide missing answers"
  hideMissingAnswers: "إخفاء الإجابات المفقودة",
  // "Show missing answers"
  showMissingAnswers: "عرض الإجابات المفقودة",
  // "Missing answers"
  missingAnswersLabel: "أجوبة مفقودة",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "لم يتم العرض بعد",
  // "There are no results yet"
  noResults: "لا يوجد نتائج للعرض",
  // "Per Values"
  showPerValues: "لكل القيم",
  // "Per Columns"
  showPerColumns: "لكل الأعمدة",
  // "Answer"
  answer: "إجب",
  // "Correct answer: "
  correctAnswer: "الاجابة الصحيحة: ",
  // "Percent"
  percent: "النسبه المئويه",
  // [Auto-translated] "Percentage"
  percentage: "النسبه المئويه",
  // [Auto-translated] "Chart"
  statistics_chart: "جدول",
  // "Responses"
  responses: "الاستجابات",
  // [Auto-translated] "NPS"
  visualizer_nps: "NPS",
  // [Auto-translated] "Chart"
  visualizer_boolean: "جدول",
  // [Auto-translated] "Table"
  visualizer_options: "جدول",
  // [Auto-translated] "NPS"
  npsScore: "NPS",
  // [Auto-translated] "Promoters"
  npsPromoters: "المروجين",
  // [Auto-translated] "Passives"
  npsPassives: "سلبيات",
  // [Auto-translated] "Detractors"
  npsDetractors: "المنتقدين",
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "الفئة (المحور X):",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "أسطورة (سلسلة):",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "قطاعات:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "المجموعات:",
  // [Auto-translated] "Not selected"
  notSelected: "غير محدد",
  // [Auto-translated] "Default"
  intervalMode_default: "افتراضي",
  // [Auto-translated] "Decades"
  intervalMode_decades: "عقود",
  // [Auto-translated] "Years"
  intervalMode_years: "اعوام",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "ارباع",
  // [Auto-translated] "Months"
  intervalMode_months: "أشهر",
  // [Auto-translated] "Days"
  intervalMode_days: "أيام",
  // [Auto-translated] "Custom"
  intervalMode_custom: "تقليد",
  // [Auto-translated] "Auto"
  intervalMode_auto: "تلقائي",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "فترات:",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "إظهار القيم الفردية",
  // [Auto-translated] "Show running totals"
  runningTotals: "إظهار الإجماليات الجارية",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "مقارنة الفترات",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "عرض الجدول الزمني",
  // [Auto-translated] "None"
  noneAggregateText: "اي",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "تجميع:",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "ينتهي العام ب"
};

setupLocale({ localeCode: "ar", strings: arabicStrings, nativeName: "العربية" });