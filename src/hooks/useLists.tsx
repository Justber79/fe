import { useQuery } from "@tanstack/react-query";
import { HttpMethod, Option } from "need4deed-sdk";
import { useEffect, useState } from "react";
import { fetchFn } from "@/utils";
import { apiPathVolunteer } from "@/config/constants";
import { fallbackLists } from "@/components/forms/fallbackLists";
import { ListsOfOptions, ListsOfOptionsType } from "@/components/forms/types";

const FF_USE_OPTIONS_LISTS = false;

export function useListQuery() {
  const { data: listData } = useQuery<ListsOfOptionsType>({
    queryKey: ["lists"],
    queryFn: () => {
      if (FF_USE_OPTIONS_LISTS) {
        return fetchFn<{ lists: ListsOfOptionsType }, ListsOfOptionsType>({
          url: apiPathVolunteer,
          options: { method: HttpMethod.OPTIONS },
          fnDTO: ({ lists }) => lists,
        });
      }
      return Promise.resolve(fallbackLists);
    },
    staleTime: Infinity,
  });

  return listData;
}

export default function useList(listType: ListsOfOptions) {
  const [list, setList] = useState<Option[]>([]);
  const listsOptions = useListQuery();

  useEffect(() => {
    const listTmp = listsOptions?.[listType] ?? [];
    setList(listTmp.length ? listTmp : fallbackLists[listType]);
  }, [listType, listsOptions]);

  return list;
}
