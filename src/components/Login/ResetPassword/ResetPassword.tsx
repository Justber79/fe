"use client";
import styled from "styled-components";
import { PageLayout } from "../../Layout";
import { CustomHeading } from "../../styled/text";
import { ImageWithGradient } from "../../core/image";
import { getImageUrl } from "@/utils/helpers";
import { useScreenType } from "@/context/DeviceContext";
import { ScreenTypes } from "@/config/constants";
import { ResetPasswordController } from "./ResetPasswordController";

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

export function ResetPassword() {
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
              Reset Password
            </CustomHeading>
            <ResetPasswordController />
          </LoginContentContainer>
        </LoginSubContainer>

        <LoginSubContainer>
          <ImageWithGradient imageUrl={imageUrl} gradientClass={gradientClassName} />
        </LoginSubContainer>
      </LoginContainer>
    </PageLayout>
  );
}
