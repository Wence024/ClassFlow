This is an excellent decision and demonstrates a strong commitment to code quality. Testing the features and fixes you've implemented is crucial for maintaining stability and confidence, especially with a complex multi-user system.

Based on your `git log` and the changes we've discussed, here's a plan for creating test files for each significant commit. We'll focus on **integration tests** for the main logic (hooks, services) and **component/integration tests** for the UI elements, as these provide the most value for validating features.

I'll outline the purpose of each test, the file it should go in, and a conceptual structure for the tests, focusing on what changed in that commit.

---

### **Test Plan for `feature/multi-user-workflow`**

We'll work through your `git log` from newest to oldest, addressing each significant change.

---

#### **Commit: `011fb63 feat(timetabling-semester-scope): :bug: fetch timetable assignments for active semester`**

*   **What changed:** `useTimetable` and `timetableService` now fetch assignments filtered by `semester_id`, not `user_id`. Also, `useActiveSemester` was introduced.
*   **Key Logic to Test:** Ensure `useTimetable` correctly uses the active semester ID, and that `timetableService` passes it to Supabase.
*   **Test File:** `src/features/timetabling/hooks/tests/useTimetable.integration.test.ts`
*   **Conceptual Test Structure:**

    ```typescript
    import { renderHook, waitFor } from '@testing-library/react';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { describe, it, expect, vi, beforeEach } from 'vitest';
    import { useTimetable } from '../useTimetable';
    import * as timetableService from '../../services/timetableService';
    import * as useActiveSemesterHook from '../../scheduleConfig/hooks/useActiveSemester';
    import { AuthContext } from '../../../auth/contexts/AuthContext';
    // ... import other mocked hooks like useClassGroups, useScheduleConfig

    const queryClient = new QueryClient();

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ user: { id: 'u1', program_id: 'p1', role: 'program_head' } }}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    describe('useTimetable - semester scope', () => {
      const mockSemesterId = 'sem-active-123';
      const mockAssignments = [{ id: 'a1', semester_id: mockSemesterId, class_session: { /* ... mock session data */ } }];

      beforeEach(() => {
        vi.clearAllMocks();
        // Mock the dependency useActiveSemester to return a known active semester
        vi.spyOn(useActiveSemesterHook, 'useActiveSemester').mockReturnValue({
          data: { id: mockSemesterId, name: 'Fall 2025', is_active: true /* ... */ },
          isLoading: false,
          error: null,
          isFetching: false,
        });
        vi.spyOn(timetableService, 'getTimetableAssignments').mockResolvedValue(mockAssignments);
        // Mock other dependencies as needed (e.g., useClassGroups, useScheduleConfig)
      });

      it('should call timetableService.getTimetableAssignments with the active semester ID', async () => {
        const { result } = renderHook(() => useTimetable(), { wrapper });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(timetableService.getTimetableAssignments).toHaveBeenCalledWith(mockSemesterId);
        expect(result.current.timetable.size).toBeGreaterThan(0); // Assuming assignments lead to a populated table
      });

      // Add tests for assignClassSession and moveClassSession to confirm they pass semester_id
      it('should pass semester_id to assignClassSessionToTimetable', async () => {
        const mockAssignFn = vi.spyOn(timetableService, 'assignClassSessionToTimetable').mockResolvedValue({});
        const mockSession = { id: 's1', period_count: 1 /* ... other mock session data */ };
        const { result } = renderHook(() => useTimetable(), { wrapper });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await result.current.assignClassSession('group1', 0, mockSession);

        expect(mockAssignFn).toHaveBeenCalledWith(expect.objectContaining({
          semester_id: mockSemesterId,
          class_session_id: mockSession.id,
        }));
      });

      // Similar test for moveClassSession using timetableService.moveClassSessionInTimetable
      it('should pass semester_id to moveClassSessionInTimetable', async () => {
        const mockMoveFn = vi.spyOn(timetableService, 'moveClassSessionInTimetable').mockResolvedValue({});
        const mockSession = { id: 's1', period_count: 1 /* ... other mock session data */ };
        const { result } = renderHook(() => useTimetable(), { wrapper });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await result.current.moveClassSession(
          { class_group_id: 'group1', period_index: 0 },
          { class_group_id: 'group1', period_index: 1 },
          mockSession
        );

        expect(mockMoveFn).toHaveBeenCalledWith(
          expect.anything(), expect.anything(), expect.objectContaining({
            semester_id: mockSemesterId,
            class_session_id: mockSession.id,
          })
        );
      });
    });
    ```

