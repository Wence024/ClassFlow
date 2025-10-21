import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ViewSelector } from '../ViewSelector';


describe('ViewSelector', () => {
  it('should render all three view options', () => {
    const mockOnChange = vi.fn();
    render(<ViewSelector viewMode="class-group" onViewModeChange={mockOnChange} />);

    expect(screen.getByText('Class Groups')).toBeInTheDocument();
    expect(screen.getByText('Classrooms')).toBeInTheDocument();
    expect(screen.getByText('Instructors')).toBeInTheDocument();
  });

  it('should highlight the active view mode', () => {
    const mockOnChange = vi.fn();
    render(<ViewSelector viewMode="classroom" onViewModeChange={mockOnChange} />);

    const classroomButton = screen.getByRole('button', { name: /switch to classrooms view/i });
    expect(classroomButton).toHaveClass('bg-background');
    expect(classroomButton).toHaveClass('text-foreground');
    expect(classroomButton).toHaveClass('shadow-sm');
  });

  it('should call onViewModeChange when a view button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<ViewSelector viewMode="class-group" onViewModeChange={mockOnChange} />);

    const instructorButton = screen.getByRole('button', { name: /switch to instructors view/i });
    await user.click(instructorButton);

    expect(mockOnChange).toHaveBeenCalledWith('instructor');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should not call onViewModeChange when clicking the already active view', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<ViewSelector viewMode="classroom" onViewModeChange={mockOnChange} />);

    const classroomButton = screen.getByRole('button', { name: /switch to classrooms view/i });
    await user.click(classroomButton);

    expect(mockOnChange).toHaveBeenCalledWith('classroom');
  });

  it('should switch between all view modes correctly', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const { rerender } = render(<ViewSelector viewMode="class-group" onViewModeChange={mockOnChange} />);

    // Switch to classroom
    const classroomButton = screen.getByRole('button', { name: /switch to classrooms view/i });
    await user.click(classroomButton);
    expect(mockOnChange).toHaveBeenCalledWith('classroom');

    // Simulate prop change
    rerender(<ViewSelector viewMode="classroom" onViewModeChange={mockOnChange} />);

    // Switch to instructor
    const instructorButton = screen.getByRole('button', { name: /switch to instructors view/i });
    await user.click(instructorButton);
    expect(mockOnChange).toHaveBeenCalledWith('instructor');

    // Simulate prop change
    rerender(<ViewSelector viewMode="instructor" onViewModeChange={mockOnChange} />);

    // Switch back to class-group
    const classGroupButton = screen.getByRole('button', { name: /switch to class groups view/i });
    await user.click(classGroupButton);
    expect(mockOnChange).toHaveBeenCalledWith('class-group');
  });

  it('should render correct icons for each view', () => {
    const mockOnChange = vi.fn();
    render(<ViewSelector viewMode="class-group" onViewModeChange={mockOnChange} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    
    // Each button should have an icon (svg element)
    buttons.forEach((button) => {
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  it('should have proper accessibility attributes', () => {
    const mockOnChange = vi.fn();
    render(<ViewSelector viewMode="class-group" onViewModeChange={mockOnChange} />);

    const classGroupButton = screen.getByRole('button', { name: /switch to class groups view/i });
    const classroomButton = screen.getByRole('button', { name: /switch to classrooms view/i });
    const instructorButton = screen.getByRole('button', { name: /switch to instructors view/i });

    expect(classGroupButton).toHaveAttribute('aria-label');
    expect(classroomButton).toHaveAttribute('aria-label');
    expect(instructorButton).toHaveAttribute('aria-label');
  });
});
