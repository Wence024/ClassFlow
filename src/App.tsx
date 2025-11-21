import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider, Toaster } from './components/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/reactQueryClient';
import { 
  AuthRoutes, 
  AdminRoutes, 
  DepartmentHeadRoutes, 
  ProgramHeadRoutes, 
  SharedRoutes 
} from './routes';
import { AuthProvider } from './features/shared/auth/contexts/AuthProvider';
import { RealtimeProvider } from './contexts/RealtimeProvider';
import { EnvironmentIndicator } from './components/EnvironmentIndicator';
import PrivateRoute from './features/shared/auth/components/PrivateRoute';
import AppLayout from './components/layout/AppLayout';

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

                {/* Private Routes - Role-based organization */}
                <Route element={<PrivateRoute />}>
                  <Route element={<AppLayout />}>
                    {/* Program Head Routes */}
                    {ProgramHeadRoutes}
                    
                    {/* Department Head Routes */}
                    {DepartmentHeadRoutes}
                    
                    {/* Admin Routes */}
                    {AdminRoutes}
                    
                    {/* Shared Routes */}
                    {SharedRoutes}
                  </Route>
                </Route>
              </Routes>
              <Toaster 
                position="top-center"
                expand={false}
                richColors
                closeButton
                visibleToasts={3}
                offset="20px"
              />
              <EnvironmentIndicator />
            </TooltipProvider>
          </RealtimeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
