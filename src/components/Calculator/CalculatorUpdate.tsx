import React, { useState, useEffect } from 'react';
import {
    IRentalCalculatorData,
    BackendAPI,
    RedirectAPI,
} from '@bpenwell/instantlyanalyze-module';
import './CalculatorUpdate.css'; 
import { Button } from '@cloudscape-design/components';
import { useAuth0 } from '@auth0/auth0-react';

export interface ICalculatorUpdateProps {
    reportId: string;
    initialRentalReportData: IRentalCalculatorData;
}

export const CalculatorUpdate: React.FC<ICalculatorUpdateProps> = ({ reportId, initialRentalReportData }) => {
    const [formData, setFormData] = useState<IRentalCalculatorData>(initialRentalReportData);
    const [isModified, setIsModified] = useState(false);
    const backendAPI = new BackendAPI();
    const redirectAPI = new RedirectAPI();
    const { user } = useAuth0();
    
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
            await backendAPI.saveUpdatedRentalReport(reportId, formData,  true, user?.sub);
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
                await backendAPI.deleteRentalReport(reportId, user?.sub);
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
                <Button
                    className="save-button" 
                    onClick={handleSave} 
                    disabled={!isModified}
                >
                    Save
                </Button>
                <Button
                    className="edit-button" 
                    href={redirectAPI.createRentalCalculatorEditRedirectUrl()}
                >
                    Edit
                </Button>
                <Button 
                    className="delete-button" 
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};