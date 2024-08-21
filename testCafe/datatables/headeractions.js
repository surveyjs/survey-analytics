import { Selector, ClientFunction } from 'testcafe';

fixture `headeractions`
    .page `http://localhost:8080/examples/datatables.html`
    .beforeEach(async t => {
        await t
            .resizeWindow(1920, 1080);
    });

test('Check pagination', async t => {
    const getPaginationInState = ClientFunction(() => {
        return surveyAnalyticsDatatables.state.pageSize;
    });

    var json = {
      elements: [
        {
          type: "boolean",
          name: "bool",
          title: "Question 1",
        },
        {
          type: "boolean",
          name: "bool2",
          title: "Question 2",
        },
           {
          type: "boolean",
          name: "bool3",
          title: "Question 3",
        },
      ],
    };

    var data = [
      {
        bool: true,
        bool2: false,
        bool3: true,
      },
      {
        bool: true,
        bool2: false,
        bool3: false,
      },
      {
        bool: false,
        bool2: true,
        bool3: false,
      }, {
        bool: true,
        bool2: false,
        bool3: true,
      },
      {
        bool: true,
        bool2: false,
        bool3: false,
      },
      {
        bool: false,
        bool2: true,
        bool3: false,
      }, {
        bool: true,
        bool2: false,
        bool3: true,
      },
      {
        bool: true,
        bool2: false,
        bool3: false,
      },
      {
        bool: false,
        bool2: true,
        bool3: false,
      },
    ];

    var initDatatables = ClientFunction((json, data, options) => {
      var survey = new Survey.SurveyModel(json);
      window.surveyAnalyticsDatatables = new SurveyAnalyticsDatatables.DataTables(
        survey,
        data,
        options
      );
      surveyAnalyticsDatatables.render(document.getElementById("dataTablesContainer"));
    })

    await initDatatables(json, data, {actionsColumnWidth: 100});

    await t
        .expect(Selector('#dataTablesContainer .dataTables_scrollBody tbody').childElementCount).eql(5)
        .click('.sa-table__entries select')
        .click(Selector('#dataTablesContainer .sa-table__entries select option').withText('1'))
        .expect(Selector('#dataTablesContainer .dataTables_scrollBody tbody').childElementCount).eql(1)
        .expect(getPaginationInState()).eql(1)
        .click('#dataTablesContainer .sa-table__entries select')
        .click(Selector('#dataTablesContainer .sa-table__entries select option').withText('10'))
        .expect(Selector('#dataTablesContainer .dataTables_scrollBody tbody').childElementCount).eql(9)
        .expect(getPaginationInState()).eql(10);
});

test('Check change locale', async t => {
    const getLocaleInState = ClientFunction(() => {
        return window.surveyAnalyticsDatatables.state.locale;
    });

    var json = {
      locale: "ru",
      questions: [
        {
          type: "dropdown",
          name: "satisfaction",
          title: {
            default: "How satisfied are you with the Product?",
            ru: "Насколько Вас устраивает наш продукт?",
          },
          choices: [
            {
              value: 0,
              text: {
                default: "Not Satisfied",
                ru: "Coвсем не устраивает",
              },
            },
            {
              value: 1,
              text: {
                default: "Satisfied",
                ru: "Устраивает",
              },
            },
            {
              value: 2,
              text: {
                default: "Completely satisfied",
                ru: "Полностью устраивает",
              },
            },
          ],
        },
      ],
    };

    var data = [{ satisfaction: 0 }, { satisfaction: 1 }, { satisfaction: 2 }];

    var initDatatables = ClientFunction((json, data, options) => {
      var survey = new Survey.SurveyModel(json);
      window.surveyAnalyticsDatatables = new SurveyAnalyticsDatatables.DataTables(
        survey,
        data,
        options
      );
      surveyAnalyticsDatatables.render(document.getElementById("dataTablesContainer"));
    })

    await initDatatables(json, data, { actionsColumnWidth: 100 });

    await t
        .expect(Selector('#dataTablesContainer .dataTables_scrollHead th').withText('Насколько Вас устраивает наш продукт?').innerText).eql("Насколько Вас устраивает наш продукт?")
        .expect(Selector('#dataTablesContainer .dataTables_scrollBody td').withText('Coвсем не устраивает').innerText).eql("Coвсем не устраивает")
        .expect(Selector('#dataTablesContainer .dataTables_scrollBody td').withText('Устраивает').innerText).eql("Устраивает")
        .expect(Selector('#dataTablesContainer .dataTables_scrollBody td').withText('Полностью устраивает').innerText).eql("Полностью устраивает")
        .click(Selector('#dataTablesContainer .sa-table__header-extension ').withText('Сменить язык'))
        .click(Selector('#dataTablesContainer .sa-table__header-extension option').withText('English'))
        .expect(Selector('#dataTablesContainer .dataTables_scrollHead th').withText('How satisfied are you with the Product?').innerText).eql("How satisfied are you with the Product?")
        .expect(Selector('#dataTablesContainer .dataTables_scrollBody td').withText('Not Satisfied').innerText).eql("Not Satisfied")
        .expect(Selector('#dataTablesContainer .dataTables_scrollBody td').withExactText('Satisfied').innerText).eql("Satisfied")
        .expect(Selector('#dataTablesContainer .dataTables_scrollBody td').withText('Completely satisfied').innerText).eql("Completely satisfied")
        .expect(Selector('#dataTablesContainer .sa-table__header-extension').withText('Change Locale').exists).eql(true)
        .expect(getLocaleInState()).eql("");
});

