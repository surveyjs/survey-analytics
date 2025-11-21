import { englishStrings } from "./analytics-localization/english";
import { surveyLocalization } from "survey-core";

export var localization = {
  currentLocaleValue: "",
  defaultLocaleValue: "en",
  locales: <{ [index: string]: any }>{},
  localeNames: <{ [index: string]: any }>{},
  supportedLocales: <Array<any>>[],
  get currentLocale() {
    return this.currentLocaleValue === this.defaultLocaleValue
      ? ""
      : this.currentLocaleValue;
  },
  set currentLocale(val: string) {
    this.currentLocaleValue = val;
  },
  get defaultLocale() {
    return this.defaultLocaleValue;
  },
  set defaultLocale(val: string) {
    this.defaultLocaleValue = val;
  },
  setupLocale: function (loc: string, strings: any) {
    this.locales[loc] = strings;
  },
  getLocaleName: function (loc: string, inEnglish: boolean = false): string {
    const res = !inEnglish ? this.localeNames[loc] : "";
    return res || surveyLocalization.getLocaleName(loc, inEnglish);
  },
  getString: function (strName: string) {
    var loc = this.currentLocale
      ? this.locales[this.currentLocale]
      : this.locales[this.defaultLocale];
    if(!loc || !loc[strName]) loc = this.locales[this.defaultLocale];
    var result = loc[strName];
    if(result === undefined) {
      result = this.locales["en"][strName] || strName;
    }
    return result;
  },
  getLocales: function (): Array<string> {
    var res = [];
    res.push("");
    if(this.supportedLocales && this.supportedLocales.length > 0) {
      for(var i = 0; i < this.supportedLocales.length; i++) {
        res.push(this.supportedLocales[i]);
      }
    } else {
      for(var key in this.locales) {
        res.push(key);
      }
    }
    res.sort();
    return res;
  }
};

export var surveyStrings = englishStrings;
export function setupLocale(localeConfig: { localeCode: string, strings: any, nativeName?: string }): void {
  const loc = localeConfig.localeCode;
  localization.setupLocale(loc, localeConfig.strings);
  if(localeConfig.nativeName) {
    localization.localeNames[loc] = localeConfig.nativeName;
  }
}
setupLocale({ localeCode: "en", strings: englishStrings, nativeName: "English" });