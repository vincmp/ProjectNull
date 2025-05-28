"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Option {
  value: string;
  label: string;
}

interface ContactTypeaheadInputProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export default function ContactTypeaheadInput({
  options,
  value,
  onChange,
  placeholder = "Selecione ou digite o tipo de contato",
  id = "contactTypeahead",
}: ContactTypeaheadInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    if (newValue) {
      const lowerCaseNewValue = newValue.toLowerCase();
      const newFilteredOptions = options.filter(
        (option) =>
          option.label.toLowerCase().includes(lowerCaseNewValue) ||
          option.value.toLowerCase().includes(lowerCaseNewValue)
      );
      setFilteredOptions(newFilteredOptions);
      setShowSuggestions(true);
    } else {
      setFilteredOptions(options);
      setShowSuggestions(false);
    }
  };

  const handleSelectOption = (option: Option) => {
    setInputValue(option.label);
    onChange(option.value);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    setFilteredOptions(options);
    setShowSuggestions(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        id={id}
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
        autoComplete="off"
      />
      {showSuggestions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelectOption(option)}
              className="p-3 cursor-pointer hover:bg-gray-100 last:rounded-b-xl first:rounded-t-xl"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
