import React, { useState, useEffect } from 'react';
import { Modal, Button, Checkbox, Input, SpaceBetween, CopyToClipboard } from '@cloudscape-design/components';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareableLink: string;
  onShareableChange: (isShareable: boolean) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareableLink, onShareableChange }) => {
  const [isShareable, setIsShareable] = useState(false);

  useEffect(() => {
    onShareableChange(isShareable);
  }, [isShareable, onShareableChange]);

  const handleCheckboxChange = (event: { detail: { checked: boolean } }) => {
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