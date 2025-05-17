import { Button, Fieldset, Space, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import PouchDB from 'pouchdb-browser';
import { useParams } from 'react-router-dom';
import { Stage, StageEntity } from '../../types/Stage';
import Loading from '../common/Loading';
import { LinkedLabel } from '../../types/LinkedLabel';
import StageBreadcrumbs from './components/StageBreadcrumbs';
import PositionSelector from './components/PositionSelector';
import EditShortcutForm from './forms/EditShortcutForm';
import StageContext from './context/StageContext';
import PositionContext from './context/PositionContext';

export default function EditorApp() {
  const { stageID } = useParams<string>(); // TODO: use props instead
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<LinkedLabel[]>([]);
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [position, setPosition] = useState<number>(-1);

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

      <StageContext.Provider
        value={{ stage: currentStage, setStage: setCurrentStage }}
      >
        <PositionContext.Provider value={{ position, setPosition }}>
          <Stack p="md" justify="center" align="center" h="100%">
            <Fieldset legend="Position">
              <PositionSelector />
            </Fieldset>
            <Space h="md" />

            {!!currentStage && position >= 0 && (
              <EditShortcutForm stageID={stageID!} />
            )}

            <Button
              variant="outline"
              onClick={async () => {
                const apps =
                  await window.electron.ipcRenderer.listInstalledApps();
                console.log(apps);
              }}
            >
              Log installed apps
            </Button>
          </Stack>
        </PositionContext.Provider>
      </StageContext.Provider>
    </>
  );
}
