import { stopWords } from "./english";

var stopWordsDictionary: { [index: string]: Array<string> } = {};
stopWordsDictionary["en"] = stopWords;

export var textHelper = {
  getStopWords: (locale: string = "") => {
    return stopWordsDictionary[locale || "en"] || [];
  }
};
