"use client";
import WithParentRef from "@/components/withParentRef";
import useList from "@/hooks/useLists";
import usePostRequest from "@/hooks/usePostRequest";
import { Subpage } from "@/types";
import { useForm } from "@tanstack/react-form";
import { validate as validateEmail } from "email-validator";
import { Lang, OpportunityType, TranslatedIntoType } from "need4deed-sdk";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiPathOpportunity, eightDays, phoneRegEx } from "../../../config/constants";
import { getImageUrl } from "../../../utils";
import UploadIcon from "../../svg/Upload";
import FieldInfo from "../FieldInfo";
import HeaderWithHelp from "../HeaderWithHelp";
import style from "../index.module.css";
import MultipleCheckBoxInputsWithMore from "../MultipleCheckBoxInputsWithMore";
import MultipleRadioInputsWithMore from "../MultipleRadioInputsWithMore";
import SimpleInputField from "../SimpleInputField";
import { ListsOfOptions, TypePLZ } from "../types";
import {
  getAllSelectedFalse,
  getDate,
  getScheduleState,
  getTickMark,
  getTimeslotTitle,
  isSelected,
  isTimeSlotSelected,
  isValidPLZ,
  OpportunityDTO,
  parseFormStateDTOOpportunity,
} from "../utils";
import { validateRACEmail } from "../validators";
import { OpportunityData } from "./dataStructure";
import ErrorAnnouncement from "./ErrorAnnouncement";

const thankYou = "form.addOpportunity.thankYou";
const queryParamsMap: Record<string, keyof ParsedOpportunity> = {
  name: "fullName",
  email: "email",
  phone: "racPhone",
  address: "racAddress",
  postcode: "racPostcode",
};

type ParsedOpportunity = Pick<OpportunityData, "fullName" | "email" | "racPhone" | "racAddress" | "racPostcode">;

