import React from 'react';
import {
  Modal,
  Box,
  Button,
  SpaceBetween,
  FormField,
  Input,
  Select,
  SelectProps,
  Textarea,
} from '@cloudscape-design/components';

export function FeedbackModal(props: {
  isOpen: boolean;
  closeFeedbackModal: () => void;
  feedbackType: 'bug' | 'feature';
  setFeedbackType: React.Dispatch<React.SetStateAction<'bug' | 'feature'>>;
  feedbackEmail: string;
  setFeedbackEmail: React.Dispatch<React.SetStateAction<string>>;
  feedbackNote: string;
  setFeedbackNote: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitFeedback: () => void;
}) {
  const {
    isOpen,
    closeFeedbackModal,
    feedbackType,
    setFeedbackType,
    feedbackEmail,
    setFeedbackEmail,
    feedbackNote,
    setFeedbackNote,
    handleSubmitFeedback,
  } = props;

  // Convert string to Cloudscape "selectedOption".
  const selectedFeedbackOption: SelectProps.Option =
    feedbackType === 'bug'
      ? { label: 'Report a Bug', value: 'bug' }
      : { label: 'Suggest a Feature', value: 'feature' };

  // Callback for selecting feedback type in <Select>
  const onFeedbackTypeChange = (e: any) => {
    const newValue = e.detail.selectedOption.value as 'bug' | 'feature';
    setFeedbackType(newValue);
  };

  return (
    <Modal
      visible={isOpen}
      onDismiss={closeFeedbackModal}
      size="medium"
      closeAriaLabel="Close feedback modal"
      header="Send Feedback"
      footer={
        <Box float="right">
          <Button variant="link" onClick={closeFeedbackModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitFeedback}>
            Submit
          </Button>
        </Box>
      }
    >
      <SpaceBetween size="l">
        {/* Feedback Type dropdown */}
        <FormField label="Feedback Type">
          <Select
            selectedOption={selectedFeedbackOption}
            onChange={onFeedbackTypeChange}
            options={[
              { label: 'Report a Bug', value: 'bug' },
              { label: 'Suggest a Feature', value: 'feature' },
            ]}
          />
        </FormField>

        {/* Email (optional) */}
        <FormField label="Email (optional)">
          <Input
            value={feedbackEmail}
            onChange={(e) => setFeedbackEmail(e.detail.value)}
            placeholder="you@example.com"
          />
        </FormField>

        {/* Note to Developer (multiline) */}
        <FormField label="Note to Developer">
          <Textarea
            value={feedbackNote}
            onChange={(e) => setFeedbackNote(e.detail.value)}
            placeholder="Describe your feedback..."
            rows={3}
          />
        </FormField>
      </SpaceBetween>
    </Modal>
  );
}