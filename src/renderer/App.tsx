import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StageProvider from './layout/StageProvider';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StageProvider />} />
      </Routes>
    </Router>
  );
}
