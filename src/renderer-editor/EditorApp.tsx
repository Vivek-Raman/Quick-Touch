import { AppShell, Burger, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import PositionSelector from './components/PositionSelector';
import StageBreadcrumbs from './components/StageBreadcrumbs';
import EditorContextWrapper from './context/EditorContextWrapper';
import EditShortcutForm from './forms/EditShortcutForm';

export default function EditorApp() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <EditorContextWrapper>
      <AppShell
        withBorder
        header={{ height: 60 }}
        navbar={{
          width: '24rem',
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Group h="100%" align="center" mx="md">
            <Burger
              size="sm"
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
            />
            <StageBreadcrumbs />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <Stack justify="space-between" h="100%" p="xl">
            <PositionSelector />
            {/* TODO: Settings? */}
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
          <EditShortcutForm />
        </AppShell.Main>
      </AppShell>
    </EditorContextWrapper>
  );
}
