import React from "react";
import {
  Container,
  ColumnLayout,
  SpaceBetween,
  Input,
  Select,
  Button,
  StatusIndicator,
  Box,
  SelectProps,
  NonCancelableCustomEvent
} from "@cloudscape-design/components";
import { FilterInstance, InputType, FilterToken } from "@ben1000240/instantlyanalyze-module";

const operationOptions = [
  { label: "<", value: "<" },
  { label: ">", value: ">" },
  { label: "=", value: "=" },
];

export const BuyboxFilter: React.FC<{
  filter: FilterInstance;
  onInputChange: (instanceId: string, tokenIndex: number, value: string) => void;
  onRemoveFilter: (instanceId: string) => void;
}> = ({
  filter,
  onInputChange,
  onRemoveFilter,
}) => {
  // Determine validity
  const isValid = filter.option.tokens.every((token: FilterToken, idx: number) => {
    if (token.type === "input" && !filter.removedInputs.includes(idx)) {
      const value = filter.inputs[idx];
      if (!value || value.trim() === "") return false;
      if (token.inputType === InputType.NUMBER_INPUT && isNaN(Number(value))) return false;
      if (
        token.inputType === InputType.OPERATION_INPUT &&
        !["<", ">", "="].includes(value)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <Container
      variant="default"
      disableContentPaddings
      /* 
        The Container's header is where we arrange everything on one row.
        We use ColumnLayout with two columns:
          - left column holds the status indicator & input tokens
          - right column holds the close button, right-aligned
      */
      header={
        <ColumnLayout columns={2} borders="none">
          {/* Left column: status indicator + tokens */}
          <SpaceBetween direction="horizontal" size="s" alignItems="center">
            {isValid ? (
              <StatusIndicator type="success">Valid</StatusIndicator>
            ) : (
              <StatusIndicator type="error">Invalid</StatusIndicator>
            )}
            {filter.option.tokens.map((token: FilterToken, index: number) => {
              if (token.type === "text") {
                return <div key={index}>{token.text}</div>;
              }
              if (token.type === "input") {
                // Skip removed inputs
                if (filter.removedInputs.includes(index)) return null;

                if (token.inputType === InputType.NUMBER_INPUT) {
                  return (
                    <Box key={index}>
                      <Input
                        type="number"
                        value={filter.inputs[index] || ""}
                        onChange={(e) =>
                          onInputChange(filter.instanceId, index, e.detail.value)
                        }
                      />
                    </Box>
                  );
                }
                if (token.inputType === InputType.OPERATION_INPUT) {
                  return (
                    <Select
                      key={index}
                      placeholder="Select"
                      selectedOption={{
                        label: filter.inputs[index] || "",
                        value: filter.inputs[index] || "",
                      }}
                      options={operationOptions}
                      onChange={(e: NonCancelableCustomEvent<SelectProps.ChangeDetail>) => {
                        const value = e.detail.selectedOption.value;
                        if (value) {
                          onInputChange(filter.instanceId, index, value);
                        }
                      }}
                    />
                  );
                }
              }
              return null;
            })}
          </SpaceBetween>

          {/* Right column: close button, aligned to the right */}
          <Box textAlign="right">
            <Button
              onClick={() => onRemoveFilter(filter.instanceId)}
              variant="icon"
              iconName="close"
            />
          </Box>
        </ColumnLayout>
      }
    >
      {/* No content here (the container body) unless you want more details below the header */}
    </Container>
  );
};
