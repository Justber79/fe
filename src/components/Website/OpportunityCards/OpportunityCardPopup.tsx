"use client";
import { Lang } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button } from "@/components/core/button";
import { ATag } from "@/components/styled/tags";
import { Paragraph } from "@/components/styled/text";
import CloseIcon from "@/components/svg/CloseIcon";
import { ScreenTypes } from "@/config/constants";
import { useScreenType } from "@/context/DeviceContext";
import { CategoryTitle, volunteerContactEmail } from "./constants";
import { getIconName, getRegisterCtaUrl } from "./helpers";
import OpportunityCard from "./OpportunityCard";
import { Opportunity } from "./types";

interface Props {
  opportunity: Opportunity;
  close: () => void;
}

export default function OpportunityCardPopup({ opportunity, close }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isMobile = useScreenType() === ScreenTypes.MOBILE;

  return (
    <DimmedBackground>
      <PopupCard>
        <CloseButton type="button" aria-label="Close" onClick={close}>
          <CloseIcon />
        </CloseButton>
        <OpportunityCard
          width="var(--page-opportunity-popup-card-width)"
          height="var(--page-opportunity-popup-card-height)"
          backgroundColor="var(--color-white)"
          iconName={getIconName(opportunity.categoryId as CategoryTitle)}
          opportunity={opportunity}
          vo
        >
          <CTAsContainer $flexDirection={isMobile ? "column" : "row"}>
            <span>
              <Paragraph fontSize="20px" fontWeight={600}>
                {t("opportunityPage.popup.register.title")}
              </Paragraph>
              <Button
                text={t("opportunityPage.popup.register.button")}
                onClick={() => router.push(getRegisterCtaUrl(i18n.language as Lang, opportunity))}
              />
            </span>
            <span>
              <Paragraph fontSize="20px" fontWeight={600}>
                {t("opportunityPage.popup.apply.title")}
              </Paragraph>
              <ATag href={`mailto:${volunteerContactEmail}`}>
                <Button
                  text={t("opportunityPage.popup.apply.button")}
                  textColor="var(--color-midnight)"
                  backgroundcolor="var(--color-orchid)"
                />
              </ATag>
            </span>
          </CTAsContainer>
        </OpportunityCard>
      </PopupCard>
    </DimmedBackground>
  );
}

/* Styles */

const DimmedBackground = styled.div`
  position: fixed;
  inset: 0;
  background-color: var(--color-dimmed-background);
  display: grid;
  place-items: center;
  z-index: 10;
`;

const PopupCard = styled.div`
  position: relative;
  max-height: 100vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--page-opportunity-popup-card-x-margins);
  right: var(--page-opportunity-popup-card-x-margins);
  padding: 0;
  color: #bbb;
  background: unset;
  border: unset;
  border-radius: 50%;
`;

const CTAsContainer = styled.div<{ $flexDirection: "row" | "column" }>`
  display: flex;
  flex-direction: ${({ $flexDirection }) => $flexDirection};
  justify-content: space-between;
  gap: var(--page-opportunity-popup-ctas-gap);
  margin-top: var(--page-opportunity-popup-ctas-margin-top);

  > span {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    text-align: center;
  }
`;
