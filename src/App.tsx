import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Scheduler from './pages/Scheduler';
import ClassSessions from './pages/ClassSessions';
import ComponentManagement from './pages/ComponentManagement';
import { ClassSessionsProvider } from './context/ClassSessionsContext';

function App() {
  return (
    <ClassSessionsProvider>
      <BrowserRouter>
        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <Link to="/class-sessions">Class Sessions</Link>
          <Link to="/scheduler">Scheduler</Link>
          <Link to="/component-management">Component Management</Link>
        </nav>
        <Routes>
          <Route path="/class-sessions" element={<ClassSessions />} />
          <Route path="/scheduler" element={<Scheduler />} />
          <Route path="/component-management" element={<ComponentManagement />} />
        </Routes>
      </BrowserRouter>
    </ClassSessionsProvider>
  );
}

export default App;
