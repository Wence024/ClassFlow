import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SessionCell from '../SessionCell';
import TimetableContext, { type TimetableContextType } from '../TimetableContext';
import {
  getSessionCellBgColor,
  getSessionCellBorderStyle,
  getSessionCellTextColor,
} from '../../../../../../lib/colorUtils';
import type { ClassSession } from '../../../../../../features/classSessions/types/classSession';

// Test helper to convert a hex color to the rgb/rgba format JSDOM uses
const hexToRgba = (hex: string): string => {
  const hexValue = hex.replace('#', '');
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);

  if (hexValue.length === 8) {
    const a = parseInt(hexValue.substring(6, 8), 16) / 255;
    const alpha = Math.round(a * 100) / 100; // Round to handle floating point issues
    if (alpha === 1) {
      return `rgb(${r}, ${g}, ${b})`; // JSDOM simplifies when alpha is 1
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Return rgb for 6-digit hex codes
  return `rgb(${r}, ${g}, ${b})`;
};

const mockContextValue: TimetableContextType = {
  dragOverCell: null,
  currentDraggedSession: null,
  isSlotAvailable: () => false,
  onDragStart: vi.fn(),
  onShowTooltip: vi.fn(),
  onHideTooltip: vi.fn(),
  onDragEnter: vi.fn(),
  onDragOver: vi.fn(),
  onDragLeave: vi.fn(),
  onDropToGrid: vi.fn(),
};

const renderWithContext = (
  ui: React.ReactElement,
  providerProps?: Partial<TimetableContextType>
) => {
  return render(
    <TimetableContext.Provider value={{ ...mockContextValue, ...providerProps }}>
      <table>
        <tbody>
          <tr>{ui}</tr>
        </tbody>
      </table>
    </TimetableContext.Provider>
  );
};

// Create a fully typed mock object for the ClassSession
const mockSession: ClassSession = {
  id: '1',
  period_count: 1,
  course: {
    id: 'c1',
    name: 'Test Course',
    code: 'T101',
    color: '#ffffff',
    created_at: new Date().toISOString(),
    user_id: 'u1',
  },
  instructor: {
    id: 'i1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    color: '#ef4444', // Red
    prefix: 'Mr.',
    suffix: null,
    contract_type: 'Full-time',
    code: 'JD1',
    created_at: new Date().toISOString(),
    user_id: 'u1',
  },
  classroom: {
    id: 'r1',
    name: 'Room 1',
    capacity: 30,
    code: 'R1',
    color: null,
    location: 'Building A',
    created_at: new Date().toISOString(),
    user_id: 'u1',
  },
  group: {
    id: 'g1',
    name: 'Group A',
    student_count: 25,
    code: 'G1',
    color: null,
    created_at: new Date().toISOString(),
    user_id: 'u1',
  },
};

describe('SessionCell', () => {
  it('should apply the correct inline styles based on instructor color', () => {
    renderWithContext(
      <SessionCell
        session={mockSession}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />
    );

    const cellContent = screen.getByTestId('session-card-1').firstChild as HTMLElement;
    expect(cellContent).toBeInTheDocument();

    const instructorHex = mockSession.instructor.color || '#808080';
    const expectedBgHex = getSessionCellBgColor(instructorHex, false);
    const expectedTextColor = getSessionCellTextColor(instructorHex);

    // Assert against the rgba() value that JSDOM computes
    expect(cellContent.style.backgroundColor).toBe(hexToRgba(expectedBgHex));

    const textElement = screen.getByText('T101');
    expect(textElement).toHaveStyle({
      color: expectedTextColor,
    });
  });

  it('should apply different styles when being dragged', () => {
    renderWithContext(
      <SessionCell
        session={mockSession}
        groupId="g1"
        periodIndex={0}
        isLastInDay={false}
        isNotLastInTable={false}
      />,
      { currentDraggedSession: mockSession }
    );

    const cellContent = screen.getByTestId('session-card-1').firstChild as HTMLElement;
    const instructorHex = mockSession.instructor.color || '#808080';

    const expectedBgHex = getSessionCellBgColor(instructorHex, true);
    const expectedBorderStyle = getSessionCellBorderStyle(instructorHex, true);

    // Extract hex color from the border style string to convert it for the assertion
    const borderHexColor = expectedBorderStyle.split(' ')[2];
    const expectedRgbaBorder = `2px dashed ${hexToRgba(borderHexColor)}`;

    expect(cellContent.style.backgroundColor).toBe(hexToRgba(expectedBgHex));
    expect(cellContent.style.border).toBe(expectedRgbaBorder);
  });
});
