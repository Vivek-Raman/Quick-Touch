import {
  Fieldset,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import PouchDb from 'pouchdb-browser';
import ShortcutType from '../../enums/ShortcutType';
import { Stage } from '../../../types/Stage';
import { Shortcut } from '../../../types/Shortcut';
import Loading from '../../common/Loading';
import NewContainerForm from '../forms/NewContainerForm';
import PositionSelector from './PositionSelector';

interface ShortcutUpsertModalProps {
  stageID: string;
  initialPosition: number;
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
  const { stageID, initialPosition } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [stage, setStage] = useState<Stage>();
  const [position, setPosition] = useState<number>(initialPosition);
  const [shortcutType, setShortcutType] = useState<string>(ShortcutType.EMPTY);

  const fetchStage = useCallback(async () => {
    const db = new PouchDb<Stage>('stage');
    const theStage = await db.get(stageID);
    setStage(theStage);
  }, [stageID]);

  // update shortcut when stage or position changes
  // useEffect(() => {
  //   const child = stage?.children.filter((s) => s.position === position);
  //   if (!child) return;
  //   if (child.length <= 0) {
  //     throw new Error(
  //       `Child not found! Stage: ${stage?.children} and position: ${position}`,
  //     );
  //   }
  //   setShortcut(child[0]);
  // }, [stage, position]);

  // fetch stage on component mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchStage();
      setLoading(false);
    })();
  }, [fetchStage]);

  if (loading) return <Loading />;

  return (
    <Stack>
      <SegmentedControl
        value={shortcutType}
        data={SHORTCUT_TYPES}
        onChange={setShortcutType}
      />

      <Fieldset legend="Position">
        <PositionSelector
          stage={stage}
          position={position}
          setPosition={setPosition}
        />
      </Fieldset>

      {shortcutType === ShortcutType.EMPTY && (
        <div>Leave this shortcut slot empty.</div>
      )}

      {shortcutType === ShortcutType.CONTAINER && (
        <>
          <div>This slot will open a new container of shortcuts.</div>
          <NewContainerForm stage={stage} position={position} />
        </>
      )}

      {shortcutType === ShortcutType.OPEN_FILE && <div>Open File Content</div>}

      {shortcutType === ShortcutType.HOTKEY && <div>Hotkey Content</div>}
    </Stack>
  );
}
