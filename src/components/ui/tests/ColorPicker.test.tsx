import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ColorPicker from '../ColorPicker';

describe('ColorPicker', () => {
  it('should render the label, color swatch, and hex value', () => {
    render(<ColorPicker id="test-color" label="Test Color" value="#ff0000" onChange={() => {}} />);

    expect(screen.getByText('Test Color')).toBeInTheDocument();
    // The hex code should be displayed in uppercase
    expect(screen.getByText('#FF0000')).toBeInTheDocument();
  });

  it('should call the onChange handler when a new color is selected', () => {
    const handleChange = vi.fn();
    render(
      <ColorPicker id="test-color" label="Test Color" value="#ff0000" onChange={handleChange} />
    );

    // The input itself is hidden, so we find it by its label association
    const colorInput = screen.getByLabelText('Test Color');

    // Simulate the user selecting a new color
    fireEvent.change(colorInput, { target: { value: '#00ff00' } });

    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleChange).toHaveBeenCalledWith('#00ff00');
  });

  it('should display an error message when provided', () => {
    render(
      <ColorPicker
        id="test-color"
        label="Test Color"
        value="#ff0000"
        onChange={() => {}}
        error="This color is invalid"
      />
    );
    expect(screen.getByText('This color is invalid')).toBeInTheDocument();
  });
});
