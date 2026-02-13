import { describe, it, expect } from "vitest";
import { diff } from "../src/diff";

describe("diff", () => {
  it("returns empty array for identical objects", () => {
    expect(diff({ a: 1 }, { a: 1 })).toEqual([]);
  });

  it("returns empty array for same reference", () => {
    const obj = { a: 1 };
    expect(diff(obj, obj)).toEqual([]);
  });

  it("detects added properties", () => {
    const result = diff({ a: 1 }, { a: 1, b: 2 });
    expect(result).toEqual([{ type: "CREATE", path: ["b"], value: 2 }]);
  });

  it("detects removed properties", () => {
    const result = diff({ a: 1, b: 2 }, { a: 1 });
    expect(result).toEqual([{ type: "DELETE", path: ["b"], oldValue: 2 }]);
  });

  it("detects updated properties", () => {
    const result = diff({ a: 1 }, { a: 2 });
    expect(result).toEqual([
      { type: "UPDATE", path: ["a"], oldValue: 1, value: 2 },
    ]);
  });

  it("handles nested objects", () => {
    const result = diff(
      { user: { name: "Alice", age: 30 } },
      { user: { name: "Alice", age: 31 } },
    );
    expect(result).toEqual([
      { type: "UPDATE", path: ["user", "age"], oldValue: 30, value: 31 },
    ]);
  });

  it("handles deeply nested changes", () => {
    const result = diff(
      { a: { b: { c: { d: 1 } } } },
      { a: { b: { c: { d: 2 } } } },
    );
    expect(result).toEqual([
      {
        type: "UPDATE",
        path: ["a", "b", "c", "d"],
        oldValue: 1,
        value: 2,
      },
    ]);
  });

  it("handles arrays", () => {
    const result = diff({ items: [1, 2, 3] }, { items: [1, 2, 4] });
    expect(result).toEqual([
      { type: "UPDATE", path: ["items", 2], oldValue: 3, value: 4 },
    ]);
  });

  it("handles array additions", () => {
    const result = diff({ items: [1] }, { items: [1, 2] });
    expect(result).toEqual([{ type: "CREATE", path: ["items", 1], value: 2 }]);
  });

  it("handles array removals", () => {
    const result = diff({ items: [1, 2] }, { items: [1] });
    expect(result).toEqual([
      { type: "DELETE", path: ["items", 1], oldValue: 2 },
    ]);
  });

  it("handles type changes", () => {
    const result = diff({ a: "1" }, { a: 1 });
    expect(result).toEqual([
      { type: "UPDATE", path: ["a"], oldValue: "1", value: 1 },
    ]);
  });

  it("handles null values", () => {
    const result = diff({ a: null }, { a: 1 });
    expect(result).toEqual([
      { type: "UPDATE", path: ["a"], oldValue: null, value: 1 },
    ]);
  });

  it("handles undefined values", () => {
    const result = diff({ a: undefined }, { a: 1 });
    expect(result).toEqual([
      { type: "UPDATE", path: ["a"], oldValue: undefined, value: 1 },
    ]);
  });

  it("handles Date objects", () => {
    const d1 = new Date("2026-01-01");
    const d2 = new Date("2026-06-01");
    const result = diff({ date: d1 }, { date: d2 });
    expect(result).toEqual([
      { type: "UPDATE", path: ["date"], oldValue: d1, value: d2 },
    ]);
  });

  it("treats identical Dates as equal", () => {
    const d1 = new Date("2026-01-01");
    const d2 = new Date("2026-01-01");
    expect(diff({ date: d1 }, { date: d2 })).toEqual([]);
  });

  it("handles RegExp objects", () => {
    const r1 = /abc/gi;
    const r2 = /abc/g;
    const result = diff({ pattern: r1 }, { pattern: r2 });
    expect(result).toEqual([
      { type: "UPDATE", path: ["pattern"], oldValue: r1, value: r2 },
    ]);
  });

  it("treats identical RegExps as equal", () => {
    expect(diff({ r: /abc/g }, { r: /abc/g })).toEqual([]);
  });

  it("handles mixed nested structures", () => {
    const result = diff(
      { users: [{ name: "Alice" }] },
      { users: [{ name: "Bob" }] },
    );
    expect(result).toEqual([
      {
        type: "UPDATE",
        path: ["users", 0, "name"],
        oldValue: "Alice",
        value: "Bob",
      },
    ]);
  });

  it("handles empty objects", () => {
    expect(diff({}, {})).toEqual([]);
  });

  it("handles multiple changes", () => {
    const result = diff({ a: 1, b: 2, c: 3 }, { a: 1, b: 5, d: 4 });
    expect(result).toHaveLength(3);
    expect(result).toContainEqual({
      type: "UPDATE",
      path: ["b"],
      oldValue: 2,
      value: 5,
    });
    expect(result).toContainEqual({
      type: "DELETE",
      path: ["c"],
      oldValue: 3,
    });
    expect(result).toContainEqual({
      type: "CREATE",
      path: ["d"],
      value: 4,
    });
  });

  it("handles NaN", () => {
    expect(diff({ a: NaN }, { a: NaN })).toEqual([]);
  });

  it("handles boolean changes", () => {
    const result = diff({ active: true }, { active: false });
    expect(result).toEqual([
      { type: "UPDATE", path: ["active"], oldValue: true, value: false },
    ]);
  });
});
