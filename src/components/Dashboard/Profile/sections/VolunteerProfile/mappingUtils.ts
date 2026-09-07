import { ApiLanguageOption } from "./hooks";

export type Mapping = {
  idToTitle: Record<number, string>;
  titleToId: Record<string, number>;
  titleToIdLower: Record<string, number>;
};

export function createMapping(items: ApiLanguageOption[]): Mapping {
  const idToTitle: Record<number, string> = {};
  const titleToId: Record<string, number> = {};
  const titleToIdLower: Record<string, number> = {};

  items?.forEach((item) => {
    idToTitle[item.id] = item.title;
    titleToId[item.title] = item.id;
    titleToIdLower[item.title.toLowerCase()] = item.id;
  });

  return { idToTitle, titleToId, titleToIdLower };
}
