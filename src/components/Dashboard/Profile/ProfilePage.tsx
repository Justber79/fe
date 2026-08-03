import { Heading2 } from "@/components/styled/text";
import { useProfileSections } from "@/hooks/useProfileSections";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SectionCard } from "./common/SectionCard";
import {
  BackButton,
  PageContainer,
  PageContentContainer,
  ProfileNavigatorContainer,
  ProfileNavigatorWrapper,
} from "./styles";
import { ProfileEntityProps, ProfileNavigationDirection } from "./types";
import { useEffect, useState } from "react";

const FADE_DURATION = 300;

const ProfilePage = (props: ProfileEntityProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { sections, heading, header } = useProfileSections(props);
  const [isFading, setIsFading] = useState<boolean>(false);

  const handleNavigate = (direction: ProfileNavigationDirection) => {
    if (!props.handleProfileNavigation) return;
    setIsFading(true);
    setTimeout(() => {
      props.handleProfileNavigation!(direction);
    }, FADE_DURATION);
  };

  useEffect(() => {
    setIsFading(false);
  }, [props.agent?.id]);

  return (
    <PageContainer>
      <BackButton onClick={() => router.back()}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackButton>

      <Heading2>{heading}</Heading2>

      {props.handleProfileNavigation && (
        <ProfileNavigatorWrapper>
          <ProfileNavigatorContainer onClick={() => handleNavigate(ProfileNavigationDirection.LEFT)}>
            <ArrowLeftIcon size={24} />
            {t("dashboard.profile.prevNgoProfile")}
          </ProfileNavigatorContainer>
          <ProfileNavigatorContainer onClick={() => handleNavigate(ProfileNavigationDirection.RIGHT)}>
            {t("dashboard.profile.nextNgoProfile")}
            <ArrowRightIcon size={24} />
          </ProfileNavigatorContainer>
        </ProfileNavigatorWrapper>
      )}

      <PageContentContainer $isFading={isFading} $fadeDuration={FADE_DURATION}>
        {header}

        {sections.map((s) => (
          <SectionCard key={s.title} {...s} />
        ))}
      </PageContentContainer>
    </PageContainer>
  );
};

export default ProfilePage;
