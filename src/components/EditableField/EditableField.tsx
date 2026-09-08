import { ErrorMessage } from "@/components/core/common";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { HasError, HasHint } from "@/types";
import { MinusIcon, PlusIcon, XCircleIcon } from "@phosphor-icons/react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import styled from "styled-components";

const EditModeWrapper = styled.div`
  width: 100%;
`;

const FieldWrapper = styled.div<HasError & HasHint>`
  display: var(--editableField-fieldWrapper-display);
  border-bottom: var(--editableField-fieldWrapper-borderBottom);
  padding: ${(props) =>
    props.$hasError ? "var(--editableField-fieldWrapper-padding-error)" : "var(--editableField-fieldWrapper-padding)"};
  ${(props) => props.$hasHint && "padding-bottom: 0;"}
  color: var(--color-midnight);
  width: var(--editableField-fieldWrapper-width);
  align-items: var(--editableField-fieldWrapper-alignItems);
  font-size: var(--editableField-fieldWrapper-fontSize);
  gap: var(--editableField-fieldWrapper-gap);

  label {
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    width: var(--editableField-fieldWrapper-label-width);
    flex-shrink: var(--editableField-fieldWrapper-label-flexShrink);
  }

  > span {
    flex: 1;
  }

  input {
    border-radius: var(--editableField-fieldWrapper-input-borderRadius);
    padding: var(--editableField-fieldWrapper-input-padding);
    color: var(--color-midnight);
    border: var(--editableField-fieldWrapper-input-border);
    flex: 1;
    min-width: 0;
  }
`;

const InputWrapper = styled.div<HasError>`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;

  input,
  textarea {
    border-radius: var(--editableField-fieldWrapper-input-borderRadius);
    padding: var(--editableField-fieldWrapper-input-padding);
    padding-right: var(--editableField-fieldWrapper-input-paddingRight);
    color: var(--color-midnight);
    border: ${(props) =>
      props.$hasError ? "var(--editableField-border-error)" : "var(--editableField-fieldWrapper-input-border)"};
    flex: 1;
    min-width: 0;
    width: 100%;
    font-family: inherit;
    font-size: inherit;

    &:focus {
      outline: none;
      border: ${(props) =>
        props.$hasError ? "var(--editableField-border-error)" : "var(--editableField-border-focus)"};
    }
  }

  textarea {
    resize: vertical;
    min-height: var(--editableField-fieldWrapper-textarea-minHeight);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--editableField-clearButton-padding);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-grey-400);
  transition: color 0.2s;

  &:hover {
    color: var(--color-midnight);
  }
`;

const DropdownWrapper = styled.div`
  position: var(--editableField-dropdownWrapper-position);
  width: var(--editableField-dropdownWrapper-width);
  flex: 1;
`;

const DropdownButton = styled.div<{ $hasError?: boolean }>`
  border: ${(props) =>
    props.$hasError ? "var(--editableField-border-error)" : "var(--editableField-dropdownButton-border)"};
  padding: var(--editableField-dropdownButton-padding);
  border-radius: var(--editableField-dropdownButton-borderRadius);
  cursor: var(--editableField-dropdownButton-cursor);
  color: var(--color-midnight);
  display: var(--editableField-dropdownButton-display);
  justify-content: var(--editableField-dropdownButton-justifyContent);
  align-items: var(--editableField-dropdownButton-alignItems);
  user-select: var(--editableField-dropdownButton-userSelect);
  transition: border 0.2s ease;

  &:focus-within {
    outline: none;
    border: ${(props) => (props.$hasError ? "var(--editableField-border-error)" : "var(--editableField-border-focus)")};
  }
`;

const Arrow = styled(IoIosArrowDown)`
  transition: var(--editableField-arrow-transition);
  transform: var(--editableField-arrow-transform);

  &.open {
    transform: var(--editableField-arrow-open-transform);
  }
`;

