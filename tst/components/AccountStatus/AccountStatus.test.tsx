import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccountStatus } from '../../../src/components/AccountStatus/AccountStatus';
import { UserStatus } from '@bpenwell/instantlyanalyze-module';

// Mock the cloudscape components
jest.mock('@cloudscape-design/components', () => ({
  Box: ({ children, margin }: any) => (
    <div data-testid="box" data-margin={JSON.stringify(margin)}>
      {children}
    </div>
  ),
  StatusIndicator: ({ children, type }: any) => (
    <div data-testid="status-indicator" data-type={type}>
      {children}
    </div>
  ),
}));

describe('AccountStatus', () => {
  const renderAccountStatus = (status: UserStatus) => {
    return render(<AccountStatus status={status} />);
  };

  describe('rendering', () => {
    it('should render PRO status correctly', () => {
      renderAccountStatus(UserStatus.PRO);
      
      const statusIndicator = screen.getByTestId('status-indicator');
      const box = screen.getByTestId('box');
      
      expect(statusIndicator).toBeInTheDocument();
      expect(statusIndicator).toHaveAttribute('data-type', 'success');
      expect(statusIndicator).toHaveTextContent('Account: Pro');
      expect(box).toHaveAttribute('data-margin', '{"right":"s"}');
    });

    it('should render FREE status correctly', () => {
      renderAccountStatus(UserStatus.FREE);
      
      const statusIndicator = screen.getByTestId('status-indicator');
      
      expect(statusIndicator).toBeInTheDocument();
      expect(statusIndicator).toHaveAttribute('data-type', 'info');
      expect(statusIndicator).toHaveTextContent('Account: Free');
    });

    it('should render unknown status as pending', () => {
      renderAccountStatus('UNKNOWN' as UserStatus);
      
      const statusIndicator = screen.getByTestId('status-indicator');
      
      expect(statusIndicator).toBeInTheDocument();
      expect(statusIndicator).toHaveAttribute('data-type', 'pending');
      expect(statusIndicator).toHaveTextContent('Account: Loading...');
    });
  });

  describe('status mapping', () => {
    it('should map PRO status to success type', () => {
      renderAccountStatus(UserStatus.PRO);
      
      const statusIndicator = screen.getByTestId('status-indicator');
      expect(statusIndicator).toHaveAttribute('data-type', 'success');
    });

    it('should map FREE status to info type', () => {
      renderAccountStatus(UserStatus.FREE);
      
      const statusIndicator = screen.getByTestId('status-indicator');
      expect(statusIndicator).toHaveAttribute('data-type', 'info');
    });

    it('should map unknown status to pending type', () => {
      renderAccountStatus('UNKNOWN' as UserStatus);
      
      const statusIndicator = screen.getByTestId('status-indicator');
      expect(statusIndicator).toHaveAttribute('data-type', 'pending');
    });
  });

  describe('text display', () => {
    it('should display "Pro" for PRO status', () => {
      renderAccountStatus(UserStatus.PRO);
      
      expect(screen.getByText('Account: Pro')).toBeInTheDocument();
    });

    it('should display "Free" for FREE status', () => {
      renderAccountStatus(UserStatus.FREE);
      
      expect(screen.getByText('Account: Free')).toBeInTheDocument();
    });

    it('should display "Loading..." for unknown status', () => {
      renderAccountStatus('UNKNOWN' as UserStatus);
      
      expect(screen.getByText('Account: Loading...')).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('should render with proper box margin', () => {
      renderAccountStatus(UserStatus.PRO);
      
      const box = screen.getByTestId('box');
      expect(box).toHaveAttribute('data-margin', '{"right":"s"}');
    });

    it('should contain status indicator within box', () => {
      renderAccountStatus(UserStatus.PRO);
      
      const box = screen.getByTestId('box');
      const statusIndicator = screen.getByTestId('status-indicator');
      
      expect(box).toContainElement(statusIndicator);
    });
  });
}); 