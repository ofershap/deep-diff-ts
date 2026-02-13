import type { Difference } from "./types";

function setNestedValue(
  obj: Record<string, unknown>,
  path: (string | number)[],
  value: unknown,
): void {
  let current: unknown = obj;
  for (let i = 0; i < path.length - 1; i++) {
    current = (current as Record<string | number, unknown>)[path[i]];
  }
  (current as Record<string | number, unknown>)[path[path.length - 1]] = value;
}

function deleteNestedValue(
  obj: Record<string, unknown>,
  path: (string | number)[],
): void {
  let current: unknown = obj;
  for (let i = 0; i < path.length - 1; i++) {
    current = (current as Record<string | number, unknown>)[path[i]];
  }
  const lastKey = path[path.length - 1];
  if (Array.isArray(current)) {
    current.splice(lastKey as number, 1);
  } else {
    delete (current as Record<string, unknown>)[lastKey as string];
  }
}

export function applyDiff<T extends Record<string, unknown>>(
  target: T,
  diffs: Difference[],
): T {
  const clone = structuredClone(target);

  for (const d of diffs) {
    switch (d.type) {
      case "CREATE":
      case "UPDATE":
        setNestedValue(clone, d.path, d.value);
        break;
      case "DELETE":
        deleteNestedValue(clone, d.path);
        break;
    }
  }

  return clone;
}
