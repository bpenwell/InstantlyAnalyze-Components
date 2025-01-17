import React from 'react';

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
    // Update state so the next render shows the fallback UI and stores the error
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // You can still log the error and info if needed
    console.error('Error caught by ErrorBoundary:', error, info);
  }

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      // Display a fallback UI with the error message
      return (
        <div>
          <h1>Something went wrong.</h1>
          {/* Render the error message if available */}
          {error && <p>{error.message}</p>}
        </div>
      );
    }

    return this.props.children;
  }
}