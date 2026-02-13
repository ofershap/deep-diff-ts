export interface DiffCreate {
  type: "CREATE";
  path: (string | number)[];
  value: unknown;
}

export interface DiffUpdate {
  type: "UPDATE";
  path: (string | number)[];
  oldValue: unknown;
  value: unknown;
}

export interface DiffDelete {
  type: "DELETE";
  path: (string | number)[];
  oldValue: unknown;
}

export type Difference = DiffCreate | DiffUpdate | DiffDelete;
