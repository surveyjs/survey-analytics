import { Selector, ClientFunction } from 'testcafe';

fixture`columnactions`
  .page`http://localhost:8080/examples/tabulator.html`
  .beforeEach(async t => {
    await t
      .resizeWindow(1920, 1080);

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
      },
    ];

    var initTabulator = ClientFunction((json, data, options) => {
      window.SurveyAnalyticsTabulator.TableExtensions.findExtension(
        "column",
        "makepublic"
      ).visibleIndex = 0;

      var survey = new Survey.SurveyModel(json);
      window.surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
        survey,
        data,
        options
      );
      surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
    })

    await initTabulator(json, data, { actionsColumnWidth: 100 });
  });

test('Check show/hide actions', async t => {
  const getColumnsVisibilityArray = ClientFunction(() => {
    return window.surveyAnalyticsTabulator.state.elements.map((column) => { return column.isVisible });
  });

  await t
    .expect(Selector('#tabulatorContainer div').withText('Question 1').visible).eql(true)
    .expect(getColumnsVisibilityArray()).eql([true, true, true])
    .click('#tabulatorContainer .tabulator-col[title="Question 1"] button[title="Hide column"]')
    .expect(Selector('#tabulatorContainer div').withText('Question 1').nth(3).visible).eql(false)
    .expect(getColumnsVisibilityArray()).eql([false, true, true])
    .click('#tabulatorContainer .sa-table__show-column.sa-table__header-extension')
    .click(Selector('#tabulatorContainer .sa-table__show-column.sa-table__header-extension option').withText('Question 1'))
    .expect(Selector('#tabulatorContainer div').withText('Question 1').nth(3).visible).eql(true)
    .expect(getColumnsVisibilityArray()).eql([true, true, true]);
});

test('Check move to details', async t => {
  const getColumnsLocationsArray = ClientFunction(() => {
    return window.surveyAnalyticsTabulator.state.elements.map(column => column.location);
  });

  await t
    .expect(Selector('#tabulatorContainer .tabulator-col[title="Question 1"] ').visible).eql(true)
    .expect(getColumnsLocationsArray()).eql([0, 0, 0])
    .click('#tabulatorContainer .tabulator-row:nth-child(1) button[title="Show minor columns"]')
    .expect(Selector('#tabulatorContainer td').withText('Question 1').exists).eql(false)
    .click('#tabulatorContainer .tabulator-col[title="Question 1"] button[title="Move to Detail"]')
    .expect(Selector('#tabulatorContainer .tabulator-col[title="Question 1"] ').visible).eql(false)
    .click('#tabulatorContainer .tabulator-row:nth-child(1) button[title="Show minor columns"]')
    .expect(Selector('#tabulatorContainer td').withText('Question 1').visible).eql(true)
    .expect(Selector('#tabulatorContainer td').withText('Yes').visible).eql(true)
    .expect(getColumnsLocationsArray()).eql([1, 0, 0])
    .click(Selector('#tabulatorContainer button').withText('Show as Column'))
    .expect(Selector('#tabulatorContainer .tabulator-col[title="Question 1"] ').visible).eql(true)
    .expect(getColumnsLocationsArray()).eql([0, 0, 0])
    .click('#tabulatorContainer .tabulator-row:nth-child(1) button[title="Show minor columns"]')
    .expect(Selector('#tabulatorContainer td').withText('Question 1').exists).eql(false);
});

test('Check columns drag and drop', async t => {
  const getColumnNamesOrder = ClientFunction(() => {
    var names = [];
    document.querySelectorAll(".tabulator .tabulator-col").forEach((col) => { names.push(col.innerText) })
    names.splice(0, 1);
    return names;
  });

  const getColumnNamesOrderInState = ClientFunction(() => {
    var names = [];
    window.surveyAnalyticsTabulator.state.elements.forEach((col) => { names.push(col.displayName) })
    return names;
  });

  await t
    .drag('#tabulatorContainer div.tabulator-col[title="Question 1"] button.sa-table__drag-button', 1200, 120, {
      offsetX: 5,
      offsetY: 10,
      speed: 0.01
    })
    .expect(getColumnNamesOrder()).eql(["Question 2", "Question 1", "Question 3"])
    .expect(getColumnNamesOrderInState()).eql(["Question 2", "Question 1", "Question 3"]);
});

test('Check public/private actions', async t => {
  const getPublicitArrayInState = ClientFunction(() => {
    return window.surveyAnalyticsTabulator.state.elements.map(col => col.isPublic)
  });

  await t
    .click('#tabulatorContainer .tabulator-col[title="Question 2"] button.sa-table__svg-button[title="Make column private"]')
    .expect(getPublicitArrayInState()).eql([true, false, true])
    .click('#tabulatorContainer .tabulator-col[title="Question 2"] button.sa-table__svg-button[title="Make column public"]')
    .expect(getPublicitArrayInState()).eql([true, true, true]);
});

test('Check tabulator taking into account state', async t => {
  const getColumnNamesOrder = ClientFunction(() => {
    var names = [];
    document.querySelectorAll(".tabulator .tabulator-col").forEach((col) => { names.push(col.innerText) })
    names.splice(0, 1);
    return names;
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
      {
        type: "boolean",
        name: "bool4",
        title: "Question 4",
      },
    ],
  };

  var data = [
    {
      bool: true,
      bool2: false,
      bool3: true,
      bool4: true,
    },
    {
      bool: true,
      bool2: false,
      bool3: false,
      bool4: true,

    },
    {
      bool: false,
      bool2: true,
      bool3: false,
      bool4: true,
    },
  ];

  var initTabulator = ClientFunction((json, data, options) => {
    window.survey = new Survey.SurveyModel(json);
    window.surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
      survey,
      data,
      options,
      [
        { "name": "bool4", "displayName": "Question 4", "dataType": 0, "isVisible": true, "location": 0 },
        { "name": "bool", "displayName": "Question 1", "dataType": 0, "isVisible": false, "location": 0 },
        { "name": "bool2", "displayName": "Question 2", "dataType": 0, "isVisible": true, "location": 1 },
        { "name": "bool3", "displayName": "Question 3", "dataType": 0, "isVisible": true, "location": 0 }
      ]

    );
    surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
  })

  await initTabulator(json, data, { actionsColumnWidth: 100 });

  await t
    .expect(getColumnNamesOrder()).eql(["Question 4", "Question 1", "Question 2", "Question 3"])
    .expect(Selector('#tabulatorContainer .tabulator-col').withText('Question 1').visible).notOk()
    .expect(Selector('#tabulatorContainer .tabulator-col').withText('Question 2').visible).notOk()
    .expect(Selector('#tabulatorContainer .sa-table__show-column.sa-table__header-extension option').exists).ok()
    .click('#tabulatorContainer .tabulator-row:nth-child(1) button[title="Show minor columns"]')
    .expect(Selector('#tabulatorContainer td').withText('Question 2').visible).ok();
});