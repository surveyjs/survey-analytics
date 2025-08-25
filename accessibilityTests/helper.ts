import { Page } from "@playwright/test";
import { RunOptions } from "axe-core";

export const FLOAT_PRECISION = 0.01;

// https://www.deque.com/axe/core-documentation/api-documentation/#overview
export const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice", "section508", "wcag412"];

export const axeOptions: RunOptions = {
  runOnly: {
    type: "tag",
    values: axeTags
  },
  rules: {
    //https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
    "color-contrast": {
      enabled: false
    },
    "document-title": {
      enabled: false
    },
    "landmark-one-main": {
      enabled: false
    },
    "page-has-heading-one": {
      enabled: false
    },
    "region": {
      enabled: false
    }
  }
};
