import styled from "styled-components";

export const EmailSentMessageDiv = styled.div`
  display: flex;
  gap: var(--dashboard-login-forgot-password-email-message-gap);
  align-items: center;
`;

export const EmailButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: var(--spacing-12);
  }
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

  @media (max-width: 480px) {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--spacing-12);
  }
`;

export const LoginButtonDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-16);
`;
