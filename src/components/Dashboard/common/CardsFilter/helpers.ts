import { ApiOptionLists } from "need4deed-sdk";
import { SelectionMap, SetFilter } from "./types";

export const getClearFilter = <T extends object>(filter: T): T => {
  const newFilter: Record<string, string | boolean | object> = {};

  for (const [key, val] of Object.entries(filter)) {
    if (typeof val === "boolean") newFilter[key] = false;
    else if (typeof val === "string") newFilter[key] = "";
    else if (typeof val === "object") newFilter[key] = getClearFilter(val);
    else throw new Error("Unsupported type to clear the filter");
  }

  return newFilter as T;
};

/**
 * Generic helper to create a list of checkbox-like filter items from a record of booleans.
 */
export const generateNestedFilterControlItems = <TFilter>(
  obj: SelectionMap,
  setFilter: SetFilter<TFilter>,
  key: keyof SelectionMap,
  labelResolver: (input: string) => string,
) =>
  Object.keys(obj)
    .sort()
    .map((k) => ({
      label: labelResolver(k),
      checked: obj[k],
      onChange: (checked: boolean) => {
        const updated = { ...obj, [k]: checked };
        setFilter((prev) => ({ ...prev, [key]: updated }));
      },
    }));

/**
 * Generic helper to create a list of checkbox-like filter items from a record of boolean.
 */
export const createFilterFromOption = (option: ApiOptionLists, field: keyof ApiOptionLists) =>
  option[field] ? option[field].reduce((acc, curr) => ({ ...acc, [curr.title]: false }), {}) : {};

export const generateFilterControlItem = <TFilter>(
  obj: TFilter,
  setFilter: SetFilter<TFilter>,
  key: keyof TFilter,
  labelResolver: (input: string) => string,
) => {
  return {
    label: labelResolver(key as string),
    checked: obj[key],
    onChange: (checked: boolean) => {
      setFilter((prev) => ({ ...prev, [key]: checked }));
    },
  };
};
