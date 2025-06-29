import { createTheme, MantineProvider } from '@mantine/core';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import StageProvider from './layout/StageProvider';
import Onboarding from './onboarding/Onboarding';
import App from './App';
import './App.css';
import '@mantine/core/styles.css';

const theme = createTheme({
  primaryColor: 'teal',
});

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/stage/:id" element={<StageProvider />} />
        <Route path="/first-launch" element={<Onboarding />} />
      </Routes>
    </MemoryRouter>
  </MantineProvider>,
);
