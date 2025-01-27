import React from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  TextContent,
  Button
} from '@cloudscape-design/components';
import { Header as CustomHeader } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { AppContextProvider } from './AppContextProvider';
import { AppLayoutPreview } from '../components/AppLayout/AppLayout';
import { PAGE_PATH, RedirectAPI } from '@bpenwell/instantlyanalyze-module';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // You can still log the error and info if needed
    console.error('Error caught by ErrorBoundary:', error, info);
  }

  render() {
    const { hasError, error } = this.state;
    // Generates an integer between 1 and 4 (inclusive).
    const randomNumber = Math.floor(Math.random() * 4) + 1;
    const redirectAPI: RedirectAPI = new RedirectAPI();

    if (hasError) {
      return (
        <AppContextProvider>
          <CustomHeader />
          <AppLayoutPreview>
            <Container>
              <Header variant="h1">Who let the dogs out?</Header>
              <SpaceBetween size="l">
                <TextContent>
                  <p>
                    Meet Franklin. He tried to fetch this page, but it seems something went wrong.
                    Don’t worry—he’s on it!
                  </p>
                  <p>
                    In the meantime, you can return to our homepage or contact us if the problem
                    persists.
                  </p>
                  <img
                    src={`/public/franklin${randomNumber}.jpeg`}
                    alt="Franky!"
                    style={{ maxWidth: '400px', display: 'block', margin: '0 auto' }}
                  />
                  <SpaceBetween size="s" direction="horizontal">
                    <Button href={redirectAPI.createRedirectUrl(PAGE_PATH.HOME)}>Return to Home</Button>
                  </SpaceBetween>
                  {error && (
                    <p style={{ marginTop: '1rem', color: '#a62100' }}>
                      <strong>Error details:</strong> {error.message}
                    </p>
                  )}
                </TextContent>
              </SpaceBetween>
            </Container>
          </AppLayoutPreview>
          <Footer />
        </AppContextProvider>
      );
    }

    return this.props.children;
  }
}