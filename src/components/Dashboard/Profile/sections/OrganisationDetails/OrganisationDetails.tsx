"use client";
import { useApiLanguages } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";
import { useUpdateOrganization } from "@/hooks/useUpdateOrganizationDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../shared/types";
import { useEditingChangeNotifier } from "../shared/useEditingChangeNotifier";
import { apiLanguagesToFormValues, toLanguagesForForm } from "./formatters";
import { OrganisationDetailsDisplay } from "./OrganisationDetailsDisplay";
import { OrganisationDetailsEdit } from "./OrganisationDetailsEdit";
import { createOrganisationDetailsSchema, OrganisationDetailsFormData } from "./organisationDetailsSchema";

type Props = {
  agent: ApiAgentProfileGet;
} & EditableSectionProps;

export const OrganisationDetails = forwardRef<EditableSectionRef, Props>(function OrganisationDetails(
  { agent, onEditingChange },
  ref,
) {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateOrganization /*, isPending */ } = useUpdateOrganization(String(agent?.id));

  useEditingChangeNotifier(isEditing, onEditingChange);
  const { data: apiLanguages } = useApiLanguages();

  const details = agent.agentDetails;
  const languagesForForm = toLanguagesForForm(apiLanguages, i18n.language);
  const schema = createOrganisationDetailsSchema(t);

  const initialFormValues = {
    ...details,
    operator: details?.operator || agent.operator || "",
    clientLanguages: apiLanguagesToFormValues(details?.clientLanguages),
  };

  const methods = useForm<OrganisationDetailsFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormValues,
  });

  const { handleSubmit, reset } = methods;

  const handleEditClick = () => setIsEditing(true);

  useImperativeHandle(ref, () => ({ handleEditClick }));

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (values: OrganisationDetailsFormData) => {
    updateOrganization(
      { about: values.about, website: values.website },
      {
        onSuccess: () => {
          reset(values);
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <FormContainer data-testid="organisation-details-container" $isEditing={isEditing}>
        {isEditing ? (
          <OrganisationDetailsEdit
            languagesForForm={languagesForForm}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
          />
        ) : (
          <OrganisationDetailsDisplay rawClientLanguages={details?.clientLanguages} />
        )}
      </FormContainer>
    </FormProvider>
  );
});
