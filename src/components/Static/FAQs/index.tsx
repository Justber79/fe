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
  QuestionRow,
  SectionBlock,
  SectionHeader,
  TextLink,
} from "../styled";

type FaqItem = { key: string; link?: string };

const MAILTO = `mailto:${CONTACT_EMAIL}`;

const SECTIONS: { key: string; items: FaqItem[] }[] = [
  {
    key: "volunteers",
    items: [
      { key: "register", link: "register/volunteer" },
      { key: "afterRegistration" },
      { key: "documents" },
      { key: "accompaniment" },
      { key: "suggestions" },
      { key: "time" },
      { key: "skills" },
      { key: "age" },
      { key: "changes" },
      { key: "login", link: "forgotten-password" },
      { key: "events", link: "event-page" },
      { key: "groups", link: MAILTO },
    ],
  },
  {
    key: "organisations",
    items: [
      { key: "register", link: "register/agent" },
      { key: "request" },
      { key: "afterRequest" },
      { key: "noMatch" },
      { key: "ownVolunteers" },
      { key: "dashboard" },
      { key: "costs" },
      { key: "more", link: Subpage.FOR_ORGANISATIONS },
    ],
  },
];

function FAQs() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <PageLayout background="var(--color-magnolia)">
      <Container>
        <Heading>{t("faqs.title")}</Heading>

        <ContentSection>
          {SECTIONS.map((section) => (
            <SectionBlock key={section.key}>
              <SectionHeader>{t(`faqs.${section.key}.heading`)}</SectionHeader>
              <ItemsList>
                {section.items.map((item, index) => {
                  const prefix = `faqs.${section.key}.${item.key}`;
                  return (
                    <Item key={item.key}>
                      <QuestionRow>
                        <Badge>{index + 1}</Badge>
                        <ItemTitle>{t(`${prefix}.question`)}</ItemTitle>
                      </QuestionRow>
                      <AnswerRow>
                        <DashContainer>
                          <Dash />
                        </DashContainer>
                        <ItemBody>
                          {t(`${prefix}.answer`)}
                          {item.link && (
                            <>
                              {" "}
                              <TextLink href={item.link === MAILTO ? MAILTO : `/${lang}/${item.link}`}>
                                {item.link === MAILTO ? CONTACT_EMAIL : t(`${prefix}.link`)}
                              </TextLink>
                            </>
                          )}
                        </ItemBody>
                      </AnswerRow>
                    </Item>
                  );
                })}
              </ItemsList>
            </SectionBlock>
          ))}
        </ContentSection>
      </Container>
    </PageLayout>
  );
}

export default FAQs;
