"use client";
import {
  useApiAgentTypes,
  useApiLanguages,
  useApiServices,
} from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";
import { useUpdateOrganization } from "@/hooks/useUpdateOrganizationDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../shared/types";
import { useEditingChangeNotifier } from "../shared/useEditingChangeNotifier";
import { apiLanguagesToFormValues, toLanguagesForForm } from "./formatters";
import { OrganisationDetailsDisplay } from "./OrganisationDetailsDisplay";
import { OrganisationDetailsEdit } from "./OrganisationDetailsEdit";
import { createOrganisationDetailsSchema, OrganisationDetailsFormData } from "./organisationDetailsSchema";
import { useGetOrganization } from "@/hooks/useGetOrganization";

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
  const { data: apiAgentTypes = [] } = useApiAgentTypes();
  const { data: apiServices = [] } = useApiServices();
  const { data: organizations = [] } = useGetOrganization();
  const agentTypeMapping = useMemo(() => createMapping(apiAgentTypes), [apiAgentTypes]);
  const serviceMapping = useMemo(() => createMapping(apiServices), [apiServices]);
  const organizationMapping = useMemo(() => createMapping(organizations), [organizations]);

  const details = agent.agentDetails;
  const languagesForForm = toLanguagesForForm(apiLanguages, i18n.language);
  const schema = createOrganisationDetailsSchema(
    t,
    organizations?.map((org) => org.title),
  );

  // organizationType/services come back from GET /agent as { id, title: {en,de} }
  // (both languages at once); resolve by id to the title already translated to
  // the current UI language by the fetched AgentType/Service option lists, so
  // the picker's options and the pre-selected value use the same strings.
  const initialFormValues = useMemo(
    () => ({
      ...details,
      title: agent.title || "",
      website: details?.website || "",
      operator: details?.operator || agent.operator || "",
      clientLanguages: apiLanguagesToFormValues(details?.clientLanguages),
      addressStreet: details?.addressStreet ?? "",
      addressPostcode: details?.addressPostcode ?? "",
      organizationType: details?.organizationType?.id
        ? (agentTypeMapping.idToTitle[Number(details.organizationType.id)] ?? "")
        : "",
      services: (details?.services ?? [])
        .map((service) => (service.id ? serviceMapping.idToTitle[Number(service.id)] : undefined))
        .filter((title): title is string => Boolean(title)),
    }),
    [details, agent.title, agent.operator, agentTypeMapping, serviceMapping],
  );

  const methods = useForm<OrganisationDetailsFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormValues,
  });

  const { handleSubmit, reset } = methods;

  const handleEditClick = () => setIsEditing(true);

  useImperativeHandle(ref, () => ({ handleEditClick }));

  // apiAgentTypes/apiServices resolve asynchronously after the form's initial
  // mount, so the id->title lookups above are still empty when useForm first
  // captures defaultValues (RHF freezes them at mount). Re-sync once the real
  // data arrives, matching the pattern in RefugeeAccommodationCentre.tsx.
  useEffect(() => {
    if (isEditing) return;
    reset(initialFormValues);
  }, [initialFormValues, isEditing, reset]);

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (values: OrganisationDetailsFormData) => {
    const typeId = agentTypeMapping.titleToId[values.organizationType];
    const serviceIds = values.services
      .map((title) => serviceMapping.titleToId[title])
      .filter((id): id is number => id !== undefined);
    const organizationId = organizationMapping.titleToId[values.operator];

    updateOrganization(
      {
        title: values.title,
        about: values.about,
        website: values.website,
        addressStreet: values.addressStreet,
        addressPostcode: values.addressPostcode,
        ...(typeId !== undefined && { typeId }),
        serviceIds,
        ...(organizationId !== undefined && { organizationId }),
      },
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
            organizationTypeOptions={apiAgentTypes.map((agentType) => agentType.title)}
            servicesOptions={apiServices.map((service) => service.title)}
            operatorOptions={organizations.map((org) => org.title)}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
          />
        ) : (
          <OrganisationDetailsDisplay rawClientLanguages={details?.clientLanguages} address={details?.address} />
        )}
      </FormContainer>
    </FormProvider>
  );
});
