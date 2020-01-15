import $ from "jquery";

var svgText = require("html-loader?interpolate!val-loader!../svgbundle.html")
$(document.head).append(svgText);