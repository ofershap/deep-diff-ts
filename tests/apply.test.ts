import { describe, it, expect } from "vitest";
import { diff } from "../src/diff";
import { applyDiff } from "../src/apply";

describe("applyDiff", () => {
  it("applies CREATE diff", () => {
    const original = { a: 1 };
    const diffs = diff(original, { a: 1, b: 2 });
    const result = applyDiff(original, diffs);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("applies UPDATE diff", () => {
    const original = { a: 1 };
    const diffs = diff(original, { a: 2 });
    const result = applyDiff(original, diffs);
    expect(result).toEqual({ a: 2 });
  });

  it("applies DELETE diff", () => {
    const original = { a: 1, b: 2 } as Record<string, unknown>;
    const diffs = diff(original, { a: 1 });
    const result = applyDiff(original, diffs);
    expect(result).toEqual({ a: 1 });
  });

  it("applies nested diffs", () => {
    const original = { user: { name: "Alice", age: 30 } };
    const target = { user: { name: "Alice", age: 31 } };
    const diffs = diff(original, target);
    const result = applyDiff(original, diffs);
    expect(result).toEqual(target);
  });

  it("does not mutate the original", () => {
    const original = { a: 1 };
    const diffs = diff(original, { a: 2 });
    applyDiff(original, diffs);
    expect(original.a).toBe(1);
  });

  it("roundtrips complex changes", () => {
    const original = {
      name: "Project",
      tags: ["a", "b"],
      config: { debug: true, level: 3 },
    };
    const target = {
      name: "Project v2",
      tags: ["a", "c"],
      config: { debug: false, level: 3, verbose: true },
    };
    const diffs = diff(original, target);
    const result = applyDiff(original as Record<string, unknown>, diffs);
    expect(result).toEqual(target);
  });
});
