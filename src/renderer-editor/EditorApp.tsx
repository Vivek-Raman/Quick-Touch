import { AppShell, Stack } from '@mantine/core';
import EditorContextWrapper from './context/EditorContextWrapper';
import StageBreadcrumbs from './components/StageBreadcrumbs';
import PositionSelector from './components/PositionSelector';
import EditShortcutForm from './forms/EditShortcutForm';

export default function EditorApp() {
  return (
    <EditorContextWrapper>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: '24rem', breakpoint: 'sm' }}
      >
        <AppShell.Header>
          <StageBreadcrumbs />
        </AppShell.Header>
        <AppShell.Navbar>
          <Stack justify="space-between" h="100%" p="xl">
            <PositionSelector />
            <div>asd</div>
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
          <EditShortcutForm />
        </AppShell.Main>
      </AppShell>
    </EditorContextWrapper>
  );
}
