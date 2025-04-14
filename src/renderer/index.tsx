import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EditorApp from './editor/Editor';
import StageProvider from './layout/StageProvider';
import Onboarding from './onboarding/Onboarding';
import App from './App';
import './App.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <MemoryRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/stage" element={<StageProvider />} />
      <Route path="/editor" element={<EditorApp />} />
      <Route path="/first-launch" element={<Onboarding />} />
    </Routes>
  </MemoryRouter>,
);
