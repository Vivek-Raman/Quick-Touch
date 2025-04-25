import { Button, Modal, SimpleGrid, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import PouchDB from 'pouchdb-browser';
import { useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Stage, StageEntity } from '../../types/Stage';
import Loading from '../common/Loading';
import { LinkedLabel } from '../../types/LinkedLabel';
import StageBreadcrumbs from './components/StageBreadcrumbs';
import ShortcutUpsertModal from './components/ShortcutUpsertModal';
import ShortcutPreview from './components/ShortcutPreview';
import { CENTER_INDEX } from '../common/constants';
import Back from '../layout/shortcuts/Back';

export default function EditorApp() {
  const { stageID } = useParams<string>();
  const [showAddModal, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<LinkedLabel[]>([]);
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);

  const loadStage = async (stageId: string) => {
    const db = new PouchDB<StageEntity>('stage');
    const stage = await db.get(stageId);
    setCurrentStage(stage);
  };

  useEffect(() => {
    (async () => {
      if (!currentStage) {
        if (!stageID) {
          return;
        }
        setLoading(true);
        await loadStage(stageID);
        setLoading(false);
      }
    })();
  }, [currentStage, stageID]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Stack p="md">
      <Modal opened={showAddModal} onClose={closeAddModal} title="Add Shortcut">
        <ShortcutUpsertModal stageID={stageID!} position={-1} />
      </Modal>

      <StageBreadcrumbs history={history} />

      <SimpleGrid cols={3}>
        {currentStage?.children.flatMap((shortcut, index) => {
          const components = [];
          if (index === CENTER_INDEX) {
            components.push(<Back />);
          }
          components.push(
            <ShortcutPreview key={shortcut.position} shortcut={shortcut} />,
          );
          return components;
        })}
      </SimpleGrid>

      <Button
        variant="outline"
        onClick={async () => {
          const apps = await window.electron.ipcRenderer.listInstalledApps();
          console.log(apps);
        }}
      >
        Log installed apps
      </Button>

      <Button
        variant="filled"
        onClick={async () => {
          openAddModal();
        }}
      >
        Add shortcut
      </Button>
    </Stack>
  );
}
