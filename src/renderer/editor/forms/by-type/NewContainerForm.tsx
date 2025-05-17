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
import { useNavigate } from 'react-router-dom';

interface NewContainerFormProps {
  parentStageID: string;
}

export default function NewContainerForm(props: NewContainerFormProps) {
  const { parentStageID } = props;
  const navigate = useNavigate();
  const { stage: parentStage, setStage: setParentStage } =
    useContext(StageContext)!;
  const { position } = useContext(PositionContext);
  const [updateMode, setUpdateMode] = useState<boolean>(false);

  const containerForm = useForm({
    name: 'new-container-form',
    mode: 'uncontrolled',
    initialValues: {
      stageID: '',
      stageName: '',
      position,
    },
  });

  const handleSubmit = async (values: any) => {
    console.log('values', values);
    const stageDb = new PouchDb<Stage>('stage');
    const configDb = new PouchDb<Config>('config');
    const stageCounterConfig = await configDb.get<ConfigEntity>(
      ConfigKey.STAGE_ID_COUNTER,
    );

    // update shortcut in parent stage
    const parent: StageEntity = await stageDb.get(parentStageID);
    const shortcut = parent!.children[values.position] as ContainerShortcut;
    shortcut.type = ShortcutType.CONTAINER;
    if (!updateMode) {
      // insert new stage
      const { id } = await createStage(
        stageDb,
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
    const shortcut = parentStage!.children[position] as ContainerShortcut;
    if (shortcut.type === ShortcutType.CONTAINER) {
      setUpdateMode(true);
      containerForm.setValues({
        stageID: shortcut.stageID,
        stageName: shortcut.stageName,
        position,
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
            onClick={() => {
              console.log(
                `/editor/${(parentStage!.children[position] as ContainerShortcut).stageID}`,
              );
              navigate(
                `/editor/${(parentStage!.children[position] as ContainerShortcut).stageID}`,
              );
            }}
          >
            Open container
          </Button>
        )}
      </Stack>
    </form>
  );
}
