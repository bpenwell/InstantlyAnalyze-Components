import React, { useState, useEffect } from 'react';
import {
    IRentalCalculatorData,
    BackendAPI,
} from '@bpenwell/rei-module';
import './CalculatorUpdate.css'; 

export interface ICalculatorUpdateProps {
    reportId: string;
    initialRentalReportData: IRentalCalculatorData;
}

export const CalculatorUpdate: React.FC<ICalculatorUpdateProps> = ({ reportId, initialRentalReportData }) => {
    const [formData, setFormData] = useState<IRentalCalculatorData>(initialRentalReportData);
    const [isModified, setIsModified] = useState(false);
    const backendAPI = new BackendAPI();

    useEffect(() => {
        // Compare initial data with current formData to determine if modifications have been made
        setIsModified(JSON.stringify(formData) !== JSON.stringify(initialRentalReportData));
    }, [formData, initialRentalReportData]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value, // Dynamically set the form field
        });
    };

    const handleSave = async () => {
        try {
            await backendAPI.saveUpdatedRentalReport(reportId, formData);
            alert('Report saved successfully.');
            setIsModified(false); // Reset the modification flag after saving
        } catch (error) {
            console.error('Error saving report:', error);
            alert('Failed to save the report.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                await backendAPI.deleteRentalReport(reportId);
                alert('Report deleted successfully.');
                // Optionally redirect or take further action after deletion
            } catch (error) {
                console.error('Error deleting report:', error);
                alert('Failed to delete the report.');
            }
        }
    };

    return (
        <div className="calculator-update-container">
            <div className="calculator-update-buttons">
                <button 
                    className="save-button" 
                    onClick={handleSave} 
                    disabled={!isModified}
                >
                    Save
                </button>
                <button 
                    className="delete-button" 
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};