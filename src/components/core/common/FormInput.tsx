import { Paragraph } from "@/components/styled/text";
import { EyeIcon, EyeSlashIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { ValidationError } from "@tanstack/react-form";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const FormInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorMessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--form-input-error-message-container-gap);
  padding: var(--form-input-error-message-container-padding);
`;

interface StyledInputProps {
  type: string;
  width?: string;
  $backgroundColor?: string;
  $errorsExist?: boolean;
  $hasToggle?: boolean;
}

const StyledInput = styled.input<StyledInputProps>`
  color: var(--color-midnight);
  font-size: var(--form-input-fontSize);
  height: var(--form-input-container-height);
  width: ${(props) => props.width || "-webkit-fill-available"};
  background-color: ${(props) => props.$backgroundColor || "var(--color-white)"};
  border-radius: var(--form-input-container-border-radius);
  padding: var(--form-input-container-padding);
  ${(props) => props.$hasToggle && "padding-right: 48px;"}
  border: ${(props) => `var(--form-input-container-border${props.$errorsExist ? "-error" : ""})`};

  &:focus {
    outline: none;
    border: var(--form-input-container-border-focus);
  }
`;

const InputRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-midnight);
`;

interface Props {
  type?: string;
  placeHolder?: string;
  onInputChange: (input: string) => void;
  width?: string;
  backgroundColor?: string;
  value?: string;
  errors?: ValidationError[];
}

export function FormInput({
  placeHolder = "Input",
  value = "",
  type = "input",
  onInputChange,
  width,
  backgroundColor,
  errors,
}: Props) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };

  const errorsExist = errors && errors.length > 0;
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <FormInputContainer>
      <InputRow>
        <StyledInput
          placeholder={placeHolder}
          value={value}
          onChange={handleInputChange}
          type={inputType}
          width={width}
          $backgroundColor={backgroundColor}
          $errorsExist={errorsExist}
          $hasToggle={isPassword}
        />
        {isPassword && (
          <ToggleButton
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={t(showPassword ? "formInput.hidePassword" : "formInput.showPassword")}
          >
            {showPassword ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
          </ToggleButton>
        )}
      </InputRow>

      {errorsExist &&
        errors.map((error) => (
          <ErrorMessageContainer key={`${error}`}>
            <WarningCircleIcon size={20} color="var(--form-input-error-message-color)" />
            <Paragraph
              color="var(--form-input-error-message-color)"
              fontSize="var(--form-input-error-message-fontSize)"
              fontWeight="var(--form-input-error-message-fontWeight)"
              lineheight="var(--form-input-error-message-lineHeight)"
            >
              {error}
            </Paragraph>
          </ErrorMessageContainer>
        ))}
    </FormInputContainer>
  );
}

export default FormInput;
