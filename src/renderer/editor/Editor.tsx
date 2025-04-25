import { Anchor, Breadcrumbs, Button, SimpleGrid } from '@mantine/core';
import { useEffect, useState } from 'react';
import PouchDB from 'pouchdb-browser';
import { useParams } from 'react-router-dom';
import { Stage, StageEntity } from '../../types/Stage';
import Loading from '../common/Loading';
import { LinkedLabel } from '../../types/LinkedLabel';
import StageBreadcrumbs from './components/StageBreadcrumbs';

export default function EditorApp() {
  const { stageID } = useParams<string>();
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
    <>
      <StageBreadcrumbs history={history} />

      <SimpleGrid cols={3}>
        {currentStage?.children.map((child) => (
          <div key={child.position}>{child.type}</div>
        ))}
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
        variant="outline"
        onClick={async () => {
          console.log('Shortcut added');
        }}
      >
        Add shortcut
      </Button>
    </>
  );
}
