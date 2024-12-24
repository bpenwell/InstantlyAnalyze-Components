import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { IUserConfigs, LOCAL_STORAGE_KEYS, useLocalStorage } from '@bpenwell/instantlyanalyze-module';
import {
  Button,
  Container,
  Header,
  SpaceBetween,
} from '@cloudscape-design/components';

export const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // Local storage state for user configs (subscription status, free report count, etc.)
  const [userConfigs, setUserConfigs] = useLocalStorage<IUserConfigs>(
    LOCAL_STORAGE_KEYS.USER_CONFIGS,
    {
      userId: '',
      status: 'free',
      freeReportsAvailable: 5,
    }
  );

  // Placeholder image to use if user does not have a profile picture
  const placeholderImage = 'https://via.placeholder.com/100?text=No+Image';

  if (isLoading) {
    return (
      <Container header={<Header variant="h2">Loading...</Header>}>
        <p>Loading user data...</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container header={<Header variant="h2">Not Logged In</Header>}>
        <SpaceBetween size="m">
          <p>You are not logged in.</p>
          <Button onClick={() => loginWithRedirect()}>Log in</Button>
        </SpaceBetween>
      </Container>
    );
  }

  // Handle subscription upgrade
  const handleSubscribe = () => {
    // Replace with real subscription logic or redirect to your billing page
    setUserConfigs({
      ...userConfigs,
      status: 'paid',
      freeReportsAvailable: -1, // unlimited
    });
    alert('You have subscribed to our paid plan!');
  };

  // Example of "edit profile" logic:
  const handleEditProfile = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'profile',
      },
    });
  };

  const isFreePlan = userConfigs.status === 'free';
  const reportsRemaining = userConfigs.freeReportsAvailable ?? 0;

  return (
    <Container
      header={
        <Header variant="h1">
          Profile
        </Header>
      }
    >
      <SpaceBetween size="l">
        {/* Profile Picture and Basic Info */}
        <div style={{ textAlign: 'center' }}>
          <img
            src={user?.picture || placeholderImage}
            alt="Profile"
            style={{ width: 100, height: 100, borderRadius: '50%' }}
          />
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>

          <Button onClick={handleEditProfile} variant="primary">
            Edit Profile
          </Button>
        </div>

        {/* Subscription Status */}
        <div>
          <strong>Subscription Status:</strong> {userConfigs.status}
          {isFreePlan && (
            <div style={{ marginTop: '0.5rem' }}>
              <Button onClick={handleSubscribe} variant="primary">
                Subscribe Now
              </Button>
            </div>
          )}
        </div>

        {/* Reports Remaining */}
        <div>
          <strong>Reports Remaining:</strong> {reportsRemaining}
          {reportsRemaining === 0 && isFreePlan && (
            <p style={{ color: 'red' }}>
              You have no free reports remaining. Please subscribe for unlimited access!
            </p>
          )}
        </div>

        {/* Additional Account Details */}
        <div>
          <Header variant="h3">Account Details</Header>
          <p>User ID (from local storage configs): {userConfigs.userId || '[No ID set]'}</p>
        </div>
      </SpaceBetween>
    </Container>
  );
};