import React, { useState, useEffect } from 'react';
import './CalculatorHeader.css'; // Import the new CSS file
import { BackendAPI, getImageSrc, IRentalCalculatorData, PAGE_PATH, printObjectFields, RedirectAPI } from '@bpenwell/rei-module';

export interface ICalculatorHeaderProps {
    reportId: string;
    initialData: IRentalCalculatorData;
}

export const CalculatorHeader: React.FC<ICalculatorHeaderProps> = ({
    reportId,
    initialData,
}) => {
    const [formData, setFormData] = useState<IRentalCalculatorData>(initialData);
    const [isModified, setIsModified] = useState(false);
    const backendAPI = new BackendAPI();
    const redirectAPI = new RedirectAPI();

    useEffect(() => {
        setIsModified(JSON.stringify(formData) !== JSON.stringify(initialData));
    }, [formData, initialData]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            console.debug(`[DEBUG] initialData ${printObjectFields(initialData)}`);
            await backendAPI.saveUpdatedRentalReport(reportId, initialData);
            alert('Report saved successfully.');
            setIsModified(false);
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
                redirectAPI.redirectToPage(PAGE_PATH.RENTAL_CALCULATOR_HOME);
            } catch (error) {
                console.error('Error deleting report:', error);
                alert('Failed to delete the report.');
            }
        }
    };

    return (
        <div className="combined-container">
            <div className="image-container">
                <img src={getImageSrc(initialData) } alt="Property" className='image-property' />
            </div>
            <div className="address-container">
                <h2 className="text-3xl font-bold">{initialData.propertyInformation.streetAddress}</h2>
                <h3 className="text-xl font-bold">{initialData.propertyInformation.city}, {initialData.propertyInformation.state}</h3>
            </div>
            <div className="buttons-container">
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
                    Delete Report
                </button>
            </div>
        </div>
    );
};
