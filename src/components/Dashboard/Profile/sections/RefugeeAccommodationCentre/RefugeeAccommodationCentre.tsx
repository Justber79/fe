"use client";

import Button from "@/components/core/button/Button/Button";
import { apiPathOpportunity } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet, ApiOpportunityPatch, Lang } from "need4deed-sdk";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  OpportunityAddressFields,
  OpportunityAddressFormData,
  createOpportunityAddressSchema,
  formatAddress,
  toAddressFormData,
  toApiAddress,
} from "../OpportunityAddress";
import { FormButtonRow } from "../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../shared/types";
import { RefugeeAccommodationCentreDisplay } from "./RefugeeAccommodationCentreDisplay";

type Props = EditableSectionProps & {
  opportunity: ApiOpportunityGet;
};

export const RefugeeAccommodationCentre = forwardRef<EditableSectionRef, Props>(
  ({ opportunity, onEditingChange }, ref) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language as Lang;
    const districtTitle = opportunity.agent.district?.title?.[lang] ?? opportunity.agent.district?.title?.de ?? "";
    const [isEditing, setIsEditing] = useState(false);

    const methods = useForm<OpportunityAddressFormData>({
      resolver: zodResolver(createOpportunityAddressSchema(t)),
      mode: "onChange",
      values: toAddressFormData(opportunity.address),
    });

    const { mutate, isPending } = useMutationQuery<Pick<ApiOpportunityPatch, "address">, unknown>({
      apiPath: `${apiPathOpportunity}/${opportunity.id}`,
      method: "patch",
      queryKeyToInvalidate: ["opportunity", String(opportunity.id)],
      onSuccessCallback: () => setEditing(false),
    });

    const setEditing = (editing: boolean) => {
      setIsEditing(editing);
      onEditingChange?.(editing);
    };

    useImperativeHandle(ref, () => ({ handleEditClick: () => setEditing(true) }));

    const handleCancel = () => {
      methods.reset();
      setEditing(false);
    };

    const handleSubmit = methods.handleSubmit((data) => mutate({ address: toApiAddress(data) }));

    if (isEditing) {
      return (
        <FormProvider {...methods}>
          <OpportunityAddressFields />
          <FormButtonRow>
            <Button
              text={t("dashboard.opportunityProfile.accompanyingDetails.cancel")}
              onClick={handleCancel}
              width="auto"
              padding="var(--volunteer-profile-section-card-header-button-padding)"
              backgroundcolor="var(--color-white)"
              textColor="var(--color-aubergine)"
            />
            <Button
              text={t("dashboard.opportunityProfile.accompanyingDetails.saveChanges")}
              onClick={handleSubmit}
              width="auto"
              padding="var(--volunteer-profile-section-card-header-button-padding)"
              disabled={!methods.formState.isDirty || isPending}
            />
          </FormButtonRow>
        </FormProvider>
      );
    }

    return (
      <RefugeeAccommodationCentreDisplay
        name={opportunity.agent.name}
        address={opportunity.address ? formatAddress(opportunity.address) : opportunity.agent.address}
        district={districtTitle}
      />
    );
  },
);

RefugeeAccommodationCentre.displayName = "RefugeeAccommodationCentre";
