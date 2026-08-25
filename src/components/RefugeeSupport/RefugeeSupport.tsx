import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Heading2 } from "../styled/text";
import { FullWidthContainer, SectionContainer } from "../styled/container";

const IFrame = styled.iframe`
  width: var(--homepage-process-section-video-width);
  height: var(--homepage-process-section-video-height);
  border-radius: var(--homepage-process-section-video-border-radius);
`;

export function RefugeeSupport() {
  const { t } = useTranslation();
  const translationTextJsonPath = "homepage.iframeTitles.howToVolunteer";
  const youtubeVideoUrl = "https://www.youtube.com/embed/tk5akHPd9oo?si=k01Klx7SxIWwKHO_&rel=0&autoplay=0";

  return (
    <FullWidthContainer id="refugee-support-fullWidthContainer" background-color="var(--color-orchid-subtle)">
      <SectionContainer id="refugee-support-container">
        <Heading2>{t(translationTextJsonPath)}</Heading2>
        <IFrame
          title={t(translationTextJsonPath)}
          src={youtubeVideoUrl}
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      </SectionContainer>
    </FullWidthContainer>
  );
}
