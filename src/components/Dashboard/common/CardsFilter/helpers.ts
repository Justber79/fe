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

export const getClearSingleFilter = <T extends object>(filter: T, targetKey: string, parentKey?: string): T => {
  const newFilter: Record<string, string | boolean | object> = {};
  const normalizedTarget = targetKey.toLowerCase().trim();
  const normalizedParent = parentKey?.toLowerCase().trim();

  for (const [key, val] of Object.entries(filter)) {
    const normalizedKey = key.toLowerCase().trim();
    const keyWithoutPrefix = normalizedKey.replace(/^[a-z]{2,5}-/, "");

    const isKeyMatch = normalizedKey === normalizedTarget || keyWithoutPrefix === normalizedTarget;

    const isParentMatch = !normalizedParent || normalizedParent === key.toLowerCase();

    if (isKeyMatch && isParentMatch) {
      if (typeof val === "boolean") newFilter[key] = false;
      else if (typeof val === "string") newFilter[key] = "";
      else if (typeof val === "object" && val !== null) newFilter[key] = getClearFilter(val);
      else newFilter[key] = val;
    } else if (typeof val === "object" && val !== null) {
      const nextParentConstraint = normalizedParent === normalizedKey ? undefined : parentKey;
      newFilter[key] = getClearSingleFilter(val, targetKey, nextParentConstraint);
    } else {
      newFilter[key] = val;
    }
  }

  return newFilter as T;
};

/**
 * Generic helper to create a list of checkbox-like filter items from a record of booleans.
 */
export const generateNestedFilterControlItems = <TFilter>(
  obj: SelectionMap,
  setFilter: SetFilter<TFilter>,
  key: keyof TFilter,
  labelResolver: (input: string, parentKey?: string | number | symbol) => string,
) =>
  Object.keys(obj)
    .sort()
    .map((k) => ({
      label: labelResolver(k, key),
      checked: obj[k],
      keyValue: k,
      parentKey: key as string,
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
    keyValue: key,
    onChange: (checked: boolean) => {
      setFilter((prev) => ({ ...prev, [key]: checked }));
    },
  };
};
