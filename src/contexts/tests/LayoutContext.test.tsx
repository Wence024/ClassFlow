import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { LayoutProvider, useLayout } from '../LayoutContext';

/**
 * Test component to verify LayoutContext functionality.
 */
const TestComponent = () => {
  const { isSidebarCollapsed, toggleSidebar } = useLayout();
  return (
    <div>
      <p data-testid="collapse-state">{isSidebarCollapsed ? 'collapsed' : 'expanded'}</p>
      <button onClick={toggleSidebar}>Toggle</button>
    </div>
  );
};

describe('LayoutContext', () => {
  it('should provide initial collapsed state as false', () => {
    render(
      <LayoutProvider>
        <TestComponent />
      </LayoutProvider>
    );
    expect(screen.getByTestId('collapse-state')).toHaveTextContent('expanded');
  });

  it('should toggle sidebar state when toggleSidebar is called', async () => {
    const user = userEvent.setup();
    render(
      <LayoutProvider>
        <TestComponent />
      </LayoutProvider>
    );

    expect(screen.getByTestId('collapse-state')).toHaveTextContent('expanded');

    await user.click(screen.getByRole('button', { name: /toggle/i }));
    expect(screen.getByTestId('collapse-state')).toHaveTextContent('collapsed');

    await user.click(screen.getByRole('button', { name: /toggle/i }));
    expect(screen.getByTestId('collapse-state')).toHaveTextContent('expanded');
  });

  it('should throw error when useLayout is used outside provider', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useLayout must be used within a LayoutProvider'
    );

    errorSpy.mockRestore();
  });
});
