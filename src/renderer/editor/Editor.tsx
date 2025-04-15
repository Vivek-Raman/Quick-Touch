import { Anchor, Breadcrumbs, Button, SimpleGrid } from '@mantine/core';
import { useEffect, useState } from 'react';
import PouchDB from 'pouchdb-browser';
import { Stage, StageEntity } from '../../types/Stage';
import Loading from '../common/Loading';

interface LinkedLabel {
  label: string;
  id: string;
}

export default function EditorApp() {
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
        setLoading(true);
        await loadStage('0');
        setLoading(false);
      }
    })();
  }, [currentStage]);

  if (loading) {
    // TODO: pretty
    return <Loading />;
  }

  return (
    <>
      <Breadcrumbs>
        {history.map((item) => (
          <Anchor key={item.id} href={item.id}>
            {item.label}
          </Anchor>
        ))}
      </Breadcrumbs>
      <SimpleGrid cols={3}>
        {currentStage?.children.map((child, index) => (
          <div key={index}>{child.type}</div>
        ))}
      </SimpleGrid>
      <Button
        onClick={() => {
          window.electron.ipcRenderer.listInstalledApps().then((res) => {
            console.log(res);
          });
        }}
      >
        ghhh
      </Button>
    </>
  );
}
