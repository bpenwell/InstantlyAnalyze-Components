import React, { useState, useEffect } from 'react';
import { Modal, Button, Checkbox, Input, SpaceBetween, CopyToClipboard } from '@cloudscape-design/components';
import { BackendAPI, IRentalCalculatorData } from '@bpenwell/instantlyanalyze-module';
import { useAuth0 } from '@auth0/auth0-react';

interface ShareModalProps {
  reportData: IRentalCalculatorData;
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
  shareableLink: string;
  onShareableChange: (isShareable: boolean) => void;
}

export const ShareModal: React.FC<ShareModalProps> = (props: ShareModalProps) => {
  const { reportData, reportId, isOpen, onClose, shareableLink, onShareableChange } = props;
  const backendApi = new BackendAPI();
  const [isShareable, setIsShareable] = useState(reportData.isShareable);
  const { user } = useAuth0();

  const handleCheckboxChange = async (event: { detail: { checked: boolean } }) => {
    const newReportData: IRentalCalculatorData = {
      ...reportData,
      isShareable: event.detail.checked
    };
    await backendApi.changeRentalReportSharability(reportId, newReportData, user?.sub);
    setIsShareable(event.detail.checked);
    onShareableChange(event.detail.checked)
  };

  return (
    <Modal
      onDismiss={onClose}
      visible={isOpen}
      closeAriaLabel="Close modal"
      header="Share Report"
    >
      <SpaceBetween size="m">
        <Checkbox onChange={handleCheckboxChange} checked={isShareable}>
          {isShareable ? 'Make this report shareable': 'Report is shareable'}
        </Checkbox>
        {isShareable && (
          <SpaceBetween size="s">
            <Input value={shareableLink} readOnly />
            <CopyToClipboard
                copyButtonText="Copy"
                copyErrorText="Shareable link failed to copy"
                copySuccessText="Shareable link copied"
                textToCopy={shareableLink}
            />
          </SpaceBetween>
        )}
      </SpaceBetween>
    </Modal>
  );
};