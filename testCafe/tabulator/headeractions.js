// import { Selector, ClientFunction } from 'testcafe';

// fixture`headeractions`
//   .page`http://localhost:8080/examples/tabulator.html`
//   .beforeEach(async t => {
//     await t
//       .resizeWindow(1920, 1080);
//   });

// test('Check pagination', async t => {
//   const getPaginationInState = ClientFunction(() => {
//     return surveyAnalyticsTabulator.state.pageSize;
//   });

//   var json = {
//     elements: [
//       {
//         type: "boolean",
//         name: "bool",
//         title: "Question 1",
//       },
//       {
//         type: "boolean",
//         name: "bool2",
//         title: "Question 2",
//       },
//       {
//         type: "boolean",
//         name: "bool3",
//         title: "Question 3",
//       },
//     ],
//   };

//   var data = [
//     {
//       bool: true,
//       bool2: false,
//       bool3: true,
//     },
//     {
//       bool: true,
//       bool2: false,
//       bool3: false,
//     },
//     {
//       bool: false,
//       bool2: true,
//       bool3: false,
//     }, {
//       bool: true,
//       bool2: false,
//       bool3: true,
//     },
//     {
//       bool: true,
//       bool2: false,
//       bool3: false,
//     },
//     {
//       bool: false,
//       bool2: true,
//       bool3: false,
//     }, {
//       bool: true,
//       bool2: false,
//       bool3: true,
//     },
//     {
//       bool: true,
//       bool2: false,
//       bool3: false,
//     },
//     {
//       bool: false,
//       bool2: true,
//       bool3: false,
//     },
//   ];

//   var initTabulator = ClientFunction((json, data, options) => {
//     var survey = new Survey.SurveyModel(json);
//     window.surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
//       survey,
//       data,
//       options
//     );
//     surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
//   })

//   await initTabulator(json, data, { actionsColumnWidth: 100 });

//   await t
//     .expect(Selector('#tabulatorContainer .tabulator-table').childElementCount).eql(5)
//     .click('.sa-table__entries select')
//     .click(Selector('#tabulatorContainer .sa-table__entries select option').withText('1'))
//     .expect(Selector('#tabulatorContainer .tabulator-table').childElementCount).eql(1)
//     .expect(getPaginationInState()).eql(1)
//     .click('.sa-table__entries select')
//     .click(Selector('#tabulatorContainer .sa-table__entries select option').withText('10'))
//     .expect(Selector('#tabulatorContainer .tabulator-table').childElementCount).eql(9)
//     .expect(getPaginationInState()).eql(10);
// });

// test('Check change locale', async t => {
//   const getLocaleInState = ClientFunction(() => {
//     return window.surveyAnalyticsTabulator.state.locale;
//   });

//   var json = {
//     locale: "ru",
//     questions: [
//       {
//         type: "dropdown",
//         name: "satisfaction",
//         title: {
//           default: "How satisfied are you with the Product?",
//           ru: "Насколько Вас устраивает наш продукт?",
//         },
//         choices: [
//           {
//             value: 0,
//             text: {
//               default: "Not Satisfied",
//               ru: "Coвсем не устраивает",
//             },
//           },
//           {
//             value: 1,
//             text: {
//               default: "Satisfied",
//               ru: "Устраивает",
//             },
//           },
//           {
//             value: 2,
//             text: {
//               default: "Completely satisfied",
//               ru: "Полностью устраивает",
//             },
//           },
//         ],
//       },
//     ],
//   };

//   var data = [{ satisfaction: 0 }, { satisfaction: 1 }, { satisfaction: 2 }];

//   var initTabulator = ClientFunction((json, data, options) => {
//     var survey = new Survey.SurveyModel(json);
//     window.surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
//       survey,
//       data,
//       options
//     );
//     surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
//   })

//   await initTabulator(json, data, { actionsColumnWidth: 100 });

//   await t
//     .expect(Selector('#tabulatorContainer span').withText('Насколько Вас устраивает наш продукт?').innerText).eql("Насколько Вас устраивает наш продукт?")
//     .expect(Selector('#tabulatorContainer div').withText('Coвсем не устраивает').nth(4).innerText).eql("Coвсем не устраивает")
//     .expect(Selector('#tabulatorContainer div').withText('Устраивает').nth(4).innerText).eql("Устраивает")
//     .expect(Selector('#tabulatorContainer div').withText('Полностью устраивает').nth(4).innerText).eql("Полностью устраивает")
//     .click(Selector('#tabulatorContainer .sa-table__header-extension ').withText('Сменить язык'))
//     .click(Selector('#tabulatorContainer .sa-table__header-extension option').withText('English'))
//     .expect(Selector('#tabulatorContainer span').withText('How satisfied are you with the Product?').innerText).eql("How satisfied are you with the Product?")
//     .expect(Selector('#tabulatorContainer div').withText('Not Satisfied').nth(4).innerText).eql("Not Satisfied")
//     .expect(Selector('#tabulatorContainer div').withText('Satisfied').nth(6).innerText).eql("Satisfied")
//     .expect(Selector('#tabulatorContainer div').withText('Completely satisfied').nth(4).innerText).eql("Completely satisfied")
//     .expect(Selector('#tabulatorContainer .sa-table__header-extension').withText('Change Locale').exists).eql(true)
//     .expect(getLocaleInState()).eql("");
// });

// test('Check pagination from state', async t => {
//   var json = {
//     elements: [
//       {
//         type: "boolean",
//         name: "bool",
//         title: "Question 1",
//       },
//       {
//         type: "boolean",
//         name: "bool2",
//         title: "Question 2",
//       },
//       {
//         type: "boolean",
//         name: "bool3",
//         title: "Question 3",
//       },
//     ],
//   };

