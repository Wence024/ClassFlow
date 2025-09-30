import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ColorPicker from '../custom/color-picker';
import { PRESET_COLORS_DATA } from '../../../lib/colorUtils';
import React from 'react';

// Mock the color utils
vi.mock('../../../lib/colorUtils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../lib/colorUtils')>();
  return {
    ...actual,
    getRandomPresetColor: () => '#d97706', // Always return Orange for predictable tests
  };
});

describe('ColorPicker', () => {
  const defaultProps = {
    id: 'test-color',
    label: 'Test Color',
    value: '#4f46e5', // Indigo
    onChange: vi.fn(),
  };

  it('should render the trigger button with the color name', () => {
    render(<ColorPicker {...defaultProps} />);
    expect(screen.getByText('Indigo')).toBeInTheDocument();
  });

  it('should open the popover when the trigger is clicked', async () => {
    render(<ColorPicker {...defaultProps} />);
    const trigger = screen.getByRole('button', { name: /Indigo/i });

    await act(async () => {
      fireEvent.click(trigger);
    });

    expect(screen.getByRole('dialog', { name: /color picker/i })).toBeInTheDocument();
    // Check for a preset color button
    expect(screen.getAllByRole('button', { name: /select color/i })[0]).toBeInTheDocument();
  });

  it('should call onChange and close the popover when a preset color is clicked', async () => {
    const onChange = vi.fn();
    render(<ColorPicker {...defaultProps} onChange={onChange} />);

    // Open popover
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Indigo/i }));
    });

    const popover = screen.getByRole('dialog');
    expect(popover).toBeInTheDocument();

    // Click the second preset color (Teal)
    const tealButton = screen.getByRole('button', { name: /select color Teal/i });
    await act(async () => {
      fireEvent.click(tealButton);
    });

    expect(onChange).toHaveBeenCalledWith(PRESET_COLORS_DATA[1].hex);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onChange when the random button is clicked', async () => {
    const onChange = vi.fn();
    render(<ColorPicker {...defaultProps} onChange={onChange} />);

    const randomButton = screen.getByRole('button', { name: /select a random preset color/i });
    await act(async () => {
      fireEvent.click(randomButton);
    });

    expect(onChange).toHaveBeenCalledWith('#d97706'); // The mocked random color
  });

  it('should close the popover when clicking outside', async () => {
    render(<ColorPicker {...defaultProps} />);
    // Open popover
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Indigo/i }));
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Click outside
    await act(async () => {
      fireEvent.mouseDown(document.body);
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should close the popover when Escape key is pressed', async () => {
    render(<ColorPicker {...defaultProps} />);
    // Open popover
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Indigo/i }));
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Press Escape
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should allow custom color selection without closing popover immediately', async () => {
    const onChange = vi.fn();
    render(<ColorPicker {...defaultProps} onChange={onChange} />);

    // Open popover
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Indigo/i }));
    });

    const popover = screen.getByRole('dialog');
    expect(popover).toBeInTheDocument();

    // Find and interact with the color input
    const colorInput = screen.getByDisplayValue('#4f46e5');
    expect(colorInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(colorInput, { target: { value: '#ff0000' } });
    });

    expect(onChange).toHaveBeenCalledWith('#ff0000');
    // Popover should remain open after custom color change
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
