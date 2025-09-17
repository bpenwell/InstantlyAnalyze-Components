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

interface FeedbackModalProps {
  visible: boolean;
  onDismiss: () => void;
  feedbackType?: FeedbackType;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  visible, 
  onDismiss, 
  feedbackType: initialFeedbackType = FeedbackType.Bug 
}) => {
  const backendAPI: BackendAPI = new BackendAPI();
  // Feedback modal states
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(initialFeedbackType);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [friendEmail, setFriendEmail] = useState(''); // New field for referral
  const [friendInfo, setFriendInfo] = useState(''); // New field for referral

  // NEW states for controlling loading & banner messages
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth0();

  // Convert string to Cloudscape "selectedOption".
  const selectedFeedbackOption: SelectProps.Option =
    feedbackType === FeedbackType.Bug
      ? { label: 'Report a Bug', value: FeedbackType.Bug }
      : feedbackType === FeedbackType.Feature
      ? { label: 'Suggest a Feature', value: FeedbackType.Feature }
      : feedbackType === FeedbackType.ContactUs
      ? { label: 'Contact Us', value: FeedbackType.ContactUs }
      : { label: 'Register a Referral', value: FeedbackType.Referral };

  // Callback for feedback type in <Select>
  const onFeedbackTypeChange = (e: any) => {
    const newValue = e.detail.selectedOption.value as FeedbackType;
    setFeedbackType(newValue);
  };
  
  // Reset form when modal closes
  const handleDismiss = () => {
    setFeedbackType(initialFeedbackType);
    setFeedbackEmail('');
    setFeedbackNote('');
    setFriendEmail('');
    setFriendInfo('');
    setSuccessMessage('');
    setErrorMessage('');
    onDismiss();
  };

  // SUBMIT FEEDBACK
  const handleSubmitFeedback = async () => {
    // Clear prior messages
    setSuccessMessage('');
    setErrorMessage('');

    // Validation based on feedback type
    if (feedbackType === FeedbackType.Referral) {
      if (!feedbackEmail.trim() || !friendEmail.trim() || !friendInfo.trim()) {
        setErrorMessage('Please provide your email, friend\'s email/identifier, and identifying information.');
        return;
      }
    } else {
      if (!feedbackEmail.trim() || !feedbackNote.trim()) {
        setErrorMessage('Please provide your email and message.');
        return;
      }
    }

    setIsSending(true);
    try {
      let userId = user?.sub;
      if (!user) {
        userId = 'Unavailable';
        console.warn('User must be authenticated to send feedback email');
      }

      // Format the message based on feedback type
      let message = feedbackNote;
      if (feedbackType === FeedbackType.Referral) {
        message = `Referral Registration Request:
        
Friend's Email: ${friendEmail}
Friend's Identifying Information: ${friendInfo}
Referrer's Email: ${feedbackEmail || user?.email || 'Not provided'}
Referrer's User ID: ${userId}

Please apply a $20 credit to the referrer's account after verifying the friend's subscription.`;
      }

      await backendAPI.sendFeedbackEmail(feedbackType, feedbackEmail, message, userId);
      setSuccessMessage(
        feedbackType === FeedbackType.Referral 
          ? 'Referral registration submitted successfully! You\'ll receive a confirmation email once the credit is applied.'
          : 'Your message has been submitted successfully! We\'ll get back to you soon.'
      );
      
      // Reset form after successful submission
      setTimeout(() => {
        handleDismiss();
      }, 2000);
    } catch (error) {
      console.error('Error sending feedback:', error);
      setErrorMessage('Failed to send feedback. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleDismiss}
      size="medium"
      closeAriaLabel="Close modal"
      header={feedbackType === FeedbackType.Referral ? "Register a Referral" : "Contact Us"}
      footer={
        <Box float="right" display="block">
          <Button variant="link" onClick={handleDismiss} disabled={isSending}>
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
              { label: 'Contact Us', value: FeedbackType.ContactUs },
              { label: 'Register a Referral', value: FeedbackType.Referral },
            ]}
          />
        </FormField>

        <FormField label="Your Email" description="Required for follow-up communication">
          <Input
            value={feedbackEmail}
            onChange={(e) => setFeedbackEmail(e.detail.value)}
            placeholder="your.email@example.com"
            type="email"
          />
        </FormField>

        {/* Referral-specific fields */}
        {feedbackType === FeedbackType.Referral && (
          <>
            <FormField label="Friend's Email/Identifier" description="Email or identifying information of the person who subscribed">
              <Input
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.detail.value)}
                placeholder="friend@example.com or their name"
                type="email"
              />
            </FormField>
            
            <FormField 
              label="Friend's Identifying Information" 
              description="Any additional info to help us identify your friend (name, subscription date, etc.)"
            >
              <Textarea
                value={friendInfo}
                onChange={(e) => setFriendInfo(e.detail.value)}
                placeholder="e.g., John Smith, subscribed on January 15th, 2024"
                rows={3}
              />
            </FormField>
          </>
        )}

        {/* Regular feedback note (hidden for referrals) */}
        {feedbackType !== FeedbackType.Referral && (
          <FormField label="Message">
            <Textarea
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.detail.value)}
              placeholder="Please describe your inquiry, feedback, or request..."
              rows={4}
            />
          </FormField>
        )}

        {/* Info for referrals */}
        {feedbackType === FeedbackType.Referral && (
          <Alert type="info">
            <strong>How it works:</strong> After submitting this form, our team will verify that your friend has subscribed 
            and then apply a $20 credit to your account. You'll receive a confirmation email once the credit is processed.
          </Alert>
        )}
      </SpaceBetween>
    </Modal>
  );
};