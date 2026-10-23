"use client";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/Layout";
import { CONTACT_EMAIL } from "@/config/constants";
import { Subpage } from "@/types";
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
  TextLink,
} from "../styled";

const STEPS = ["request", "prepare", "match", "introduction", "noMatch", "afterMatch"];
const DASHBOARD_FEATURES = ["volunteers", "hours", "posts", "openSource"];

function ForOrganisations() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <PageLayout background="var(--color-magnolia)">
      <Container>
        <Heading>{t("forOrganisationsPage.heading")}</Heading>

        <ContentSection>
          <NoteText>{t("forOrganisationsPage.intro")}</NoteText>

          <SectionBlock>
            <SectionHeader>{t("forOrganisationsPage.stepsHeading")}</SectionHeader>
            <ItemsList>
              {STEPS.map((step, index) => (
                <Item key={step}>
                  <QuestionRow>
                    <Badge>{index + 1}</Badge>
                    <ItemTitle>{t(`forOrganisationsPage.steps.${step}.title`)}</ItemTitle>
                  </QuestionRow>
                  <AnswerRow>
                    <DashContainer>
                      <Dash />
                    </DashContainer>
                    <ItemBody>{t(`forOrganisationsPage.steps.${step}.body`)}</ItemBody>
                  </AnswerRow>
                </Item>
              ))}
            </ItemsList>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("forOrganisationsPage.dashboard.heading")}</SectionHeader>
            <NoteText>{t("forOrganisationsPage.dashboard.intro")}</NoteText>
            <ItemsList>
              {DASHBOARD_FEATURES.map((feature, index) => (
                <Item key={feature}>
                  <QuestionRow>
                    <Badge>{index + 1}</Badge>
                    <ItemTitle>{t(`forOrganisationsPage.dashboard.features.${feature}.title`)}</ItemTitle>
                  </QuestionRow>
                  <AnswerRow>
                    <DashContainer>
                      <Dash />
                    </DashContainer>
                    <ItemBody>{t(`forOrganisationsPage.dashboard.features.${feature}.body`)}</ItemBody>
                  </AnswerRow>
                </Item>
              ))}
            </ItemsList>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("forOrganisationsPage.goodToKnow.heading")}</SectionHeader>
            <NoteText>{t("forOrganisationsPage.goodToKnow.free")}</NoteText>
            <NoteText>
              {t("forOrganisationsPage.goodToKnow.register")}{" "}
              <TextLink href={`/${lang}/register/agent`}>{t("forOrganisationsPage.goodToKnow.registerLink")}</TextLink>
            </NoteText>
            <NoteText>
              {t("forOrganisationsPage.goodToKnow.guidelines")}{" "}
              <TextLink href={`/${lang}/${Subpage.RAC_GUIDELINES}`}>
                {t("forOrganisationsPage.goodToKnow.guidelinesLink")}
              </TextLink>
            </NoteText>
            <NoteText>
              {t("forOrganisationsPage.goodToKnow.contact")}{" "}
              <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
            </NoteText>
          </SectionBlock>
        </ContentSection>
      </Container>
    </PageLayout>
  );
}

export default ForOrganisations;
