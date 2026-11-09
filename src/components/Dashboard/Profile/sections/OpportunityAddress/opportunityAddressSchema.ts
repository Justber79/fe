import { TFunction } from "i18next";
import { ApiOpportunityAddress } from "need4deed-sdk";
import { z } from "zod";

const i18nPrefix = "dashboard.opportunityProfile.opportunityAddress";

export const createOpportunityAddressSchema = (t: TFunction) =>
  z
    .object({
      notMyLocation: z.boolean(),
      street: z.string(),
      postcode: z.string(),
      city: z.string(),
    })
    .superRefine((data, ctx) => {
      if (!data.notMyLocation) return;
      if (!data.street.trim()) ctx.addIssue({ code: "custom", path: ["street"], message: t(`${i18nPrefix}.required`) });
      if (!data.city.trim()) ctx.addIssue({ code: "custom", path: ["city"], message: t(`${i18nPrefix}.required`) });
      if (!/^\d{5}$/.test(data.postcode.trim()))
        ctx.addIssue({ code: "custom", path: ["postcode"], message: t(`${i18nPrefix}.postcodeInvalid`) });
    });

export type OpportunityAddressFormData = z.infer<ReturnType<typeof createOpportunityAddressSchema>>;

export const toAddressFormData = (address?: ApiOpportunityAddress | null): OpportunityAddressFormData => ({
  notMyLocation: Boolean(address),
  street: address?.street ?? "",
  postcode: address?.postcode ?? "",
  city: address?.city ?? "",
});

export const toApiAddress = (data: OpportunityAddressFormData): ApiOpportunityAddress | null =>
  data.notMyLocation ? { street: data.street.trim(), postcode: data.postcode.trim(), city: data.city.trim() } : null;

export const formatAddress = (address: ApiOpportunityAddress) =>
  `${address.street}, ${address.postcode} ${address.city}`;
