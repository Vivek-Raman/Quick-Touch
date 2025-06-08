import { SegmentedControl, Stack, Text } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { SHORTCUT_TYPES } from '../../common/constants';
import ShortcutType from '../../common/enums/ShortcutType';
import Loading from '../../common/Loading';
import { Shortcut } from '../../types/Shortcut';
import { PositionContext } from '../context/PositionContext';
import { StageContext } from '../context/StageContext';
import ContainerForm from './by-type/ContainerForm';
import ScriptForm from './by-type/ScriptForm';

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
