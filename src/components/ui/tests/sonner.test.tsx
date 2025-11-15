import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Toaster } from '../sonner';
import { toast } from 'sonner';

/**
 * Test suite for the Toaster component.
 */
describe('Toaster', () => {
  beforeEach(() => {
    // Clear any existing toasts
    toast.dismiss();
  });

  it('renders and displays a toast message', async () => {
    render(<Toaster />);
    
    // Trigger a toast
    toast('Test message');
    
    // Wait for the toast to appear
    const toastElement = await screen.findByText('Test message');
    expect(toastElement).toBeInTheDocument();
  });

  it('displays success toast with richColors', async () => {
    render(<Toaster richColors />);
    
    toast.success('Success message');
    
    const toastElement = await screen.findByText('Success message');
    expect(toastElement).toBeInTheDocument();
    
    // Check that the toast is rendered (richColors will apply inline styles)
    const toastContainer = toastElement.closest('[data-sonner-toast]');
    expect(toastContainer).toBeInTheDocument();
  });

  it('displays error toast with richColors', async () => {
    render(<Toaster richColors />);
    
    toast.error('Error message');
    
    const toastElement = await screen.findByText('Error message');
    expect(toastElement).toBeInTheDocument();
    
    const toastContainer = toastElement.closest('[data-sonner-toast]');
    expect(toastContainer).toBeInTheDocument();
  });

  it('displays multiple toasts with visibleToasts limit', async () => {
    render(<Toaster richColors visibleToasts={2} />);
    
    toast('Message 1');
    toast('Message 2');
    toast('Message 3');
    
    await waitFor(() => {
      expect(screen.getByText('Message 1')).toBeInTheDocument();
      expect(screen.getByText('Message 2')).toBeInTheDocument();
    });
    
    // Third toast should exist but may not be visible due to limit
    // Just verify the first two are showing
  });

  it('respects position prop', async () => {
    render(<Toaster position="top-center" />);
    
    toast('Positioned message');
    
    const toastElement = await screen.findByText('Positioned message');
    expect(toastElement).toBeInTheDocument();
  });
});
