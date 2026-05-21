import { Heading2 } from "@/components/styled/text";
import { useProfileSections } from "@/hooks/useProfileSections";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SectionCard } from "./common/SectionCard";
import { BackButton, PageContainer } from "./styles";
import { ProfileEntityProps } from "./types";

const ProfilePage = (props: ProfileEntityProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { sections, heading, header } = useProfileSections(props);

  return (
    <PageContainer>
      <BackButton onClick={() => router.back()}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackButton>

      <Heading2>{heading}</Heading2>

      {header}

      {sections.map((s) => (
        <SectionCard key={s.title} {...s} />
      ))}
    </PageContainer>
  );
};

export default ProfilePage;
