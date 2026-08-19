import { Button } from "@/components/core/button";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { Modal } from "@/components/core/modal";
import { de, enUS, Locale } from "date-fns/locale";
import { ApiAppreciationGet, VolunteerStateAppreciationType } from "need4deed-sdk";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectableOption } from "../shared/SelectableOption";
import { DialogButtonGroup, DialogForm } from "../shared/styles";
import {
  DateFieldWrapper,
  DialogTitle,
  ExpandedSection,
  RadioOptionsContainer,
  Separator,
  SubOptionContainer,
  SubQuestion,
} from "./styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: number;
    title: VolunteerStateAppreciationType;
    dateDue: Date | null;
    dateDelivery: Date | null;
  }) => void;
  initialData?: ApiAppreciationGet;
};

type DeliveryStatus = "received" | "pending";

const APPRECIATION_TYPES = [
  {
    value: VolunteerStateAppreciationType.TOTE_BAG,
    labelKey: "dashboard.appreciationSection.typeOptions.toteBag",
  },
  {
    value: VolunteerStateAppreciationType.T_SHIRT,
    labelKey: "dashboard.appreciationSection.typeOptions.tshirt",
  },
  {
    value: VolunteerStateAppreciationType.BENEFIT_CARD,
    labelKey: "dashboard.appreciationSection.typeOptions.benefitCard",
  },
  {
    value: VolunteerStateAppreciationType.NEED4DEED_CERTIFICATE,
    labelKey: "dashboard.appreciationSection.typeOptions.need4deedCertificate",
  },
  { value: VolunteerStateAppreciationType.CAP, labelKey: "dashboard.appreciationSection.typeOptions.cap" },
  { value: VolunteerStateAppreciationType.NOTEBOOK, labelKey: "dashboard.appreciationSection.typeOptions.notebook" },
  {
    value: VolunteerStateAppreciationType.CITY_CERTIFICATE,
    labelKey: "dashboard.appreciationSection.typeOptions.cityCertificate",
  },
];

type DeliveryStatusOptionProps = {
  status: DeliveryStatus;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
  showDatePicker: boolean;
  date: Date | undefined;
  onDateSelect: (d: Date | undefined) => void;
  locale: Locale;
  dateLabel: string;
  todayText: string;
  allowFuture?: boolean;
  testId: string;
};

function DeliveryStatusOption({
  status,
  isSelected,
  label,
  onSelect,
  showDatePicker,
  date,
  onDateSelect,
  locale,
  dateLabel,
  todayText,
  allowFuture = false,
  testId,
}: DeliveryStatusOptionProps) {
  return (
    <>
      <SelectableOption isSelected={isSelected} label={label} onClick={onSelect} data-testid={`sub-option-${status}`} />
      {showDatePicker && (
        <DateFieldWrapper data-testid={testId}>
          <DatePickerWithLabel
            date={date}
            onSelect={onDateSelect}
            locale={locale}
            allowFuture={allowFuture}
            label={dateLabel}
            showTodayIndicator
            todayText={todayText}
          />
        </DateFieldWrapper>
      )}
    </>
  );
}

export function AppreciationDialog({ isOpen, onClose, onSave, initialData }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "de" ? de : enUS;

  const [selectedType, setSelectedType] = useState<VolunteerStateAppreciationType | undefined>(undefined);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setSelectedType(initialData.title);
      if (initialData.dateDelivery) {
        setDeliveryStatus("received");
        setSelectedDate(new Date(initialData.dateDelivery));
      } else if (initialData.dateDue) {
        setDeliveryStatus("pending");
        setSelectedDate(new Date(initialData.dateDue));
      }
    } else {
      setSelectedType(undefined);
      setDeliveryStatus(undefined);
      setSelectedDate(undefined);
    }
  }, [isOpen, initialData]);

  const handleTypeSelect = (type: VolunteerStateAppreciationType) => {
    setSelectedType(type);
    if (selectedType !== type) {
      setDeliveryStatus(undefined);
      setSelectedDate(undefined);
    }
  };

  const handleDeliveryStatusSelect = (status: DeliveryStatus) => {
    setDeliveryStatus(status);
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !deliveryStatus || !selectedDate) return;

    onSave({
      id: initialData?.id,
      title: selectedType,
      dateDue: deliveryStatus === "pending" ? selectedDate : null,
      dateDelivery: deliveryStatus === "received" ? selectedDate : null,
    });
  };

  const isFormValid = !!selectedType && !!deliveryStatus && !!selectedDate;
  const todayText = t("dashboard.appreciationSection.today");

  const dialogTitle = initialData
    ? t("dashboard.appreciationSection.editAppreciation")
    : t("dashboard.appreciationSection.addAppreciation");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DialogTitle data-testid="appreciation-dialog-title">{dialogTitle}</DialogTitle>

      <DialogForm onSubmit={handleSubmit} data-testid="appreciation-form">
        <RadioOptionsContainer data-testid="appreciation-options">
          {APPRECIATION_TYPES.map((option, index) => {
            const isSelected = selectedType === option.value;
            const isLastSelected = isSelected && index < APPRECIATION_TYPES.length - 1;

            return (
              <div key={option.value}>
                <SelectableOption
                  isSelected={isSelected}
                  label={t(option.labelKey)}
                  onClick={() => handleTypeSelect(option.value)}
                  data-testid={`type-option-${option.value}`}
                />

                {isSelected && (
                  <ExpandedSection data-testid="expanded-section">
                    <SubQuestion>{t("dashboard.appreciationSection.didVolunteerReceive")}</SubQuestion>
                    <SubOptionContainer>
                      <DeliveryStatusOption
                        status="received"
                        isSelected={deliveryStatus === "received"}
                        label={t("dashboard.appreciationSection.volunteerReceivedIt")}
                        onSelect={() => handleDeliveryStatusSelect("received")}
                        showDatePicker={deliveryStatus === "received"}
                        date={selectedDate}
                        onDateSelect={setSelectedDate}
                        locale={locale}
                        dateLabel={t("dashboard.appreciationSection.receivedOnRequired")}
                        todayText={todayText}
                        testId="received-date-field"
                      />
                      <DeliveryStatusOption
                        status="pending"
                        isSelected={deliveryStatus === "pending"}
                        label={t("dashboard.appreciationSection.needToGiveIt")}
                        onSelect={() => handleDeliveryStatusSelect("pending")}
                        showDatePicker={deliveryStatus === "pending"}
                        date={selectedDate}
                        onDateSelect={setSelectedDate}
                        locale={locale}
                        dateLabel={t("dashboard.appreciationSection.dueDateRequired")}
                        todayText={todayText}
                        allowFuture
                        testId="due-date-field"
                      />
                    </SubOptionContainer>
                  </ExpandedSection>
                )}

                {isLastSelected && <Separator />}
              </div>
            );
          })}
        </RadioOptionsContainer>

        <DialogButtonGroup>
          <Button
            text={t("dashboard.appreciationSection.cancel")}
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            backgroundcolor="transparent"
            textColor="var(--color-aubergine)"
            border="var(--border-width-medium) solid var(--color-aubergine)"
          />
          <Button
            text={t("dashboard.appreciationSection.save")}
            onClick={handleSubmit}
            backgroundcolor={isFormValid ? "var(--color-aubergine)" : "var(--color-grey-50)"}
            textColor={isFormValid ? "var(--color-white)" : "var(--color-grey-400)"}
            disabled={!isFormValid}
          />
        </DialogButtonGroup>
      </DialogForm>
    </Modal>
  );
}
