"use client";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/Layout";

const DIFFERENT_POINTS = ["point1", "point2", "point3", "point4", "point5"];

function AboutUs() {
  const { t } = useTranslation();
  const AboutUsContainer = styled.div`
    font-size: var(--font-size-xs);
    line-height: 2;
    margin: 0;
    margin-inline: auto;
    max-width: min(90vw, 1080px);
    padding: min(2vw, 40px);
    & h2,
    h6 {
      color: var(--color-neutral-200);
    }
  `;

  return (
    <PageLayout background="var(--color-orchid)">
      <AboutUsContainer>
        <h2>{t("aboutus.aboutusHeading")}</h2>
        <p>{t("aboutus.aboutusSubheading")}</p>
        <p>{t("aboutus.aboutusPlatform")}</p>

        <h2>{t("aboutus.whatWeDo.heading")}</h2>
        <p>{t("aboutus.whatWeDo.paragraph1")}</p>
        <p>{t("aboutus.whatWeDo.paragraph2")}</p>
        <p>{t("aboutus.whatWeDo.paragraph3")}</p>

        <h2>{t("aboutus.different.heading")}</h2>
        <p>{t("aboutus.different.intro")}</p>
        <ul>
          {DIFFERENT_POINTS.map((point) => (
            <li key={point}>{t(`aboutus.different.${point}`)}</li>
          ))}
        </ul>
        <p>{t("aboutus.different.outro")}</p>

        <h2>{t("aboutus.values.valuesHeading")}</h2>

        <h6>{t("aboutus.values.equalOpportunityHeading")}</h6>
        <p>{t("aboutus.values.equalOpportunitySubheading")}</p>

        <h6>{t("aboutus.values.responsibilityHeading")}</h6>
        <p>{t("aboutus.values.responsibilitySubheading")}</p>

        <h6>{t("aboutus.values.migranToMigranSupportHeading")}</h6>
        <p>{t("aboutus.values.migranToMigranSupportSubheading")}</p>
        <h6>{t("aboutus.values.activeParticipationHeading")}</h6>
        <p>{t("aboutus.values.activeParticipationSubheading")}</p>

        <h6>{t("aboutus.values.technologyHeading")}</h6>
        <p>{t("aboutus.values.technologySubheading")}</p>

        <h2>{t("aboutus.whoFor.heading")}</h2>
        <p>{t("aboutus.whoFor.paragraph1")}</p>
        <p>{t("aboutus.whoFor.paragraph2")}</p>

        <h2>{t("aboutus.history.heading")}</h2>
        <p>{t("aboutus.history.paragraph1")}</p>
        <p>{t("aboutus.history.paragraph2")}</p>
        <p>{t("aboutus.history.paragraph3")}</p>
      </AboutUsContainer>
    </PageLayout>
  );
}

export default AboutUs;