const DropdownList = styled.div<{ $direction?: "up" | "down" }>`
  position: var(--editableField-dropdownList-position);
  ${(props) => (props.$direction === "down" ? "var(--editableField-dropdownList-top);" : "bottom: 100%;")};
  left: var(--editableField-dropdownList-left);
  width: var(--editableField-dropdownList-width);
  background: var(--editableField-dropdownList-background);
  border: var(--editableField-dropdownList-border);
  border-radius: var(--editableField-dropdownList-borderRadius);
  padding: var(--editableField-dropdownList-padding);
  z-index: var(--editableField-dropdownList-zIndex);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--editableField-dropdownList-gap);
  max-height: 240px;
  overflow-y: auto;
`;

const OptionRow = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: var(--editableField-optionRow-padding);
  cursor: pointer;
  user-select: none;
  width: 100%;
  border-radius: var(--editableField-optionRow-borderRadius);
  transition: background-color 0.2s ease;
  gap: var(--editableField-optionRow-gap);
  background-color: ${(props) => (props.$isSelected ? "var(--editableField-optionRow-selectedBg)" : "transparent")};

  &:hover {
    background-color: var(--color-orchid-light);
  }

  input[type="checkbox"] {
    width: var(--editableField-optionRow-checkbox-size);
    height: var(--editableField-optionRow-checkbox-size);
    cursor: pointer;
    margin: var(--editableField-optionRow-checkbox-margin);
    flex: var(--editableField-optionRow-checkbox-flex);
    accent-color: var(--editableField-optionRow-checkbox-accentColor);
  }

  input[type="radio"] {
    appearance: var(--editableField-optionRow-radio-appearance);
    width: var(--editableField-optionRow-radio-size);
    height: var(--editableField-optionRow-radio-size);
    border: var(--editableField-optionRow-radio-border);
    border-radius: var(--editableField-optionRow-radio-borderRadius);
    cursor: pointer;
    margin: var(--editableField-optionRow-radio-margin);
    flex: var(--editableField-optionRow-radio-flex);
    position: relative;

    &:checked {
      background-color: var(--editableField-optionRow-radio-checked-bg);
      border-color: var(--editableField-optionRow-radio-checked-borderColor);

      &::after {
        content: "";
        position: absolute;
        width: var(--editableField-optionRow-radio-checkmark-width);
        height: var(--editableField-optionRow-radio-checkmark-height);
        border: var(--editableField-optionRow-radio-checkmark-border);
        border-width: var(--editableField-optionRow-radio-checkmark-borderWidth);
        top: 50%;
        left: 50%;
        transform: var(--editableField-optionRow-radio-checkmark-transform);
      }
    }
  }
`;

const HintWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-8) var(--spacing-16) var(--spacing-8) 0;
  gap: var(--spacing-8);
  padding-left: calc(var(--editableField-fieldWrapper-label-width) + var(--editableField-fieldWrapper-gap));
`;

const HintText = styled.span`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-20);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-grey-500);
  flex: 1;
`;

const Text = styled.span`
  flex: 1;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: break-word;
  cursor: pointer;
  font-size: var(--editableField-text-fontSize);
  color: var(--color-midnight);
`;

const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: var(--editableField-fieldWrapper-input-borderRadius);
  border: var(--editableField-fieldWrapper-input-border);
  overflow: hidden;
  height: var(--form-input-height);
`;

const StepperButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-8) var(--spacing-16);
  color: var(--color-midnight);

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const StepperValue = styled.span`
  min-width: 40px;
  text-align: center;
  font-size: inherit;
  color: var(--color-midnight);
  user-select: none;
