"use client";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/Layout";
import {
  Container,
  Heading,
  ContentSection,
  SectionBlock,
  SectionHeader,
  ItemsList,
  Item,
  QuestionRow,
  Badge,
  ItemTitle,
  AnswerRow,
  DashContainer,
  Dash,
  ItemBody,
  BulletList,
  NoteText,
} from "../styled";

function RacGuidelines() {
  const { t } = useTranslation();

  return (
    <PageLayout background="var(--color-magnolia)">
      <Container>
        <Heading>{t("racGuidelines.heading")}</Heading>

        <ContentSection>
          <SectionBlock>
            <SectionHeader>{t("racGuidelines.sectionGeneral")}</SectionHeader>
            <ItemsList>
              <Item>
                <QuestionRow>
                  <Badge>1</Badge>
                  <ItemTitle>{t("racGuidelines.requestMatchingTitle")}</ItemTitle>
                </QuestionRow>
                <AnswerRow>
                  <DashContainer>
                    <Dash />
                  </DashContainer>
                  <ItemBody>{t("racGuidelines.requestMatchingBody")}</ItemBody>
                </AnswerRow>
              </Item>

              <Item>
                <QuestionRow>
                  <Badge>2</Badge>
                  <ItemTitle>{t("racGuidelines.volunteerScreeningTitle")}</ItemTitle>
                </QuestionRow>
                <AnswerRow>
                  <DashContainer>
                    <Dash />
                  </DashContainer>
                  <ItemBody>{t("racGuidelines.volunteerScreeningBody")}</ItemBody>
                </AnswerRow>
              </Item>
            </ItemsList>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("racGuidelines.sectionLeisure")}</SectionHeader>
            <ItemsList>
              <Item>
                <QuestionRow>
                  <Badge>3</Badge>
                  <ItemTitle>{t("racGuidelines.contactTitle")}</ItemTitle>
                </QuestionRow>
                <AnswerRow>
                  <DashContainer>
                    <Dash />
                  </DashContainer>
                  <ItemBody>{t("racGuidelines.contactBody")}</ItemBody>
                </AnswerRow>
              </Item>

              <Item>
                <QuestionRow>
                  <Badge>4</Badge>
                  <ItemTitle>{t("racGuidelines.updatingOffersTitle")}</ItemTitle>
                </QuestionRow>
                <AnswerRow>
                  <DashContainer>
                    <Dash />
                  </DashContainer>
                  <ItemBody>{t("racGuidelines.updatingOffersBody")}</ItemBody>
                </AnswerRow>
              </Item>

              <Item>
                <QuestionRow>
                  <Badge>5</Badge>
                  <ItemTitle>{t("racGuidelines.visitsPhotosTitle")}</ItemTitle>
                </QuestionRow>
                <AnswerRow>
                  <DashContainer>
                    <Dash />
                  </DashContainer>
                  <ItemBody>{t("racGuidelines.visitsPhotosBody")}</ItemBody>
                </AnswerRow>
              </Item>
            </ItemsList>
          </SectionBlock>

          <SectionBlock>
            <SectionHeader>{t("racGuidelines.sectionAccompaniment")}</SectionHeader>
            <ItemsList>
              <Item>
                <QuestionRow>
                  <Badge>6</Badge>
                  <ItemTitle>{t("racGuidelines.supportCasesTitle")}</ItemTitle>
                </QuestionRow>
                <AnswerRow>
                  <DashContainer>
                    <Dash />
                  </DashContainer>
                  <BulletList>
                    <li>{t("racGuidelines.bulletDoctorAppt")}</li>
                    <li>{t("racGuidelines.bulletGovtOffice")}</li>
                    <li>{t("racGuidelines.bulletCounsellingBank")}</li>
                    <li>{t("racGuidelines.bulletAccountOpening")}</li>
                    <li>{t("racGuidelines.bulletFlatViewing")}</li>
                    <li>{t("racGuidelines.bulletSchoolDaycare")}</li>
                    <li>{t("racGuidelines.bulletWayfinding")}</li>
                  </BulletList>
                </AnswerRow>
              </Item>

              <NoteText>{t("racGuidelines.interpreterNote")}</NoteText>

              <Item>
                <QuestionRow>
                  <Badge>7</Badge>
                  <ItemTitle>{t("racGuidelines.miscTitle")}</ItemTitle>
                </QuestionRow>
                <AnswerRow>
                  <DashContainer>
                    <Dash />
                  </DashContainer>
                  <ItemBody>{t("racGuidelines.miscBody")}</ItemBody>
                </AnswerRow>
              </Item>
            </ItemsList>
          </SectionBlock>
        </ContentSection>
      </Container>
    </PageLayout>
  );
}

export default RacGuidelines;
