/**
 * Unit tests for RejectionDialog component.
 * Tests dialog behavior, validation, and user interactions.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RejectionDialog from '../RejectionDialog';

describe('RejectionDialog', () => {
  const mockOnConfirm = vi.fn();
  const mockOnOpenChange = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onConfirm: mockOnConfirm,
    isLoading: false,
    resourceName: 'Dr. John Doe',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with resource name', () => {
    render(<RejectionDialog {...defaultProps} />);

    expect(screen.getByText(/Reject Resource Request/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. John Doe/i)).toBeInTheDocument();
  });

  it('should require rejection message (disabled submit when empty)', () => {
    render(<RejectionDialog {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /Reject Request/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when message is entered', async () => {
    render(<RejectionDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Enter reason for rejection/i);
    const submitButton = screen.getByRole('button', { name: /Reject Request/i });

    fireEvent.change(input, { target: { value: 'Resource not available' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should call onConfirm with message on submit', async () => {
    render(<RejectionDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Enter reason for rejection/i);
    const submitButton = screen.getByRole('button', { name: /Reject Request/i });

    fireEvent.change(input, { target: { value: 'Instructor on leave' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith('Instructor on leave');
    });
  });

  it('should not call onConfirm with whitespace-only message', async () => {
    render(<RejectionDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Enter reason for rejection/i);
    const submitButton = screen.getByRole('button', { name: /Reject Request/i });

    fireEvent.change(input, { target: { value: '   ' } });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    fireEvent.click(submitButton);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should clear message on close', async () => {
    render(<RejectionDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Enter reason for rejection/i);
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    // Reopen dialog
    render(<RejectionDialog {...defaultProps} open={true} />);
    
    await waitFor(() => {
      const inputAfterReopen = screen.getByLabelText(/Rejection Reason \*/i);
      expect(inputAfterReopen).toHaveValue('');
    });
  });

  it('should disable form during loading state', () => {
    render(<RejectionDialog {...defaultProps} isLoading={true} />);

    const input = screen.getByPlaceholderText(/Enter reason for rejection/i);
    const submitButton = screen.getByRole('button', { name: /Rejecting.../i });
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should show loading text on submit button during loading', () => {
    render(<RejectionDialog {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('button', { name: /Rejecting.../i })).toBeInTheDocument();
  });
});
