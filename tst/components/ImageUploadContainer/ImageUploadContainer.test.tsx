import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUploadContainer } from '../../../src/components/ImageUploadContainer/ImageUploadContainer';

// Mock the module
jest.mock('@bpenwell/instantlyanalyze-module', () => ({
  setRentalCalculatorFormState: jest.fn(),
}));

// Mock FileReader
const mockFileReader = {
  readAsDataURL: jest.fn(),
  onloadend: null as (() => void) | null,
  result: 'data:image/jpeg;base64,mock-base64-data',
};

Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: jest.fn(() => mockFileReader),
});

describe('ImageUploadContainer', () => {
  const mockSetState = jest.fn();
  const mockSetRentalCalculatorFormState = require('@bpenwell/instantlyanalyze-module').setRentalCalculatorFormState;

  const defaultProps = {
    image: undefined,
    setState: mockSetState,
  };

  const renderImageUploadContainer = (props = {}) => {
    return render(<ImageUploadContainer {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFileReader.onloadend = null;
  });

  describe('rendering', () => {
    it('should render without image initially', () => {
      renderImageUploadContainer();
      
      expect(screen.getByText('Click to add property image')).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should render with image when provided', () => {
      renderImageUploadContainer({ image: 'data:image/jpeg;base64,test-image' });
      
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'data:image/jpeg;base64,test-image');
      expect(image).toHaveAttribute('alt', 'Uploaded');
      expect(screen.queryByText('Click to add property image')).not.toBeInTheDocument();
    });

    it('should have correct CSS classes when no image', () => {
      renderImageUploadContainer();
      
      const container = screen.getByText('Click to add property image').closest('.image-upload-container');
      expect(container).toHaveClass('bordered');
    });

    it('should have correct CSS classes when image is present', () => {
      renderImageUploadContainer({ image: 'data:image/jpeg;base64,test-image' });
      
      const container = screen.getByRole('img').closest('.image-upload-container');
      expect(container).not.toHaveClass('bordered');
    });

    it('should have hidden file input', () => {
      renderImageUploadContainer();
      
      const fileInput = screen.getByDisplayValue('');
      expect(fileInput).toHaveAttribute('type', 'file');
      expect(fileInput).toHaveAttribute('accept', 'image/*');
      expect(fileInput).toHaveStyle({ display: 'none' });
    });
  });

  describe('user interactions', () => {
    it('should trigger file input when container is clicked', async () => {
      const user = userEvent.setup();
      renderImageUploadContainer();
      
      const container = screen.getByText('Click to add property image').closest('.image-upload-container');
      const fileInput = screen.getByDisplayValue('');
      
      // Mock the click event to trigger file input
      const clickSpy = jest.spyOn(fileInput, 'click');
      
      await user.click(container!);
      
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should handle file selection', async () => {
      const user = userEvent.setup();
      renderImageUploadContainer();
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByDisplayValue('');
      
      await user.upload(fileInput, file);
      
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
    });

    it('should call setRentalCalculatorFormState when file is loaded', () => {
      renderImageUploadContainer();
      
      // Simulate file selection
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByDisplayValue('');
      
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      // Simulate FileReader onloadend
      if (mockFileReader.onloadend) {
        mockFileReader.onloadend();
      }
      
      expect(mockSetRentalCalculatorFormState).toHaveBeenCalledWith(
        mockSetState,
        'propertyInformation',
        'image',
        'data:image/jpeg;base64,mock-base64-data'
      );
    });

    it('should not call setRentalCalculatorFormState when no file is selected', () => {
      renderImageUploadContainer();
      
      const fileInput = screen.getByDisplayValue('');
      
      fireEvent.change(fileInput, { target: { files: [] } });
      
      expect(mockSetRentalCalculatorFormState).not.toHaveBeenCalled();
    });

    it('should not call setRentalCalculatorFormState when file is null', () => {
      renderImageUploadContainer();
      
      const fileInput = screen.getByDisplayValue('');
      
      fireEvent.change(fileInput, { target: { files: null } });
      
      expect(mockSetRentalCalculatorFormState).not.toHaveBeenCalled();
    });
  });

  describe('file handling', () => {
    it('should handle different image file types', async () => {
      const user = userEvent.setup();
      renderImageUploadContainer();
      
      const fileInput = screen.getByDisplayValue('');
      
      const pngFile = new File(['test'], 'test.png', { type: 'image/png' });
      await user.upload(fileInput, pngFile);
      
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(pngFile);
    });

    it('should handle large image files', async () => {
      const user = userEvent.setup();
      renderImageUploadContainer();
      
      const fileInput = screen.getByDisplayValue('');
      
      // Create a mock large file
      const largeFile = new File(['x'.repeat(1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      await user.upload(fileInput, largeFile);
      
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(largeFile);
    });
  });

  describe('edge cases', () => {
    it('should handle empty file array', () => {
      renderImageUploadContainer();
      
      const fileInput = screen.getByDisplayValue('');
      
      fireEvent.change(fileInput, { target: { files: [] } });
      
      expect(mockSetRentalCalculatorFormState).not.toHaveBeenCalled();
    });

    it('should handle undefined files property', () => {
      renderImageUploadContainer();
      
      const fileInput = screen.getByDisplayValue('');
      
      fireEvent.change(fileInput, { target: {} });
      
      expect(mockSetRentalCalculatorFormState).not.toHaveBeenCalled();
    });

    it('should handle FileReader errors gracefully', () => {
      renderImageUploadContainer();
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByDisplayValue('');
      
      // Mock FileReader error
      mockFileReader.result = '';
      
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      if (mockFileReader.onloadend) {
        mockFileReader.onloadend();
      }
      
      expect(mockSetRentalCalculatorFormState).toHaveBeenCalledWith(
        mockSetState,
        'propertyInformation',
        'image',
        ''
      );
    });
  });
}); 