import { IconDiv } from "@/components/styled/container";
import { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";
import { iconNameMap } from "./icon";
import { IconName } from "../types";
import { Heading2 } from "@/components/styled/text";
import { Button } from "@/components/core/button";

export const Card = styled.div`
  background-color: var(--color-white);
  border-radius: var(--volunteer-profile-section-card-border-radius);
  padding: var(--volunteer-profile-section-card-padding);
  gap: var(--volunteer-profile-section-card-gap);
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: var(--volunteer-profile-section-card-header-height);
  gap: var(--spacing-16);

  @media (max-width: 767px) {
    align-items: stretch;
    flex-direction: column;

    > button {
      align-self: flex-start;
      max-width: 100%;
      white-space: normal;
    }
  }
`;

const CardHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--volunteer-profile-section-card-header-info-gap);
  min-width: 0;

  h2 {
    overflow-wrap: anywhere;
  }

  @media (max-width: 360px) {
    gap: var(--spacing-8);

    h2 {
      font-size: 1.75rem;
      line-height: 1.15;
    }
  }
`;

export interface SectionCardProps extends PropsWithChildren {
  iconName: IconName;
  title: string;
  headerButtonName?: string;
  headerButtonDisabled?: boolean;
  onHeaderButtonClick?: () => void;
  subComponent: ReactNode;
}

export const SectionCard = ({
  iconName,
  title,
  headerButtonName,
  headerButtonDisabled,
  onHeaderButtonClick,
  subComponent,
}: SectionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardHeaderInfo>
          <IconDiv size="var(--volunteer-profile-section-card-icon-size)">{iconNameMap[iconName]}</IconDiv>
          <Heading2>{title}</Heading2>
        </CardHeaderInfo>

        {headerButtonName && (
          <Button
            onClick={onHeaderButtonClick || (() => {})}
            text={headerButtonName}
            height="var(--volunteer-profile-section-card-header-button-height)"
            textFontSize="var(--volunteer-profile-section-card-header-button-textFontSize)"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            disabled={headerButtonDisabled}
          />
        )}
      </CardHeader>

      {subComponent}
    </Card>
  );
};
