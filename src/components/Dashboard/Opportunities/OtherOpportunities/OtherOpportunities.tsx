"use client";

import { Search } from "@/components/core/common";
import { TableCell, TableRow } from "@/components/core/common/Table";
import { DashboardLayout } from "@/components/Layout";
import { Paragraph } from "@/components/styled/text";
import { apiPathOpportunity, apiPathOption, TABLE_LIMIT } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiOpportunityOtherGetList, ApiOptionLists } from "need4deed-sdk";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { HyphenatedHeading2 } from "../../common/CardsHeader/styles";
import { DashboardListLoading } from "../../common/DashboardListLoading";
import { EntityTableList } from "../../common/EntityTableList/EntityTableList";
import { formatDate } from "../../Profile/sections/shared/utils/formatDate";
import { getDistrictTitle } from "../helpers";

export function OtherOpportunities() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: options } = useGetQuery<ApiOptionLists>({ queryKey: ["options"], apiPath: apiPathOption });
  const {
    data = [],
    count = 0,
    isLoading,
  } = useGetQuery<ApiOpportunityOtherGetList[]>({
    queryKey: ["opportunities-other", search, String(currentPage), i18n.language],
    apiPath: `${apiPathOpportunity}/other`,
    params: { page: currentPage, limit: TABLE_LIMIT, search: search || undefined },
  });

  const columns = [
    { key: "title", label: t("dashboard.opportunities.other.columns.title") },
    { key: "district", label: t("dashboard.opportunities.other.columns.district"), width: "200px" },
    { key: "createdAt", label: t("dashboard.opportunities.other.columns.createdAt"), width: "160px" },
  ];

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <Container>
        <HyphenatedHeading2>{t("dashboard.opportunities.other.title")}</HyphenatedHeading2>
        <Paragraph>{t("dashboard.opportunities.other.description")}</Paragraph>
        <Search
          placeHolder={`${t("dashboard.opportunities.card.search")}...`}
          onInputChange={handleSearch}
          value={search}
          width="var(--filters-search-bar-width)"
          backgroundColor="var(--color-magnolia-light)"
        />
        {isLoading ? (
          <DashboardListLoading />
        ) : data.length === 0 ? (
          <Paragraph color="var(--color-grey-500)">{t("dashboard.opportunities.other.empty")}</Paragraph>
        ) : (
          <EntityTableList
            columns={columns}
            data={data}
            count={count}
            itemsPerPage={TABLE_LIMIT}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            testIdPrefix="other-opportunities"
            renderRow={(opportunity, isLast) => (
              <TableRow key={opportunity.id} $isLast={isLast}>
                <TableCell>{opportunity.title}</TableCell>
                <TableCell $width="200px">
                  {(opportunity.district && getDistrictTitle(opportunity.district, options?.district ?? undefined)) ||
                    "—"}
                </TableCell>
                <TableCell $width="160px">{formatDate(opportunity.createdAt)}</TableCell>
              </TableRow>
            )}
          />
        )}
      </Container>
    </DashboardLayout>
  );
}

export default OtherOpportunities;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-24);
`;
