![SurveyJS Analytics](https://surveyjstest.azurewebsites.net/Content/Images/design/analytics/Monitor.png)

# SurveyJS Analytics (BETA)

[![Build Status](https://dev.azure.com/SurveyJS/survey-analytics/_apis/build/status/survey-analytics-release?branchName=master)](https://dev.azure.com/SurveyJS/survey-analytics/_build/latest?definitionId=17&branchName=master)

SurveyJS Analytics library allows to render survey results as charts or tables

## Main Features
- Count answers and render results as charts for the select type questions
- Count answers and render results as gauge for range type question
- Three different types of charts: bar, pie and line
- Wordcloud for text questions representation
- Interactive filtering for the select type questions
- Flexible layout and customizable colors

## Examples

You may review the [analytics example](https://surveyjstest.azurewebsites.net/Examples/Library/?id=analytics-nps) or check this standalone plnkr [example](https://plnkr.co/edit/bCk64wdvOLShXkPyvGfk?p=preview) Other examples - [one question](https://next.plnkr.co/edit/3yIIFnbcn8RMJQHY?preview).

## Licensing

SurveyJS Analytics library is currently in BETA. Unlike SurveyJS Library itself, this library will be distributed under commercial license. Please read more about licensing on our [license page](https://surveyjstest.azurewebsites.net/Licenses#Analytics).

## Support and realease version

Analytics library will be out of the beta as soon as we see that our customers may successfully use it in their products. If you feel that we have missed some important functionality or found a bug, please write us [here](https://github.com/surveyjs/survey-analytics/issues) on our [support desk](https://surveyjs.answerdesk.io/).

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

