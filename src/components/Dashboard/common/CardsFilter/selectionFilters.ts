import { TFunction } from "i18next";
import { ApiOptionLists, EntityTableName } from "need4deed-sdk";
import { ReadonlyURLSearchParams } from "next/navigation";
import { ViewMode } from "../types";
import { createFilterFromOption, generateNestedFilterControlItems } from "./helpers";
import { FilterItem, SelectionMap, SetFilter } from "./types";

export type SelectionFilterKey<TFilter> = {
  [K in keyof TFilter]: TFilter[K] extends SelectionMap ? K : never;
}[keyof TFilter] &
  string;

export type FilterVisibilityContext = {
  viewMode: ViewMode;
  isAuthorized: boolean;
  isAgent: boolean;
  isVolunteer: boolean;
};

export type SelectionFilterConfig = {
  header: string;
  label?: (value: string, t: TFunction) => string;
  // Values come from GET /option and are sent to the API as ids.
  option?: EntityTableName;
  toParam?: (value: string) => string;
  fromParam?: (param: string) => string;
  isVisible?: (context: FilterVisibilityContext) => boolean;
  isItemVisible?: (value: string, context: FilterVisibilityContext) => boolean;
};

// Keyed by filter key, which is also the URL param name. Every checkbox-style
// key of TFilter needs an entry, so a new filter can't be half wired.
export type SelectionFilterConfigs<TFilter> = Record<SelectionFilterKey<TFilter>, SelectionFilterConfig>;

type SerializeOptions = {
  serializeToIDs?: boolean;
  apiFilterOptions?: ApiOptionLists;
};

export type SelectionFilterSection = {
  key: string;
  config: SelectionFilterConfig;
  items: FilterItem[];
};

const configEntries = <TFilter>(configs: SelectionFilterConfigs<TFilter>) =>
  Object.entries(configs) as [SelectionFilterKey<TFilter>, SelectionFilterConfig][];

export const createSelectionFilterSections = <TFilter>(
  configs: SelectionFilterConfigs<TFilter>,
  filter: TFilter,
  setFilter: SetFilter<TFilter>,
  t: TFunction,
): SelectionFilterSection[] =>
  configEntries(configs).map(([key, config]) => ({
    key,
    config,
    items: generateNestedFilterControlItems(filter[key] as SelectionMap, setFilter, key, (value) =>
      config.label ? config.label(value, t) : value,
    ),
  }));

export const getVisibleSelectionFilterSections = (
  sections: SelectionFilterSection[],
  context: FilterVisibilityContext,
): SelectionFilterSection[] =>
  sections
    .filter(({ config }) => config.isVisible?.(context) ?? true)
    .map((section) => ({
      ...section,
      items: section.config.isItemVisible
        ? section.items.filter(({ keyValue }) => section.config.isItemVisible!(keyValue, context))
        : section.items,
    }));

export const getSelectedSelectionFilterItems = (sections: SelectionFilterSection[]): FilterItem[] =>
  sections.flatMap(({ items }) => items).filter((item) => item.checked);

export const withOptionFilters = <TFilter>(
  configs: SelectionFilterConfigs<TFilter>,
  filter: TFilter,
  apiFilterOptions: ApiOptionLists,
): TFilter => {
  const optionFilters = configEntries(configs)
    .filter(([, config]) => config.option)
    .map(([key, config]) => [key, createFilterFromOption(apiFilterOptions, config.option!)]);
  return { ...filter, ...Object.fromEntries(optionFilters) };
};

export const serializeSelectionFilters = <TFilter>(
  configs: SelectionFilterConfigs<TFilter>,
  filter: TFilter,
  params: URLSearchParams,
  options?: SerializeOptions,
) => {
  configEntries(configs).forEach(([key, config]) => {
    params.delete(key);
    Object.entries(filter[key] as SelectionMap).forEach(([value, checked]) => {
      if (!checked) return;
      const id =
        options?.serializeToIDs && config.option
          ? options.apiFilterOptions?.[config.option]?.find((option) => option.title === value)?.id
          : undefined;
      params.append(key, id !== undefined ? String(id) : (config.toParam?.(value) ?? value));
    });
  });
};

// Mutates `filter`, which should already be a copy. Unknown values are ignored.
export const deserializeSelectionFilters = <TFilter>(
  configs: SelectionFilterConfigs<TFilter>,
  filter: TFilter,
  searchParams: ReadonlyURLSearchParams,
) => {
  configEntries(configs).forEach(([key, config]) => {
    const selection = filter[key] as SelectionMap;
    searchParams.getAll(key).forEach((param) => {
      const value = config.fromParam?.(param) ?? param;
      if (selection[value] !== undefined) selection[value] = true;
    });
  });
};

export const getSectionItems = (sections: SelectionFilterSection[], key: string): FilterItem[] =>
  sections.find((section) => section.key === key)?.items ?? [];
