import { setupLocale } from "../localizationManager";

export var farsiStrings = {
  // "Group By Me"
  groupButton: "گروه بندی با",
  // "Ungroup By Me"
  ungroupButton: "حذف گروه",
  // "Select Me"
  selectButton: "انتخاب",
  // "Hide column"
  hideColumn: "مخفی کردن ستون",
  // "Show column"
  showColumn: "نمایش ستون",
  // "Make column private"
  makePrivateColumn: "خصوصی کردن ستون",
  // "Make column public"
  makePublicColumn: "عمومی کردن ستون",
  // "Move to Detail"
  moveToDetail: "انتقال به جزئیات",
  // "Show as Column"
  showAsColumn: "نمایش به عنوان ستون",
  // "Search..."
  filterPlaceholder: "جستجو...",
  // "Remove rows"
  removeRows: "حذف سطرها",
  // "Show"
  showLabel: "نمایش",
  // "entries"
  entriesLabel: "ورودی",
  // "Texts in table"
  visualizer_text: "متون در جدول",
  // "Wordcloud"
  visualizer_wordcloud: "ابر کلمات",
  // "Histogram"
  visualizer_histogram: "هیستوگرام",
  // "Average"
  visualizer_number: "متوسط",
  // "Table"
  visualizer_choices: "جدول",
  // "Chart"
  visualizer_selectBase: "نمودار",
  // [Auto-translated] "Chart"
  visualizer_matrix: "نمودار",
  // [Auto-translated] "Bar"
  chartType_bar: "نوار",
  // "Vertical Bar"
  chartType_vbar: "نوار عمودی",
  // "Stacked Bar"
  chartType_stackedbar: "نوار پشته",
  // "Doughnut"
  chartType_doughnut: "دونات",
  // "Pie"
  chartType_pie: "دابره ای(pie)",
  // "Scatter"
  chartType_scatter: "پراکندگی(Scatter)",
  // "Gauge"
  chartType_gauge: "عقربه ای",
  // "Bullet"
  chartType_bullet: "Bullet",
  // [Auto-translated] "Line"
  chartType_line: "خط",
  // [Auto-translated] "Radar"
  chartType_radar: "رادار",
  // "Hide"
  hideButton: "مخفی",
  // "Make private"
  makePrivateButton: "خصوصی کردن",
  // "Make public"
  makePublicButton: "عمومی کردن",
  // "Show"
  showButton: "نمایش",
  // "Filter"
  filter: "فیلتر",
  // "Reset Filter"
  resetFilter: "بازنشانی فیلترها",
  // "Change Locale"
  changeLocale: "تغییر محلی",
  // "Clear"
  clearButton: "پاک کردن",
  // "Choose question to show..."
  addElement: "انتخاب سوال برای نمایش...",
  // "Default Order"
  defaultOrder: "ترتیب پیشفرض",
  // "Ascending"
  ascOrder: "صعودی",
  // "Descending"
  descOrder: "نزولی",
  // "Show minor columns"
  showMinorColumns: "نمایش ستونهای فرعی",
  // [Auto-translated] "Actions"
  actionsColumn: "اقدامات",
  // "Other items and comments"
  otherCommentTitle: "سایر موارد و نظرات",
  // "Show percentages"
  showPercentages: "نمایش درصد",
  // "Hide percentages"
  hidePercentages: "درصدهای مخفی",
  // "PDF"
  pdfDownloadCaption: "پی دی اف",
  // "Excel"
  xlsxDownloadCaption: "اکسل",
  // "CSV"
  csvDownloadCaption: "Csv",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "دانلود طرح به عنوان یک فایل PNG",
  // "Hide empty answers"
  hideEmptyAnswers: "مخفی کردن پاسخهای خالی",
  // "Show empty answers"
  showEmptyAnswers: "نمایش پاسخهای خالی",
  // "All answers"
  "topNValueText-1": "همه پاسخ ها",
  // "Top 5 answers"
  topNValueText5: "5 پاسخ برتر",
  // "Top 10 answers"
  topNValueText10: "10 پاسخ برتر",
  // "Top 20 answers"
  topNValueText20: "20 پاسخ برتر",
  // "Hide missing answers"
  hideMissingAnswers: "مخفی کردن پاسخهای گمشده",
  // "Show missing answers"
  showMissingAnswers: "نمایش پاسخهای گمشده",
  // "Missing answers"
  missingAnswersLabel: "پاسخ های گمشده",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "این نوع سوال هنوز تجسم نشده است",
  // "There are no results yet"
  noResults: "هنوز نتیجه ای حاصل نشده است",
  // "Per Values"
  showPerValues: "به ازای هر ارزش",
  // "Per Columns"
  showPerColumns: "در هر ستون",
  // "Answer"
  answer: "پاسخ",
  // "Correct answer: "
  correctAnswer: "پاسخ صحیح: ",
  // "Percent"
  percent: "درصد",
  // [Auto-translated] "Percentage"
  percentage: "درصد",
  // [Auto-translated] "Chart"
  statistics_chart: "نمودار",
  // "Responses"
  responses: "پاسخ",
  // [Auto-translated] "NPS"
  visualizer_nps: "NPS",
  // [Auto-translated] "NPS"
  npsScore: "NPS",
  // [Auto-translated] "Promoters"
  npsPromoters: "مروج",
  // [Auto-translated] "Passives"
  npsPassives: "منفعل ها",
  // [Auto-translated] "Detractors"
  npsDetractors: "بدهیدان",
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "دسته (محور X):",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "افسانه (سری):",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "بخش:",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "گروه:",
  // [Auto-translated] "Not selected"
  notSelected: "انتخاب نشده است"
};

setupLocale({ localeCode: "fa", strings: farsiStrings, nativeName: "فارسی" });
