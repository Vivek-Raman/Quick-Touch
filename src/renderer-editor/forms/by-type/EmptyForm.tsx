import { Button, Stack, Text } from '@mantine/core';
import PouchDb from 'pouchdb-browser';
import { useContext } from 'react';
import ShortcutType from '../../../common/enums/ShortcutType';
import { Stage, StageEntity } from '../../../types/Stage';
import { PositionContext } from '../../context/PositionContext';
import { StageContext } from '../../context/StageContext';
import TypeChangeContext from '../../context/TypeChangeContext';

export default function EmptyForm() {
  const { stage, setStage } = useContext(StageContext)!;
  const { position } = useContext(PositionContext);
  const { typeChanged } = useContext(TypeChangeContext);

  const handleSaveEmpty = async () => {
    const stageDb = new PouchDb<Stage>('stage');
    const stageToPersist: StageEntity = await stageDb.get(stage!._id);
    stageToPersist.children[position] = {
      position,
      type: ShortcutType.EMPTY,
    };

    const update = await stageDb.put(stageToPersist);
    stageToPersist._rev = update.rev;
    setStage(stageToPersist);
  };

  return (
    <Stack gap="md" w="100%" h="100%">
      {typeChanged && (
        <Text>
          Updating this shortcut to empty will clear all of the configured
          values. If this used to be a container,&nbsp;
          <strong>all of its contents will be removed</strong>.
        </Text>
      )}
      <Button onClick={handleSaveEmpty}>Save as Empty</Button>
    </Stack>
  );
}
