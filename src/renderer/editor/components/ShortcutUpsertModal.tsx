import {
  SegmentedControl,
  SegmentedControlItem,
  Stack,
  TextInput,
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import PouchDb from 'pouchdb-browser';
import ShortcutType from '../../enums/ShortcutType';
import { Stage } from '../../../types/Stage';
import { Shortcut } from '../../../types/Shortcut';
import Loading from '../../common/Loading';

interface ShortcutUpsertModalProps {
  stageID: string;
  position: number;
}

const SHORTCUT_TYPES: SegmentedControlItem[] = [
  {
    label: 'Empty',
    value: ShortcutType.EMPTY,
  },
  {
    label: 'Container',
    value: ShortcutType.CONTAINER,
  },
  {
    label: 'Open File',
    value: ShortcutType.OPEN_FILE,
  },
  {
    label: 'Hotkey',
    value: ShortcutType.HOTKEY,
  },
];

export default function ShortcutUpsertModal(props: ShortcutUpsertModalProps) {
  const { stageID, position } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [shortcutType, setShortcutType] = useState<string>(ShortcutType.EMPTY);
  const [shortcut, setShortcut] = useState<Shortcut>();

  const fetchShortcut = useCallback(async () => {
    const db = new PouchDb<Stage>('stage');
    const stage = await db.get(stageID);

    const child = stage.children.filter((s) => s.position === position);
    setShortcut(child[0]);
  }, [stageID, position]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchShortcut();
      setLoading(false);
    })();
  }, [fetchShortcut]);

  if (loading) return <Loading />;

  return (
    <Stack>
      <SegmentedControl
        value={shortcutType}
        data={SHORTCUT_TYPES}
        onChange={setShortcutType}
      />

      {shortcutType === ShortcutType.EMPTY && (
        <div>Leave this shortcut slot empty.</div>
      )}
      {shortcutType === ShortcutType.CONTAINER && (
        <div>This slot will open a new container of shortcuts.</div>
      )}
      {shortcutType === ShortcutType.OPEN_FILE && <div>Open File Content</div>}
      {shortcutType === ShortcutType.HOTKEY && <div>Hotkey Content</div>}
    </Stack>
  );
}
