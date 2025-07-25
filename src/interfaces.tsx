import { IRentalCalculatorData } from "@ben1000240/instantlyanalyze-module";

export interface IRentalCalculatorPageProps {
    currentYear: number;
    currentYearData: IRentalCalculatorData;
    fullLoanTermRentalReportData: IRentalCalculatorData[];
    //Should just be fullLoanTermRentalReportData[0]
    initialRentalReportData: IRentalCalculatorData;
    updateInitialData: (data: IRentalCalculatorData) => void;
    reportId: string;
}