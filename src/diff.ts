import type { Difference } from "./types";

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

export function diff(
  oldObj: unknown,
  newObj: unknown,
  basePath: (string | number)[] = [],
): Difference[] {
  if (Object.is(oldObj, newObj)) return [];

  if (isDate(oldObj) && isDate(newObj)) {
    return oldObj.getTime() === newObj.getTime()
      ? []
      : [{ type: "UPDATE", path: basePath, oldValue: oldObj, value: newObj }];
  }

  if (isRegExp(oldObj) && isRegExp(newObj)) {
    return oldObj.toString() === newObj.toString()
      ? []
      : [{ type: "UPDATE", path: basePath, oldValue: oldObj, value: newObj }];
  }

  if (Array.isArray(oldObj) && Array.isArray(newObj)) {
    return diffArrays(oldObj, newObj, basePath);
  }

  if (isObject(oldObj) && isObject(newObj)) {
    return diffObjects(oldObj, newObj, basePath);
  }

  if (basePath.length === 0) return [];

  return [{ type: "UPDATE", path: basePath, oldValue: oldObj, value: newObj }];
}

function diffObjects(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>,
  basePath: (string | number)[],
): Difference[] {
  const result: Difference[] = [];
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  for (const key of allKeys) {
    const path = [...basePath, key];
    const inOld = key in oldObj;
    const inNew = key in newObj;

    if (inOld && !inNew) {
      result.push({ type: "DELETE", path, oldValue: oldObj[key] });
    } else if (!inOld && inNew) {
      result.push({ type: "CREATE", path, value: newObj[key] });
    } else {
      result.push(...diff(oldObj[key], newObj[key], path));
    }
  }

  return result;
}

function diffArrays(
  oldArr: unknown[],
  newArr: unknown[],
  basePath: (string | number)[],
): Difference[] {
  const result: Difference[] = [];
  const maxLen = Math.max(oldArr.length, newArr.length);

  for (let i = 0; i < maxLen; i++) {
    const path = [...basePath, i];

    if (i >= oldArr.length) {
      result.push({ type: "CREATE", path, value: newArr[i] });
    } else if (i >= newArr.length) {
      result.push({ type: "DELETE", path, oldValue: oldArr[i] });
    } else {
      result.push(...diff(oldArr[i], newArr[i], path));
    }
  }

  return result;
}
