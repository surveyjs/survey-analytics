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