---

#### **Commit: `26a2941 feat(session-visibility): :eye: dim sessions not owned by user's program`**

*   **What changed:** `SessionCell` now conditionally styles based on `session.program_id` vs `user.program_id`.
*   **Key Logic to Test:** Verify `SessionCell` renders with correct styles (opacity, color) for owned vs. non-owned sessions.
*   **Test File:** `src/features/timetabling/pages/components/timetable/tests/SessionCell.integration.test.tsx` (You already have a good start here).
*   **Conceptual Test Structure (Enhance existing file):**

    ```typescript
    // In src/features/timetabling/pages/components/timetable/tests/SessionCell.integration.test.tsx
    // ... imports and mock data (ensure mockSession has a program_id, and mockUser in context has one)
    import { AuthContext } from '../../../../auth/contexts/AuthContext';

    // Mock Contexts (Auth and Timetable)
    const renderWithProviders = (ui, authContextValue, timetableContextValue) => {
      return render(
        <QueryClientProvider client={new QueryClient()}>
          <AuthContext.Provider value={authContextValue}>
            <TimetableContext.Provider value={timetableContextValue}>
              <table><tbody><tr>{ui}</tr></tbody></table>
            </TimetableContext.Provider>
          </AuthContext.Provider>
        </QueryClientProvider>
      );
    };

    describe('SessionCell - Ownership Styling', () => {
      const mockProgramId = 'prog-owner-123';
      const mockOtherProgramId = 'prog-other-456';

      const ownedSession = { ...mockSession, program_id: mockProgramId };
      const otherSession = { ...mockSession, id: '2', program_id: mockOtherProgramId };

      const authOwnerContext = { user: { id: 'u1', program_id: mockProgramId, role: 'program_head' }, loading: false };
      const timetableDefaultContext = { /* ... default mock values for timetable context */ };

      it('should render owned sessions with normal styling', () => {
        renderWithProviders(
          <SessionCell session={ownedSession} groupId="g1" periodIndex={0} isLastInDay={false} isNotLastInTable={false} />,
          authOwnerContext,
          timetableDefaultContext
        );
        const cellContent = screen.getByTestId(`session-card-${ownedSession.id}`).firstChild;
        expect(cellContent).not.toHaveStyle('opacity: 0.8'); // Expect it to be full opacity
        expect(cellContent).not.toHaveStyle('background-color: rgb(229, 231, 235)'); // Not gray
      });

      it('should render non-owned sessions with "washed out" styling', () => {
        renderWithProviders(
          <SessionCell session={otherSession} groupId="g1" periodIndex={0} isLastInDay={false} isNotLastInTable={false} />,
          authOwnerContext,
          timetableDefaultContext
        );
        const cellContent = screen.getByTestId(`session-card-${otherSession.id}`).firstChild;
        expect(cellContent).toHaveStyle('opacity: 0.8'); // Specific for non-owned
        expect(cellContent).toHaveStyle('background-color: rgb(229, 231, 235)'); // gray-200
        expect(cellContent.querySelector('p')).toHaveStyle('color: rgb(75, 85, 99)'); // gray-600
      });
    });
    ```

---

#### **Commits: `e2e179e refactor(sidebar): :sparkles: add class component management to base nav and update settings route` & `e8fb319 refactor(sidebar): :sparkles: add class component management to base nav (now sidebar) and update settings route`**

