import { SegmentedControl, Space, Text } from '@mantine/core';
import { Children, useContext, useEffect, useState } from 'react';
import { Shortcut } from '../../../types/Shortcut';
import { SHORTCUT_TYPES } from '../../common/constants';
import ShortcutType from '../../enums/ShortcutType';
import NewContainerForm from './by-type/NewContainerForm';
import StageContext from '../context/StageContext';
import PositionContext from '../context/PositionContext';

interface EditShortcutFormProps {
  stageID: string;
}

export default function EditShortcutForm(props: EditShortcutFormProps) {
  const { stageID } = props;
  const { stage } = useContext(StageContext);
  const { position } = useContext(PositionContext);
  const [shortcut, setShortcut] = useState<Shortcut>(stage!.children[position]);
  const [type, setType] = useState<string>();

  useEffect(() => {
    if (!stage) return;
    setShortcut(stage.children[position]);
    setType(stage.children[position].type);
  }, [stage, position]);

  return (
    <>
      <SegmentedControl
        key={`${position}-${shortcut}`}
        data={SHORTCUT_TYPES}
        disabled={!shortcut}
        value={type}
        onChange={setType}
        style={{ appRegion: 'no-drag' }}
      />
      {type !== shortcut.type && <Text size="xs">Yet to save changes</Text>}

      <Space h="sm" />

      {type === ShortcutType.CONTAINER && (
        <NewContainerForm parentStageID={stageID} />
      )}
    </>
  );
}