test('Check pagination from state', async t => {
    var json = {
      elements: [
        {
          type: "boolean",
          name: "bool",
          title: "Question 1",
        },
        {
          type: "boolean",
          name: "bool2",
          title: "Question 2",
        },
        {
          type: "boolean",
          name: "bool3",
          title: "Question 3",
        },
      ],
    };

    var data = [
      {
        bool: true,
        bool2: false,
        bool3: true,
      },
      {
        bool: true,
        bool2: false,
        bool3: false,
      },
      {
        bool: false,
        bool2: true,
        bool3: false,
      }, {
        bool: true,
        bool2: false,
        bool3: true,
      },
      {
        bool: true,
        bool2: false,
        bool3: false,
      },
      {
        bool: false,
        bool2: true,
        bool3: false,
      }, {
        bool: true,
        bool2: false,
        bool3: true,
      },
      {
        bool: true,
        bool2: false,
        bool3: false,
      },
      {
        bool: false,
        bool2: true,
        bool3: false,
      },
    ];

    var initDatatables = ClientFunction((json, data, options, state) => {
      var survey = new Survey.SurveyModel(json);
      window.surveyAnalyticsDatatables = new SurveyAnalyticsDatatables.DataTables(
        survey,
        data,
        options
      );
      surveyAnalyticsDatatables.state = state;
      surveyAnalyticsDatatables.render(document.getElementById("dataTablesContainer"));
    })

    await initDatatables(json, data, { actionsColumnWidth: 100 }, { pageSize: 10 });

    await t
        .expect(Selector('#dataTablesContainer .dataTables_scrollBody tbody').childElementCount).eql(9)
        .expect(Selector('.sa-table__entries select').value).eql('10');
});

test('Check locale from state', async t => {
    var json = {
      locale: "ru",
      questions: [
        {
          type: "dropdown",
          name: "satisfaction",
          title: {
            default: "How satisfied are you with the Product?",
            ru: "Насколько Вас устраивает наш продукт?",
          },
          choices: [
            {
              value: 0,
              text: {
                default: "Not Satisfied",
                ru: "Coвсем не устраивает",
              },
            },
            {
              value: 1,
              text: {
                default: "Satisfied",
                ru: "Устраивает",
              },
            },
            {
              value: 2,
              text: {
                default: "Completely satisfied",
                ru: "Полностью устраивает",
              },
            },
          ],
        },
      ],
    };

    var data = [{ satisfaction: 0 }, { satisfaction: 1 }, { satisfaction: 2 }];

    var initDatatables = ClientFunction((json, data, options, state) => {
      var survey = new Survey.SurveyModel(json);
      window.surveyAnalyticsDatatables = new SurveyAnalyticsDatatables.DataTables(
        survey,
        data,
        options
      );
      window.surveyAnalyticsDatatables.state = state;
      window.surveyAnalyticsDatatables.render(document.getElementById("dataTablesContainer"));
    })

    await initDatatables(json, data, { actionsColumnWidth: 100 }, { locale: "en" });

    await t
        .expect(Selector('#dataTablesContainer thead th').withText('How satisfied are you with the Product?').innerText).eql("How satisfied are you with the Product?")
        .expect(Selector('#dataTablesContainer td').withText('Not Satisfied').visible).eql(true)
        .expect(Selector('#dataTablesContainer td').withExactText('Satisfied').visible).eql(true)
        .expect(Selector('#dataTablesContainer td').withText('Completely satisfied').visible).eql(true);
});

test('Check commercial license caption', async t => {
    var json = {
      questions: [
        {
          type: "dropdown",
          name: "simplequestion",
          choices: [
            0,
          ],
        },
      ],
    };

    var data = [];

    var initDatatables = ClientFunction((json, data, options, state) => {
      var survey = new Survey.SurveyModel(json);
      window.surveyAnalyticsDatatables = new SurveyAnalyticsDatatables.DataTables(
        survey,
        data,
        options
      );
      window.surveyAnalyticsDatatables.state = state;
      window.surveyAnalyticsDatatables.render(document.getElementById("dataTablesContainer"));
    })

    await initDatatables(json, data, {});

    await t
        .expect(Selector('#dataTablesContainer span').withText('Please purchase a SurveyJS Analytics developer lic').nth(1).exists).ok();

    var json = {
      questions: [
        {
          type: "dropdown",
          name: "simplequestion",
          choices: [
            0,
          ],
        },
      ],
    };

    var data = [];

    var initDatatables = ClientFunction((json, data, options, state) => {
      var survey = new Survey.SurveyModel(json);
      window.surveyAnalyticsDatatables = new SurveyAnalyticsDatatables.DataTables(
        survey,
        data,
        options
      );
      window.surveyAnalyticsDatatables.state = state;
      window.surveyAnalyticsDatatables.render(document.getElementById("dataTablesContainer"));
    })

    await initDatatables(json, data, {haveCommercialLicense: true});

    await t
        .expect(Selector('#dataTablesContainer span').withText('Please purchase a SurveyJS Analytics developer lic').nth(1).exists).notOk();

    var json = {
      questions: [
        {
          type: "dropdown",
          name: "simplequestion",
          choices: [
            0,
          ],
        },
      ],
    };

    var data = [];

    var initDatatables = ClientFunction((json, data, options, state) => {
      SurveyAnalyticsDatatables.DataTables.haveCommercialLicense = true;
      var survey = new Survey.SurveyModel(json);
      window.surveyAnalyticsDatatables = new SurveyAnalyticsDatatables.DataTables(
        survey,
        data,
        options
      );
      window.surveyAnalyticsDatatables.state = state;
      window.surveyAnalyticsDatatables.render(document.getElementById("dataTablesContainer"));
    })

    await initDatatables(json, data, {});

    await t
        .expect(Selector('#dataTablesContainer span').withText('Please purchase a SurveyJS Analytics developer lic').nth(1).exists).notOk();
});