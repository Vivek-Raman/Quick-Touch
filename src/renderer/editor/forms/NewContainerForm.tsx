// FIXME: This is annoying.
/* eslint-disable react/jsx-props-no-spreading */
import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import PouchDb from 'pouchdb-browser';
import { useEffect, useState } from 'react';
import { Stage, StageEntity } from '../../../types/Stage';
import ShortcutType from '../../enums/ShortcutType';
import { ContainerShortcut } from '../../../types/Shortcut';
import Loading from '../../common/Loading';
import ConfigKey from '../../enums/ConfigKey';
import { Config, ConfigEntity } from '../../../types/Config';

interface NewContainerFormProps {
  initialValues: {
    stageID: string;
    stageName: string;
    position: number;
  };
}

export default function NewContainerForm({
  initialValues,
}: NewContainerFormProps) {
  const { stageID } = initialValues;
  const [stage, setStage] = useState<StageEntity | null>(null);
  const containerForm = useForm({
    name: 'new-container-form',
    mode: 'controlled',
    initialValues,
  });

  const handleSubmit = async (values: any) => {
    if (!stage) {
      throw new Error(`Stage with ID ${stageID} not found`);
    }

    const shortcut = stage!.children[values.position] as ContainerShortcut;
    shortcut.type = ShortcutType.CONTAINER;
    shortcut.stageID = values.stageID;
    shortcut.stageName = values.stageName;
    const stageDb = new PouchDb<Stage>('stage');
    await stageDb.put(stage);

    const configDb = new PouchDb<Config>('config');
    const stageCounterConfig = await configDb.get<ConfigEntity>(
      ConfigKey.STAGE_ID_COUNTER,
    );

    // insert new stage
    await stageDb.put({
      _id: stageCounterConfig.value,
      name: values.containerName,
      children: [],
    });

    // update stage counter config
    await configDb.put({
      ...stageCounterConfig,
      value: (parseInt(stageCounterConfig.value, 10) + 1).toString(),
    });
  };

  // fetch stage from stageID
  useEffect(() => {
    (async () => {
      const db = new PouchDb<Stage>('stage');
      const currentStage = await db.get<StageEntity>(stageID);
      setStage(currentStage);
    })();
  }, [stageID]);

  if (!stage) return <Loading />;

  return (
    <form onSubmit={containerForm.onSubmit(handleSubmit)}>
      <Stack gap="md" align="center" w="100%">
        <TextInput
          label="Container Name"
          key={containerForm.key('containerName')}
          {...containerForm.getInputProps('containerName')}
        />
        <Button type="submit">Create container</Button>
      </Stack>
    </form>
  );
}
