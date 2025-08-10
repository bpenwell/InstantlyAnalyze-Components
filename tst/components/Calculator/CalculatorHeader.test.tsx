import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CalculatorHeader } from '../../../src/components/Calculator/CalculatorHeader';
import userEvent from '@testing-library/user-event';

// Mock dependencies
const mockSaveUpdatedRentalReport = jest.fn();
const mockDeleteRentalReport = jest.fn();

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ user: { sub: 'test-user' } }),
}));
jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  BackendAPI: jest.fn().mockImplementation(() => ({
    saveUpdatedRentalReport: mockSaveUpdatedRentalReport,
    deleteRentalReport: mockDeleteRentalReport,
  })),
  RedirectAPI: jest.fn().mockImplementation(() => ({
    redirectToPage: jest.fn(),
    createRentalCalculatorEditRedirectUrl: jest.fn(() => '/edit-url'),
  })),
  getImageSrc: jest.fn(() => 'test-image.jpg'),
  printObjectFields: jest.fn(() => 'test-debug-string'),
  PAGE_PATH: { RENTAL_CALCULATOR_DASHBOARD: '/dashboard' },
}));
jest.mock('../../../src/components/ShareModal/ShareModal', () => ({
  ShareModal: ({ isOpen }: any) => isOpen ? <div data-testid="share-modal">Share Modal</div> : null,
}));
jest.mock('@cloudscape-design/components', () => ({
  Box: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, onClick, disabled, href }: any) => <button onClick={onClick} disabled={disabled} data-href={href}>{children}</button>,
  Header: ({ children }: any) => <h2>{children}</h2>,
  SpaceBetween: ({ children }: any) => <div>{children}</div>,
  Grid: ({ children }: any) => <div>{children}</div>,
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const mockProps = {
  initialRentalReportData: {
    propertyInformation: { streetAddress: '123 Main St', city: 'Anytown', state: 'CA' },
    purchaseDetails: { purchasePrice: 200000 },
    isShareable: false,
    metaData: {},
  } as any,
  updateInitialData: jest.fn(),
  reportId: 'report-123',
  currentYear: 2024,
  currentYearData: {} as any,
  fullLoanTermRentalReportData: [],
  updateDataYear: jest.fn(),
};

describe('CalculatorHeader Component', () => {
  it('should render without crashing', () => {
    render(<CalculatorHeader {...mockProps} />);
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Anytown, CA')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
  });

  it('should display header content correctly', async () => {
    const { rerender } = render(<CalculatorHeader {...mockProps} />);
    expect(screen.queryByRole('link', { name: '123 Main St' })).not.toBeInTheDocument();

    rerender(<CalculatorHeader {...{...mockProps, initialRentalReportData: { ...mockProps.initialRentalReportData, metaData: { listingUrl: 'http://example.com' } }}} />);
    expect(screen.getByRole('link', { name: '123 Main St' })).toHaveAttribute('href', 'http://example.com');
  });

  it('should handle header actions', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<CalculatorHeader {...mockProps} />);
    
    // Share
    await user.click(screen.getByRole('button', { name: 'Share' }));
    expect(screen.getByTestId('share-modal')).toBeInTheDocument();
    
    // Save
    const modifiedData = { ...mockProps.initialRentalReportData, purchaseDetails: { ...mockProps.initialRentalReportData.purchaseDetails, purchasePrice: 250000 } };
    rerender(<CalculatorHeader {...mockProps} initialRentalReportData={modifiedData} />);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    await user.click(saveButton);
    await waitFor(() => {
      expect(mockSaveUpdatedRentalReport).toHaveBeenCalled();
    });
    
    // Delete
    window.confirm = jest.fn(() => true);
    await user.click(screen.getByRole('button', { name: 'Delete Report' }));
    await waitFor(() => {
      expect(mockDeleteRentalReport).toHaveBeenCalled();
    });
    // Edit
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveAttribute('data-href', '/edit-url');
  });
}); 