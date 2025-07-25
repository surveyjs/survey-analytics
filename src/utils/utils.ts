export function getTruncatedLabel(value: any, labelTruncateLength: number): string {
  const label = value.toString();
  const truncateSymbols = "...";
  const truncateSymbolsLength = truncateSymbols.length;

  if (!labelTruncateLength) return label;
  if (labelTruncateLength === -1) return label;
  if (label.length <= labelTruncateLength + truncateSymbolsLength)
    return label;

  return label.substring(0, labelTruncateLength) + truncateSymbols;
}

export function reverseAll(labels: string[], seriesLabels: string[], colors: string[], hasSeries: boolean, texts: any[][], datasets: any[][]) {
  labels = [].concat(labels).reverse();
  seriesLabels = [].concat(seriesLabels).reverse();
  colors = [].concat(colors.slice(0, hasSeries ? seriesLabels.length : labels.length)).reverse();
  const ts = [];
  texts.forEach(text => {
    ts.push([].concat(text).reverse());
  });
  texts = ts;
  const ds = [];
  datasets.forEach(dataset => {
    ds.push([].concat(dataset).reverse());
  });
  datasets = ds;
  return { labels, seriesLabels, colors, texts, datasets };
}
