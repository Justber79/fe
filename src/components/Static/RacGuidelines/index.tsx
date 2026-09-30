"use client";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/Layout";

const Container = styled.div`
  color: var(--color-midnight);
  font-family: Figtree, sans-serif;
  font-size: 20px;
  line-height: 24px;
  margin-inline: auto;
  max-width: 880px;
  padding-block: clamp(48px, 8vw, 100px);
  padding-inline: clamp(24px, 8vw, 120px);
  width: 100%;

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 22px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
    line-height: 21px;
  }
`;

const Heading = styled.h2`
  color: var(--color-midnight);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 600;
  letter-spacing: 0.1px;
  line-height: normal;
  margin: 0 0 48px;

  @media (max-width: 480px) {
    margin: 0 0 32px;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 32px;
  }

  @media (max-width: 480px) {
    gap: 24px;
  }
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

const SectionHeader = styled.p`
  font-weight: 700;
  letter-spacing: 0.1px;
  margin: 0;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const QuestionRow = styled.div`
  align-items: center;
  display: flex;
  gap: 16px;
`;

const Badge = styled.span`
  align-items: center;
  background-color: var(--color-orchid);
  border-radius: 16.571px;
  display: flex;
  flex-shrink: 0;
  font-size: 15.75px;
  font-weight: 600;
  height: 28px;
  justify-content: center;
  width: 28px;
`;

const ItemTitle = styled.span`
  font-weight: 400;
  letter-spacing: 0.1px;
`;

const AnswerRow = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 16px;
  padding-left: 44px;

  @media (max-width: 480px) {
    padding-left: 32px;
  }
`;

const DashContainer = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
`;

const Dash = styled.span`
  background-color: #f2b1ff;
  display: block;
  height: 1.5px;
  width: 16px;
`;

const ItemBody = styled.span`
  flex: 1;
  letter-spacing: 0.1px;
`;

const BulletList = styled.ul`
  flex: 1;
  letter-spacing: 0.1px;
  margin: 0;
  padding-left: 20px;

  li + li {
    margin-top: 4px;
  }
`;

const NoteText = styled.p`
  letter-spacing: 0.1px;
  margin: 0;
`;

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
