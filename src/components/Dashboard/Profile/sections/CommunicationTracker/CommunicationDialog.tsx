import { Button } from "@/components/core/button";
import { Modal } from "@/components/core/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "@phosphor-icons/react";
import { de, enUS } from "date-fns/locale";
import { ApiCommunicationGet, CommunicationType, ContactMethodType, ContactType } from "need4deed-sdk";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { DialogButtonGroup, DialogForm } from "../shared/styles";
import {
  CloseButton,
  DialogHeader,
  DialogTitle,
  FormField,
  Label,
  RadioInput,
  RadioOption,
  RadioRow,
  Select,
} from "./styles";
import { getCommunicationTypeOptions, getContactMethodOptions, getDefaultContactMethod } from "./utils/options";
import { getContactTypeLabel } from "./utils/translations";
import { CommunicationFormData, createValidationSchema } from "./utils/validation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ApiCommunicationGet>) => void;
  initialData?: ApiCommunicationGet;
};

export function CommunicationDialog({ isOpen, onClose, onSave, initialData }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : enUS;

  const schema = createValidationSchema(t);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isValid: isFormValid },
  } = useForm<CommunicationFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      contactType: undefined,
      contactMethod: ContactMethodType.PHONE,
      communicationType: CommunicationType.BRIEF,
      date: new Date(),
    },
  });

  const contactType = watch("contactType");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          contactType: initialData.contactType,
          contactMethod: initialData.contactMethod,
          communicationType: initialData.communicationType || CommunicationType.BRIEF,
          date: new Date(initialData.date),
        });
      } else {
        reset({
          contactType: undefined,
          contactMethod: ContactMethodType.PHONE,
          communicationType: CommunicationType.BRIEF,
          date: new Date(),
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: CommunicationFormData) => {
    if (!data.contactType || !data.date) return;

    const payload: Partial<ApiCommunicationGet> = {
      id: initialData?.id,
      contactType: data.contactType,
      contactMethod: data.contactMethod,
      communicationType: data.contactType === ContactType.OTHER ? data.communicationType : undefined,
      date: data.date,
    };
    onSave(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{t("dashboard.communicationSection.registerContact", "Register contact")}</DialogTitle>
        <CloseButton onClick={onClose} data-testid="close-dialog-button">
          <X size={24} weight="bold" />
        </CloseButton>
      </DialogHeader>

      <DialogForm onSubmit={handleSubmit(onSubmit)}>
        {Object.values(ContactType).map((type) => (
          <RadioOption key={type}>
            <RadioRow>
              <Controller
                name="contactType"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioInput
                    {...field}
                    type="radio"
                    value={type}
                    checked={field.value === type}
                    onChange={() => {
                      field.onChange(type);
                      const defaultMethod = getDefaultContactMethod(type);
                      setValue("contactMethod", defaultMethod);
                    }}
                    data-testid={`radio-${type.toLowerCase().replace(/_/g, "-")}`}
                  />
                )}
              />
              {getContactTypeLabel(t, type)}
            </RadioRow>

            {contactType === type && (
              <>
                {type === ContactType.OTHER && (
                  <FormField>
                    <Label>
                      {t("dashboard.communicationSection.communicationTypeRequired", "Communication type*")}
                    </Label>
                    <Controller
                      name="communicationType"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} data-testid="communication-type-select">
                          {getCommunicationTypeOptions(t).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                  </FormField>
                )}
                <FormField>
                  <Label>{t("dashboard.communicationSection.contactMethodRequired", "Contact method*")}</Label>
                  <Controller
                    name="contactMethod"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} data-testid="platform-select">
                        {getContactMethodOptions(t, type).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </FormField>
                <FormField>
                  <Label>{t("dashboard.communicationSection.contactDateRequired", "Contact date*")}</Label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <DatePickerWithLabel
                        date={field.value}
                        onSelect={field.onChange}
                        locale={locale}
                        showTodayIndicator
                        todayText={t("dashboard.communicationSection.today")}
                      />
                    )}
                  />
                </FormField>
              </>
            )}
          </RadioOption>
        ))}

        <DialogButtonGroup>
          <Button
            text={t("dashboard.communicationSection.cancel", "Cancel")}
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            backgroundcolor="transparent"
            textColor="var(--color-aubergine)"
            border="var(--border-width-medium) solid var(--color-aubergine)"
          />
          <Button
            text={t("dashboard.communicationSection.save", "Save")}
            onClick={handleSubmit(onSubmit)}
            backgroundcolor="var(--color-aubergine)"
            textColor="var(--color-white)"
            disabled={!isFormValid || !contactType}
          />
        </DialogButtonGroup>
      </DialogForm>
    </Modal>
  );
}
