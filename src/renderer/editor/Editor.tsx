import {
  Button,
  Fieldset,
  SegmentedControl,
  Space,
  Stack,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import PouchDB from 'pouchdb-browser';
import { useParams } from 'react-router-dom';
import { Stage, StageEntity } from '../../types/Stage';
import Loading from '../common/Loading';
import { LinkedLabel } from '../../types/LinkedLabel';
import StageBreadcrumbs from './components/StageBreadcrumbs';
import { SHORTCUT_TYPES } from '../common/constants';
import PositionSelector from './components/PositionSelector';
import { ContainerShortcut, Shortcut } from '../../types/Shortcut';
import ShortcutType from '../enums/ShortcutType';
import NewContainerForm from './forms/NewContainerForm';

export default function EditorApp() {
  const { stageID } = useParams<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<LinkedLabel[]>([]);
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [position, setPosition] = useState<number>(-1);
  const [currentShortcut, setCurrentShortcut] = useState<Shortcut | null>(null);

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

  useEffect(() => {
    if (!currentStage) return;
    setCurrentShortcut(currentStage.children[position]);
  }, [currentStage, position]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <StageBreadcrumbs history={history} />

      <Stack p="md" justify="center" align="center" h="100%">
        <Fieldset legend="Position">
          <PositionSelector
            stage={currentStage}
            position={position}
            setPosition={setPosition}
          />
        </Fieldset>

        <Space h="md" />

        <SegmentedControl
          data={SHORTCUT_TYPES}
          value={currentShortcut?.type}
          // TODO: onChange={setShortcutType}
        />

        <Space h="sm" />

        {currentShortcut?.type === ShortcutType.CONTAINER && (
          <NewContainerForm
            initialValues={{
              parentID: (currentShortcut as ContainerShortcut).stageID,
              stageName: (currentShortcut as ContainerShortcut).stageName,
            }}
          />
        )}

        <Button
          variant="outline"
          onClick={async () => {
            const apps = await window.electron.ipcRenderer.listInstalledApps();
            console.log(apps);
          }}
        >
          Log installed apps
        </Button>
      </Stack>
    </>
  );
}
