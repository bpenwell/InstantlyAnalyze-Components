import React, { useState, useEffect } from 'react';
import { Box, Button, Header, SpaceBetween, Grid } from '@cloudscape-design/components';
import { BackendAPI, getImageSrc, IRentalCalculatorData, PAGE_PATH, printObjectFields, RedirectAPI } from '@bpenwell/instantlyanalyze-module';
import { ShareModal } from '../ShareModal/ShareModal';
import './CalculatorHeader.css';
import { useAuth0 } from '@auth0/auth0-react';

export interface ICalculatorHeaderProps {
  reportId: string;
  initialData: IRentalCalculatorData;
  isShareView: boolean;
}

export const CalculatorHeader: React.FC<ICalculatorHeaderProps> = ({
  reportId,
  initialData,
  isShareView,
}) => {
  const [formData, setFormData] = useState<IRentalCalculatorData>(initialData);
  const [isModified, setIsModified] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const backendAPI = new BackendAPI();
  const redirectAPI = new RedirectAPI();
  const { user } = useAuth0();

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
      await backendAPI.saveUpdatedRentalReport(reportId, initialData, user?.sub);
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
        await backendAPI.deleteRentalReport(reportId, user?.sub);
        alert('Report deleted successfully.');
        redirectAPI.redirectToPage(PAGE_PATH.RENTAL_CALCULATOR_HOME);
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete the report.');
      }
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleShareableChange = (isShareable: boolean) => {
    if (isShareable) {
      const currentUrl = window.location.href;
      const shareableUrl = currentUrl.replace('/view/', '/share/');
      // Generate shareable link (this should be replaced with actual backend logic)
      setShareableLink(shareableUrl);
    } else {
      setShareableLink('');
    }
  };

  return (
    <Box padding={{ vertical: 's', horizontal: 'l' }}>
      <Grid
        gridDefinition={[
          { colspan: { default: 3 } },  // Left column - Image
          { colspan: { default: 2 } },  // Middle column - Address
          { colspan: { default: 7 } },  // Right column - Buttons
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
          { !isShareView ? 
            <SpaceBetween size="s" direction="horizontal">
              <Button variant="normal" onClick={handleShare}>
                Share
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={!isModified}>
                Save
              </Button>
              <Button variant="normal" href={redirectAPI.createRentalCalculatorEditRedirectUrl()}>
                Edit
              </Button>
              <Button variant="normal" onClick={handleDelete}>
                Delete Report
              </Button>
            </SpaceBetween>
            : null
          }
        </div>
      </Grid>

      {/* Share Modal */}
      <ShareModal
        reportId={reportId}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareableLink={shareableLink}
        onShareableChange={handleShareableChange}
      />
    </Box>
  );
};