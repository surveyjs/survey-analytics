import $ from "jquery";
export function load(node: HTMLElement) {
  "use strict";

  var file = "/images/SaSvgs.svg";

  try {
    $.get(file, function(data) {
      var div = document.createElement("div");
      div.innerHTML = new XMLSerializer().serializeToString(
        data.documentElement
      );
      $(div).hide();
      $(div).insertBefore(node);
    });
  } catch (e) {}
}
