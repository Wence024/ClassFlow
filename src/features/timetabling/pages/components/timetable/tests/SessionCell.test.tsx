import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SessionCell from '../SessionCell';
import TimetableContext, { type TimetableContextType } from '../TimetableContext';
import { AuthContext } from '../../../../../../features/auth/contexts/AuthContext';
import {
  getSessionCellBgColor,
  getSessionCellBorderStyle,
  getSessionCellTextColor,
} from '../../../../../../lib/colorUtils';
import type { ClassSession } from '../../../../../../features/classSessions/types/classSession';
import type { AuthContextType } from '../../../../../../features/auth/types/auth';

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
  activeDraggedSession: null,
  isSlotAvailable: () => false,
  handleDragStart: vi.fn(),
  onShowTooltip: vi.fn(),
  onHideTooltip: vi.fn(),
  handleDragEnter: vi.fn(),
  handleDragOver: vi.fn(),
  handleDragLeave: vi.fn(),
  handleDropToGrid: vi.fn(),
};

const renderWithContext = (
  ui: React.ReactElement,
  providerProps?: Partial<TimetableContextType>
) => {
  const mockAuthContext: AuthContextType = {
    user: {
      id: 'test-user',
      role: 'program_head',
      program_id: 'p1',
      name: 'Test User',
      email: 'test@example.com',
    },
    loading: false,
    role: 'program_head',
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    resendVerificationEmail: vi.fn(),
    error: null,
    clearError: vi.fn(),
  };

  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <TimetableContext.Provider value={{ ...mockContextValue, ...providerProps }}>
        <table>
          <tbody>
            <tr>{ui}</tr>
          </tbody>
        </table>
      </TimetableContext.Provider>
    </AuthContext.Provider>
  );
};

// --- MOCK DATA ---

const mockSession1: ClassSession = {
  id: '1',
  period_count: 1,
  program_id: 'p1',
  course: {
    id: 'c1',
    name: 'Test Course',
    code: 'T101',
    color: '#ffffff',
    created_at: new Date().toISOString(),
    user_id: 'u1',
    program_id: 'p1',
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
    program_id: 'p1',
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
    program_id: 'p1',
  },
  group: {
    id: 'g1',
    name: 'Group A',
    student_count: 25,
    code: 'G1',
    color: null,
    created_at: new Date().toISOString(),
    user_id: 'u1',
    program_id: 'p1',
  },
};

const mockSession2: ClassSession = {
  ...mockSession1,
  id: '2',
  program_id: 'p1',
  instructor: {
    ...mockSession1.instructor,
    id: 'i2',
    color: '#3b82f6', // Blue
  },
  group: {
    ...mockSession1.group,
    id: 'g2',
    name: 'Group B',
  },
};

// --- TESTS ---

