// FIXME: This is annoying.
/* eslint-disable react/jsx-props-no-spreading */
import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import PouchDb from 'pouchdb-browser';
import { useContext, useEffect, useState } from 'react';
import { Stage, StageEntity } from '../../../../types/Stage';
import ShortcutType from '../../../enums/ShortcutType';
import { ContainerShortcut } from '../../../../types/Shortcut';
import ConfigKey from '../../../enums/ConfigKey';
import { Config, ConfigEntity } from '../../../../types/Config';
import StageContext from '../../context/StageContext';
import PositionContext from '../../context/PositionContext';
import { createStage } from '../../../common/db-util';
import HistoryContext from '../../context/HistoryContext';

export default function ContainerForm() {
  const { stage: parentStage, setStage: setParentStage } =
    useContext(StageContext)!;
  const { pushHistory } = useContext(HistoryContext);
  const { position } = useContext(PositionContext);
  const [updateMode, setUpdateMode] = useState<boolean>(false);

  const containerForm = useForm({
    name: 'new-container-form',
    mode: 'uncontrolled',
    initialValues: {
      stageID: '',
      stageName: '',
    },
  });

  const getContainerShortcut = () => {
    return parentStage!.children[position] as ContainerShortcut;
  };

  const handleSubmit = async (values: typeof containerForm.values) => {
    const stageDb = new PouchDb<Stage>('stage');
    const configDb = new PouchDb<Config>('config');
    const stageCounterConfig = await configDb.get<ConfigEntity>(
      ConfigKey.STAGE_ID_COUNTER,
    );

    // update shortcut in parent stage
    const parent: StageEntity = await stageDb.get(parentStage!._id);
    const shortcut = parent!.children[position] as ContainerShortcut;
    shortcut.type = ShortcutType.CONTAINER;
    if (!updateMode) {
      // insert new stage
      const { id } = await createStage(
        stageDb,
        parent._id,
        stageCounterConfig.value,
        values.stageName,
      );
      shortcut.stageID = id;
    } else {
      shortcut.stageID = values.stageID;
    }
    shortcut.stageName = values.stageName;
    await stageDb.put(parent);
    setParentStage(parent);

    // update stage counter config
    await configDb.put({
      ...stageCounterConfig,
      value: (parseInt(stageCounterConfig.value, 10) + 1).toString(),
    });
  };

  // load saved shortcut data if available
  useEffect(() => {
    const shortcut = getContainerShortcut();
    if (shortcut.type === ShortcutType.CONTAINER) {
      setUpdateMode(true);
      containerForm.setValues({
        stageID: shortcut.stageID,
        stageName: shortcut.stageName,
      });
    }
  }, [parentStage, position]);

  return (
    <form onSubmit={containerForm.onSubmit(handleSubmit)}>
      <Stack gap="md" align="center" w="100%">
        <TextInput
          label="Container Name"
          key={containerForm.key('stageName')}
          {...containerForm.getInputProps('stageName')}
        />
        {!updateMode && <Button type="submit">Create container</Button>}
        {updateMode && <Button type="submit">Update container</Button>}
        {updateMode && (
          <Button
            variant="subtle"
            onClick={async () => {
              const db = new PouchDb<StageEntity>('stage');
              const stage = await db.get<StageEntity>(
                getContainerShortcut().stageID,
              );
              pushHistory({ id: stage._id, label: stage.name });
              setParentStage(stage);
            }}
          >
            Open container
          </Button>
        )}
      </Stack>
    </form>
  );
}
