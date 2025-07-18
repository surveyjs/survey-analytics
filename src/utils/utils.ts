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