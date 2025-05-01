// FIXME: This is annoying.
/* eslint-disable react/jsx-props-no-spreading */
import { Button, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import PouchDb from 'pouchdb-browser';
import { Stage } from '../../../types/Stage';
import ShortcutType from '../../enums/ShortcutType';
import { ContainerShortcut } from '../../../types/Shortcut';
import Loading from '../../common/Loading';
import ConfigKey from '../../enums/ConfigKey';
import { Config, ConfigEntity } from '../../../types/Config';

interface NewContainerFormProps {
  stage: Stage | undefined;
  position: number;
}

export default function NewContainerForm(props: NewContainerFormProps) {
  const { stage, position } = props;
  const containerForm = useForm({
    name: 'new-container-form',
    mode: 'controlled',
    initialValues: {
      containerName: '',
      parentID: 0,
      position,
    },
  });

  const handleSubmit = async (values: any) => {
    const shortcut = stage!.children[position] as ContainerShortcut;
    if (!shortcut) {
      throw new Error(`Shortcut not found at position: ${position}`);
    }
    shortcut.type = ShortcutType.CONTAINER;
    shortcut.stageId = values.parentID;
    const stageDb = new PouchDb<Stage>('stage');
    await stageDb.put({
      _rev: stage._rev,
    });

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
      _rev: stageCounterConfig._rev,
      _id: stageCounterConfig._id,
      value: (parseInt(stageCounterConfig.value, 10) + 1).toString(),
    });
  };

  if (!stage) return <Loading />;

  return (
    <form onSubmit={containerForm.onSubmit(handleSubmit)}>
      <Stack>
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
