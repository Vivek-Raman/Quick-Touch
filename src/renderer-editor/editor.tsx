import { createTheme, MantineProvider } from '@mantine/core';
import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import EditorApp from './EditorApp';

const theme = createTheme({
  primaryColor: 'teal',
});

const container = document.getElementById('root-editor') as HTMLElement;
const root = createRoot(container);
root.render(
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <EditorApp />
  </MantineProvider>,
);
