// buyboxOptions.ts
import { ZillowAggregatedDataItem } from "@bpenwell/instantlyanalyze-module";
import { BuyboxOption, FilterInstance, InputType } from "@bpenwell/instantlyanalyze-module";

export const BUYBOX_OPTIONS: BuyboxOption[] = [
  {
    id: "list-price",
    tokens: [
      { type: "text", text: "List price is at least " },
      { type: "input", inputType: InputType.NUMBER_INPUT, defaultValue: 3000 },
      { type: "text", text: " lower than Zestimate" },
    ],
  },
  {
    id: "rent-zestimate",
    tokens: [
      { type: "text", text: "Rent Zestimate is > " },
      { type: "input", inputType: InputType.NUMBER_INPUT, defaultValue: 1.0 },
      { type: "text", text: "% of list price" },
    ],
  },
  {
    id: "beds",
    tokens: [
      { type: "input", inputType: InputType.OPERATION_INPUT },
      { type: "text", text: " " },
      { type: "input", inputType: InputType.NUMBER_INPUT },
      { type: "text", text: " Beds" },
    ],
  },
  {
    id: "baths",
    tokens: [
      { type: "input", inputType: InputType.OPERATION_INPUT },
      { type: "text", text: " " },
      { type: "input", inputType: InputType.NUMBER_INPUT },
      { type: "text", text: " Baths" },
    ],
  },
  {
    id: "sqft",
    tokens: [
      { type: "input", inputType: InputType.OPERATION_INPUT },
      { type: "text", text: " " },
      { type: "input", inputType: InputType.NUMBER_INPUT },
      { type: "text", text: " Sqft" },
    ],
  },
];

// Helper: Evaluate a simple operation.
export const evaluateOperation = (value: number, op: string, numberVal: number): boolean => {
  switch (op) {
    case '<': return value < numberVal;
    case '>': return value > numberVal;
    case '=': return value === numberVal;
    default: return false;
  }
};

// Helper: Evaluate a single buybox filter against a data item.
export const evaluateBuyboxFilter = (filter: FilterInstance, item: ZillowAggregatedDataItem): boolean => {
  switch (filter.option.id) {
    case "list-price": {
      const threshold = Number(filter.inputs[1]);
      return item.zestimate !== undefined && (item.zestimate - item.unformattedPrice >= threshold);
    }
    case "rent-zestimate": {
      const percent = Number(filter.inputs[1]);
      return item.hdpData.homeInfo.rentZestimate !== undefined &&
        (item.hdpData.homeInfo.rentZestimate > item.unformattedPrice * (percent / 100));
    }
    case "beds": {
      const op = filter.inputs[0];
      const num = Number(filter.inputs[2]);
      if (item.beds === undefined) return false;
      return evaluateOperation(item.beds, op, num);
    }
    case "baths": {
      const op = filter.inputs[0];
      const num = Number(filter.inputs[2]);
      if (item.baths === undefined) return false;
      return evaluateOperation(item.baths, op, num);
    }
    case "sqft": {
      const op = filter.inputs[0];
      const num = Number(filter.inputs[2]);
      return evaluateOperation(item.hdpData.homeInfo.livingArea, op, num);
    }
    default:
      return true;
  }
};

// New helper: Determine if an item meets the selected buybox filters.
export const meetsBuyboxCriteria = (buyboxFilters: FilterInstance[], item: ZillowAggregatedDataItem): boolean =>
  buyboxFilters.every(filter => evaluateBuyboxFilter(filter, item));
