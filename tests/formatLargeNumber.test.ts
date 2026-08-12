import { formatLargeNumber, getFormattedValueTicks } from "../src/utils/utils";

describe("formatLargeNumber", () => {
  test("returns value as-is for numbers less than 10000", () => {
    expect(formatLargeNumber(0)).toBe("0");
    expect(formatLargeNumber(1)).toBe("1");
    expect(formatLargeNumber(999)).toBe("999");
    expect(formatLargeNumber(9999)).toBe("9999");
  });

  test("formats thousands with K suffix", () => {
    expect(formatLargeNumber(10000)).toBe("10K");
    expect(formatLargeNumber(15600)).toBe("15.6K");
    expect(formatLargeNumber(50000)).toBe("50K");
    expect(formatLargeNumber(99999)).toBe("100K");
    expect(formatLargeNumber(123456)).toBe("123.46K");
  });

  test("formats millions with M suffix", () => {
    expect(formatLargeNumber(1000000)).toBe("1M");
    expect(formatLargeNumber(1250000)).toBe("1.25M");
    expect(formatLargeNumber(2000000)).toBe("2M");
    expect(formatLargeNumber(2530000)).toBe("2.53M");
    expect(formatLargeNumber(999999999)).toBe("1000M");
  });

  test("formats billions with B suffix", () => {
    expect(formatLargeNumber(1000000000)).toBe("1B");
    expect(formatLargeNumber(7200000000)).toBe("7.2B");
    expect(formatLargeNumber(1500000000)).toBe("1.5B");
  });

  test("handles negative numbers", () => {
    expect(formatLargeNumber(-500)).toBe("-500");
    expect(formatLargeNumber(-15600)).toBe("-15.6K");
    expect(formatLargeNumber(-2530000)).toBe("-2.53M");
    expect(formatLargeNumber(-7200000000)).toBe("-7.2B");
  });

  test("handles edge cases", () => {
    expect(formatLargeNumber(NaN)).toBe("NaN");
    expect(formatLargeNumber(null)).toBe("null");
    expect(formatLargeNumber(undefined)).toBe("undefined");
  });
});

describe("getFormattedValueTicks", () => {
  test("returns undefined for values less than 10000", () => {
    expect(getFormattedValueTicks(0)).toBeUndefined();
    expect(getFormattedValueTicks(5000)).toBeUndefined();
    expect(getFormattedValueTicks(9999)).toBeUndefined();
  });

  test("returns tick values and formatted text for large values", () => {
    const result = getFormattedValueTicks(50000);
    expect(result).toBeDefined();
    expect(result.tickvals).toContain(0);
    expect(result.tickvals.length).toBeGreaterThanOrEqual(3);
    expect(result.ticktext.length).toBe(result.tickvals.length);
    result.ticktext.forEach((text: string) => {
      expect(typeof text).toBe("string");
    });
  });

  test("tick values include formatted K/M/B labels", () => {
    const result = getFormattedValueTicks(1500000);
    expect(result).toBeDefined();
    const hasFormattedTick = result.ticktext.some((t: string) => t.endsWith("K") || t.endsWith("M"));
    expect(hasFormattedTick).toBe(true);
  });

  test("tick values cover the data range", () => {
    const maxValue = 100000;
    const result = getFormattedValueTicks(maxValue);
    expect(result).toBeDefined();
    const lastTick = result.tickvals[result.tickvals.length - 1];
    expect(lastTick).toBeGreaterThanOrEqual(maxValue);
  });
});
