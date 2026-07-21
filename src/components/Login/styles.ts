import styled from "styled-components";

export const EmailSentMessageDiv = styled.div`
  display: flex;
  gap: var(--dashboard-login-forgot-password-email-message-gap);
  align-items: center;
`;

export const EmailButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-login-content-container-gap);
`;

export const FormActions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const LoginButtonDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-16);
`;
