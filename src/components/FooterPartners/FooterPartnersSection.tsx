import styled from "styled-components";

import { Partners } from "./Partners";
import { Footer } from "./footer/Footer";
import { FullWidthContainer, SectionContainer } from "../styled/container";

const FooterPartnersSectionContainer = styled(SectionContainer)`
  height: var(--homepage-footer-partners-section-container-height);
  padding: var(--homepage-footer-partners-section-container-padding);
  gap: var(--homepage-footer-partners-section-container-gap);

  @media (max-width: 359px) {
    box-sizing: border-box;
    width: 100%;
    height: auto;
    padding: 32px 16px;
    gap: 48px;
  }
`;

export function FooterPartnersSection() {
  return (
    <FullWidthContainer id="FooterPartnersSection-FWContainer" background-color="var(--color-midnight)">
      <FooterPartnersSectionContainer id="footerPartners-section-container">
        <Partners />
        <Footer />
      </FooterPartnersSectionContainer>
    </FullWidthContainer>
  );
}
export default FooterPartnersSection;