*   **What changed:** `Sidebar` now conditionally renders navigation links based on user role (`isAdmin`).
*   **Key Logic to Test:** Verify that the "Settings" link is shown only for admins.
*   **Test File:** `src/components/layout/tests/Sidebar.integration.test.tsx`
*   **Conceptual Test Structure:**

    ```typescript
    import { render, screen } from '@testing-library/react';
    import { describe, it, expect, vi } from 'vitest';
    import { MemoryRouter } from 'react-router-dom';
    import Sidebar from '../Sidebar';
    import { AuthContext } from '../../features/auth/contexts/AuthContext'; // Path adjusted for new location

    const renderSidebar = (authContextValue) => {
      return render(
        <MemoryRouter>
          <AuthContext.Provider value={authContextValue}>
            <Sidebar />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    };

    describe('Sidebar - Role-based Navigation', () => {
      it('should show "Settings" link for admin users', () => {
        renderSidebar({ user: { id: 'u1', role: 'admin', program_id: 'p1' }, loading: false });
        expect(screen.getByRole('link', { name: /Settings/i })).toBeInTheDocument();
      });

      it('should NOT show "Settings" link for non-admin users', () => {
        renderSidebar({ user: { id: 'u1', role: 'program_head', program_id: 'p1' }, loading: false });
        expect(screen.queryByRole('link', { name: /Settings/i })).not.toBeInTheDocument();
      });

      it('should NOT show "Settings" link for logged out users', () => {
        renderSidebar({ user: null, loading: false });
        expect(screen.queryByRole('link', { name: /Settings/i })).not.toBeInTheDocument();
      });
    });
    ```

---

#### **Commits: `c086009 chore(routing-cleanup): :fire: remove obsolete scheduleLessonsRoutes abstraction` & `7a0bc91 refactor(routing): :recycle: simplify private route nesting and inline authenticated routes` & `a9e9a94 refactor(app-layout): :truck: centralize layout structure and migrate UI shell components`**

*   **What changed:** These three commits collectively define the new central routing structure in `App.tsx` and the `AppLayout`. `PrivateRoute` also changed.
*   **Key Logic to Test:** Verify that `PrivateRoute` correctly guards access and that `AppLayout` renders for protected routes, but not for public ones.
*   **Test File:** `src/features/auth/components/tests/PrivateRoute.integration.test.tsx` (or a dedicated `src/routing/tests/AppRouting.integration.test.tsx` if you prefer a broader scope).
*   **Conceptual Test Structure (Enhance existing file):**

    ```typescript
    // In src/features/auth/components/tests/PrivateRoute.integration.test.tsx
    // ... imports

    // Need to mock the <AppLayout> and the actual pages to simplify the routing test
    vi.mock('../../components/layout/AppLayout', () => ({ default: ({ children }) => <div>AppLayout: {children}</div> }));
    vi.mock('../../features/classSessions/pages/ClassSessionsPage', () => ({ default: () => <div>ClassSessionsPage</div> }));
    vi.mock('../../features/auth/pages/LoginPage', () => ({ default: () => <div>LoginPage</div> }));

    const renderAppRoutes = (authContextValue) => {
      return render(
        <QueryClientProvider client={new QueryClient()}>
          <BrowserRouter>
            <AuthContext.Provider value={authContextValue}>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<div>LoginPage</div>} />

                {/* Private Routes */}
                <Route element={<PrivateRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/class-sessions" element={<div>ClassSessionsPage</div>} />
                    <Route path="/" element={<Navigate to="/class-sessions" replace />} />
                  </Route>
                </Route>
              </Routes>
            </AuthContext.Provider>
          </BrowserRouter>
        </QueryClientProvider>
      );
    };

    describe('PrivateRoute & App Routing', () => {
      it('should redirect to login if not authenticated', async () => {
        renderAppRoutes({ user: null, loading: false });
        // Navigate to a protected route
        history.push('/class-sessions');
        await waitFor(() => {
          expect(screen.getByText('LoginPage')).toBeInTheDocument();
        });
      });

      it('should render AppLayout and protected page if authenticated', async () => {
        renderAppRoutes({ user: { id: 'u1', role: 'program_head', program_id: 'p1' }, loading: false });
        // Navigate to the default authenticated path
        history.push('/'); // Should redirect to /class-sessions
        await waitFor(() => {
          expect(screen.getByText('AppLayout: ClassSessionsPage')).toBeInTheDocument();
        });
      });

      it('should show loading spinner during authentication', async () => {
        renderAppRoutes({ user: null, loading: true });
        history.push('/class-sessions'); // Try to access a protected route
        expect(screen.getByText('Authenticating...')).toBeInTheDocument();
      });
    });
    ```

---

#### **Commit: `b69e483 feat(schedule-config|sidebar): :lock: restrict settings access to admins and update docs`**

