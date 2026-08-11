import { describe, expect, it } from "vitest";

import { formatElapsedTime } from "./similarTaskUtils";

describe("formatElapsedTime", () => {
  it.each([
    [10, "10초"],
    [65, "1분 5초"],
    [3600, "1시간"],
    [3665, "1시간 1분 5초"],
    [-1, "0초"],
    [Number.NaN, "0초"],
  ])("formats %s seconds", (seconds, expected) => {
    expect(formatElapsedTime(seconds)).toBe(expected);
  });
});
