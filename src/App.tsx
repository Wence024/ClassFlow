import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TooltipProvider, Toaster } from './components/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/reactQueryClient';
import { AuthRoutes } from './routes/AuthRoutes';
import { AuthProvider } from './features/auth/contexts/AuthProvider';
import { RealtimeProvider } from './contexts/RealtimeProvider';
import PrivateRoute from './features/auth/components/PrivateRoute';
import RoleGuardedPage from './components/layout/RoleGuardedPage';
import AppLayout from './components/layout/AppLayout';
import ClassSessions from './features/classSessions/pages/ClassSessionsPage'; // Import pages here
import TimetablePage from './features/timetabling/pages/TimetablePage';
import ComponentManagement from './features/classSessionComponents/pages';
import ScheduleConfigPage from './features/scheduleConfig/pages/ScheduleConfigPage';
import DepartmentManagementPage from './features/departments/pages/DepartmentManagementPage';
import UserProfilePage from './features/auth/pages/UserProfilePage';
import DepartmentHeadDashboard from './features/departments/pages/DepartmentHeadDashboard';
import ProgramManagementPage from './features/programs/pages/ProgramManagementPage';
import UserManagementPage from './features/users/pages/UserManagementPage';
import InstructorReportsPage from './features/reports/pages/InstructorReportsPage';

/**
 * The root component of the application.
 *
 * Its primary responsibility is to set up the top-level context providers
 * (QueryClient, Browser Router, Auth) and define the global routing structure.
 * It does not contain any visual layout itself.
 *
 * @returns The main application component with all providers and routes.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <RealtimeProvider>
            <TooltipProvider>
              <Routes>
                {/* Public Routes */}
                {AuthRoutes}

                {/* Private Routes */}
                <Route element={<PrivateRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/class-sessions" replace />} />
                    <Route path="/class-sessions" element={<ClassSessions />} />
                    <Route path="/scheduler" element={<TimetablePage />} />
                    <Route path="/component-management" element={<ComponentManagement />} />
                    <Route 
                      path="/schedule-configuration" 
                      element={
                        <RoleGuardedPage requiresAdmin>
                          <ScheduleConfigPage />
                        </RoleGuardedPage>
                      } 
                    />
                    <Route 
                      path="/departments" 
                      element={
                        <RoleGuardedPage requiresAdmin>
                          <DepartmentManagementPage />
                        </RoleGuardedPage>
                      } 
                    />
                    <Route 
                      path="/programs" 
                      element={
                        <RoleGuardedPage requiresAdmin>
                          <ProgramManagementPage />
                        </RoleGuardedPage>
                      } 
                    />
                    <Route 
                      path="/user-management" 
                      element={
                        <RoleGuardedPage requiresAdmin>
                          <UserManagementPage />
                        </RoleGuardedPage>
                      } 
                    />
                    <Route 
                      path="/department-head" 
                      element={
                        <RoleGuardedPage requiresDeptHead>
                          <DepartmentHeadDashboard />
                        </RoleGuardedPage>
                      } 
                    />
                    <Route path="/reports/instructors" element={<InstructorReportsPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster 
                position="top-center"
                expand={false}
                richColors
                closeButton
                visibleToasts={3}
                offset="20px"
              />
            </TooltipProvider>
          </RealtimeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
