"use client";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { useParams } from "next/navigation";
import { PageLayout } from "../../Layout";
import { useTranslation } from "react-i18next";
import { LoginController } from "./LoginController";
import {
  Illustration,
  LoginHeading,
  LoginPage,
  LoginSection,
  RegistrationHeading,
  RegistrationLink,
  RegistrationLinks,
  RegistrationSection,
} from "./login-styles";

export function Login() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  return (
    <PageLayout background="var(--color-white)">
      <LoginPage>
        <LoginSection aria-labelledby="login-heading">
          <LoginHeading id="login-heading">{t("dashboard.login.login")}</LoginHeading>
          <LoginController />
        </LoginSection>
        <RegistrationSection aria-labelledby="registration-heading">
          <Illustration>
            <Image
              src="/images/login/community-illustration.webp"
              alt=""
              width={1560}
              height={1553}
              sizes="(max-width: 767px) 0px, (max-width: 1280px) 45vw, 584px"
            />
          </Illustration>
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
        </RegistrationSection>
      </LoginPage>
    </PageLayout>
  );
}
