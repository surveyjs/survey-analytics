![SurveyJS Analytics](https://raw.githubusercontent.com/surveyjs/survey-analytics/master/docs/images/survey-analytics-note.png)

# SurveyJS Analytics


[![Build Status](https://dev.azure.com/SurveyJS/SurveyJS%20Integration%20Tests/_apis/build/status/SurveyJS%20Library?branchName=master)](https://dev.azure.com/SurveyJS/SurveyJS%20Integration%20Tests/_build/latest?definitionId=7&branchName=master)
<a href="https://github.com/DevExpress/testcafe">
<img alt="Tested with TestCafe" src="https://img.shields.io/badge/tested%20with-TestCafe-2fa4cf.svg">
</a>
<a href="https://github.com/surveyjs/survey-analytics/issues">
<img alt="Open Issues" title="Open Issues" src="https://img.shields.io/github/issues/surveyjs/survey-analytics.svg">
</a>
<a href="https://github.com/surveyjs/survey-analytics/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+">
<img alt="Closed issues" title="Closed issues" src="https://img.shields.io/github/issues-closed/surveyjs/survey-analytics.svg">
</a>

SurveyJS Analytics library allows to render survey results as charts or tables

## Main Features

- Count answers and render results as charts for the select type questions
- Count answers and render results as gauge for range type question
- Three different types of charts: bar, pie and line
- Wordcloud for text questions representation
- Interactive filtering for the select type questions
- Flexible layout and customizable colors

## Examples

You may review the [analytics example](https://surveyjstest.azurewebsites.net/Examples/Library/?id=analytics-nps) or check this standalone plnkr [example](https://plnkr.co/edit/bCk64wdvOLShXkPyvGfk?p=preview).

Other live examples:

- [how to show chanrt for the one question](https://next.plnkr.co/edit/3yIIFnbcn8RMJQHY?preview).

## Licensing

Unlike SurveyJS Library itself, this library is distributed under commercial license. Please read more about licensing on our [license page](https://surveyjstest.azurewebsites.net/Licenses#Analytics).

## Support

If you feel that we have missed some important functionality or found a bug, please write us [here](https://github.com/surveyjs/survey-analytics/issues) on our [support desk](https://surveyjs.answerdesk.io/).

## Building survey-analytics from sources

To build library yourself:

1.  **Clone the repo from GitHub**

    ```
    git clone https://github.com/surveyjs/survey-analytics.git
    cd survey-analytics
    ```

2.  **Acquire build dependencies.** Make sure you have [Node.js](http://nodejs.org/) installed on your workstation. You need a version of Node.js greater than 6.0.0 and npm greater than 2.7.0. This is only needed to _build_ surveyjs from sources.

    ```
    npm install
    ```

3.  **Build the library**

    ```
    npm run build_prod
    ```

    After that you should have the library at 'packages' directory.

4.  **Run samples**

    ```
    npm start
    ```

    This command will run local http server at the http://localhost:7777

    You can open http://localhost:7777/examples/examples

5.  **Run unit tests**
    ```
    npm test
    ```
    This command will run unit tests

## Nearest plans

Our task list of Survey Analytics pack:

- Implement data providing server side prototype
- Introduce (or use 3rd party) data processing engine for survey analytics
- Support high load scenario - process at least billion records

## Limitations

- SurveyJS Analytics doesn't support objects as values (e.g. of dropdown, radiogroup and other select question items)
- WordCloud visualizer is too slow for large texts and significant answers count
