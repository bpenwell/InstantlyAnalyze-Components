import React, { useState, useEffect } from 'react';
import { Box, Button, Header, SpaceBetween, Grid, Textarea } from '@cloudscape-design/components';
import { BackendAPI, getImageSrc, IRentalCalculatorData, PAGE_PATH, printObjectFields, RedirectAPI } from '@bpenwell/rei-module';
import './CalculatorHeader.css';

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

    // Then modify the return section:
    return (
    <Box padding={{ vertical: 's', horizontal: 'l' }}>
        <Grid
        gridDefinition={[
            { colspan: { default: 4, xs: 12, s: 4 } },  // Left column - Image
            { colspan: { default: 4, xs: 12, s: 4 } },  // Middle column - Address
            { colspan: { default: 4, xs: 12, s: 4 } },  // Right column - Buttons
            { colspan: { default: 12, xs: 12, s: 12 } },  // Text input spanning middle and right
        ]}
        >
        {/* Left Column - Image */}
        <div className='header-box'>
            <Box>
            <img
                src={getImageSrc(initialData)}
                alt="Property"
                style={{ width: '100%', borderRadius: '10px' }}
            />
            </Box>
        </div>

        <div className='header-address'>
            <Box>
                <Header variant="h2">
                {initialData.propertyInformation.streetAddress}
                </Header>
                <Header variant="h3">
                {initialData.propertyInformation.city}, {initialData.propertyInformation.state}
                </Header>
            </Box>
        </div>

        {/* Right Column - Buttons */}
        <div className='header-buttons'>
            <SpaceBetween size="s" direction="horizontal">
                <Button variant="primary" onClick={handleSave} disabled={!isModified}>
                    Save
                </Button>
                <Button variant="normal" onClick={handleDelete}>
                    Delete Report
                </Button>
            </SpaceBetween>
        </div>

        {/* Text input spanning middle and right columns */}
        <Box>
            <Header variant="h2">
                Advice from your eAgent
            </Header>
            
            <Textarea
                value="This deal is quite difficult to make work"
                /*onChange={({ detail }) => setStreamedText(detail.value)}*/
                rows={10}
                readOnly
                placeholder="AI response will appear here..."
                spellcheck={false}
                /*style={{ fontFamily: 'monospace' }}*/s
                />
        </Box>
        </Grid>
    </Box>
    );
}