import { SimpleGrid } from '@mantine/core';
import PouchDB from 'pouchdb-browser';
import { Suspense, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../common/Loading';
import type { Shortcut } from '../../types/Shortcut';
import type { Stage, StageEntity } from '../../types/Stage';
import ToolSizeContext from '../context/ToolSizeContext';
import ShortcutItem from './Shortcut';
import Back from './shortcuts/Back';

export default function StageProvider() {
  const { id: stageID } = useParams<{ id?: string }>();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [mounted, setMounted] = useState(false);
  const { expand } = useContext(ToolSizeContext);

  const loadStage = async (id: string) => {
    setShortcuts([]);

    const db = new PouchDB<Stage>('stage');
    const stage: StageEntity = await db.get(id);
    if (!stage) return;
    setShortcuts(stage.children);
  };

  useEffect(() => {
    setMounted(false);

    (async () => {
      if (!stageID) return;
      await loadStage(stageID);
    })();

    setTimeout(() => {
      setMounted(true);
    }, 10);
  }, [stageID]);

  useEffect(() => {
    expand();
  }, [expand]);

  return (
    <Suspense fallback={<Loading />}>
      <SimpleGrid cols={3} h="100%" p="xs">
        <ShortcutItem shortcut={shortcuts[0]} mounted={mounted} />
        <ShortcutItem shortcut={shortcuts[1]} mounted={mounted} />
        <ShortcutItem shortcut={shortcuts[2]} mounted={mounted} />
        <ShortcutItem shortcut={shortcuts[3]} mounted={mounted} />
        <Back />
        <ShortcutItem shortcut={shortcuts[4]} mounted={mounted} />
        <ShortcutItem shortcut={shortcuts[5]} mounted={mounted} />
        <ShortcutItem shortcut={shortcuts[6]} mounted={mounted} />
        <ShortcutItem shortcut={shortcuts[7]} mounted={mounted} />
      </SimpleGrid>
    </Suspense>
  );
}
