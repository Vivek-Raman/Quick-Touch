import PouchDB from 'pouchdb-browser';
import { useEffect, useState } from 'react';
import type { Stage, StageEntity } from '../../types/Stage';
import type { ContainerItem, HotkeyItem, Item } from '../../types/Item';
import Container from './items/Container';
import Hotkey from './items/Hotkey';

export default function StageProvider() {
  const [loading, setLoading] = useState<boolean>(false);
  // TODO: use saved initial stage
  const [stageId, setStageId] = useState<number>(0);
  const [items, setItems] = useState<Item[]>([]);

  const loadStage = async () => {
    setLoading(true);
    setItems([]);

    const db = new PouchDB<Stage>('stage');
    db.info().then(console.debug);

    const stage: StageEntity = await db.get(stageId.toString());
    if (!stage) return;
    setItems(stage.children);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadStage();
    })();
  }, [stageId]);

  if (loading) return <>Loading...</>;
  return (
    <>
      {items.map((item) => {
        if (item.type === 'container') {
          return (
            <Container
              // key={item.position} // FIXME: add key
              item={item as ContainerItem}
              doUpdate={setStageId}
            />
          );
        }
        if (item.type === 'hotkey') {
          return (
            <Hotkey
              // key={item.position} // FIXME: add key
              item={item as HotkeyItem}
            />
          );
        }

        return <></>;
      })}
    </>
  );
}
