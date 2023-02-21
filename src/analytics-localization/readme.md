# SurveyJS Dashboard Localization

This topic describes how to add a new dictionary or update an existing dictionary to localize SurveyJS Dashboard.

## Add a New Dictionary

Follow the steps below to add a new localization dictionary:

1. Fork the [`survey-analytics`](https://github.com/surveyjs/survey-analytics) repository.
1. Create a new file in the [`src/analytics-localization`](../analytics-localization/) directory and name it `[language name].ts`, for example, `french.ts`.
2. Copy the content from the [`english.ts`](../analytics-localization/english.ts) file and uncomment the first and last lines.
3. Translate required strings.
4. Open all files in the [`entries`](../entries/) directory and import your file in each of them for Webpack. For example, the following code imports the `french.ts` file:
  
    ```js
    import "../analytics-localization/french";
    ```

5. [Rebuild the library](../../README.md#build-surveyjs-dashboard-from-sources).
6. *(Optional)* Create a [pull request](https://github.com/surveyjs/survey-analytics/pulls) to share your dictionary with the community. After the PR is merged, your localization will be included in the next official release.

## Update an Existing Dictionary

Follow the steps below to update an existing localization dictionary:

1. Fork the [`survey-analytics`](https://github.com/surveyjs/survey-analytics) repository.
1. Open the [`src/analytics-localization`](../analytics-localization/) directory and find the required dictionary.
1. Change required translations.
1. [Rebuild the library](../../README.md#build-surveyjs-dashboard-from-sources).
1. *(Optional)* Create a [pull request](https://github.com/surveyjs/survey-analytics/pulls) to share your translations with the community. After the PR is merged, your localization will be included in the next official release.
