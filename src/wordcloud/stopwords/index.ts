import { stopWords } from "./english";
import { stopWords as noStopWords } from "./norwegian";
import { stopWords as nlStopWords } from "./dutch";
import { stopWords as esStopWords } from "./spanish";

var stopWordsDictionary: { [index: string]: Array<string> } = {};
stopWordsDictionary["en"] = stopWords;
stopWordsDictionary["no"] = noStopWords;
stopWordsDictionary["nl"] = nlStopWords;
stopWordsDictionary["es"] = esStopWords;

export var textHelper = {
  getStopWords: (locale: string = "") => {
    return stopWordsDictionary[locale || "en"] || [];
  },
};
