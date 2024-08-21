import { IRentalCalculatorData } from "@bpenwell/rei-module";

export interface IRentalCalculatorPageProps {
    currentYearData: IRentalCalculatorData;
    fullLoanTermRentalReportData: IRentalCalculatorData[];
    //Should just be fullLoanTermRentalReportData[0]
    initialRentalReportData: IRentalCalculatorData;
    updateInitialData: (data: IRentalCalculatorData) => void;
}