*   **What changed:** `ScheduleConfigPage` allows read-only view for non-admins, edit for admins.
*   **Key Logic to Test:** Verify form fields are disabled for non-admins, enabled for admins, and save button is only visible for admins.
*   **Test File:** `src/features/scheduleConfig/pages/tests/ScheduleConfigPage.integration.test.tsx`
*   **Conceptual Test Structure:**

    ```typescript
    import { render, screen, waitFor } from '@testing-library/react';
    import { describe, it, expect, vi } from 'vitest';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import ScheduleConfigPage from '../ScheduleConfigPage';
    import { AuthContext } from '../../auth/contexts/AuthContext';
    import * as useScheduleConfigHook from '../hooks/useScheduleConfig';
    import * as scheduleConfigService from '../services/scheduleConfigService';

    const queryClient = new QueryClient();

    const renderPage = (authContextValue) => {
      return render(
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={authContextValue}>
            <ScheduleConfigPage />
          </AuthContext.Provider>
        </QueryClientProvider>
      );
    };

    describe('ScheduleConfigPage - Admin Access', () => {
      const mockSettings = { periods_per_day: 8, class_days_per_week: 5, start_time: '09:00', period_duration_mins: 60 };

      beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
          settings: mockSettings,
          updateSettings: vi.fn().mockResolvedValue(mockSettings),
          isLoading: false,
          isUpdating: false,
          error: null,
        });
      });

      it('should display fields as disabled for non-admin users', async () => {
        renderPage({ user: { id: 'u1', role: 'program_head', program_id: 'p1' }, loading: false });
        await waitFor(() => {
          expect(screen.getByLabelText(/Periods Per Day/i)).toBeDisabled();
          expect(screen.getByLabelText(/Class Days Per Week/i)).toBeDisabled();
          // ... check other fields
        });
        expect(screen.queryByRole('button', { name: /Save Settings/i })).not.toBeInTheDocument();
      });

      it('should display fields as enabled for admin users', async () => {
        renderPage({ user: { id: 'u1', role: 'admin', program_id: 'p1' }, loading: false });
        await waitFor(() => {
          expect(screen.getByLabelText(/Periods Per Day/i)).toBeEnabled();
          // ... check other fields
        });
        expect(screen.getByRole('button', { name: /Save Settings/i })).toBeInTheDocument();
      });

      it('admin user should be able to save settings', async () => {
        const updateSpy = vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
          settings: mockSettings,
          updateSettings: vi.fn().mockResolvedValue(mockSettings),
          isLoading: false,
          isUpdating: false,
          error: null,
        }).updateSettings; // Get the specific updateSettings function reference

        renderPage({ user: { id: 'u1', role: 'admin', program_id: 'p1' }, loading: false });

        const saveButton = await screen.findByRole('button', { name: /Save Settings/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(updateSpy).toHaveBeenCalledWith(mockSettings);
        });
      });
    });
    ```

---

#### **Commit: `e006673 feat(class-sessions): :sparkles: associate new class sessions with user's program_id`**

*   **What changed:** `useClassSessions` now adds `program_id` when creating a new class session.
*   **Key Logic to Test:** Verify `addClassSession` mutation passes the correct `program_id`.
*   **Test File:** `src/features/classSessions/hooks/tests/useClassSessions.integration.test.ts`
*   **Conceptual Test Structure:**

    ```typescript
    import { renderHook, waitFor } from '@testing-library/react';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { describe, it, expect, vi, beforeEach } from 'vitest';
    import { useClassSessions } from '../useClassSessions';
    import * as classSessionsService from '../../services/classSessionsService';
    import { AuthContext } from '../../../auth/contexts/AuthContext';

    const queryClient = new QueryClient();

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ user: { id: 'u1', program_id: 'p1', role: 'program_head' }, loading: false }}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    describe('useClassSessions - program_id association', () => {
      const mockProgramId = 'p1';
      const mockUserId = 'u1';
      const mockClassSessionInput = {
        course_id: 'c1',
        class_group_id: 'g1',
        classroom_id: 'r1',
        instructor_id: 'i1',
        period_count: 1,
      };

      beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(classSessionsService, 'addClassSession').mockResolvedValue({ id: 's1', ...mockClassSessionInput, user_id: mockUserId, program_id: mockProgramId /* ... */ });
        vi.spyOn(classSessionsService, 'getClassSessions').mockResolvedValue([]); // Mock query
      });

      it('should add class session with current user\'s program_id', async () => {
        const { result } = renderHook(() => useClassSessions(), { wrapper });

        await result.current.addClassSession(mockClassSessionInput);

        expect(classSessionsService.addClassSession).toHaveBeenCalledWith(
          expect.objectContaining({
            ...mockClassSessionInput,
            user_id: mockUserId,
            program_id: mockProgramId,
          })
        );
      });

      it('should throw error if user is not assigned to a program', async () => {
        const wrapperNoProgram = ({ children }) => (
          <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ user: { id: 'u1', role: 'program_head', program_id: null }, loading: false }}>
              {children}
            </AuthContext.Provider>
          </QueryClientProvider>
        );
        const { result } = renderHook(() => useClassSessions(), { wrapper: wrapperNoProgram });

        await expect(result.current.addClassSession(mockClassSessionInput)).rejects.toThrow(
          'Cannot create class session: User is not assigned to a program.'
        );
      });
    });
    ```

