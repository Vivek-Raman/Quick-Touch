import PouchDB from 'pouchdb-browser';
import { useContext, useEffect, useState } from 'react';
import { SimpleGrid } from '@mantine/core';
import { useParams } from 'react-router-dom';
import type { Stage, StageEntity } from '../../types/Stage';
import {
  ContainerShortcut,
  HotkeyShortcut,
  ScriptShortcut,
  Shortcut,
} from '../../types/Shortcut';
import Container from './shortcuts/Container';
import Hotkey from './shortcuts/Hotkey';
import Loading from '../../common/Loading';
import ShortcutType from '../../common/enums/ShortcutType';
import { CENTER_INDEX } from '../../common/constants';
import Back from './shortcuts/Back';
import Script from './shortcuts/Script';

export default function StageProvider() {
  const { id: stageID } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  const loadStage = async (id: string) => {
    setLoading(true);
    setShortcuts([]);

    const db = new PouchDB<Stage>('stage');
    const stage: StageEntity = await db.get(id);
    if (!stage) return;
    setShortcuts(stage.children);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadStage(stageID);
    })();
  }, [stageID]);

  if (loading) return <Loading />;
  return (
    <SimpleGrid cols={3}>
      {shortcuts.flatMap((shortcut, index) => {
        const elements = [];
        if (index === CENTER_INDEX) {
          elements.push(<Back key="x" />);
        }
        if (shortcut.type === ShortcutType.EMPTY) {
          elements.push(<div key={shortcut.position} />);
        } else if (shortcut.type === ShortcutType.CONTAINER) {
          elements.push(
            <Container
              key={shortcut.position}
              item={shortcut as ContainerShortcut}
            />,
          );
        } else if (shortcut.type === ShortcutType.SCRIPT) {
          elements.push(
            <Script
              key={shortcut.position}
              item={shortcut as ScriptShortcut}
            />,
          );
        } else if (shortcut.type === ShortcutType.HOTKEY) {
          elements.push(
            <Hotkey
              key={shortcut.position}
              item={shortcut as HotkeyShortcut}
            />,
          );
        }

        return elements;
      })}
    </SimpleGrid>
  );
}