`;

type EditableFieldType = "text" | "textarea" | "number" | "stepper" | "checkbox-list" | "radio-list";

export interface EditableFieldRef<T> {
  getValue: () => T;
  validate: () => string | null;
}

interface EditableFieldProps<T = string | number | string[]> {
  mode: "display" | "edit";
  type: EditableFieldType;
  placeholder?: string;
  label?: string;
  value: T;
  setValue: (value: T) => void;
  submit?: (value: T) => void | Promise<void>;
  validator?: (value: T) => string | null;
  options?: string[] | number[];
  errorMessage?: string;
  hint?: string;
  maxLength?: number;
  labels?: string[];
  displayValue?: string;
  isAutocomplete?: boolean;
  dropdownDirection?: "up" | "down";
}

export const EditableField = forwardRef(function EditableField<T extends string | number | string[]>(
  {
    mode,
    type,
    label,
    value,
    setValue,
    submit,
    validator,
    options = [],
    errorMessage,
    placeholder,
    hint,
    maxLength,
    labels,
    displayValue,
    isAutocomplete = false,
    dropdownDirection = "down",
  }: EditableFieldProps<T>,
  ref: React.Ref<EditableFieldRef<T>>,
) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [localValue, setLocalValue] = useState<T>(value);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setLocalValue(value);
    setError(null);
  }, [value]);

  useImperativeHandle(ref, () => ({
    getValue: () => localValue,
    validate: () => {
      if (!validator) return null;
      const validationError = validator(localValue);
      setError(validationError);
      return validationError;
    },
  }));

  const handleCheckboxChange = (option: string) => {
    if (!Array.isArray(localValue)) return;
    let newValue: string[];
    if (localValue.includes(option)) {
      newValue = localValue.filter((v) => v !== option);
    } else {
      newValue = [...localValue, option];
    }
    setLocalValue(newValue as T);
    setValue(newValue as T);
  };

  const handleSubmit = () => {
    submit?.(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (mode === "display") {
    if (type === "checkbox-list" && Array.isArray(value)) {
      const displayValue = value.length > 0 ? value.join(", ") : EMPTY_PLACEHOLDER_VALUE;
      return (
        <FieldWrapper>
          {label && <label>{label}</label>}
          <span>{displayValue}</span>
        </FieldWrapper>
      );
    }
    const displayValue = value && String(value).trim().length > 0 ? value : EMPTY_PLACEHOLDER_VALUE;
    return (
      <FieldWrapper>
        {label && <label>{label}</label>}
        <span>{displayValue}</span>
      </FieldWrapper>
    );
  }

  // edit mode
  return (
    <EditModeWrapper>
      <FieldWrapper $hasError={!!errorMessage} $hasHint={!!hint}>
        {label && <label>{label}</label>}

        {type === "text" && (
          <InputWrapper $hasError={!!errorMessage}>
            <input
              type="text"
              value={localValue}
              placeholder={placeholder}
              onChange={(e) => {
                const v = e.target.value as T;
                setLocalValue(v);
                setValue(v);
              }}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
            />
            {Boolean(localValue) && (
              <ClearButton
                type="button"
                onClick={() => {
                  const v = "" as T;
                  setLocalValue(v);
                  setValue(v);
                }}
              >
                <XCircleIcon size={20} weight="bold" />
              </ClearButton>
            )}
          </InputWrapper>
        )}

        {type === "textarea" && (
          <InputWrapper $hasError={!!errorMessage}>
            <textarea
              value={localValue as string}
              placeholder={placeholder}
              maxLength={maxLength}
              onChange={(e) => {
                const v = e.target.value as T;
                setLocalValue(v);
                setValue(v);
              }}
              onBlur={handleSubmit}
            />
            {Boolean(localValue) && (
              <ClearButton
                type="button"
                onClick={() => {
                  const v = "" as T;
                  setLocalValue(v);
                  setValue(v);
                }}
                style={{ alignSelf: "flex-start", marginTop: "10px" }}
              >
                <XCircleIcon size={20} weight="bold" />
              </ClearButton>
            )}
          </InputWrapper>
        )}

        {type === "number" && (
          <InputWrapper $hasError={!!errorMessage}>
            <input
              type="number"
              value={localValue as number}
              onChange={(e) => {
                const v = e.target.value as T;
                setLocalValue(v);
                setValue(v);
              }}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
            />
            {String(localValue).length > 0 && (
              <ClearButton
                type="button"
                onClick={() => {
                  const v = "" as T;
                  setLocalValue(v);
                  setValue(v);
                }}
              >
                <XCircleIcon size={20} weight="bold" />
              </ClearButton>
            )}
          </InputWrapper>
        )}

        {type === "stepper" && (
          <StepperContainer data-testid="editable-field-stepper">
            <StepperButton
              type="button"
              data-testid="editable-field-stepper-minus"
              disabled={!localValue || Number(localValue) <= 0}
              onClick={() => {
                const v = String(Math.max(0, Number(localValue) - 1)) as T;
                setLocalValue(v);
                setValue(v);
              }}
            >
              <MinusIcon size={16} weight="bold" />
            </StepperButton>
            <StepperValue data-testid="editable-field-stepper-value">{localValue}</StepperValue>
            <StepperButton
              type="button"
              data-testid="editable-field-stepper-plus"
              onClick={() => {
                const v = String(Number(localValue || 0) + 1) as T;
                setLocalValue(v);
                setValue(v);
              }}
            >
              <PlusIcon size={16} weight="bold" />
            </StepperButton>
          </StepperContainer>
        )}

        {(type === "checkbox-list" || type === "radio-list") && (
          <DropdownWrapper ref={wrapperRef}>
            <DropdownButton
              $hasError={!!errorMessage}
              onClick={() => {
                if (isAutocomplete && localValue) setOpen((o) => !o);
                else if (!isAutocomplete) setOpen((o) => !o);
              }}
            >
              {!isAutocomplete ? (
                <>
                  <span>
                    {type === "checkbox-list"
                      ? Array.isArray(localValue) && localValue.length > 0
                        ? localValue.join(", ")
                        : t("dashboard.common.selectOptions")
                      : displayValue || localValue || t("dashboard.common.selectOption")}
                  </span>

                  <Arrow className={open ? "open" : ""} />
                </>
              ) : (
                <InputWrapper>
                  <input
                    type="text"
                    value={localValue}
                    placeholder={placeholder}
                    onChange={(e) => {
                      const v = e.target.value as T;
                      setLocalValue(v);
                      setValue(v);
                      setOpen(true);
                    }}
                    onBlur={handleSubmit}
                    onKeyDown={handleKeyDown}
                    style={{ border: "none", padding: 0 }}
                  />
                  {Boolean(localValue) && (
                    <ClearButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const v = "" as T;
                        setLocalValue(v);
                        setValue(v);
                        setOpen(false);
                      }}
                      style={{ alignSelf: "flex-start", marginTop: "0px", marginRight: "0px" }}
                    >
                      <XCircleIcon size={20} weight="bold" />
                    </ClearButton>
                  )}
                </InputWrapper>
              )}
            </DropdownButton>

            {open && (
              <DropdownList $direction={dropdownDirection}>
                {options.map((option, idx) => {
                  const isSelected =
                    type === "checkbox-list"
                      ? Array.isArray(localValue) && localValue.includes(String(option))
                      : localValue === option;
                  return (
                    <OptionRow
                      key={option}
                      $isSelected={isSelected}
                      onClick={() => {
                        if (type === "checkbox-list") {
                          handleCheckboxChange(String(option));
                        } else {
                          const v = option as T;
                          setLocalValue(v);
                          setValue(v);
                          setOpen(false);
                        }
                      }}
                    >
                      <input
                        type={type === "checkbox-list" ? "checkbox" : "radio"}
                        name={label}
                        value={option}
                        checked={isSelected}
                        onChange={() => {
                          if (type === "checkbox-list") {
                            handleCheckboxChange(String(option));
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Text>{labels && labels.length ? labels[idx] : option}</Text>
                    </OptionRow>
                  );
                })}
              </DropdownList>
            )}
          </DropdownWrapper>
        )}
      </FieldWrapper>
      {error && (
        <p style={{ color: "var(--editableField-error-color)", paddingLeft: "var(--editableField-error-paddingLeft)" }}>
          {error}
        </p>
      )}
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          paddingLeft="calc(var(--editableField-fieldWrapper-label-width) + var(--editableField-fieldWrapper-gap))"
        />
      )}
      {hint && (
        <HintWrapper data-testid="editable-field-hint">
          <HintText>{hint}</HintText>
        </HintWrapper>
      )}
    </EditModeWrapper>
  );
});
