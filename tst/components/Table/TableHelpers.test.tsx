import React from 'react';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { TableNoMatchState, TableEmptyState, FullPageHeader, useColumnWidths } from '../../../src/components/Table/TableHelpers';

// Mock dependencies
const mockRedirectToPage = jest.fn();
const mockCanCreateNewReport = jest.fn();
const mockSaveWidths = jest.fn();
jest.mock('@ben1000240/instantlyanalyze-module', () => ({
  PAGE_PATH: { RENTAL_CALCULATOR_CREATE: '/create' },
  RedirectAPI: jest.fn(() => ({ redirectToPage: mockRedirectToPage })),
  useLocalStorage: jest.fn(() => [null, mockSaveWidths]),
}));
jest.mock('../../../src/utils/AppContextProvider', () => ({
  useAppContext: () => ({ canCreateNewReport: mockCanCreateNewReport }),
}));

describe('TableHelpers', () => {
  describe('TableNoMatchState', () => {
    it('renders correctly and handles clear filter', () => {
      const onClearFilter = jest.fn();
      render(<TableNoMatchState onClearFilter={onClearFilter} />);
      expect(screen.getByText('No matches')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Clear filter' }));
      expect(onClearFilter).toHaveBeenCalled();
    });
  });

  describe('TableEmptyState', () => {
    it('renders create state when user can create', () => {
      mockCanCreateNewReport.mockReturnValue(true);
      render(<TableEmptyState resourceName="Report" />);
      expect(screen.getByText('No reports')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Create report' }));
      expect(mockRedirectToPage).toHaveBeenCalledWith('/create');
    });

    it('renders alert state when user cannot create', () => {
      mockCanCreateNewReport.mockReturnValue(false);
      render(<TableEmptyState resourceName="Report" />);
      expect(screen.getByText('You have reached your maximum number of free reports.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create report' })).toBeDisabled();
    });
  });

  describe('FullPageHeader', () => {
    const props = {
      createButtonOnClick: jest.fn(),
      editButtonOnClick: jest.fn(),
      handleDelete: jest.fn(),
      itemType: 'report',
    };

    it('handles button states correctly based on selection', () => {
      mockCanCreateNewReport.mockReturnValue(true);
      const { rerender } = render(<FullPageHeader {...props} selectedItems={[]} />);
      expect(screen.getByTestId('header-btn-edit')).toBeDisabled();
      expect(screen.getByTestId('header-btn-delete')).toBeDisabled();

      rerender(<FullPageHeader {...props} selectedItems={[{ id: '1' }]} />);
      expect(screen.getByTestId('header-btn-edit')).not.toBeDisabled();
      expect(screen.getByTestId('header-btn-delete')).not.toBeDisabled();

      rerender(<FullPageHeader {...props} selectedItems={[{ id: '1' }, { id: '2' }]} />);
      expect(screen.getByTestId('header-btn-edit')).toBeDisabled();
      expect(screen.getByTestId('header-btn-delete')).not.toBeDisabled();
    });
  });

  describe('useColumnWidths', () => {
    it('should manage column widths', () => {
      const columnDefs = [{ id: 'a' }, { id: 'b' }];
      const { result } = renderHook(() => useColumnWidths('test-key', columnDefs));
      
      act(() => {
        result.current[1]({ detail: { widths: [100, 200] } });
      });

      expect(mockSaveWidths).toHaveBeenCalled();
    });
  });
}); 