---

#### **Commit: `8ff6917 refactor(auth-context): :recycle: derive role from user object instead of local state`**

*   **What changed:** `AuthProvider` no longer manages a separate `role` state; it's derived from `user.role`.
*   **Key Logic to Test:** This is an internal refactor. Direct tests are hard because the public API of `AuthProvider` didn't change. The best way to test this is indirectly: if all other tests (`Sidebar`, `ScheduleConfigPage`) that rely on `useAuth().role` continue to pass, then the refactor was successful. No new test file is strictly necessary, but confirming existing tests work is key.

---

#### **Commit: `429e00d refactor(auth-service): :recycle: hydrate session with role and program from profiles table`**

*   **What changed:** `authService.getStoredUser` now queries the `profiles` table for `role` and `program_id`.
*   **Key Logic to Test:** Ensure `getStoredUser` fetches the correct data from the mocked `profiles` table.
*   **Test File:** `src/features/auth/services/tests/authService.integration.test.ts`
*   **Conceptual Test Structure (Enhance existing file or create new):**

    ```typescript
    // In src/features/auth/services/tests/authService.integration.test.ts
    import { vi, describe, it, expect, beforeEach } from 'vitest';
    import { supabase } from '../../../../lib/supabase'; // Mock this
    import { getStoredUser } from '../authService';

    // Mock Supabase client
    vi.mock('../../../../lib/supabase', () => ({
      supabase: {
        auth: {
          getSession: vi.fn(),
        },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn(),
        })),
      },
    }));

    describe('authService.getStoredUser - profile hydration', () => {
      const mockSession = {
        user: { id: 'u1', email: 'test@example.com', user_metadata: { name: 'Test User' } },
        access_token: 'abc',
        refresh_token: 'def',
      };
      const mockProfile = { role: 'admin', program_id: 'p1' };

      beforeEach(() => {
        vi.clearAllMocks();
        supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });
        supabase.from().select().eq().single.mockResolvedValue({ data: mockProfile, error: null });
      });

      it('should return user with role and program_id from profiles table', async () => {
        const user = await getStoredUser();
        expect(user).toEqual(expect.objectContaining({
          id: 'u1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'admin',
          program_id: 'p1',
        }));
        expect(supabase.from).toHaveBeenCalledWith('profiles');
        expect(supabase.from().select).toHaveBeenCalledWith('role, program_id');
        expect(supabase.from().select().eq).toHaveBeenCalledWith('id', 'u1');
      });

      it('should return null if profile not found', async () => {
        supabase.from().select().eq().single.mockResolvedValue({ data: null, error: new Error('Profile not found') });
        const user = await getStoredUser();
        expect(user).toBeNull();
      });

      it('should return null if no active session', async () => {
        supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
        const user = await getStoredUser();
        expect(user).toBeNull();
        expect(supabase.from).not.toHaveBeenCalled(); // No profile query if no session
      });
    });
    ```

---

This plan covers the most significant changes introduced by the `feature/multi-user-workflow` branch. Remember to create the `tests` subfolders as needed within each feature/component directory to match your testing pyramid strategy. Good luck!