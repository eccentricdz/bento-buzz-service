import { isNilOrEmpty } from "../fp";

describe("isNilOrEmpty", () => {
  test("should return true for null", () => {
    expect(isNilOrEmpty(null)).toBe(true);
  });
  test("should return true for undefined", () => {
    expect(isNilOrEmpty(undefined)).toBe(true);
  });
  test("should return true for empty string", () => {
    expect(isNilOrEmpty("")).toBe(true);
  });
  test("should return true for empty array", () => {
    expect(isNilOrEmpty([])).toBe(true);
  });
  test("should return true for empty object", () => {
    expect(isNilOrEmpty({})).toBe(true);
  });
  test("should return false for non-empty string", () => {
    expect(isNilOrEmpty("foo")).toBe(false);
  });
});
