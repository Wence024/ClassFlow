import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import type { Course } from '../../../types';
import ComponentCard from '../ComponentCard';

// Base mock course, satisfying the type
const baseMockCourse: Course = {
  id: 'c1',
  name: 'Test Course',
  code: 'T101',
  user_id: 'u1',
  created_at: new Date().toISOString(),
  number_of_periods: 1, // Default
};

describe('ComponentCard', () => {
  it('should display the duration for a course with 1 period (singular)', () => {
    const course: Course = { ...baseMockCourse, number_of_periods: 1 };
    render(<ComponentCard item={course} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/Duration/i)).toHaveTextContent('Duration: 1 period');
  });

  it('should display the duration for a course with multiple periods (plural)', () => {
    const course: Course = { ...baseMockCourse, number_of_periods: 3 };
    render(<ComponentCard item={course} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/Duration/i)).toHaveTextContent('Duration: 3 periods');
  });

  it('should gracefully handle a course where number_of_periods is null', () => {
    // This tests for data anomalies
    const course: Course = { ...baseMockCourse, number_of_periods: null as any };
    render(<ComponentCard item={course} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.queryByText(/Duration/i)).not.toBeInTheDocument();
  });

  it('should not display duration for non-course components', () => {
    const instructor = {
      id: 'i1',
      name: 'Dr. Jones',
      email: 'j@j.com',
      user_id: 'u1',
      created_at: '',
    };
    render(<ComponentCard item={instructor} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.queryByText(/Duration/i)).not.toBeInTheDocument();
  });
});
