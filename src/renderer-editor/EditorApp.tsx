import { AppShell, Stack, Fieldset } from '@mantine/core';
import EditorContextWrapper from './context/EditorContextWrapper';
import StageBreadcrumbs from './components/StageBreadcrumbs';
import PositionSelector from './components/PositionSelector';
import EditShortcutForm from './forms/EditShortcutForm';

export default function EditorApp() {
  return (
    <EditorContextWrapper>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm' }}
      >
        <AppShell.Header>
          <StageBreadcrumbs />
        </AppShell.Header>
        <AppShell.Navbar>
          <Stack p="md">
            <Fieldset legend="Position">
              <PositionSelector />
            </Fieldset>
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
          <EditShortcutForm />
        </AppShell.Main>
      </AppShell>
    </EditorContextWrapper>
  );
}
