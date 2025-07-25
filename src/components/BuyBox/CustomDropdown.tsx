import React from "react";
import { Select, SelectProps } from "@cloudscape-design/components";
import { BuyboxOption, InputType } from "@ben1000240/instantlyanalyze-module";

export const CustomDropdown: React.FC<{
  options: BuyboxOption[];
  onSelect: (option: BuyboxOption) => void;
}> = ({ options, onSelect }) => {
  const selectOptions: SelectProps.Option[] = options.map((option) => ({
    label: option.tokens
      .map((token) =>
        token.type === "text"
          ? token.text
          : "[INPUT]"
      )
      .join(""),
    value: option.id,
  }));

  const handleChange = (e: any) => {
    const selectedId = e.detail.selectedOption.value;
    const option = options.find((opt) => opt.id === selectedId);
    if (option) {
      onSelect(option);
    }
  };

  return (
    <Select
      placeholder="Select a filter..."
      options={selectOptions}
      onChange={handleChange}
      selectedOption={null}
    />
  );
};