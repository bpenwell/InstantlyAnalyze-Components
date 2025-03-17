import React, { useState, useEffect } from 'react';
import { Box, Button, Header, SpaceBetween, Grid } from '@cloudscape-design/components';
import { BackendAPI, getImageSrc, IRentalCalculatorData, PAGE_PATH, printObjectFields, RedirectAPI } from '@bpenwell/instantlyanalyze-module';
import { ShareModal } from '../ShareModal/ShareModal';
import './CalculatorHeader.css';
import { useAuth0 } from '@auth0/auth0-react';

export interface ICalculatorHeaderProps {
  reportId: string;
  reportData: IRentalCalculatorData;
  updateInitialReportData: (initialReportData: IRentalCalculatorData) => void;
}

export const CalculatorHeader: React.FC<ICalculatorHeaderProps> = ({
  reportId,
  reportData,
  updateInitialReportData,
}) => {
  /**
   * @param isShareable 
   * @returns '' if isShareable is false. Returns currentUrl with share instead of view if true.
   */
  const getShareableReportLink = (isShareable: boolean): string => {
    if (isShareable) {
      const currentUrl = window.location.href;
      return currentUrl.replace('/view/', '/share/');
    }
    else {
      return '';
    }
  };
  
  const [isModified, setIsModified] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState(getShareableReportLink(reportData.isShareable));
  const backendAPI = new BackendAPI();
  const redirectAPI = new RedirectAPI();
  const { user } = useAuth0();
  const isSharePage = window.location.href.includes('share/');

  const handleSave = async () => {
    try {
      console.debug(`[DEBUG] initialData ${printObjectFields(reportData)}`);
      await backendAPI.saveUpdatedRentalReport(reportId, reportData, user?.sub);
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
        redirectAPI.redirectToPage(PAGE_PATH.RENTAL_CALCULATOR_DASHBOARD);
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete the report.');
      }
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleShareableChange = async (isShareable: boolean) => {
    const linkText = getShareableReportLink(isShareable);
    setShareableLink(linkText);
    if (isShareable) {
      const newReportData: IRentalCalculatorData = {
        ...reportData,
        isShareable: isShareable
      };
      updateInitialReportData(newReportData);
      await backendAPI.saveUpdatedRentalReport(reportId, newReportData, user?.sub);
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
              src={getImageSrc(reportData)}
              alt="Property"
              style={{ width: '100%', borderRadius: '10px' }}
            />
          </Box>
        </div>

        <div className='header-address'>
          <Box>
            <Header variant="h2">
              {reportData.propertyInformation.streetAddress}
            </Header>
            <Header variant="h3">
              {reportData.propertyInformation.city}, {reportData.propertyInformation.state}
            </Header>
          </Box>
        </div>

        {/* Right Column - Buttons */}
        <div className='header-buttons'>
          { !isSharePage ? 
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
            : <h4>Viewing report in share mode</h4>
          }
        </div>
      </Grid>

      {/* Share Modal */}
      <ShareModal
        reportData={reportData}
        reportId={reportId}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareableLink={shareableLink}
        onShareableChange={handleShareableChange}
      />
    </Box>
  );
};