export default function AddOpportunity() {
  const navigate = useRouter();
  const { lng } = useParams();
  const { i18n, t } = useTranslation();
  const queryParams = useSearchParams();
  const language = i18n.language as Lang;
  const [showErrorAnnouncement, setShowErrorAnnouncement] = useState(false);

  const parsedOpportunity: Partial<ParsedOpportunity> = {};
  Object.entries(queryParamsMap).forEach(([queryParam, mappedParam]) => {
    parsedOpportunity[mappedParam] = queryParams.get(queryParam) || "";
  });

  const { postRequest } = usePostRequest<OpportunityDTO, Record<string, string | string[]>>({
    url: `${apiPathOpportunity}/legacy`,
  });

  const formOpportunity = useForm({
    defaultValues: {
      ...(parsedOpportunity as ParsedOpportunity),
      racName: [],
      title: "",
      opportunityType: undefined,
      locations: getAllSelectedFalse(useList(ListsOfOptions.LOCATIONS)),
      activities: getAllSelectedFalse(useList(ListsOfOptions.ACTIVITIES)),
      activitiesAccompanying: getAllSelectedFalse(useList(ListsOfOptions.ACTIVITIES_ACCOMPANYING)),
      languages: getAllSelectedFalse(useList(ListsOfOptions.LANGUAGES)),
      skills: getAllSelectedFalse(useList(ListsOfOptions.SKILLS)),
      aaAddress: "",
      aaPostcode: "",
      schedule: getScheduleState(),
      dateTime: undefined,
      numberVolunteers: "1",
      translatedInto: undefined,
      voInformation: "",
      refugeeName: "",
      refugeeNumber: "",
      aaInformation: "",
      consent: undefined,
      language,
    } as OpportunityData,
    onSubmit: async ({ value }) => {
      const data = parseFormStateDTOOpportunity(value);

      const { success } = await postRequest(data);
      if (success) {
        navigate.push(`/${Subpage.ANNOUNCEMENT}/?pointer=${thankYou}`);
      } else {
        setShowErrorAnnouncement(true);
      }
    },
  });

  if (showErrorAnnouncement) {
    return <ErrorAnnouncement />;
  }

  return (
    <div key={language} className={`n4d-container ${style["form-container"]}`}>
      <div className={style["form-container-header"]}>
        <h1>
          {t("form.addOpportunity.header").toLocaleUpperCase()}
          <Image src={getImageUrl("N4D-logo-purple-on-transparent-h.webp")} alt="" width={180} height={100} />
        </h1>
      </div>
      <form
        className={style["form-form-container"]}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formOpportunity.handleSubmit();
        }}
      >
        <div className="d-flex flex-column">
          <SimpleInputField<OpportunityData>
            name="title"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.title.label")}
            onChangeValidator={({ value }) => {
              if (!value) return t("form.error.required");

              if ((value as string).length > 128) {
                return t("form.addOpportunity.fields.title.errorTooLong");
              }

              return undefined;
            }}
          />
          <i className="m-1">{t("form.addOpportunity.fields.title.example")}</i>
        </div>
        <fieldset className={style["form-field-group"]}>
          <b>{t("form.addOpportunity.fields.contactGroup.label")}</b>
          <span>
            <i>{t("form.addOpportunity.fields.contactGroup.info")}</i>
          </span>
          <SimpleInputField<OpportunityData>
            name="email"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.contactGroup.email.label")}
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return t("form.error.required");
                }
                if (!validateEmail(value as string)) {
                  return t("form.error.email");
                }
                return undefined;
              },
              onChangeAsync: ({ value }) => {
                return validateRACEmail(value as string, t("form.error.badEmail"));
              },
              onSubmit: ({ value }) => {
                if (!value) {
                  return t("form.error.required");
                }
                if (!validateEmail(value as string)) {
                  return t("form.error.email");
                }
                return undefined;
              },
            }}
          />
          <SimpleInputField<OpportunityData>
            name="fullName"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.contactGroup.fullName.label")}
            onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
          />
          <SimpleInputField<OpportunityData>
            name="racAddress"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.contactGroup.address.label")}
            onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
          />
          <SimpleInputField<OpportunityData>
            name="racPostcode"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.contactGroup.postcode.label")}
            onChangeValidator={({ value }) => {
              if (!value) {
                return t("form.error.required");
              }

              if (!isValidPLZ(value as string, TypePLZ.GERMANY)) {
                return t("form.error.postcode");
              }

              return undefined;
            }}
          />
          <SimpleInputField<OpportunityData>
            name="racPhone"
            FieldTag={formOpportunity.Field}
            label={t("form.addOpportunity.fields.contactGroup.phone.label")}
            onChangeValidator={({ value }) => {
              if (!value) return t("form.error.required");

              if (!(value as string).match(phoneRegEx)) return t("form.error.number");

              return undefined;
            }}
          />
        </fieldset>
        <formOpportunity.Field
          name="opportunityType"
          validators={{
            onBlur: ({ value }) => (value === undefined ? t("form.error.required") : undefined),
          }}
        >
          {(field) => (
            <fieldset
              className={style["form-pick"]}
              onFocus={() => {
                setTimeout(field.handleBlur, 0);
              }}
            >
              <HeaderWithHelp
                textHelp={t("form.addOpportunity.fields.opportunityType.helpText")}
                titleHelp={t("form.addOpportunity.fields.opportunityType.helpTitle")}
                classNamePopup="form-help"
              >
                {t("form.addOpportunity.fields.opportunityType.header")}
              </HeaderWithHelp>
              <div className={style["form-chip-list"]}>
                <MultipleRadioInputsWithMore
                  items={[OpportunityType.ACCOMPANYING, OpportunityType.REGULAR]}
                  copyPath="form.addOpportunity.fields.opportunityType."
                  field={field}
                />
              </div>
              <FieldInfo field={field} />
            </fieldset>
          )}
        </formOpportunity.Field>
        <formOpportunity.Subscribe selector={(state) => state}>
          {(state) => {
            if (state.values.opportunityType === OpportunityType.ACCOMPANYING)
              return (
                <fieldset className={style["form-field-group"]}>
                  <b>{t("form.addOpportunity.fields.aaGroup.label")}</b>
                  <formOpportunity.Field
                    name="activitiesAccompanying"
                    validators={{
                      onBlur: ({ value }) => isSelected(value, t("form.error.required")),
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.aaGroup.activities.header")}
                          </HeaderWithHelp>
                          <WithParentRef
                            className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                            onFocus={() => setTimeout(field.handleBlur, 0)}
                          >
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "activitiesAccompanying">
                              FieldTag={formOpportunity.Field}
                              field={field}
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <formOpportunity.Field
                    name="translatedInto"
                    validators={{
                      onBlur: ({ value }) => (value === undefined ? t("form.error.required") : undefined),
                    }}
                  >
                    {(field) => (
                      <fieldset
                        className={style["form-pick"]}
                        onFocus={() => {
                          setTimeout(field.handleBlur, 0);
                        }}
                      >
                        <HeaderWithHelp
                          textHelp={t("form.addOpportunity.fields.aaGroup.translatedInto.helpText")}
                          className={style["form-chiplist-header-within-group"]}
                          classNamePopup={style["form-help"]}
                        >
                          {t("form.addOpportunity.fields.aaGroup.translatedInto.header")}
                        </HeaderWithHelp>
                        <div className={style["form-chip-list"]}>
                          <MultipleRadioInputsWithMore
                            items={Object.values(TranslatedIntoType)}
                            copyPath="form.addOpportunity.fields.aaGroup.translatedInto."
                            field={field}
                          />
                        </div>
                        <FieldInfo field={field} />
                      </fieldset>
                    )}
                  </formOpportunity.Field>
                  {state.values.translatedInto && state.values.translatedInto !== TranslatedIntoType.NO_TRANSLATION && (
                    <formOpportunity.Field
                      name="languages"
                      validators={{
                        onBlur: ({ value }) => {
                          return isSelected(value, t("form.error.language"));
                        },
                      }}
                    >
                      {(field) => {
                        return (
                          <fieldset
                            onFocus={() => {
                              setTimeout(field.handleBlur, 0);
                            }}
                          >
                            <HeaderWithHelp
                              textHelp={t("form.addOpportunity.fields.aaGroup.languagesTranslation.helpText")}
                              className={style["form-chiplist-header-within-group"]}
                              classNamePopup={style["form-help"]}
                            >
                              {t("form.addOpportunity.fields.aaGroup.languagesTranslation.header")}
                            </HeaderWithHelp>
                            <WithParentRef className={`${style["form-chip-list"]} ${style["form-pick"]}`}>
                              <MultipleCheckBoxInputsWithMore<OpportunityData, "languages">
                                FieldTag={formOpportunity.Field}
                                field={field}
                                hiddenChips={
                                  state.values.translatedInto === TranslatedIntoType.ENGLISH_OK
                                    ? ["German", "Deutsch", "English", "Englisch"]
                                    : ["German", "Deutsch"]
                                }
                              />
                              <FieldInfo field={field} />
                            </WithParentRef>
                          </fieldset>
                        );
                      }}
                    </formOpportunity.Field>
                  )}
                  <SimpleInputField<OpportunityData>
                    name="aaAddress"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.address.label")}
                    onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
                  />
                  <SimpleInputField<OpportunityData>
                    name="aaPostcode"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.postcode.label")}
                    onChangeValidator={({ value }) => {
                      if (!value) {
                        return t("form.error.required");
                      }

                      if (!isValidPLZ(value as string, TypePLZ.GERMANY)) {
                        return t("form.error.postcode");
                      }

                      return undefined;
                    }}
                  />
                  <SimpleInputField<OpportunityData>
                    name="dateTime"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.dateTime.label")}
                    inputType="datetime-local"
                    onChangeValidator={({ value }) => {
                      if (!value) {
                        return t("form.error.required");
                      }
                      if (Number.isNaN(getDate(value as string).getTime())) {
                        return t("form.error.badTime");
                      }
                      const difference = getDate(value as string).valueOf() - Date.now();
                      if (difference < eightDays) {
                        return t("form.addOpportunity.fields.aaGroup.dateTime.tooClose");
                      }
                      return undefined;
                    }}
                  />
                  <SimpleInputField<OpportunityData>
                    name="refugeeName"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.refugeeName.label")}
                    onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
                  />
                  <SimpleInputField<OpportunityData>
                    name="refugeeNumber"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.refugeeNumber.label")}
                    onChangeValidator={({ value }) => {
                      if (!value) return t("form.error.required");

                      if (!(value as string).match(phoneRegEx)) return t("form.error.number");

                      return undefined;
                    }}
                  />
                  <formOpportunity.Field
                    name="locations"
                    validators={{
                      onBlur: ({ value }) => isSelected(value, t("form.error.location")),
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.aaGroup.locations.header")}
                          </HeaderWithHelp>
                          <WithParentRef
                            className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                            onFocus={() => setTimeout(field.handleBlur, 0)}
                          >
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "locations">
                              FieldTag={formOpportunity.Field}
                              field={field}
                              isOneOption
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <SimpleInputField<OpportunityData>
                    name="aaInformation"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.aaGroup.information.label")}
                    onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
                  />
                </fieldset>
              );
            return null;
          }}
        </formOpportunity.Subscribe>
        <formOpportunity.Subscribe selector={(state) => state}>
          {(state) => {
            if (state.values.opportunityType === OpportunityType.REGULAR)
              return (
                <fieldset className={style["form-field-group"]}>
                  <b>{t("form.addOpportunity.fields.voGroup.label")}</b>
                  <formOpportunity.Field
                    name="locations"
                    validators={{
                      onBlur: ({ value }) => isSelected(value, t("form.error.location")),
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.voGroup.locations.header")}
                          </HeaderWithHelp>
                          <WithParentRef
                            className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                            onFocus={() => setTimeout(field.handleBlur, 0)}
                          >
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "locations">
                              FieldTag={formOpportunity.Field}
                              field={field}
                              isOneOption
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <formOpportunity.Field
                    name="activities"
                    validators={{
                      onBlur: ({ value }) => isSelected(value, t("form.error.activity")),
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.voGroup.activities.header")}
                          </HeaderWithHelp>
                          <WithParentRef
                            className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                            onFocus={() => setTimeout(field.handleBlur, 0)}
                          >
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "activities">
                              FieldTag={formOpportunity.Field}
                              field={field}
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <formOpportunity.Field
                    name="languages"
                    validators={{
                      onBlur: ({ value }) => isSelected(value, t("form.error.language")),
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            textHelp={t("form.addOpportunity.fields.voGroup.languagesRefugee.helpText")}
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.voGroup.languagesRefugee.header")}
                          </HeaderWithHelp>
                          <WithParentRef
                            className={`${style["form-chip-list"]} ${style["form-pick"]}`}
                            onFocus={() => setTimeout(field.handleBlur, 0)}
                          >
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "languages">
                              FieldTag={formOpportunity.Field}
                              field={field}
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <formOpportunity.Field name="skills">
                    {(field) => {
                      return (
                        <fieldset>
                          <HeaderWithHelp
                            textHelp={t("form.addOpportunity.fields.voGroup.skills.helpText")}
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.voGroup.skills.header")}
                          </HeaderWithHelp>
                          <WithParentRef className={`${style["form-chip-list"]} ${style["form-pick"]}`}>
                            <MultipleCheckBoxInputsWithMore<OpportunityData, "skills">
                              FieldTag={formOpportunity.Field}
                              field={field}
                            />
                            <FieldInfo field={field} />
                          </WithParentRef>
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <formOpportunity.Field
                    name="schedule"
                    validators={{
                      onBlur: ({ value, fieldApi }) => {
                        setTimeout(() => fieldApi.form.validateField("onetimeDateTime", "change"), 0);
                        const isDateTime = !!fieldApi.form.getFieldValue("onetimeDateTime");
                        const isScheduleEmpty = !isTimeSlotSelected(value);
                        if (!isScheduleEmpty && isDateTime)
                          return t("form.addOpportunity.fields.voGroup.schedule.errorBoth");
                        if (isScheduleEmpty && !isDateTime)
                          return t("form.addOpportunity.fields.voGroup.schedule.error");

                        return undefined;
                      },
                      onChangeListenTo: ["onetimeDateTime"],
                    }}
                  >
                    {(field) => {
                      return (
                        <fieldset className={style["form-schedule"]}>
                          <HeaderWithHelp
                            textHelp={t("form.addOpportunity.fields.voGroup.schedule.helpText")}
                            className={style["form-chiplist-header-within-group"]}
                            classNamePopup={style["form-help"]}
                          >
                            {t("form.addOpportunity.fields.voGroup.schedule.header")}
                          </HeaderWithHelp>
                          <div
                            className={style["form-table"]}
                            onFocus={() => {
                              setTimeout(field.handleBlur, 0);
                            }}
                          >
                            {field.state.value &&
                              field.state.value.map(({ weekday }, idx) => {
                                return (
                                  <div className={style["form-table-row"]} key={`weekday${weekday}`}>
                                    <span className={style["form-availability-weekday"]}>
                                      {t(`form.schedule.${weekday}`).toLocaleUpperCase()}
                                    </span>

                                    <formOpportunity.Field name={`schedule[${idx}].timeSlots`}>
                                      {(fieldWeekday) => {
                                        return (
                                          fieldWeekday.state.value &&
                                          fieldWeekday.state.value.map(({ title, id }, idxInner) => {
                                            return (
                                              <formOpportunity.Field
                                                key={`${weekday}${id}`}
                                                name={`schedule[${idx}].timeSlots[${idxInner}].selected`}
                                              >
                                                {(fieldTimeslot) => {
                                                  return (
                                                    <span className={style["form-pick"]}>
                                                      <input
                                                        tabIndex={0}
                                                        id={`${weekday}${idxInner}${fieldWeekday.state.value[idxInner].id}`}
                                                        type="checkbox"
                                                        onChange={(e) => {
                                                          fieldTimeslot.handleChange(e.target.checked);
                                                        }}
                                                      />
                                                      <label
                                                        htmlFor={`${weekday}${idxInner}${fieldWeekday.state.value[idxInner].id}`}
                                                      >
                                                        <span>
                                                          {getTimeslotTitle(t, title[i18n.language as Lang] as string)}
                                                        </span>
                                                      </label>
                                                    </span>
                                                  );
                                                }}
                                              </formOpportunity.Field>
                                            );
                                          })
                                        );
                                      }}
                                    </formOpportunity.Field>
                                  </div>
                                );
                              })}
                          </div>
                          <h6>
                            <i>{t("form.addOpportunity.fields.voGroup.schedule.or").toUpperCase()}</i>
                          </h6>
                          <SimpleInputField<OpportunityData>
                            name="onetimeDateTime"
                            FieldTag={formOpportunity.Field}
                            label={t("form.addOpportunity.fields.voGroup.schedule.oneTimeLabel")}
                            inputType="datetime-local"
                            validators={{
                              onChange: ({ value, fieldApi }) => {
                                setTimeout(() => fieldApi.form.validateField("schedule", "blur"), 0);
                                if (!value && !isTimeSlotSelected(fieldApi.form.getFieldValue("schedule"))) {
                                  return t("form.addOpportunity.fields.voGroup.schedule.error");
                                }
                                if (value && Number.isNaN(getDate(value as string).getTime())) {
                                  return t("form.error.badTime");
                                }
                                return undefined;
                              },
                              onChangeListenTo: ["schedule"],
                            }}
                            onFocus={() => {
                              setTimeout(field.handleBlur, 0);
                            }}
                          />
                          <FieldInfo field={field} />
                        </fieldset>
                      );
                    }}
                  </formOpportunity.Field>
                  <SimpleInputField<OpportunityData>
                    name="numberVolunteers"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.voGroup.numberVolunteers.label")}
                    onChangeValidator={({ value }) => {
                      if (!value) {
                        return t("form.error.required");
                      }
                      const numVolunteers = Number(value as string);
                      if (Number.isNaN(numVolunteers)) {
                        return t("form.addOpportunity.fields.voGroup.numberVolunteers.error");
                      }
                      return undefined;
                    }}
                  />
                  <SimpleInputField<OpportunityData>
                    name="voInformation"
                    FieldTag={formOpportunity.Field}
                    label={t("form.addOpportunity.fields.voGroup.information.label")}
                    onChangeValidator={({ value }) => (!value ? t("form.error.required") : undefined)}
                  />
                </fieldset>
              );
            return null;
          }}
        </formOpportunity.Subscribe>
        <formOpportunity.Field
          name="consent"
          validators={{
            onChange: ({ value }) => (value ? undefined : t("form.error.required")),
          }}
        >
          {(field) => {
            return (
              <div>
                <div className={`${style["form-chip-list"]} ${style["form-pick"]}`}>
                  <input
                    id="consent"
                    type="checkbox"
                    name="consent"
                    onChange={(e) => {
                      field.handleChange(e.target.checked);
                      field.validate("change");
                    }}
                  />
                  <label htmlFor="consent">{getTickMark(!!field.state.value)}</label>
                  <span>
                    {t("form.addOpportunity.fields.consent.header")} {t("form.addOpportunity.fields.consent.agree")}{" "}
                    <a href={`/${Subpage.GUIDELINES}/${lng}`}>{t("homepage.footer.legal.guidelines")}</a>{" "}
                    {t("form.addOpportunity.fields.consent.and")}{" "}
                    <a href={`/${Subpage.DATA_PROTECTION}/${lng}`}>{t("homepage.footer.legal.dataPrivacy")}</a>
                  </span>
                </div>
                <FieldInfo field={field} />
              </div>
            );
          }}
        </formOpportunity.Field>
        <formOpportunity.Subscribe selector={(state) => state}>
          {(state) => {
            const errors = Array.from(
              new Set(
                Object.keys(formOpportunity.state.fieldMeta)
                  .reduce((errorList: string[], key) => {
                    const errorsMsgs =
                      formOpportunity.state.fieldMeta[key as keyof typeof formOpportunity.state.fieldMeta].errors?.join(
                        ", ",
                      );
                    errorList.push(errorsMsgs);
                    return errorList;
                  }, [])
                  .filter(Boolean),
              ),
            ).join(", ");
            return (
              <div className={style["form-submit"]}>
                <button className="n4d-cta" type="submit" disabled={!state.canSubmit}>
                  {state.isSubmitting ? (
                    "..."
                  ) : (
                    <>
                      <UploadIcon />
                      {t("form.button.submit").toUpperCase()}
                    </>
                  )}
                </button>
                {errors ? (
                  <em>
                    {t("form.error.labelErrors")}: {errors}
                  </em>
                ) : null}
              </div>
            );
          }}
        </formOpportunity.Subscribe>
      </form>
      <p>{t("form.addOpportunity.bottomMsg")}</p>
    </div>
  );
}
