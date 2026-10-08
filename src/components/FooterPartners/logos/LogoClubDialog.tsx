import styled from "styled-components";
import { Paragraph } from "../../styled/text";
import FunderLogoClubDialog from "../../svg/FunderLogoClubDialog";
import { ScreenTypes } from "@/config/constants";
import { useEffect, useState } from "react";
import { useScreenType } from "@/context/DeviceContext";

const logoSizeMap = {
  [ScreenTypes.DESKTOP]: { width: "316", height: "58" },
  [ScreenTypes.TABLET]: { width: "316", height: "58" },
  [ScreenTypes.MOBILE]: { width: "200", height: "36" },
};

const ClubDialogDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--homepage-footer-partners-section-partners-club-dialog-div-gap);
`;

export function LogoClubDialog() {
  const screenType = useScreenType();
  const [logoWidth, setLogoWidth] = useState(logoSizeMap[screenType].width);
  const [logoHeight, setLogoHeight] = useState(logoSizeMap[screenType].height);

  useEffect(() => {
    const computedHeight = getComputedStyle(document.documentElement).getPropertyValue(
      "--homepage-footer-partners-section-logo-club-dialog-height",
    );

    const computedWidth = getComputedStyle(document.documentElement).getPropertyValue(
      "--homepage-footer-partners-section-logo-club-dialog-width",
    );

    setLogoWidth(computedWidth);
    setLogoHeight(computedHeight);
  }, [screenType]);

  return (
    <ClubDialogDiv>
      <Paragraph color="var(--color-orchid-light)" fontWeight={500}>
        Träger:
      </Paragraph>
      <FunderLogoClubDialog width={logoWidth} height={logoHeight} />
    </ClubDialogDiv>
  );
}

export default LogoClubDialog;
