"use client";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface SearchContainerProps {
  width?: string;
  $backgroundColor?: string;
}

const SearchContainer = styled.div<SearchContainerProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: var(--search-container-height);
  width: ${(props) => props.width || "-webkit-fill-available"};
  background-color: ${(props) => props.$backgroundColor || "var(--color-white)"};
  border-radius: var(--search-container-border-radius);
  align-items: center;
  padding: var(--search-container-padding);
  cursor: text;
`;

const StyledInput = styled.input`
  font-size: var(--search-input-font-size);
  border: none;
  background: transparent;

  &:focus {
    outline: none;
  }
`;

interface Props {
  placeHolder?: string;
  onInputChange: (input: string) => void;
  width?: string;
  backgroundColor?: string;
  debounceTime?: number;
  value?: string;
}

export function Search({
  placeHolder = "Search",
  value = "",
  onInputChange,
  width,
  backgroundColor,
  debounceTime = 500,
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use useCallback to ensure the debounced function is stable
  const debouncedOnInputChange = useCallback(
    (value: string) => {
      // Clear the previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout
      const id = setTimeout(() => {
        onInputChange(value);
      }, debounceTime);

      // Store the new timeout ID
      timeoutRef.current = id;
    },
    [debounceTime, onInputChange],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedOnInputChange(newValue);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Cleanup the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <SearchContainer width={width} $backgroundColor={backgroundColor} onClick={() => inputRef.current?.focus()}>
      <StyledInput ref={inputRef} placeholder={placeHolder} value={inputValue} onChange={handleInputChange} />
      <MagnifyingGlassIcon size={32} />
    </SearchContainer>
  );
}

export default Search;
