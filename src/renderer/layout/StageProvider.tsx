import PouchDB from 'pouchdb-browser';
import { useEffect, useState } from 'react';
import { SimpleGrid } from '@mantine/core';
import type { Stage, StageEntity } from '../../types/Stage';
import {
  ContainerShortcut,
  HotkeyShortcut,
  Shortcut,
} from '../../types/Shortcut';
import Container from './shortcuts/Container';
import Hotkey from './shortcuts/Hotkey';
import Loading from '../common/Loading';
import ShortcutType from '../enums/ShortcutType';
import { CENTER_INDEX } from '../common/constants';
import Back from './shortcuts/Back';

export default function StageProvider() {
  const [loading, setLoading] = useState<boolean>(false);
  // TODO: use saved initial stage
  const [stageId, setStageId] = useState<string>('0');
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  const loadStage = async (id: string) => {
    setLoading(true);
    setShortcuts([]);

    const db = new PouchDB<Stage>('stage');
    // db.info().then(console.info);

    const stage: StageEntity = await db.get(id);
    if (!stage) return;
    setShortcuts(stage.children);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadStage(stageId);
    })();
  }, [stageId]);

  if (loading) return <Loading />;
  return (
    <SimpleGrid cols={3}>
      {shortcuts.flatMap((shortcut, index) => {
        const elements = [];
        if (index === CENTER_INDEX) {
          elements.push(<Back />);
        }
        if (shortcut.type === ShortcutType.EMPTY) {
          elements.push(<div />);
        } else if (shortcut.type === ShortcutType.CONTAINER) {
          elements.push(
            <Container
              key={shortcut.position}
              item={shortcut as ContainerShortcut}
              doUpdate={setStageId}
            />,
          );
        } else if (shortcut.type === ShortcutType.HOTKEY) {
          elements.push(
            <Hotkey
              // key={item.position} // FIXME: add key
              item={shortcut as HotkeyShortcut}
            />,
          );
        }

        return elements;
      })}
    </SimpleGrid>
  );
}
