import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ClassSessionsProvider } from './features/scheduleLessons/contexts/ClassSessionsContext';
import { ComponentsProvider } from './features/scheduleLessons/contexts/ComponentsContext';
import ClassSessions from './features/scheduleLessons/pages/ClassSessions';
import Scheduler from './features/scheduleLessons/pages/Scheduler';
import ComponentManagement from './features/scheduleLessons/pages/ComponentManagement';
import { authRoutes } from './features/auth/routes/AuthRoutes';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import { useAuth } from './features/auth/hooks/useAuth';
import PrivateRoute from './features/auth/components/PrivateRoute';

// Home page component that redirects based on auth status
const HomePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Loading...
      </div>
    );
  }

  return user ? <Navigate to="/class-sessions" replace /> : <Navigate to="/login" replace />;
};

function NavBar({ onLogout }: { onLogout?: () => void }) {
  const { user, logout } = useAuth();
  return (
    <nav className="flex gap-4 mb-8 justify-center items-center bg-white py-4 shadow">
      <Link to="/login" className="text-blue-600 hover:underline">
        Login
      </Link>
      <Link to="/class-sessions" className="text-blue-600 hover:underline">
        Class Sessions
      </Link>
      <Link to="/scheduler" className="text-blue-600 hover:underline">
        Scheduler
      </Link>
      <Link to="/component-management" className="text-blue-600 hover:underline">
        Component Management
      </Link>
      {user && <span className="ml-8 font-semibold text-blue-700">Welcome, {user.name}</span>}
      {user && (
        <button
          onClick={() => {
            logout();
            if (onLogout) onLogout();
          }}
          className="ml-4 px-4 py-2 text-base rounded bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

function App() {
  const [toast, setToast] = useState<string | null>(null);

  const handleLogout = () => {
    setToast('Logged out successfully');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <ClassSessionsProvider>
      <ComponentsProvider>
        <BrowserRouter>
          <AuthProvider>
            <NavBar onLogout={handleLogout} />
            {toast && (
              <div
                className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded-lg z-50 text-base shadow-lg"
                role="status"
                aria-live="polite"
              >
                {toast}
              </div>
            )}
            <Routes>
              {authRoutes}
              <Route path="/" element={<HomePage />} />
              <Route
                path="/class-sessions"
                element={
                  <PrivateRoute>
                    <ClassSessions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/scheduler"
                element={
                  <PrivateRoute>
                    <Scheduler />
                  </PrivateRoute>
                }
              />
              <Route
                path="/component-management"
                element={
                  <PrivateRoute>
                    <ComponentManagement />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ComponentsProvider>
    </ClassSessionsProvider>
  );
}

export default App;
