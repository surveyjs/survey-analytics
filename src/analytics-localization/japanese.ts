import { setupLocale } from "../localizationManager";

export var japaneseStrings = {
  // "Group By Me"
  groupButton: "グループ化",
  // "Ungroup By Me"
  ungroupButton: "グループ解除",
  // "Select Me"
  selectButton: "選択",
  // "Hide column"
  hideColumn: "列を非表示",
  // "Show column"
  showColumn: "列を表示",
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
  // "Texts in table"
  visualizer_text: "テキスト",
  // "Wordcloud"
  visualizer_wordcloud: "ワードクラウド",
  // "Histogram"
  visualizer_histogram: "ヒストグラム",
  // "Average"
  visualizer_number: "平均",
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
  // "PDF"
  pdfDownloadCaption: "PDF",
  // "Excel"
  xlsxDownloadCaption: "Excel",
  // "CSV"
  csvDownloadCaption: "CSV",
  // "Download plot as a PNG file"
  saveDiagramAsPNG: "プロットをPNGファイルとして保存",
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
  // [Auto-translated] "Category (X Axis):"
  axisXSelectorTitle: "カテゴリ(X軸):",
  // [Auto-translated] "Legend (Series):"
  axisYSelectorTitle: "凡例(シリーズ):",
  // [Auto-translated] "Segments:"
  axisXAlternativeSelectorTitle: "セグメント：",
  // [Auto-translated] "Groups:"
  axisYAlternativeSelectorTitle: "グループ：",
  // [Auto-translated] "Not selected"
  notSelected: "選択されていない",
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
  groupedYearsAxisTitle: "年末は"
};

setupLocale({ localeCode: "ja", strings: japaneseStrings, nativeName: "日本語" });