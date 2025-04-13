import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StageProvider from './layout/StageProvider';
import EditorApp from './editor/Editor';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StageProvider />} />
        <Route path="/editor" element={<EditorApp />} />
      </Routes>
    </Router>
  );
}
