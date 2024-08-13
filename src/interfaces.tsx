import { IRentalCalculatorData } from "@bpenwell/rei-module";

export interface IRentalCalculatorPageData {
    currentYearData: IRentalCalculatorData;
    updateInitialData?: (data: IRentalCalculatorData) => void;
}