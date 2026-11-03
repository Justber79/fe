"use client";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PageLayout } from "../PageLayout";
import {
  Illustration,
  LoginHeading,
  LoginPage,
  LoginSection,
  RegistrationHeading,
  RegistrationLink,
  RegistrationLinks,
  RegistrationSection,
} from "./login-layout-styles";

type Props = {
  children: ReactNode;
  heading: string;
  showRegistration?: boolean;
};

export function LoginLayout({ children, heading, showRegistration = false }: Props) {
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();
  return (
    <PageLayout background="var(--color-white)">
      <LoginPage>
        <LoginSection aria-labelledby="login-heading">
          <LoginHeading id="login-heading" $compact={!showRegistration}>
            {heading}
          </LoginHeading>
          {children}
        </LoginSection>
        <RegistrationSection
          $illustrationOnly={!showRegistration}
          aria-labelledby={showRegistration ? "registration-heading" : undefined}
        >
          <Illustration>
            <Image src="/images/login/community-illustration.webp" alt="" width={600} height={597} />
          </Illustration>
          {showRegistration && (
            <>
              <RegistrationHeading id="registration-heading">{t("dashboard.login.newToNeed4Deed")}</RegistrationHeading>
              <RegistrationLinks>
                <RegistrationLink href={`/${lang}/register/agent`}>
                  {t("dashboard.login.createNgoAccount")}
                  <ArrowRight size={28} aria-hidden="true" />
                </RegistrationLink>
                <RegistrationLink href={`/${lang}/register/volunteer`}>
                  {t("dashboard.login.createVolunteerAccount")}
                  <ArrowRight size={28} aria-hidden="true" />
                </RegistrationLink>
              </RegistrationLinks>
            </>
          )}
        </RegistrationSection>
      </LoginPage>
    </PageLayout>
  );
}