describe('SessionCell', () => {
  describe('Single Session Rendering', () => {
    it('should apply the correct inline styles based on instructor color', () => {
      renderWithContext(
        <SessionCell
          sessions={[mockSession1]}
          groupId="g1"
          periodIndex={0}
          isLastInDay={false}
          isNotLastInTable={false}
        />
      );

      const cellContent = screen.getByTestId('session-card-1').firstChild as HTMLElement;
      expect(cellContent).toBeInTheDocument();

      const instructorHex = mockSession1.instructor.color || '#808080';
      const expectedBgHex = getSessionCellBgColor(instructorHex, false);
      const expectedTextColor = getSessionCellTextColor(instructorHex);

      expect(cellContent.style.backgroundColor).toBe(hexToRgba(expectedBgHex));

      const textElement = screen.getByText('T101');
      expect(textElement).toHaveStyle({
        color: expectedTextColor,
      });
    });

    it('should apply different styles when being dragged', () => {
      renderWithContext(
        <SessionCell
          sessions={[mockSession1]}
          groupId="g1"
          periodIndex={0}
          isLastInDay={false}
          isNotLastInTable={false}
        />,
        { activeDraggedSession: mockSession1 }
      );

      const cellContent = screen.getByTestId('session-card-1').firstChild as HTMLElement;
      const instructorHex = mockSession1.instructor.color || '#808080';

      const expectedBgHex = getSessionCellBgColor(instructorHex, true);
      const expectedBorderStyle = getSessionCellBorderStyle(instructorHex, true);

      const borderHexColor = expectedBorderStyle.split(' ')[2];
      const expectedRgbaBorder = `2px dashed ${hexToRgba(borderHexColor)}`;

      expect(cellContent.style.backgroundColor).toBe(hexToRgba(expectedBgHex));
      expect(cellContent.style.border).toBe(expectedRgbaBorder);
    });
  });

  describe('Merged Session Rendering', () => {
    it('should render a gradient background for two merged sessions', () => {
      renderWithContext(
        <SessionCell
          sessions={[mockSession1, mockSession2]}
          groupId="g1"
          periodIndex={0}
          isLastInDay={false}
          isNotLastInTable={false}
        />
      );

      const cellContent = screen.getByTestId('session-card-1').firstChild as HTMLElement;
      const color1 = getSessionCellBgColor(mockSession1.instructor.color!, false);
      const color2 = getSessionCellBgColor(mockSession2.instructor.color!, false);

      // JSDOM will compute the full gradient string
      const expectedGradient = `linear-gradient(135deg, ${hexToRgba(color1)}, ${hexToRgba(color2)})`;

      expect(cellContent.style.background).toBe(expectedGradient);
    });

    it('should render a merged session indicator with the correct count', () => {
      renderWithContext(
        <SessionCell
          sessions={[mockSession1, mockSession2]}
          groupId="g1"
          periodIndex={0}
          isLastInDay={false}
          isNotLastInTable={false}
        />
      );

      const countIndicator = screen.getByText('2');
      expect(countIndicator).toBeInTheDocument();
      // Check for the parent container which has the icon
      expect(countIndicator.parentElement).toHaveClass('flex items-center');
    });

    it('should be draggable if the user owns at least one session in the merge', () => {
      // User's program_id is 'p1', which matches both mock sessions
      const { container } = renderWithContext(
        <SessionCell
          sessions={[mockSession1, mockSession2]}
          groupId="g1"
          periodIndex={0}
          isLastInDay={false}
          isNotLastInTable={false}
        />
      );

      const draggableDiv = container.querySelector('[draggable="true"]');
      expect(draggableDiv).toBeInTheDocument();
    });

    it('should NOT be draggable if the user owns none of the sessions', () => {
        const nonOwnedSession = { ...mockSession1, program_id: 'p2' };
        const { container } = renderWithContext(
          <SessionCell
            sessions={[nonOwnedSession]}
            groupId="g1"
            periodIndex={0}
            isLastInDay={false}
            isNotLastInTable={false}
          />
        );
  
        const draggableDiv = container.querySelector('[draggable="true"]');
        expect(draggableDiv).not.toBeInTheDocument();
      });
  });

  describe('Invalid Data Handling', () => {
    it('should render an invalid cell if sessions array is empty', () => {
        const { container } = renderWithContext(
            <SessionCell
              sessions={[]}
              groupId="g1"
              periodIndex={0}
              isLastInDay={false}
              isNotLastInTable={false}
            />
          );
      // It should render an empty <td> to not break the table layout
      const td = container.querySelector('td');
      expect(td).toBeInTheDocument();
      expect(td?.childElementCount).toBe(0);
    });

    it('should render the invalid data fallback if the primary session is missing data', () => {
        const invalidSession = { ...mockSession1, instructor: undefined as any };
        renderWithContext(
            <SessionCell
              sessions={[invalidSession]}
              groupId="g1"
              periodIndex={0}
              isLastInDay={false}
              isNotLastInTable={false}
            />
          );

        expect(screen.getByText('Invalid Session Data')).toBeInTheDocument();
    });
  });
});