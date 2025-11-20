/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from '../ConfirmDialog';

describe('ConfirmDialog Component', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnConfirm = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onConfirm: mockOnConfirm,
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render dialog when open is true', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    });

    it('should not render dialog when open is false', () => {
      render(<ConfirmDialog {...defaultProps} open={false} />);
      
      expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
    });

    it('should render default button text', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render custom button text', () => {
      render(
        <ConfirmDialog 
          {...defaultProps} 
          confirmText="Delete Forever"
          cancelText="Go Back"
        />
      );
      
      expect(screen.getByText('Delete Forever')).toBeInTheDocument();
      expect(screen.getByText('Go Back')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onConfirm when confirm button is clicked', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onOpenChange with false when cancel button is clicked', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should disable buttons when isLoading is true', () => {
      render(<ConfirmDialog {...defaultProps} isLoading={true} />);
      
      const confirmButton = screen.getByText('Processing...');
      const cancelButton = screen.getByText('Cancel');
      
      expect(confirmButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it('should show "Processing..." text when loading', () => {
      render(<ConfirmDialog {...defaultProps} isLoading={true} />);
      
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    });
  });

  describe('Button Variants', () => {
    it('should render confirm button with default variant', () => {
      render(<ConfirmDialog {...defaultProps} variant="default" />);
      
      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton).toHaveClass('bg-primary');
    });

    it('should render confirm button with destructive variant', () => {
      render(<ConfirmDialog {...defaultProps} variant="destructive" />);
      
      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton).toHaveClass('bg-destructive');
    });
  });

  describe('Cross-Department Confirmation Scenarios', () => {
    it('should handle move confirmed session scenario', () => {
      render(
        <ConfirmDialog 
          {...defaultProps}
          title="Move Confirmed Session"
          description="This session uses cross-department resources and is currently confirmed. Moving it will require department head approval again. Continue?"
          confirmText="Continue"
          variant="default"
        />
      );
      
      expect(screen.getByText('Move Confirmed Session')).toBeInTheDocument();
      expect(screen.getByText(/cross-department resources/i)).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Continue'));
      expect(mockOnConfirm).toHaveBeenCalled();
    });

    it('should handle remove cross-department session scenario', () => {
      render(
        <ConfirmDialog 
          {...defaultProps}
          title="Remove Cross-Department Session"
          description="This session uses cross-department resources. Removing it will cancel the approval. Continue?"
          confirmText="Remove"
          variant="destructive"
        />
      );
      
      expect(screen.getByText('Remove Cross-Department Session')).toBeInTheDocument();
      expect(screen.getByText(/cancel the approval/i)).toBeInTheDocument();
      
      const removeButton = screen.getByText('Remove');
      expect(removeButton).toHaveClass('bg-destructive');
    });
  });

  describe('Accessibility', () => {
    it('should have proper dialog role', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should have accessible title', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const title = screen.getByText('Confirm Action');
      expect(title).toHaveAttribute('id');
    });

    it('should have accessible description', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const description = screen.getByText('Are you sure you want to proceed?');
      expect(description).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicks when not loading', () => {
      render(<ConfirmDialog {...defaultProps} />);
      
      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);
      fireEvent.click(confirmButton);
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).toHaveBeenCalledTimes(3);
    });

    it('should prevent clicks when loading', () => {
      render(<ConfirmDialog {...defaultProps} isLoading={true} />);
      
      const confirmButton = screen.getByText('Processing...');
      fireEvent.click(confirmButton);
      
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should handle empty strings for custom text', () => {
      render(
        <ConfirmDialog 
          {...defaultProps}
          confirmText=""
          cancelText=""
        />
      );
      
      // Should still render buttons even with empty text
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });
  });
});
