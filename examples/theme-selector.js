(function (global) {
  var THEME_KEY_ORDER = [
    "DefaultLight", "DefaultDark",
    "SoftLight", "SoftDark",
    "ContrastLight", "ContrastDark",
    "BorderlessLight", "BorderlessDark",
    "FlatLight", "FlatDark",
    "PlainLight", "PlainDark",
    "ThreeDimensionalLight", "ThreeDimensionalDark",
    "MonochromeLight", "MonochromeDark",
  ];

  function getThemeKeys() {
    if (typeof SurveyTheme === "undefined") {
      return [];
    }
    var keys = Object.keys(SurveyTheme).filter(function (key) {
      return key.indexOf("Panelless") === -1
        && key.indexOf("__") !== 0
        && key !== "default";
    });
    return keys.sort(function (a, b) {
      var indexA = THEME_KEY_ORDER.indexOf(a);
      var indexB = THEME_KEY_ORDER.indexOf(b);
      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }
      if (indexA === -1) {
        return 1;
      }
      if (indexB === -1) {
        return -1;
      }
      return indexA - indexB;
    });
  }

  function formatThemeLabel(themeKey) {
    return themeKey
      .replace(/Light$/, " (Light)")
      .replace(/Dark$/, " (Dark)")
      .replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  function resolveElement(elementOrId) {
    if (!elementOrId) {
      return null;
    }
    if (typeof elementOrId === "string") {
      return document.getElementById(elementOrId);
    }
    return elementOrId;
  }

  function populateThemeSelect(select, defaultThemeKey) {
    getThemeKeys().forEach(function (themeKey) {
      var option = document.createElement("option");
      option.value = themeKey;
      option.textContent = formatThemeLabel(themeKey);
      if (themeKey === defaultThemeKey) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  }

  function applyThemeToTargets(themeKey, themeable) {
    var theme = SurveyTheme[themeKey];
    if (!theme) {
      return;
    }
    var targets = Array.isArray(themeable) ? themeable : [themeable];
    targets.forEach(function (target) {
      if (target && typeof target.applyTheme === "function") {
        target.applyTheme(theme);
      }
    });
  }

  function setupThemeSelector(selectOrId, themeable, options) {
    options = options || {};
    var select = resolveElement(selectOrId);
    if (!select) {
      return;
    }

    var defaultThemeKey = options.defaultThemeKey || "DefaultLight";
    populateThemeSelect(select, defaultThemeKey);

    select.addEventListener("change", function () {
      applyThemeToTargets(select.value, themeable);
    });
  }

  function createThemeSelector(themeable, options) {
    options = options || {};
    var container = document.createElement("div");
    container.className = options.containerClassName || "sa-theme-selector";

    var label = document.createElement("label");
    label.htmlFor = options.selectId || "theme-selector";
    label.textContent = options.labelText || "Theme";

    var select = document.createElement("select");
    select.id = options.selectId || "theme-selector";

    container.appendChild(label);
    container.appendChild(document.createTextNode(" "));
    container.appendChild(select);

    if (options.insertBefore) {
      var insertBefore = resolveElement(options.insertBefore);
      if (insertBefore && insertBefore.parentNode) {
        insertBefore.parentNode.insertBefore(container, insertBefore);
      }
    } else if (options.parent) {
      var parent = resolveElement(options.parent);
      if (parent) {
        parent.insertBefore(container, parent.firstChild);
      }
    } else {
      document.body.insertBefore(container, document.body.firstChild);
    }

    setupThemeSelector(select, themeable, options);
    return container;
  }

  global.SurveyAnalyticsExamples = global.SurveyAnalyticsExamples || {};
  global.SurveyAnalyticsExamples.getThemeKeys = getThemeKeys;
  global.SurveyAnalyticsExamples.formatThemeLabel = formatThemeLabel;
  global.SurveyAnalyticsExamples.setupThemeSelector = setupThemeSelector;
  global.SurveyAnalyticsExamples.createThemeSelector = createThemeSelector;
})(typeof window !== "undefined" ? window : this);
