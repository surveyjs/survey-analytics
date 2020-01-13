"use strict";
const fs = require("fs");
var path = process.argv[2];
var modules = new Set();
var lines = fs.readFileSync(path, "utf-8").split("\n");
fs.unlinkSync(path);
lines.forEach(line => {
  var reg = /(import\s*){(.*)}(.*)/;
  var res = line.match(reg);
  if (!res) {
    fs.appendFileSync(path, line + "\n");
    return;
  }
  var sp = res[2].split(/,\s*/);
  var imp_part = "";
  for (var s in sp) {
    var mdl = sp[s].trim();
    if (!modules.has(mdl)) {
      modules.add(mdl);
      imp_part = imp_part !== "" ? imp_part + ", " + mdl : mdl;
    }
  }
  if (imp_part !== "") {
    fs.appendFileSync(path, res[1] + "{ " + imp_part + " }" + res[3] + "\n");
  }
});
