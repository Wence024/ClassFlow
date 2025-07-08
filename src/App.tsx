import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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

function NavBar({ onLogout }: { onLogout?: () => void }) {
  const { user, logout } = useAuth();
  return (
    <nav
      style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Link to="/login">Login</Link>
      <Link to="/class-sessions">Class Sessions</Link>
      <Link to="/scheduler">Scheduler</Link>
      <Link to="/component-management">Component Management</Link>
      {user && (
        <span style={{ marginLeft: '2rem', fontWeight: 500, color: '#007bff' }}>
          Welcome, {user.name}
        </span>
      )}
      {user && (
        <button
          onClick={() => {
            logout();
            if (onLogout) onLogout();
          }}
          style={{ marginLeft: '1rem', padding: '6px 16px', fontSize: '1rem', cursor: 'pointer' }}
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
    <AuthProvider>
      <ClassSessionsProvider>
        <ComponentsProvider>
          <BrowserRouter>
            <NavBar onLogout={handleLogout} />
            {toast && (
              <div
                style={{
                  position: 'fixed',
                  top: 70,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#333',
                  color: '#fff',
                  padding: '10px 24px',
                  borderRadius: 6,
                  zIndex: 1000,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #0003',
                }}
                role="status"
                aria-live="polite"
              >
                {toast}
              </div>
            )}
            <Routes>
              {authRoutes}
              <Route path="/class-sessions" element={<PrivateRoute><ClassSessions /></PrivateRoute>} />
              <Route path="/scheduler" element={<PrivateRoute><Scheduler /></PrivateRoute>} />
              <Route path="/component-management" element={<PrivateRoute><ComponentManagement /></PrivateRoute>} />
            </Routes>
          </BrowserRouter>
        </ComponentsProvider>
      </ClassSessionsProvider>
    </AuthProvider>
  );
}

export default App;
