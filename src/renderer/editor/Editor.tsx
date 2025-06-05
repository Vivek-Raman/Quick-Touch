/* eslint-disable react/jsx-no-constructed-context-values */
import { Button, Fieldset, Space, Stack } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import PouchDB from 'pouchdb-browser';
import { Stage, StageEntity } from '../../types/Stage';
import Loading from '../common/Loading';
import { LinkedLabel } from '../../types/LinkedLabel';
import StageBreadcrumbs from './components/StageBreadcrumbs';
import PositionSelector from './components/PositionSelector';
import EditShortcutForm from './forms/EditShortcutForm';
import StageContext from './context/StageContext';
import PositionContext from './context/PositionContext';
import HistoryContext from './context/HistoryContext';

interface EditorProps {
  initialStageID: string;
}

export default function EditorApp(props: EditorProps) {
  const { initialStageID } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<
    (Stage & PouchDB.Core.IdMeta) | null
  >(null);
  const [position, setPosition] = useState<number>(-1);

  // History
  const [history, setHistory] = useState<LinkedLabel[]>([]);
  const pushHistory = useCallback((toAdd: LinkedLabel) => {
    if (history.lastIndexOf(toAdd) !== -1) {
      return;
    }
    setHistory((prev) => [...prev, toAdd]);
  }, []);

  const popHistory = useCallback(() => {
    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory.pop();
      return newHistory;
    });
  }, []);

  const loadStage = async (stageId: string) => {
    const db = new PouchDB<StageEntity>('stage');
    return db.get(stageId);
  };

  // load initial stage
  useEffect(() => {
    (async () => {
      setLoading(true);
      const stage = await loadStage(initialStageID);
      setCurrentStage(stage);
      pushHistory({ id: stage._id, label: stage.name });
      setLoading(false);
    })();
  }, [initialStageID, pushHistory]);

  if (loading) {
    return <Loading />;
  }

  return (
    <HistoryContext.Provider value={{ history, pushHistory, popHistory }}>
      <StageContext.Provider
        value={{
          stage: currentStage,
          setStage: setCurrentStage,
        }}
      >
        <PositionContext.Provider value={{ position, setPosition }}>
          <Stack p="md" justify="center" align="center" h="100%">
            <StageBreadcrumbs />
            <Space h="md" />
            <Fieldset legend="Position">
              <PositionSelector />
            </Fieldset>
            <Space h="md" />

            {!!currentStage && position >= 0 && (
              <EditShortcutForm stageID={initialStageID!} />
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
    </HistoryContext.Provider>
  );
}
