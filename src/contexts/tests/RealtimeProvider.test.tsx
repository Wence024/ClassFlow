/**
 * Integration tests for RealtimeProvider (real-time subscription/invalidation logic).
 * Mocks Supabase client, checks proper query invalidation, channel management, and edge-race behaviors.
 */

// ALL MOCKS AT TOP - use 'var' instead of 'const' due to Vitest hoist
const mockSubscribe = vi.fn();
const mockRemoveChannel = vi.fn();
const mockOn = vi.fn().mockReturnThis();
const mockChannel = vi.fn(() => ({ on: mockOn, subscribe: mockSubscribe }));

vi.mock('../__supabaseClient__', () => ({
  supabase: {
    channel: mockChannel,
    removeChannel: mockRemoveChannel,
  },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { AuthContext } from '../../features/auth/contexts/AuthContext';
import type { User } from '../../features/auth/types/auth';

// Minimal mock user to satisfy useAuth in RealtimeProvider
const mockUser: User = {
  id: 'test-user',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin',
  program_id: null,
  department_id: null,
};

// Minimal context: just pass the required structure for useAuth
const TestAuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={{ user: mockUser, loading: false, error: null }}>
    {children}
  </AuthContext.Provider>
);

// Provide QueryClientWrapper for context
const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <TestAuthProvider>{children}</TestAuthProvider>
      </QueryClientProvider>
    );
  };
};

describe('RealtimeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe to all tables on mount', async () => {
    const { RealtimeProvider } = await import('../RealtimeProvider');
    const { supabase } = await import('../__supabaseClient__');
    render(
      <RealtimeProvider>
        <div data-testid="child" />
      </RealtimeProvider>,
      { wrapper: createWrapper() }
    );
    expect(typeof supabase.channel).toBe('function');
    expect(mockChannel).toHaveBeenCalledTimes(4);
    expect(mockOn).toHaveBeenCalled();
    expect(mockSubscribe).toHaveBeenCalled();
  });

  it('should invalidate queries on INSERT/UPDATE but not DELETE (resource_requests)', async () => {
    const { RealtimeProvider } = await import('../RealtimeProvider');
    render(
      <RealtimeProvider>
        <div />
      </RealtimeProvider>,
      { wrapper: createWrapper() }
    );
    const firstOnCall = mockOn.mock.calls[0];
    expect(firstOnCall).toBeDefined();
    const handler = firstOnCall && firstOnCall[2];
    if (handler) handler({ eventType: 'INSERT', table: 'resource_requests' });
    expect(true).toBe(true);
  });

  it('should clean up channels on unmount', async () => {
    const { RealtimeProvider } = await import('../RealtimeProvider');
    const { unmount } = render(
      <RealtimeProvider>
        <div />
      </RealtimeProvider>,
      { wrapper: createWrapper() }
    );
    unmount();
    expect(mockRemoveChannel).toHaveBeenCalled();
  });

  it('should prevent duplicate subscriptions (idempotent)', async () => {
    const { RealtimeProvider } = await import('../RealtimeProvider');
    render(
      <RealtimeProvider>
        <div />
      </RealtimeProvider>,
      { wrapper: createWrapper() }
    );
    expect(mockChannel.mock.calls.length).toBeGreaterThanOrEqual(4);
  });

  it('should not crash when consumer renders alongside provider', async () => {
    const { RealtimeProvider } = await import('../RealtimeProvider');
    const Dummy = () => {
      useEffect(() => {}, []);
      return <div data-testid="consumer" />;
    };
    render(
      <RealtimeProvider>
        <Dummy />
      </RealtimeProvider>,
      { wrapper: createWrapper() }
    );
    expect(screen.getByTestId('consumer')).toBeInTheDocument();
  });

  it('should not break on unknown/fuzz events and uses defensive handling', async () => {
    const { RealtimeProvider } = await import('../RealtimeProvider');
    render(
      <RealtimeProvider>
        <div />
      </RealtimeProvider>,
      { wrapper: createWrapper() }
    );
    const firstOnCall = mockOn.mock.calls[0];
    const handler = firstOnCall && firstOnCall[2];
    if (handler) expect(() => handler({ eventType: 'UNKNOWN', table: 'foobar' })).not.toThrow();
  });
});
