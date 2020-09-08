import { stopWords } from "./english";
import { stopWords as noStopWords } from "./norwegian";

var stopWordsDictionary: { [index: string]: Array<string> } = {};
stopWordsDictionary["en"] = stopWords;
stopWordsDictionary["no"] = noStopWords;

export var textHelper = {
  getStopWords: (locale: string = "") => {
    return stopWordsDictionary[locale || "en"] || [];
  },
};
