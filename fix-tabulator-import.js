module.exports = function (source) {
  const options = this.getOptions();
  if (options.fixTabulatorImport) {
    return source.replace(/import\s+{\s*TabulatorFull\s*}\s+from\s+"tabulator-tables"/, 'import  TabulatorFull from "tabulator-tables"');
  } else {
    return source;
  }
}