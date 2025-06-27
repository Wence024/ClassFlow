import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Scheduler from './pages/Scheduler';
import ClassSessions from './pages/ClassSessions';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <Link to="/class-sessions">Class Sessions</Link>
        <Link to="/scheduler">Scheduler</Link>
      </nav>
      <Routes>
        <Route path="/class-sessions" element={<ClassSessions />} />
        <Route path="/scheduler" element={<Scheduler />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
