import React, { useState } from 'react';
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
} from '@cloudscape-design/components';
import { useAuth0 } from '@auth0/auth0-react';
import { LensTwoTone } from '@mui/icons-material';
import { BackendAPI, FeedbackType } from '@bpenwell/instantlyanalyze-module';


export const FeedbackModal = () => {
  const backendAPI: BackendAPI = new BackendAPI();
  // Feedback modal states
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.Bug);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackNote, setFeedbackNote] = useState('');

  // NEW states for controlling loading & banner messages
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth0();

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
  
  // Feedback modal
  const openFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
    // Clear banners & fields each time we open
    setSuccessMessage('');
    setErrorMessage('');
  };
  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    // Optionally reset fields
    setFeedbackType(FeedbackType.Bug);
    setFeedbackEmail('');
    setFeedbackNote('');
  };

  // SUBMIT FEEDBACK
  const handleSubmitFeedback = async () => {
    // Clear prior messages
    setSuccessMessage('');
    setErrorMessage('');

    if (!feedbackNote.trim()) {
      setErrorMessage('Please enter a note before submitting.');
      return;
    }
    else if (!feedbackEmail.trim()) {
      setErrorMessage('Please enter your email if a follow-up is needed.');
      return;
    }

    setIsSending(true);
    try {
      let usersName = user?.name;
      if (!user) {
        usersName = 'Unavailable';
        console.warn('User must be authenticated to send feedback email');
      }

      await backendAPI.sendFeedbackEmail(feedbackType, feedbackEmail, feedbackNote, usersName);
      setSuccessMessage('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error sending feedback:', error);
      setErrorMessage('Failed to send feedback. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button onClick={openFeedbackModal}>Report Feedback</Button>
      <Modal
        visible={isFeedbackModalOpen}
        onDismiss={closeFeedbackModal}
        size="medium"
        closeAriaLabel="Close feedback modal"
        header="Send Feedback"
        footer={
          <Box float="right" display="block">
            <Button variant="link" onClick={closeFeedbackModal} disabled={isSending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitFeedback}
              disabled={isSending}
            >
              {isSending ? 'Submitting…' : 'Submit'}
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
    </>
  );
}