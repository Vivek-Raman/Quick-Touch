import { SimpleGrid } from '@mantine/core';
import PouchDB from 'pouchdb-browser';
import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../common/Loading';
import { CENTER_INDEX } from '../../common/constants';
import ShortcutType from '../../common/enums/ShortcutType';
import {
  ContainerShortcut,
  HotkeyShortcut,
  ScriptShortcut,
  Shortcut,
} from '../../types/Shortcut';
import type { Stage, StageEntity } from '../../types/Stage';
import Back from './shortcuts/Back';
import Container from './shortcuts/Container';
import Hotkey from './shortcuts/Hotkey';
import Script from './shortcuts/Script';

export default function StageProvider() {
  const { id: stageID } = useParams<{ id?: string }>();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  const loadStage = async (id: string) => {
    setShortcuts([]);

    const db = new PouchDB<Stage>('stage');
    const stage: StageEntity = await db.get(id);
    if (!stage) return;
    setShortcuts(stage.children);
  };

  useEffect(() => {
    (async () => {
      if (!stageID) return;
      await loadStage(stageID);
    })();
  }, [stageID]);

  return (
    <Suspense fallback={<Loading />}>
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
    </Suspense>
  );
}
