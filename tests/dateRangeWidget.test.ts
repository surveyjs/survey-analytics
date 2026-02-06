import { SurveyModel } from "survey-core";
import { DateRangeModel } from "../src/utils/dateRangeModel";
import { DateRangeWidget, IDateRangeWidgetOptions } from "../src/utils/dateRangeWidget";
import { VisualizationPanel } from "../src/visualizationPanel";

const mockOnDateRangeChanged = jest.fn();

beforeEach(() => {
  mockOnDateRangeChanged.mockClear();
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-12-15"));
});

afterEach(() => {
  jest.useRealTimers();
});

test("DateRangeWidget render shows date inputs with correct values", () => {
  const start = new Date("2025-12-01");
  const end = new Date("2025-12-14");
  const config = <IDateRangeWidgetOptions>{
    onDateRangeChanged: mockOnDateRangeChanged,
    dateRange: [start, end]
  };
  const model = new DateRangeModel(config);
  const widget = new DateRangeWidget(model, config);

  const element = widget.render();
  const inputs = element.querySelectorAll("input[type='date']");

  expect(inputs.length).toBe(2);
  expect(inputs[0].value).toBe("2025-12-01");
  expect(inputs[1].value).toBe("2025-12-14");
});

test("DateRangeWidget render is not show dropdown & answerCoun", () => {
  const config = <IDateRangeWidgetOptions>{
    onDateRangeChanged: mockOnDateRangeChanged,
    availableDatePeriods: [],
    showAnswerCount: false
  };
  const model = new DateRangeModel(config);
  const widget = new DateRangeWidget(model, config);

  const element = widget.render();

  expect(element).toBeDefined();
  expect(widget["datePeriodContainer"]).toBeUndefined();
  expect(widget["countLabel"]).toBeUndefined();
});

test("verifies answer count when range is set by dateRange", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-12-15"));

  const json = {
    elements: [{ type: "text", name: "question1" }],
  };
  const data = [
    { timestamp: "2025-12-01", question1: "a" },
    { timestamp: "2025-12-05", question1: "b" },
    { timestamp: "2025-12-10", question1: "c" },
    { timestamp: "2025-12-14", question1: "d" },
    { timestamp: "2025-12-15", question1: "e" },
  ];
  const survey = new SurveyModel(json);
  const visPanel = new VisualizationPanel(survey.getAllQuestions(), data, {
    dateFieldName: "timestamp",
    dateRange: [new Date("2025-12-01"), new Date("2025-12-14")],
  });

  await Promise.resolve();
  expect(visPanel["_dateRangeWidget"]["answersCount"]).toEqual(4);

  jest.useRealTimers();
});

test("verifies answer count when range is set by datePeriod", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-12-15"));

  const json = {
    elements: [{ type: "text", name: "question1" }],
  };
  const data = [
    { timestamp: "2025-12-01", question1: "a" },
    { timestamp: "2025-12-05", question1: "b" },
    { timestamp: "2025-12-10", question1: "c" },
    { timestamp: "2025-12-14", question1: "d" },
    { timestamp: "2025-12-15", question1: "e" },
  ];
  const survey = new SurveyModel(json);
  const visPanel = new VisualizationPanel(survey.getAllQuestions(), data, {
    dateFieldName: "timestamp",
    datePeriod: "last7days",
  });

  await Promise.resolve();
  expect(visPanel["_dateRangeWidget"]["answersCount"]).toEqual(2);

  jest.useRealTimers();
});

test("verifies answer count when range is not set", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-12-15"));

  const json = {
    elements: [{ type: "text", name: "question1" }],
  };
  const data = [
    { timestamp: "2025-12-01", question1: "a" },
    { timestamp: "2025-12-05", question1: "b" },
    { timestamp: "2025-12-10", question1: "c" },
    { timestamp: "2025-12-14", question1: "d" },
    { timestamp: "2025-12-15", question1: "e" },
  ];
  const survey = new SurveyModel(json);
  const visPanel = new VisualizationPanel(survey.getAllQuestions(), data, {
    dateFieldName: "timestamp",
  });

  await Promise.resolve();
  expect(visPanel["_dateRangeWidget"]["answersCount"]).toEqual(5);

  jest.useRealTimers();
});