import { IRentalCalculatorData } from "@bpenwell/rei-module";

export interface IRentalCalculatorPageProps {
    currentYearData: IRentalCalculatorData;
    fullLoanTermRentalReportData: IRentalCalculatorData[];
    updateInitialData: (data: IRentalCalculatorData) => void;
}