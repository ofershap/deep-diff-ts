# deep-diff-ts

[![npm version](https://img.shields.io/npm/v/deep-diff-ts)](https://www.npmjs.com/package/deep-diff-ts)
[![npm downloads](https://img.shields.io/npm/dm/deep-diff-ts)](https://www.npmjs.com/package/deep-diff-ts)
[![license](https://img.shields.io/npm/l/deep-diff-ts)](https://github.com/ofershap/deep-diff-ts/blob/main/LICENSE)
[![CI](https://github.com/ofershap/deep-diff-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/deep-diff-ts/actions/workflows/ci.yml)

Fast deep object diff with full TypeScript types. Zero dependencies. ~1.4KB.

![Demo](assets/demo.gif)

## Install

```bash
npm install deep-diff-ts
```

## Usage

```typescript
import { diff } from "deep-diff-ts";

const oldObj = {
  name: "Alice",
  age: 30,
  tags: ["admin"],
  config: { theme: "dark" },
};

const newObj = {
  name: "Alice",
  age: 31,
  tags: ["admin", "editor"],
  config: { theme: "light" },
};

const changes = diff(oldObj, newObj);
// [
//   { type: "UPDATE", path: ["age"], oldValue: 30, value: 31 },
//   { type: "CREATE", path: ["tags", 1], value: "editor" },
//   { type: "UPDATE", path: ["config", "theme"], oldValue: "dark", value: "light" }
// ]
```

### Apply Diffs

```typescript
import { diff, applyDiff } from "deep-diff-ts";

const changes = diff(oldObj, newObj);
const result = applyDiff(oldObj, changes);
// result deeply equals newObj
// oldObj is not mutated
```

## Diff Types

Each difference has a `type` and `path`:

| Type     | Fields                      | Description            |
| -------- | --------------------------- | ---------------------- |
| `CREATE` | `path`, `value`             | Property was added     |
| `UPDATE` | `path`, `oldValue`, `value` | Property value changed |
| `DELETE` | `path`, `oldValue`          | Property was removed   |

`path` is an array of keys/indices: `["users", 0, "name"]`

## Supported Types

- Objects (deep recursive)
- Arrays (element-by-element)
- Dates (compared by time value)
- RegExps (compared by string representation)
- Primitives (string, number, boolean, null, undefined)
- NaN (correctly handled via `Object.is`)

## API

### `diff(oldObj, newObj)`

Returns `Difference[]` describing all changes from `oldObj` to `newObj`.

### `applyDiff(target, diffs)`

Returns a new object with all diffs applied. Does not mutate the original.

## Other Projects

- [ts-result](https://github.com/ofershap/ts-result) — Rust-style Result<T, E> for TypeScript
- [ts-nano-event](https://github.com/ofershap/ts-nano-event) — Typed event emitter in <200 bytes
- [hover-effects](https://github.com/ofershap/hover-effects) — Canvas-based hover effects for images

## Author

**Ofer Shapira**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github&logoColor=white)](https://github.com/ofershap)

## License

MIT
