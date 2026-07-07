"use client";
import styled from "styled-components";
import { ScreenTypes } from "@/config/constants";
import { ReactNode } from "react";
import { getImageUrl } from "@/utils";
import { useScreenType } from "@/context/DeviceContext";
import { PageLayout } from "../PageLayout";
import { CustomHeading } from "@/components/styled/text";
import { ImageWithGradient } from "@/components/core/image";

const gradientClassName = "image-filter-gradient-blue ";

const imageNames: Record<ScreenTypes, string> = {
  mobile: "login-hands.webp",
  tablet: "login-hands.webp",
  desktop: "login-hands.webp",
};

const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: var(--dashboard-login-container-height);
`;

const LoginSubContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const LoginContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: var(--dashboard-login-content-container-width);
  gap: var(--dashboard-login-content-container-gap);
`;

type Props = {
  children: ReactNode;
  heading: string;
};

export function LoginLayout({ children, heading }: Props) {
  const screenType = useScreenType();
  const imageUrl = getImageUrl(imageNames[screenType]);
  return (
    <PageLayout background="var(--color-white)">
      <LoginContainer>
        <LoginSubContainer>
          <LoginContentContainer>
            <CustomHeading
              fontWeight="var(--dashboard-login-heading-fontWeight)"
              fontSize="var(--dashboard-login-heading-fontSize)"
              lineheight="var(--dashboard-login-heading-lineHeight)"
              letterSpacing="var(--dashboard-login-heading-letterSpacing)"
              color="var(--color-midnight)"
            >
              {heading}
            </CustomHeading>
            {children}
          </LoginContentContainer>
        </LoginSubContainer>

        <LoginSubContainer>
          <ImageWithGradient imageUrl={imageUrl} gradientClass={gradientClassName} />
        </LoginSubContainer>
      </LoginContainer>
    </PageLayout>
  );
}
