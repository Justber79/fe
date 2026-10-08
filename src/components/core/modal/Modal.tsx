"use client";

import React, { createContext, useContext, useRef, useCallback, useEffect, ReactNode } from "react";
import styled from "styled-components";
import useOutsideClick from "@/hooks/useOutsideClick";

interface ModalContextType {
  close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a Modal component");
  }
  return context;
};

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-dimmed-background);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  /* Block interaction with background content */
  pointer-events: auto;
`;

const ModalContent = styled.div`
  background-color: var(--color-white);
  border-radius: var(--card-border-radius);
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--n4d-box-shadow);
  width: 100%;
  padding: 24px;
  /* Ensure modal content can receive events */
  pointer-events: auto;
  /* Ensure modal can receive focus */
  outline: none;

  @media (min-width: 768px) {
    padding: 32px;
    max-width: 600px;
  }

  @media (min-width: 1440px) {
    padding: 40px;
    max-width: 800px;
  }
`;

interface ModalProps {
  children: ReactNode | ((close: () => void) => ReactNode);
  isOpen: boolean;
  onClose: () => void;
  closeOnOutsideClick?: boolean;
}

export function Modal({ children, isOpen, onClose, closeOnOutsideClick = true }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const handleOutsideClick = useCallback(() => {
    if (closeOnOutsideClick && isOpen) {
      onClose();
    }
  }, [closeOnOutsideClick, isOpen, onClose]);

  useOutsideClick({
    ref: modalRef as React.RefObject<HTMLElement>,
    handler: handleOutsideClick,
  });

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!modalRef.current) return [];

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    return Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors));
  }, []);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modalElement = modalRef.current;
    const focusableElements = getFocusableElements();

    previousActiveElementRef.current = document.activeElement as HTMLElement;

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      modalElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      if (focusableElements.length === 0) {
        e.preventDefault();
        modalElement.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement || document.activeElement === modalElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose, getFocusableElements]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const close = () => {
    onClose();
  };

  const contextValue: ModalContextType = {
    close,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      <Overlay $isOpen={isOpen}>
        <ModalContent ref={modalRef} tabIndex={-1}>
          {typeof children === "function" ? children(close) : children}
        </ModalContent>
      </Overlay>
    </ModalContext.Provider>
  );
}

export default Modal;
