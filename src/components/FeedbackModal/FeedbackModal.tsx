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
  Alert,
  Spinner,
} from '@cloudscape-design/components';

export enum FeedbackType {
  Bug = 'Bug',
  Feature = 'Feature',
}

export function FeedbackModal(props: {
  isOpen: boolean;
  closeFeedbackModal: () => void;
  feedbackType: FeedbackType;
  setFeedbackType: React.Dispatch<React.SetStateAction<FeedbackType>>;
  feedbackEmail: string;
  setFeedbackEmail: React.Dispatch<React.SetStateAction<string>>;
  feedbackNote: string;
  setFeedbackNote: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitFeedback: () => void;

  // NEW props:
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
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
    isLoading,
    successMessage,
    errorMessage,
  } = props;

  // Convert string to Cloudscape "selectedOption".
  const selectedFeedbackOption: SelectProps.Option =
    feedbackType === FeedbackType.Bug
      ? { label: 'Report a Bug', value: FeedbackType.Bug }
      : { label: 'Suggest a Feature', value: FeedbackType.Feature };

  // Callback for feedback type in <Select>
  const onFeedbackTypeChange = (e: any) => {
    const newValue = e.detail.selectedOption.value as FeedbackType;
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
        <Box float="right" display="block">
          <Button variant="link" onClick={closeFeedbackModal} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitFeedback}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting…' : 'Submit'}
          </Button>
        </Box>
      }
    >
      <SpaceBetween size="l">
        {/* If success or error, show an Alert */}
        {successMessage && (
          <Alert statusIconAriaLabel="Success" type="success">
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert statusIconAriaLabel="Error" type="error">
            {errorMessage}
          </Alert>
        )}

        <FormField label="Feedback Type">
          <Select
            selectedOption={selectedFeedbackOption}
            onChange={onFeedbackTypeChange}
            options={[
              { label: 'Report a Bug', value: FeedbackType.Bug },
              { label: 'Suggest a Feature', value: FeedbackType.Feature },
            ]}
          />
        </FormField>

        <FormField label="Email">
          <Input
            value={feedbackEmail}
            onChange={(e) => setFeedbackEmail(e.detail.value)}
            placeholder="you@example.com"
          />
        </FormField>

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