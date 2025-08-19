import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ComponentForm from '../ComponentForm';

// Mock the notifications service
vi.mock('../../../../lib/notificationsService', () => ({
  showNotification: vi.fn(),
}));

describe('ComponentForm', () => {
  describe('Conditional Rendering', () => {
    it('should render the "Number of Periods" input only when the form type is "course"', () => {
      const { rerender } = render(<ComponentForm type="course" onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/Number of Periods/i)).toBeInTheDocument();

      rerender(<ComponentForm type="instructor" onSubmit={vi.fn()} />);
      expect(screen.queryByLabelText(/Number of Periods/i)).not.toBeInTheDocument();
    });
  });

  describe('User Interaction & State', () => {
    it('should update its state when the user types in the number_of_periods field', () => {
      render(<ComponentForm type="course" onSubmit={vi.fn()} />);
      const periodsInput = screen.getByLabelText(/Number of Periods/i);
      fireEvent.change(periodsInput, { target: { value: '5' } });

      // THIS IS THE FIX:
      // We assert that the value is the number 5, because <input type="number">
      // in JSDOM returns a number for its .value property.
      expect(periodsInput).toHaveValue(5);
    });

    it('should display a validation error message for invalid input on submit', async () => {
      const handleSubmit = vi.fn();
      render(<ComponentForm type="course" onSubmit={handleSubmit} />);

      // Fill in valid data for other fields
      fireEvent.change(screen.getByLabelText(/Course Name/i), {
        target: { value: 'Advanced React' },
      });
      fireEvent.change(screen.getByLabelText(/Course Code/i), { target: { value: 'R101' } });

      // Enter invalid data for periods
      fireEvent.change(screen.getByLabelText(/Number of Periods/i), { target: { value: '-1' } });
      fireEvent.click(screen.getByRole('button', { name: /Create Course/i }));

      expect(handleSubmit).not.toHaveBeenCalled();
      expect(await screen.findByText('Duration must be at least 1 period')).toBeInTheDocument();
    });

    it('should call onSubmit with the correctly parsed numeric value on valid submission', () => {
      const handleSubmit = vi.fn();
      render(<ComponentForm type="course" onSubmit={handleSubmit} />);

      fireEvent.change(screen.getByLabelText(/Course Name/i), {
        target: { value: 'Advanced React' },
      });
      fireEvent.change(screen.getByLabelText(/Course Code/i), { target: { value: 'R101' } });
      fireEvent.change(screen.getByLabelText(/Number of Periods/i), { target: { value: '3' } });
      fireEvent.click(screen.getByRole('button', { name: /Create Course/i }));

      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Advanced React',
        code: 'R101',
        number_of_periods: 3,
      });
    });
  });
});
