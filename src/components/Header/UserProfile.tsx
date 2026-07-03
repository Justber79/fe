import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Paragraph } from "../styled/text";
import { Menu, ItemText } from "@/components/core/menu";
import { useLogout } from "@/hooks/useLogout";

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dashboard-cards-header-user-profile-container-gap);
`;

const UserIconDiv = styled.div<{ $size?: "m" | "l" }>`
  display: flex;
  height: ${({ $size }) =>
    $size === "l"
      ? "var(--dashboard-cards-header-user-info-icon-size)"
      : "var(--dashboard-cards-header-user-icon-size)"};
  width: ${({ $size }) =>
    $size === "l"
      ? "var(--dashboard-cards-header-user-info-icon-size)"
      : "var(--dashboard-cards-header-user-icon-size)"};
  background-color: var(--color-midnight);
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

const UserInfoBlock = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
  padding: var(--spacing-12) var(--spacing-12);
  border-bottom: 1px solid var(--color-grey-200);
`;

const UserTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const UserInfoBlockTextContainer = styled.div`
  height: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
`;

const UserInfoNameText = styled.div`
  font-size: 20px;
  line-height: var(--line-height-24);
  font-weight: var(--font-weight-semibold);
  color: var(--color-midnight);
`;

const UserInfoEmailText = styled.div`
  font-size: var(--font-size-14);
  color: var(--color-grey-500);
  line-height: var(--line-height-20);
`;

const getInitials = (fullName: string | undefined): string => {
  if (!fullName) return "";
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function UserProfile() {
  const { t } = useTranslation();
  const { mutate: logout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useCurrentUser();
  const initials = getInitials(user?.fullName) || user?.firstName?.[0]?.toUpperCase() || "";

  return (
    <Menu open={isMenuOpen} onOpen={() => setIsMenuOpen(true)} onClose={() => setIsMenuOpen(false)}>
      <Menu.Target>
        <FlexWrapper>
          <UserIconDiv>
            <Paragraph
              color="var(--color-white)"
              fontWeight={400}
              fontSize="14px"
              lineheight="18px"
              letterSpacing="0.2px"
            >
              {initials}
            </Paragraph>
          </UserIconDiv>
          {isMenuOpen ? (
            <CaretUpIcon size={20} color={"var(--color-midnight)"} />
          ) : (
            <CaretDownIcon size={20} color={"var(--color-midnight)"} />
          )}
        </FlexWrapper>
      </Menu.Target>
      <Menu.Dropdown align="right">
        {user && (
          <UserInfoBlock>
            <UserIconDiv $size="l">
              <Paragraph
                color="var(--color-white)"
                fontWeight={400}
                fontSize="14px"
                lineheight="18px"
                letterSpacing="0.2px"
              >
                {initials}
              </Paragraph>
            </UserIconDiv>
            <UserTextColumn>
              <UserInfoBlockTextContainer>
                <UserInfoNameText>{user.fullName}</UserInfoNameText>
              </UserInfoBlockTextContainer>
              <UserInfoBlockTextContainer>
                <UserInfoEmailText>{user.email}</UserInfoEmailText>
              </UserInfoBlockTextContainer>
            </UserTextColumn>
          </UserInfoBlock>
        )}
        <Menu.Item onSelect={logout}>
          <ItemText fw="bold">{t("dashboard.header.button.logout")}</ItemText>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserProfile;
