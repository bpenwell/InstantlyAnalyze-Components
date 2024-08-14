import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { IRentalCalculatorPageData } from '../../interfaces';
/*import { Slider } from 'rc-slider';*/
//import 'rc-slider/assets/index.css';
import './RCCustomize.css';

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
        {
            label: 'Cash Flow',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
    ],
};

export const RCCustomize: React.FC<IRentalCalculatorPageData> = (props: IRentalCalculatorPageData) => {
    const rentalIncome = props.currentYearData.rentalIncome.grossMonthlyIncome;

    return (
        <section className='rc-graph'>
          <div className='graph-container'>
            <h2>Test Different Scenarios</h2>
          {/*</div>
            <div className="analysis-report-container">
                <div className="analysis-report-section">
                    <div className="analysis-report-section-header">
                        <h3 className="analysis-report-section-title">Rental income</h3>
                    </div>
                    <div className="analysis-report-section-body">
                        <div className="analysis-report-pie-chart-main">
                            <div className="analysis-report-pie-chart-middle">
                                ${rentalIncome}
                            </div>
                        </div>
                        <div className="analysis-report-slider-container">
                            <span className="analysis-form-label">
                                <span>Rental income</span>
                                <span className="analysis-report-slider-value">${rentalIncome} /month</span>
                            </span>
                            <Slider
                                min={500}
                                max={2000}
                                value={rentalIncome}
                                onChange={(value) => setRentalIncome(value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="analysis-report-section">
                    <div className="analysis-report-section-header">
                        <h3 className="analysis-report-section-title">Expenses</h3>
                    </div>
                    <div className="analysis-report-section-body">
                        <div className="analysis-report-slider-container">
                            <span className="analysis-form-label">
                                <span>Custom expenses</span>
                                <span className="analysis-report-slider-value">${customExpenses} /month</span>
                            </span>
                            <Slider
                                min={0}
                                max={1000}
                                value={customExpenses}
                                onChange={(value) => setCustomExpenses(value)}
                            />
                        </div>
                        <div className="analysis-report-slider-container">
                            <span className="analysis-form-label">
                                <span>Vacancy</span>
                                <span className="analysis-report-slider-value">{vacancy}%</span>
                            </span>
                            <Slider
                                min={0}
                                max={20}
                                value={vacancy}
                                onChange={(value) => setVacancy(value)}
                            />
                        </div>
                        <div className="analysis-report-slider-container">
                            <span className="analysis-form-label">
                                <span>Management fees</span>
                                <span className="analysis-report-slider-value">{managementFees}%</span>
                            </span>
                            <Slider
                                min={0}
                                max={20}
                                value={managementFees}
                                onChange={(value) => setManagementFees(value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="analysis-report-section">
                    <h3 className="analysis-report-section-title">Loan details</h3>
                    <div className="analysis-report-tweakable-section-total">
                        <div className="analysis-report-tweakable-section-total-label">Total cash needed</div>
                        <div className="analysis-report-tweakable-section-total-value">$45,750</div>
                    </div>
                    <div className="analysis-report-slider-container">
                        <span className="analysis-form-label">
                            <span>Purchase price</span>
                            <span className="analysis-report-slider-value">${purchasePrice}</span>
                        </span>
                        <Slider
                            min={97500}
                            max={162500}
                            value={purchasePrice}
                            onChange={(value) => setPurchasePrice(value)}
                        />
                    </div>
                    <div className="analysis-report-slider-container">
                        <span className="analysis-form-label">
                            <span>Loan amount</span>
                            <span className="analysis-report-slider-value">${loanAmount}</span>
                        </span>
                        <Slider
                            min={50000}
                            max={150000}
                            value={loanAmount}
                            onChange={(value) => setLoanAmount(value)}
                        />
                    </div>
                    <div className="analysis-report-slider-container">
                        <span className="analysis-form-label">
                            <span>Loan term</span>
                            <span className="analysis-report-slider-value">{loanTerm} years</span>
                        </span>
                        <Slider
                            min={5}
                            max={30}
                            value={loanTerm}
                            onChange={(value) => setLoanTerm(value)}
                 }       />
                    </div>
                    <div className="analysis-report-slider-container">
                        <span className="analysis-form-label">
                            <span>Interest rate</span>
                            <span className="analysis-report-slider-value">{interestRate}%</span>
                        </span>
                        <Slider
                            min={1}
                            max={10}
                            value={interestRate}
                            onChange={(value) => setInterestRate(value)}
                        />
                    </div>
                </div>*/}
            </div>
        </section>
    );
};
