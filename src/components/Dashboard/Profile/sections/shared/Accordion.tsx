"use client";

import { Heading4, Paragraph } from "@/components/styled/text";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  AccordionContainer,
  HeaderButtonsContainer,
  HeaderContainer,
  HeaderInfoAvatarNameContainer,
  HeaderInfoContainer,
} from "./accordionStyles";

type AccordionProps = {
  headerLeft: ReactNode;
  subtitle: string;
  onGoToProfile: () => void;
  children?: ReactNode;
  "data-testid"?: string;
};

export const Accordion = ({ headerLeft, subtitle, onGoToProfile, children, "data-testid": testId }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const CaretIcon = isOpen ? CaretUpIcon : CaretDownIcon;

  return (
    <AccordionContainer data-testid={testId}>
      <HeaderContainer>
        <HeaderInfoContainer>
          <HeaderInfoAvatarNameContainer>{headerLeft}</HeaderInfoAvatarNameContainer>
          <Paragraph>{subtitle}</Paragraph>
        </HeaderInfoContainer>

        <HeaderButtonsContainer>
          <Heading4
            margin={0}
            color="var(--color-midnight-light)"
            onClick={onGoToProfile}
            style={{ cursor: "pointer" }}
          >
            {t("dashboard.opportunities.goToProfile")}
          </Heading4>
          {children && (
            <CaretIcon
              size={24}
              onClick={() => setIsOpen((prev) => !prev)}
              cursor="pointer"
              color="var(--color-midnight)"
            />
          )}
        </HeaderButtonsContainer>
      </HeaderContainer>

      {isOpen && children}
    </AccordionContainer>
  );
};
