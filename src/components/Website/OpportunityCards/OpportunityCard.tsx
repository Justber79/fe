"use client";
import { CalendarDotsIcon, MapPinIcon, TranslateIcon } from "@phosphor-icons/react";
import { Lang, OpportunityLegacyType } from "need4deed-sdk";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Activities } from "@/components/core/common";
import { BaseCard, IconDiv } from "@/components/styled/container";
import { hyphenationStyles } from "@/components/styled/mixins";
import { Heading3, Paragraph } from "@/components/styled/text";
import { iconNameMap } from "@/components/VolunteeringCategories/icon";
import { IconName } from "@/components/VolunteeringCategories/types";
import { formatAccompanyingDate } from "./helpers";
import { Opportunity } from "./types";

interface CardDetail {
  icon: ReactNode;
  headerText: string;
  body: ReactNode;
}

interface Props {
  opportunity: Opportunity;
  iconName: IconName;
  width?: string;
  height?: string;
  backgroundColor?: string;
  /** Show the full description (used in the popup). */
  vo?: boolean;
  onClick?: () => void;
  enableHoverEffect?: boolean;
  children?: ReactNode;
}

export default function OpportunityCard({
  opportunity,
  iconName,
  width,
  height,
  backgroundColor,
  vo = false,
  onClick,
  enableHoverEffect,
  children,
}: Props) {
  const { t, i18n } = useTranslation();
  const language = i18n.language as Lang;
  const {
    title,
    languages,
    schedule,
    locations,
    activities,
    accompanyingDate,
    voInformation,
    opportunityType,
    accompanyingTranslation,
    defaultMainCommunication,
  } = opportunity;

  const isAccompanying = opportunityType === OpportunityLegacyType.ACCOMPANYING;

  const languagesBody = (
    <DetailGroup>
      <DetailGroup>
        <Paragraph fontWeight={400}>
          {isAccompanying
            ? t("homepage.volunteeringOpportunities.translationTo")
            : t("homepage.volunteeringOpportunities.mainCommunication")}
          :
        </Paragraph>
        <Paragraph>{isAccompanying ? accompanyingTranslation : defaultMainCommunication}</Paragraph>
      </DetailGroup>
      <DetailGroup>
        <Paragraph fontWeight={400}>{t("homepage.volunteeringOpportunities.residentsSpeak")}:</Paragraph>
        <Paragraph>{languages.join(", ")}</Paragraph>
      </DetailGroup>
    </DetailGroup>
  );

  const cardDetails: CardDetail[] = [
    {
      icon: <TranslateIcon size={20} color="var(--icon-color)" />,
      headerText: t("homepage.volunteeringOpportunities.languages"),
      body: languagesBody,
    },
    {
      icon: <CalendarDotsIcon size={20} color="var(--icon-color)" />,
      headerText: accompanyingDate
        ? t("homepage.volunteeringOpportunities.dateOfAppointment")
        : t("homepage.volunteeringOpportunities.schedule"),
      body: (
        <Paragraph>{(accompanyingDate && formatAccompanyingDate(accompanyingDate, language)) || schedule}</Paragraph>
      ),
    },
    {
      icon: <MapPinIcon size={20} weight="fill" color="var(--icon-color)" />,
      headerText: t("homepage.volunteeringOpportunities.district"),
      body: <Paragraph>{locations.join(", ")}</Paragraph>,
    },
  ];

  return (
    <Card
      $width={width}
      $height={height}
      $backgroundColor={backgroundColor}
      $enableHoverEffect={enableHoverEffect}
      onClick={onClick}
    >
      <IconDiv>{iconNameMap[iconName]}</IconDiv>
      <HyphenatedHeading3 lang={language}>{title}</HyphenatedHeading3>
      {vo && voInformation && <Paragraph>{voInformation}</Paragraph>}
      <Activities activities={activities} />
      <DetailsContainer>
        {cardDetails.map(({ icon, headerText, body }) => (
          <DetailSection key={headerText}>
            <DetailHeader>
              {icon}
              <Paragraph fontWeight={550}>{headerText}:</Paragraph>
            </DetailHeader>
            {body}
          </DetailSection>
        ))}
      </DetailsContainer>
      {children}
    </Card>
  );
}

/* Styles */

interface CardProps {
  $width?: string;
  $height?: string;
  $backgroundColor?: string;
  $enableHoverEffect?: boolean;
}

const Card = styled(BaseCard)<CardProps>`
  background-color: ${({ $backgroundColor }) => $backgroundColor || "var(--color-magnolia)"};
  width: ${({ $width }) => $width || "var(--homepage-volunteering-opportunity-card-width)"};
  height: ${({ $height }) => $height || "auto"};
  padding: var(--homepage-volunteering-opportunity-card-padding-top)
    var(--homepage-volunteering-opportunity-card-padding-right)
    var(--homepage-volunteering-opportunity-card-padding-bottom)
    var(--homepage-volunteering-opportunity-card-padding-left);
  gap: var(--homepage-volunteering-opportunity-card-gap);
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;

  ${({ $enableHoverEffect }) =>
    $enableHoverEffect &&
    `
    cursor: pointer;
    &:hover {
      background-color: var(--color-orchid-subtle);
    }
  `}
`;

const HyphenatedHeading3 = styled(Heading3)`
  ${hyphenationStyles}
`;

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-volunteering-opportunity-details-languages-gap);
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-volunteering-opportunity-details-gap);
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
