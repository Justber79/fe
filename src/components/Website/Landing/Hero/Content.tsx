import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import styled from "styled-components";

import { Button } from "../../../core/button";
import { CustomHeading } from "../../../styled/text";

const ContentDiv = styled.div`
  display: flex;
  justify-content: center;
  padding-top: var(--homepage-hero-section-content-div-padding-top);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: var(--homepage-hero-section-content-container-width);
  height: var(--homepage-hero-section-content-container-height);
`;

const HeroTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-hero-section-content-hero-text-container-gap);
`;

const HeroButtonsContainer = styled.div`
  display: flex;
  flex-direction: var(--homepage-hero-section-content-hero-button-container-flex-direction);
  gap: var(--homepage-hero-section-content-hero-button-container-gap);
`;

export default function HeroContent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  return (
    <ContentDiv>
      <ContentContainer>
        <HeroTextContainer>
          <CustomHeading
            color="var(--homepage-hero-section-content-hero-text-color)"
            fontSize="var(--homepage-hero-section-content-hero-text-fontSize)"
            fontWeight="var(--homepage-hero-section-content-hero-text-fontWeight)"
            letterSpacing="var(--homepage-hero-section-content-hero-text-letterSpacing)"
            lineheight="var(--homepage-hero-section-content-hero-text-lineheight)"
          >
            {t("dashboard.heroSection.heroText")}
          </CustomHeading>
          <CustomHeading
            color="var(--homepage-hero-section-content-hero-text-color)"
            fontSize="var(--homepage-hero-section-content-hero-supporting-text-fontSize)"
            fontWeight="var(--homepage-hero-section-content-hero-supporting-text-fontWeight)"
            letterSpacing="var(--homepage-hero-section-content-hero-supporting-text-letterSpacing)"
            lineheight="var(--homepage-hero-section-content-hero-supporting-text-lineheight)"
          >
            {t("dashboard.heroSection.heroSupportingText")}
          </CustomHeading>
        </HeroTextContainer>

        <HeroButtonsContainer>
          <Button
            backgroundcolor="var(--color-orchid-light)"
            textColor="var(--color-midnight)"
            onClick={() => router.push(`/${i18n.language}/register/volunteer`)}
            text={t("dashboard.heroSection.buttonJoinVolunteer")}
          />
          <Button
            onClick={() => router.push(`/${i18n.language}/register/agent`)}
            text={t("dashboard.heroSection.buttonJoinRefugeeCenter")}
          />
        </HeroButtonsContainer>
      </ContentContainer>
    </ContentDiv>
  );
}