//   var data = [
//     {
//       bool: true,
//       bool2: false,
//       bool3: true,
//     },
//     {
//       bool: true,
//       bool2: false,
//       bool3: false,
//     },
//     {
//       bool: false,
//       bool2: true,
//       bool3: false,
//     }, {
//       bool: true,
//       bool2: false,
//       bool3: true,
//     },
//     {
//       bool: true,
//       bool2: false,
//       bool3: false,
//     },
//     {
//       bool: false,
//       bool2: true,
//       bool3: false,
//     }, {
//       bool: true,
//       bool2: false,
//       bool3: true,
//     },
//     {
//       bool: true,
//       bool2: false,
//       bool3: false,
//     },
//     {
//       bool: false,
//       bool2: true,
//       bool3: false,
//     },
//   ];

//   var initTabulator = ClientFunction((json, data, options, state) => {
//     var survey = new Survey.SurveyModel(json);
//     window.surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
//       survey,
//       data,
//       options
//     );
//     surveyAnalyticsTabulator.state = state;
//     surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
//   })

//   await initTabulator(json, data, { actionsColumnWidth: 100 }, { pageSize: 10 });

//   await t
//     .expect(Selector('#tabulatorContainer .tabulator-table').childElementCount).eql(9)
//     .expect(Selector('.sa-table__entries select').value).eql('10');
// });

// test('Check locale from state', async t => {
//   var json = {
//     locale: "ru",
//     questions: [
//       {
//         type: "dropdown",
//         name: "satisfaction",
//         title: {
//           default: "How satisfied are you with the Product?",
//           ru: "Насколько Вас устраивает наш продукт?",
//         },
//         choices: [
//           {
//             value: 0,
//             text: {
//               default: "Not Satisfied",
//               ru: "Coвсем не устраивает",
//             },
//           },
//           {
//             value: 1,
//             text: {
//               default: "Satisfied",
//               ru: "Устраивает",
//             },
//           },
//           {
//             value: 2,
//             text: {
//               default: "Completely satisfied",
//               ru: "Полностью устраивает",
//             },
//           },
//         ],
//       },
//     ],
//   };

//   var data = [{ satisfaction: 0 }, { satisfaction: 1 }, { satisfaction: 2 }];

//   var initTabulator = ClientFunction((json, data, options, state) => {
//     var survey = new Survey.SurveyModel(json);
//     window.surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
//       survey,
//       data,
//       options
//     );
//     window.surveyAnalyticsTabulator.state = state;
//     window.surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
//   })

//   await initTabulator(json, data, { actionsColumnWidth: 100 }, { locale: "en" });

//   await t
//     .expect(Selector('#tabulatorContainer span').withText('How satisfied are you with the Product?').innerText).eql("How satisfied are you with the Product?")
//     .expect(Selector('#tabulatorContainer div').withText('Not Satisfied').nth(4).innerText).eql("Not Satisfied")
//     .expect(Selector('#tabulatorContainer div').withText('Satisfied').nth(6).innerText).eql("Satisfied")
//     .expect(Selector('#tabulatorContainer div').withText('Completely satisfied').nth(4).innerText).eql("Completely satisfied");
// });

// test('Check commercial license caption', async t => {
//   var json = {
//     questions: [
//       {
//         type: "dropdown",
//         name: "simplequestion",
//         choices: [
//           0,
//         ],
//       },
//     ],
//   };

//   var data = [];

//   var initTabulator = ClientFunction((json, data, options, state) => {
//     var survey = new Survey.SurveyModel(json);
//     window.surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
//       survey,
//       data,
//       options
//     );
//     window.surveyAnalyticsTabulator.state = state;
//     window.surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
//   })

//   await initTabulator(json, data, {});

//   await t
//     .expect(Selector('#tabulatorContainer span').withText('Please purchase a SurveyJS Analytics developer lic').nth(1).exists).ok();

//   var json = {
//     questions: [
//       {
//         type: "dropdown",
//         name: "simplequestion",
//         choices: [
//           0,
//         ],
//       },
//     ],
//   };

//   var data = [];

//   var initTabulator = ClientFunction((json, data, options, state) => {
//     var survey = new Survey.SurveyModel(json);
//     window.surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
//       survey,
//       data,
//       options
//     );
//     window.surveyAnalyticsTabulator.state = state;
//     window.surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
//   })

//   await initTabulator(json, data, { haveCommercialLicense: true });

//   await t
//     .expect(Selector('#tabulatorContainer span').withText('Please purchase a SurveyJS Analytics developer lic').nth(1).exists).notOk();

//   var json = {
//     questions: [
//       {
//         type: "dropdown",
//         name: "simplequestion",
//         choices: [
//           0,
//         ],
//       },
//     ],
//   };

//   var data = [];

//   var initTabulator = ClientFunction((json, data, options, state) => {
//     SurveyAnalyticsTabulator.Tabulator.haveCommercialLicense = true;
//     var survey = new Survey.SurveyModel(json);
//     window.surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
//       survey,
//       data,
//       options
//     );
//     window.surveyAnalyticsTabulator.state = state;
//     window.surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
//   })

//   await initTabulator(json, data, { haveCommercialLicense: true });

//   await t
//     .expect(Selector('#tabulatorContainer span').withText('Please purchase a SurveyJS Analytics developer lic').nth(1).exists).notOk();
// });