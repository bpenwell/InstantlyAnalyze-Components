import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Modal,
  Input,
  ButtonGroup
} from "@cloudscape-design/components";
import { CustomDropdown } from "./CustomDropdown";
import { BuyboxFilter } from "./BuyboxFilter";
import { BUYBOX_OPTIONS } from "./constants";
import { BuyboxOption, FilterInstance, InputType, IZillowBuyboxSet } from "@bpenwell/instantlyanalyze-module";
import { useAppContext } from "../../utils/AppContextProvider";

interface BuyboxFilterBuilderProps {
  setSelectedBuyboxFilters: (validFilters: FilterInstance[]) => void;
}

export const BuyboxFilterBuilder: React.FC<BuyboxFilterBuilderProps> = ({
  setSelectedBuyboxFilters,
}) => {
  const [filters, setFilters] = useState<FilterInstance[]>([]);
  const { getZillowBuyBoxSetsPreference, setBuyBoxSetsPreference } = useAppContext();
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [setName, setSetName] = useState("");

  // Store saved sets locally so they persist between renders
  const [buyBoxSets, setBuyBoxSets] = useState<IZillowBuyboxSet[]>(() => getZillowBuyBoxSetsPreference());

  useEffect(() => {
    // If your context updates the preference externally, you can sync here if needed.
    // For now, we're relying on our local state.
  }, []);

  const addFilter = (option: BuyboxOption) => {
    const newFilter: FilterInstance = {
      instanceId: Date.now().toString(),
      option,
      inputs: {},
      removedInputs: [],
    };

    option.tokens.forEach((token, index) => {
      if (token.type === "input" && token.defaultValue !== undefined) {
        newFilter.inputs[index] = token.defaultValue.toString();
      }
    });

    setFilters((prev) => [...prev, newFilter]);
  };

  const handleInputChange = (
    instanceId: string,
    tokenIndex: number,
    value: string
  ) => {
    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.instanceId === instanceId) {
          return {
            ...filter,
            inputs: { ...filter.inputs, [tokenIndex]: value },
          };
        }
        return filter;
      })
    );
  };

  const removeFilter = (instanceId: string) => {
    setFilters((prev) => prev.filter((filter) => filter.instanceId !== instanceId));
  };

  // Memoize the validFilters array to prevent unnecessary re-renders.
  const validFilters = useMemo(() => {
    return filters.filter((filter) =>
      filter.option.tokens.every((token, index) => {
        if (token.type === "input" && !filter.removedInputs.includes(index)) {
          const value = filter.inputs[index];
          if (!value || value.trim() === "") return false;
          if (token.inputType === InputType.NUMBER_INPUT && isNaN(Number(value))) return false;
          if (token.inputType === InputType.OPERATION_INPUT && !["<", ">", "="].includes(value)) return false;
        }
        return true;
      })
    );
  }, [filters]);

  // Whenever validFilters changes, update the parent component.
  useEffect(() => {
    setSelectedBuyboxFilters(validFilters);
  }, [validFilters, setSelectedBuyboxFilters]);

  const handleSetSelection = (index: number) => {
    setSelectedSetIndex(index);
    setFilters(buyBoxSets[index].filters); // Load the filter set details
  };

  const handleDeleteSet = (index: number) => {
    const updatedSets = buyBoxSets.filter((_, i) => i !== index);
    // Update both context and local state
    setBuyBoxSetsPreference(updatedSets);
    setBuyBoxSets(updatedSets);
    if (selectedSetIndex === index) {
      setFilters([]);
      setSelectedSetIndex(null);
    }
  };

  const handleSaveSet = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (setName.trim() === "") return;
    const newSet: IZillowBuyboxSet = {
      name: setName.trim(),
      filters: validFilters,
    };
    const newSets = [...buyBoxSets, newSet];
    // Update both context and local state
    setBuyBoxSetsPreference(newSets);
    setBuyBoxSets(newSets);
    setIsModalOpen(false);
    setSetName("");
  };

  const handleCancelSave = () => {
    setIsModalOpen(false);
    setSetName("");
  };

  const setAlreadyExists = buyBoxSets.some((set: IZillowBuyboxSet) => {
    if (set.filters.length !== validFilters.length) return false;
    return set.filters.every((filter, index) => filter === validFilters[index]);
  });

  return (
    <SpaceBetween size="s">
      {/* Saved sets */}
      <Container header={<Header variant="h2">Saved Buybox Sets</Header>}>
        {buyBoxSets.length === 0 ? (
          <div>No saved sets yet</div>
        ) : (
          <SpaceBetween direction="horizontal" size="s">
            {buyBoxSets.map((set, index) => (
              <SpaceBetween key={index} direction="horizontal" size="s">
                <Button variant="normal" onClick={() => handleSetSelection(index)}>
                  {set.name}
                </Button>
                <ButtonGroup
                  onItemClick={({ detail }) =>
                    ["remove"].includes(detail.id) && handleDeleteSet(index)
                  }
                  ariaLabel="Set actions"
                  items={[
                    {
                      type: "icon-button",
                      id: "remove",
                      iconName: "remove",
                      text: "Remove",
                    },
                  ]}
                  variant="icon"
                />
              </SpaceBetween>
            ))}
          </SpaceBetween>
        )}
      </Container>
      {/* Filter builder */}
      <SpaceBetween size="s">
        <CustomDropdown options={BUYBOX_OPTIONS} onSelect={addFilter} />
        {filters.map((filter) => (
          <BuyboxFilter
            key={filter.instanceId}
            filter={filter}
            onInputChange={handleInputChange}
            onRemoveFilter={removeFilter}
          />
        ))}
      </SpaceBetween>

      {/* Save button */}
      <Button
        onClick={handleSaveSet}
        disabled={validFilters.length === 0 || setAlreadyExists}
      >
        Save Current Buybox Selection
      </Button>

      {/* Confirmation Modal */}
      <Modal
        visible={isModalOpen}
        onDismiss={handleCancelSave}
        closeAriaLabel="Close modal"
        header="Save Buybox Set"
        footer={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={handleCancelSave}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSave}
              disabled={setName.trim() === ""}
              variant="primary"
            >
              Confirm
            </Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="s">
          <h4>Selected Filters:</h4>
          <ul>
            {validFilters.map((filter) => (
              <li key={filter.instanceId}>
                {filter.option.tokens
                  .map((token, index) =>
                    token.type === "text" ? token.text : `[${filter.inputs[index]}]`
                  )
                  .join("")}
              </li>
            ))}
          </ul> 
          <Input
            value={setName}
            onChange={(e) => setSetName(e.detail.value)}
            placeholder="Enter Set Name"
          />
        </SpaceBetween>
      </Modal>
    </SpaceBetween>
  );
};