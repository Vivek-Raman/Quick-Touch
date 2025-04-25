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

export default function StageProvider() {
  const [loading, setLoading] = useState<boolean>(false);
  // TODO: use saved initial stage
  const [stageId, setStageId] = useState<string>('0');
  const [items, setItems] = useState<Shortcut[]>([]);

  const loadStage = async (id: string) => {
    setLoading(true);
    setItems([]);

    const db = new PouchDB<Stage>('stage');
    // db.info().then(console.info);

    const stage: StageEntity = await db.get(id);
    if (!stage) return;
    setItems(stage.children);
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
      {items.map((item) => {
        if (item.type === ShortcutType.EMPTY) {
          return <>--</>;
        }
        if (item.type === ShortcutType.CONTAINER) {
          return (
            <Container
              // key={item.position} // FIXME: add key
              item={item as ContainerShortcut}
              doUpdate={setStageId}
            />
          );
        }
        if (item.type === ShortcutType.HOTKEY) {
          return (
            <Hotkey
              // key={item.position} // FIXME: add key
              item={item as HotkeyShortcut}
            />
          );
        }

        return <>huh?</>;
      })}
    </SimpleGrid>
  );
}
