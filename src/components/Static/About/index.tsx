"use client";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/Layout";
import FunderLogoEU from "@/components/svg/FunderLogoEU";
import {
  AnswerRow,
  Badge,
  Container,
  ContentSection,
  Dash,
  DashContainer,
  Heading,
  Item,
  ItemBody,
  ItemsList,
  ItemTitle,
  NoteText,
  QuestionRow,
  SectionBlock,
  SectionHeader,
} from "../styled";

const DIFFERENT_POINTS = ["point1", "point2", "point3", "point4", "point5"];
const VALUES = ["equalOpportunity", "responsibility", "migranToMigranSupport", "activeParticipation", "technology"];

function AboutUs() {
  const { t } = useTranslation();

  return (
    <PageLayout background="var(--color-magnolia)">
      <Container>
        <Heading>{t("aboutus.aboutusHeading")}</Heading>

        <ContentSection>
          <SectionBlock>
            <NoteText>{t("aboutus.aboutusSubheading")}</NoteText>
            <NoteText>{t("aboutus.aboutusPlatform")}</NoteText>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("aboutus.whatWeDo.heading")}</SectionHeader>
            <NoteText>{t("aboutus.whatWeDo.paragraph1")}</NoteText>
            <NoteText>{t("aboutus.whatWeDo.paragraph2")}</NoteText>
            <NoteText>{t("aboutus.whatWeDo.paragraph3")}</NoteText>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("aboutus.different.heading")}</SectionHeader>
            <NoteText>{t("aboutus.different.intro")}</NoteText>
            <ItemsList>
              {DIFFERENT_POINTS.map((point, index) => (
                <QuestionRow key={point}>
                  <Badge>{index + 1}</Badge>
                  <ItemTitle>{t(`aboutus.different.${point}`)}</ItemTitle>
                </QuestionRow>
              ))}
            </ItemsList>
            <NoteText>{t("aboutus.different.outro")}</NoteText>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("aboutus.values.valuesHeading")}</SectionHeader>
            <ItemsList>
              {VALUES.map((value, index) => (
                <Item key={value}>
                  <QuestionRow>
                    <Badge>{index + 1}</Badge>
                    <ItemTitle>{t(`aboutus.values.${value}Heading`)}</ItemTitle>
                  </QuestionRow>
                  <AnswerRow>
                    <DashContainer>
                      <Dash />
                    </DashContainer>
                    <ItemBody>{t(`aboutus.values.${value}Subheading`)}</ItemBody>
                  </AnswerRow>
                </Item>
              ))}
            </ItemsList>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("aboutus.whoFor.heading")}</SectionHeader>
            <NoteText>{t("aboutus.whoFor.paragraph1")}</NoteText>
            <NoteText>{t("aboutus.whoFor.paragraph2")}</NoteText>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("aboutus.history.heading")}</SectionHeader>
            <NoteText>{t("aboutus.history.paragraph1")}</NoteText>
            <NoteText>{t("aboutus.history.paragraph2")}</NoteText>
            <NoteText>{t("aboutus.history.paragraph3")}</NoteText>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("aboutus.funding.heading")}</SectionHeader>
            <NoteText>{t("aboutus.funding.bevos")}</NoteText>
            <NoteText>{t("aboutus.funding.need4deed")}</NoteText>
            <FunderLogoEU width="195" height="180" textColor="var(--color-midnight)" />
          </SectionBlock>
        </ContentSection>
      </Container>
    </PageLayout>
  );
}

export default AboutUs;
