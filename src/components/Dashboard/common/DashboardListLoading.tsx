import { Heading4 } from "@/components/styled/text";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex: 1;
  min-height: var(--dashboard-home-container-min-height, 300px);
  align-items: center;
  justify-content: center;
`;

export function DashboardListLoading() {
  const { t } = useTranslation();
  return (
    <Container>
      <Heading4>{t("dashboard.home.content.loading")}</Heading4>
    </Container>
  );
}
