import { ApiVolunteerGet } from "need4deed-sdk";
import { useGetVolunteerActivityLog } from "@/hooks/useGetVolunteerActivityLog";
import { SectionEmptyState, SectionWrapper } from "../shared/styles";
import { useTranslation } from "react-i18next";
import { VolunteerActivityLogTableContainer } from "./styles";
import { Table, TableHeaderCell, TableBody, TableCell } from "@/components/core/common/Table";
import { TableHeader, TableRow } from "../VolunteerProfileDocument/styles";
import { formatDateTime } from "../shared/utils/formatDateTime";

type VolunteerActivityLogProps = {
  volunteer: ApiVolunteerGet;
};

export const VolunteerActivityLog = ({ volunteer }: VolunteerActivityLogProps) => {
  const { activities } = useGetVolunteerActivityLog(volunteer.id);
  const { t } = useTranslation();

  return (
    <SectionWrapper>
      {activities.length === 0 ? (
        <SectionEmptyState>{t("dashboard.activityLog.emptyState")}</SectionEmptyState>
      ) : (
        <VolunteerActivityLogTableContainer>
          <Table>
            <TableHeader>
              <TableHeaderCell>{t("dashboard.activityLog.activity")}</TableHeaderCell>
              <TableHeaderCell $width="185px">{t("dashboard.activityLog.dateAndTime")}</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {activities.map((activity, index) => (
                <TableRow key={activity.id} $isLast={index === activities.length - 1}>
                  <TableCell>{activity.detail}</TableCell>
                  <TableCell $width="185px" $noWrap>
                    {formatDateTime(activity.occurredAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </VolunteerActivityLogTableContainer>
      )}
    </SectionWrapper>
  );
};
