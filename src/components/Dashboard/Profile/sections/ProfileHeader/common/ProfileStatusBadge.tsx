import { VolunteerStateTypeType } from "need4deed-sdk";
import { isEnumValue } from "ts-type-safe";
import { statusColorMap, statusIconMap, StatusValue } from "../../../common/statusMaps";
import { StatusTag } from "../../../common/StatusTag";

type Props = {
  status: StatusValue;
  label: string;
  showIcon?: boolean;
};

const DEFAULT_BG = "var(--color-grey-50)";
const DEFAULT_TEXT_COLOR = "var(--color-blue-700)";
const VOLUNTEER_TYPE_TEXT_COLOR = "var(--color-white)";

const isVolunteerType = (status: StatusValue) => isEnumValue(VolunteerStateTypeType, status);

export const ProfileStatusBadge = ({ status, label, showIcon = true }: Props) => {
  const bg = statusColorMap[status] ?? DEFAULT_BG;
  const textColor = isVolunteerType(status) ? VOLUNTEER_TYPE_TEXT_COLOR : DEFAULT_TEXT_COLOR;
  const IconComp = statusIconMap[status];

  return (
    <StatusTag
      bg={bg}
      textColor={textColor}
      icon={showIcon && IconComp ? <IconComp size={20} color={textColor} /> : undefined}
      data-testid="profile-status-badge"
    >
      {label}
    </StatusTag>
  );
};
