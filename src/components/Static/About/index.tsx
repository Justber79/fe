"use client";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/Layout";
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
  Photo,
  QuestionRow,
  SectionBlock,
  SectionHeader,
  SubHeading,
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
          <NoteText>{t("aboutus.intro")}</NoteText>

          <SectionBlock>
            <SectionHeader>{t("aboutus.history.heading")}</SectionHeader>
            <NoteText>{t("aboutus.history.paragraph1")}</NoteText>
            <Photo
              src="/images/about/berlin-arrival-support.webp"
              alt={t("aboutus.history.arrivalImageAlt")}
              width={852}
              height={850}
            />
            <NoteText>{t("aboutus.history.paragraph2")}</NoteText>
            <Photo
              src="/images/about/need4deed-football.webp"
              alt={t("aboutus.history.footballImageAlt")}
              width={828}
              height={872}
            />
            <NoteText>{t("aboutus.history.paragraph3")}</NoteText>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("aboutus.whatWeDo.heading")}</SectionHeader>
            <NoteText>{t("aboutus.whatWeDo.paragraph1")}</NoteText>
            <NoteText>{t("aboutus.whatWeDo.paragraph2")}</NoteText>
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
            <SectionHeader>{t("aboutus.funding.heading")}</SectionHeader>
            <NoteText>{t("aboutus.funding.bevos")}</NoteText>
            <NoteText>{t("aboutus.funding.need4deed")}</NoteText>
          </SectionBlock>

          <SubHeading>{t("aboutus.forOrganisations")}</SubHeading>

          <SectionBlock>
            <SectionHeader>{t("aboutus.offline.heading")}</SectionHeader>
            <NoteText>{t("aboutus.whatWeDo.paragraph3")}</NoteText>
            <NoteText>{t("aboutus.offline.paragraph")}</NoteText>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("aboutus.dashboard.heading")}</SectionHeader>
            <NoteText>{t("aboutus.aboutusPlatform")}</NoteText>
            <NoteText>{t("aboutus.dashboard.openSource")}</NoteText>
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
        </ContentSection>
      </Container>
    </PageLayout>
  );
}

export default AboutUs;
