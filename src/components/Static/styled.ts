import Image from "next/image";
import styled from "styled-components";

export const Container = styled.div`
  color: var(--color-midnight);
  font-family: Figtree, sans-serif;
  font-size: 20px;
  line-height: 24px;
  margin-inline: auto;
  max-width: 880px;
  padding-block: clamp(48px, 8vw, 100px);
  padding-inline: clamp(24px, 8vw, 120px);
  width: 100%;

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 22px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
    line-height: 21px;
  }
`;

export const Heading = styled.h2`
  color: var(--color-midnight);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 600;
  letter-spacing: 0.1px;
  line-height: normal;
  margin: 0 0 48px;

  @media (max-width: 480px) {
    margin: 0 0 32px;
  }
`;

export const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 32px;
  }

  @media (max-width: 480px) {
    gap: 24px;
  }
`;

export const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

export const SubHeading = styled.h3`
  color: var(--color-midnight);
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 600;
  letter-spacing: 0.1px;
  line-height: normal;
  margin: 24px 0 0;
`;

export const SectionHeader = styled.p`
  font-weight: 700;
  letter-spacing: 0.1px;
  margin: 0;
`;

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const QuestionRow = styled.div`
  align-items: center;
  display: flex;
  gap: 16px;
`;

export const Badge = styled.span`
  align-items: center;
  background-color: var(--color-orchid);
  border-radius: 16.571px;
  display: flex;
  flex-shrink: 0;
  font-size: 15.75px;
  font-weight: 600;
  height: 28px;
  justify-content: center;
  width: 28px;
`;

export const ItemTitle = styled.span`
  font-weight: 400;
  letter-spacing: 0.1px;
`;

export const AnswerRow = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 16px;
  padding-left: 44px;

  @media (max-width: 480px) {
    padding-left: 32px;
  }
`;

export const DashContainer = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  width: 28px;
`;

export const Dash = styled.span`
  background-color: #f2b1ff;
  display: block;
  height: 1.5px;
  width: 16px;
`;

export const ItemBody = styled.span`
  flex: 1;
  letter-spacing: 0.1px;
`;

export const BulletList = styled.ul`
  flex: 1;
  letter-spacing: 0.1px;
  margin: 0;
  padding-left: 20px;

  li + li {
    margin-top: 4px;
  }
`;

export const NoteText = styled.p`
  letter-spacing: 0.1px;
  margin: 0;
`;

export const Photo = styled(Image)`
  border-radius: 16px;
  height: auto;
  max-width: 480px;
  width: 100%;
`;

export const TextLink = styled.a`
  color: var(--color-aubergine);
  font-weight: 600;
  text-decoration: underline;
`;
