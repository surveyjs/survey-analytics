import { setupLocale } from "../localizationManager";

export var japaneseStrings = {
  // "Group By Me"
  groupButton: "グループ化",
  // "Ungroup By Me"
  ungroupButton: "グループ解除",
  // "Select Me"
  selectButton: "選択",
  // [Auto-translated] "Column reorder"
  columnReorder: "列の順序付け替え",
  // "Hide column"
  hideColumn: "列を非表示",
  // "Show column"
  showColumn: "列を表示",
  // [Auto-translated] "Columns"
  columns: "柱",
  // "Make column private"
  makePrivateColumn: "列を非公開にする",
  // "Make column public"
  makePublicColumn: "列を公開する",
  // "Move to Detail"
  moveToDetail: "詳細に移動",
  // "Show as Column"
  showAsColumn: "列として表示",
  // "Search..."
  filterPlaceholder: "検索...",
  // "Remove rows"
  removeRows: "行を削除",
  // "Show"
  showLabel: "表示",
  // "entries"
  entriesLabel: "件",
  // [Auto-translated] "Entries on Page:"
  entriesOnPageLabel: "ページ上のエントリー:",
  // "Texts in table"
  visualizer_text: "テキスト",
  // "Wordcloud"
  visualizer_wordcloud: "ワードクラウド",
  // "Histogram"
  visualizer_histogram: "ヒストグラム",
  // "Average"
  visualizer_number: "平均",
  // [Auto-translated] "Average"
  visualizer_average: "平均",
  // "Table"
  visualizer_choices: "テーブル",
  // "Chart"
  visualizer_selectBase: "チャート",
  // [Auto-translated] "Chart"
  visualizer_matrix: "チャート",
  // "Bar"
  chartType_bar: "棒グラフ",
  // "Vertical Bar"
  chartType_vbar: "縦棒グラフ",
  // "Stacked Bar"
  chartType_stackedbar: "積み上げ棒グラフ",
  // "Doughnut"
  chartType_doughnut: "ドーナツチャート",
  // "Pie"
  chartType_pie: "円グラフ",
  // "Scatter"
  chartType_scatter: "散布図",
  // "Gauge"
  chartType_gauge: "ゲージ",
  // "Bullet"
  chartType_bullet: "バレット",
  // [Auto-translated] "Line"
  chartType_line: "線",
  // [Auto-translated] "Radar"
  chartType_radar: "レーダー",
  // [Auto-translated] "Histogram"
  chartType_histogram: "ヒストグラム",
  // [Auto-translated] "Vertical Histogram"
  chartType_vhistogram: "垂直ヒストグラム",
  // [Auto-translated] "Stacked Histogram"
  chartType_stackedhistogram: "積み重ねヒストグラム",
  // "Hide"
  hideButton: "非表示",
  // "Make private"
  makePrivateButton: "非公開にする",
  // "Make public"
  makePublicButton: "公開する",
  // "Show"
  showButton: "表示",
  // "Filter"
  filter: "フィルター",
  // "Reset Filter"
  resetFilter: "フィルターをリセット",
  // "Change Locale"
  changeLocale: "言語を変更",
  // "Clear"
  clearButton: "クリア",
  // "Choose question to show..."
  addElement: "表示する質問を選択...",
  // [Auto-translated] "All questions"
  allQuestions: "すべて質問です",
  // [Auto-translated] "Select all"
  selectAll: "すべて選択",
  // [Auto-translated] "Clear selection"
  clearSelection: "クリアセレクション",
  // "Default Order"
  defaultOrder: "デフォルト順",
  // "Ascending"
  ascOrder: "昇順",
  // "Descending"
  descOrder: "降順",
  // "Show minor columns"
  showMinorColumns: "マイナー列を表示",
  // [Auto-translated] "Actions"
  actionsColumn: "アクション",
  // "Other items and comments"
  otherCommentTitle: "その他のアイテムとコメント",
  // "Show percentages"
  showPercentages: "パーセンテージを表示",
  // "Hide percentages"
  hidePercentages: "パーセンテージを非表示",
  // [Auto-translated] "Export As..."
  exportAs: "エクスポートは...",
  // [Auto-translated] "PDF"
  pdfDownloadCaption: "PDF",
  // [Auto-translated] "Excel"
  xlsxDownloadCaption: "Excel",
  // [Auto-translated] "CSV"
  csvDownloadCaption: "CSV",
  // [Auto-translated] "Export as PDF"
  pdfDownloadHint: "PDFとしてエクスポート",
  // [Auto-translated] "Export as Excel"
  xlsxDownloadHint: "Excelとしてエクスポート",
  // [Auto-translated] "Export as CSV"
  csvDownloadHint: "CSVとしてエクスポート",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "プロットをPNGファイルとして保存",
  // [Auto-translated] "response(s)"
  responsesText: "回答",
  // [Auto-translated] "No data"
  noData: "データなし",
  // [Auto-translated] "Select date range..."
  selectDateRange: "日付範囲を選択してください...",
  // [Auto-translated] "Include today"
  includeToday: "今日も含めて",
  // [Auto-translated] "Custom"
  reportingPeriodCustom: "習慣",
  // [Auto-translated] "Last 7 days"
  reportingPeriodLast7days: "最後の7日間",
  // [Auto-translated] "Last 14 days"
  reportingPeriodLast14days: "最後の14日間",
  // [Auto-translated] "Last 28 days"
  reportingPeriodLast28days: "過去28日間",
  // [Auto-translated] "Last 30 days"
  reportingPeriodLast30days: "過去30日間",
  // [Auto-translated] "Last week (starts Monday)"
  reportingPeriodLastWeekMon: "先週(月曜日から始まる)",
  // [Auto-translated] "Last week (starts Sunday)"
  reportingPeriodLastWeekSun: "先週(日曜日から始まる)",
  // [Auto-translated] "Last month"
  reportingPeriodLastMonth: "先月",
  // [Auto-translated] "Last quarter"
  reportingPeriodLastQuarter: "前四半期",
  // [Auto-translated] "Last year"
  reportingPeriodLastYear: "昨年",
  // [Auto-translated] "This week to date (starts Sunday)"
  reportingPeriodWtdSun: "今週から(日曜日開始)",
  // [Auto-translated] "This week to date (starts Monday)"
  reportingPeriodWtdMon: "今週から(月曜日開始)",
  // [Auto-translated] "This month to date"
  reportingPeriodMtd: "今月の今月の時点で",
  // [Auto-translated] "This quarter to date"
  reportingPeriodQtd: "今四半期のこれまでの成績",
  // [Auto-translated] "This year to date"
  reportingPeriodYtd: "今年これまでに入っています",
  // "Hide empty answers"
  hideEmptyAnswers: "空の回答を非表示",
  // "Show empty answers"
  showEmptyAnswers: "空の回答を表示",
  // "All answers"
  "topNValueText-1": "すべての回答",
  // "Top 5 answers"
  topNValueText5: "上位5つの回答",
  // "Top 10 answers"
  topNValueText10: "上位10の回答",
  // "Top 20 answers"
  topNValueText20: "上位20の回答",
  // "Hide missing answers"
  hideMissingAnswers: "欠損値を非表示",
  // "Show missing answers"
  showMissingAnswers: "欠損値を表示",
  // "Missing answers"
  missingAnswersLabel: "欠損値",
  // "This question type is not visualized yet"
  noVisualizerForQuestion: "この質問タイプはまだ視覚化されていません",
  // "There are no results yet"
  noResults: "まだ結果がありません",
  // "Per Values"
  showPerValues: "値ごとに表示",
  // "Per Columns"
  showPerColumns: "列ごとに表示",
  // "Answer"
  answer: "回答",
  // "Correct answer: "
  correctAnswer: "正解: ",
  // "Percent"
  percent: "パーセント",
  // [Auto-translated] "Percentage"
  percentage: "百分率",
  // [Auto-translated] "Chart"
  statistics_chart: "チャート",
  // "Responses"
  responses: "回答数",
  // [Auto-translated] "Total responses"
  totalResponses: "総回答数",
  // [Auto-translated] "NPS"
  visualizer_nps: "NPSの",
  // [Auto-translated] "Chart"
  visualizer_boolean: "チャート",
  // [Auto-translated] "Table"
  visualizer_options: "テーブル",
  // [Auto-translated] "NPS"
  npsScore: "NPSの",
  // [Auto-translated] "Promoters"
  npsPromoters: "プロモーター",
  // [Auto-translated] "Passives"
  npsPassives: "パッシブ",
  // [Auto-translated] "Detractors"
  npsDetractors: "中傷",
  // [Auto-translated] "Category (X Axis)"
  axisXSelectorTitle: "圏(X軸)",
  // [Auto-translated] "Legend (Series)"
  axisYSelectorTitle: "レジェンド(シリーズ)",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "セグメント：",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "グループ：",
  // [Auto-translated] "Secondary Y axis"
  secondYAxisToggleTitle: "第二のY軸",
  // [Auto-translated] "Select a data field..."
  selectDataField: "データフィールドを選択してください...",
  // [Auto-translated] "Default"
  intervalMode_default: "デフォルト",
  // [Auto-translated] "Decades"
  intervalMode_decades: "数 十 年",
  // [Auto-translated] "Years"
  intervalMode_years: "月日",
  // [Auto-translated] "Quarters"
  intervalMode_quarters: "四半期",
  // [Auto-translated] "Months"
  intervalMode_months: "月",
  // [Auto-translated] "Days"
  intervalMode_days: "日",
  // [Auto-translated] "Custom"
  intervalMode_custom: "習慣",
  // [Auto-translated] "Auto"
  intervalMode_auto: "自動",
  // [Auto-translated] "Intervals:"
  intervalModeTitle: "間隔：",
  // [Auto-translated] "Show individual values"
  noRunningTotals: "個々の値を表示する",
  // [Auto-translated] "Show running totals"
  runningTotals: "累計を表示する",
  // [Auto-translated] "Compare periods"
  groupDateSeries: "期間の比較",
  // [Auto-translated] "View timeline"
  ungroupDateSeries: "タイムラインの表示",
  // [Auto-translated] "None"
  noneAggregateText: "何一つ",
  // [Auto-translated] "Aggregate:"
  selectAggregateText: "骨材：",
  // [Auto-translated] "Year ends with"
  groupedYearsAxisTitle: "年末は",
  // [Auto-translated] "Series {0}"
  seriesListSeries: "シリーズ{0}",
  // [Auto-translated] "Values"
  seriesListValuesLabel: "価値観",
  // [Auto-translated] "Remove"
  seriesListRemove: "削除",
  // [Auto-translated] "Add Series"
  seriesListAdd: "シリーズ追加",
  // [Auto-translated] "Move to second axis"
  seriesListMoveToSecondAxis: "第2軸への移動",
  // [Auto-translated] "Move to first axis"
  seriesListMoveToFirstAxis: "第一軸への移動",
  // [Auto-translated] "Count"
  aggregationCount: "伯爵",
  // [Auto-translated] "Sum"
  aggregationSum: "サム",
  // [Auto-translated] "Average"
  aggregationAverage: "平均",
  // [Auto-translated] "Close"
  close: "閉じる",
  // [Auto-translated] "K"
  thousandsSuffix: "千",
  // [Auto-translated] "M"
  millionsSuffix: "百万",
  // [Auto-translated] "B"
  billionsSuffix: "十億"
};

setupLocale({ localeCode: "ja", strings: japaneseStrings, nativeName: "日本語" });