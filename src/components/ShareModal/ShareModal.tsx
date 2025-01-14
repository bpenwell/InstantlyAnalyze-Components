import React, { useState, useEffect } from 'react';
import { Modal, Button, Checkbox, Input, SpaceBetween, CopyToClipboard } from '@cloudscape-design/components';
import { BackendAPI } from '@bpenwell/instantlyanalyze-module';
import { useAuth0 } from '@auth0/auth0-react';

interface ShareModalProps {
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
  shareableLink: string;
  onShareableChange: (isShareable: boolean) => void;
}

export const ShareModal: React.FC<ShareModalProps> = (props: ShareModalProps) => {
  const { reportId, isOpen, onClose, shareableLink, onShareableChange } = props;
  const backendApi = new BackendAPI();
  const [isShareable, setIsShareable] = useState(false);
  const { user } = useAuth0();
  
  useEffect(() => {
    onShareableChange(isShareable);
  }, [isShareable, onShareableChange]);

  const handleCheckboxChange = async (event: { detail: { checked: boolean } }) => {
    await backendApi.changeRentalReportSharability(reportId, event.detail.checked, user?.sub);
    setIsShareable(event.detail.checked);
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
          Make this report sharable
        </Checkbox>
        {isShareable && (
          <SpaceBetween size="s">
            <Input value={shareableLink} readOnly />
            <CopyToClipboard
                copyButtonText="Copy"
                copyErrorText="Sharable link failed to copy"
                copySuccessText="Sharable link copied"
                textToCopy={shareableLink}
            />
          </SpaceBetween>
        )}
      </SpaceBetween>
    </Modal>
  );
};