import { SegmentedControl, Space, Stack, Text } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { Shortcut } from '../../types/Shortcut';
import { SHORTCUT_TYPES } from '../../common/constants';
import ShortcutType from '../../common/enums/ShortcutType';
import ContainerForm from './by-type/ContainerForm';
import { StageContext } from '../context/StageContext';
import { PositionContext } from '../context/PositionContext';
import ScriptForm from './by-type/ScriptForm';
import Loading from '../../common/Loading';

export default function EditShortcutForm() {
  const { stage } = useContext(StageContext);
  const { position } = useContext(PositionContext);
  const [shortcut, setShortcut] = useState<Shortcut | null>(
    stage?.children[position] ?? null,
  );
  const [type, setType] = useState<string>();

  useEffect(() => {
    if (!stage) return;
    setShortcut(stage.children[position]);
    setType(stage.children[position].type);
  }, [stage, position]);

  if (!shortcut) {
    return <Loading />;
  }

  return (
    <Stack m="lg">
      <SegmentedControl
        key={`${position}-${shortcut}`}
        data={SHORTCUT_TYPES}
        disabled={!shortcut}
        value={type}
        onChange={setType}
        style={{ appRegion: 'no-drag' }}
      />
      {type !== shortcut.type && <Text size="xs">Yet to save changes</Text>}
      {type === ShortcutType.CONTAINER && <ContainerForm />}
      {type === ShortcutType.SCRIPT && <ScriptForm />}
    </Stack>
  );
}
