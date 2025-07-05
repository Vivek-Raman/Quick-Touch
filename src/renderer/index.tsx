import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './App.css';
import ToolSizeContextProvider from './context/ToolSizeContextProvider';
import Root from './layout/Root';
import StageProvider from './layout/StageProvider';
import Onboarding from './onboarding/Onboarding';

const theme = createTheme({
  primaryColor: 'teal',
});

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <MemoryRouter>
      <ToolSizeContextProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/root" element={<Root />} />
          <Route path="/stage/:id" element={<StageProvider />} />
          <Route path="/first-launch" element={<Onboarding />} />
        </Routes>
      </ToolSizeContextProvider>
    </MemoryRouter>
  </MantineProvider>,
);
