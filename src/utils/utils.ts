import { localization } from "../localizationManager";

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

export function removeUndefinedProperties(obj): void {
  if(obj === null || obj === undefined || typeof obj !== "object") {
    return;
  }
  Object.keys(obj).forEach(key => {
    if(typeof obj[key] === "object") {
      removeUndefinedProperties(obj[key]);
    }
    if(obj[key] === undefined) {
      delete obj[key];
    }
  });
  return;
}

export function isAllZeros(arr: Array<number>): boolean {
  return arr.every(num => num === 0);
}

export function formatLargeNumber(value: number): string {
  if(value === null || value === undefined || isNaN(value)) return String(value);
  const absValue = Math.abs(value);
  if(absValue < 10000) return value.toString();

  const sign = value < 0 ? "-" : "";

  if(absValue >= 1e9) {
    return sign + trimTrailingZeros(absValue / 1e9) + localization.getString("billionsSuffix");
  }
  if(absValue >= 1e6) {
    return sign + trimTrailingZeros(absValue / 1e6) + localization.getString("millionsSuffix");
  }
  return sign + trimTrailingZeros(absValue / 1e3) + localization.getString("thousandsSuffix");
}

function trimTrailingZeros(value: number): string {
  return parseFloat(value.toFixed(2)).toString();
}

export function getFormattedValueTicks(maxValue: number): { tickvals: number[], ticktext: string[] } | undefined {
  if(maxValue < 10000) return undefined;

  const approximateCount = 5;
  const rawStep = maxValue / approximateCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;

  let niceStep: number;
  if(normalized <= 1.5) niceStep = magnitude;
  else if(normalized <= 3) niceStep = 2 * magnitude;
  else if(normalized <= 7) niceStep = 5 * magnitude;
  else niceStep = 10 * magnitude;

  const tickvals: number[] = [0];
  let v = niceStep;
  while(v <= maxValue + niceStep * 0.5) {
    tickvals.push(v);
    v += niceStep;
  }

  const ticktext = tickvals.map(t => formatLargeNumber(t));
  return { tickvals, ticktext };
}
