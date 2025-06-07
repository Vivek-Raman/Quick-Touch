// FIXME: This is annoying.
/* eslint-disable react/jsx-props-no-spreading */
import { Stack, TextInput, Button } from '@mantine/core';
import PouchDb from 'pouchdb-browser';
import { useForm } from '@mantine/form';
import { useContext, useEffect, useState } from 'react';
import { Stage, StageEntity } from '../../../types/Stage';
import { PositionContext } from '../../context/PositionContext';
import { StageContext } from '../../context/StageContext';
import ShortcutType from '../../../common/enums/ShortcutType';
import { ScriptShortcut } from '../../../types/Shortcut';

export default function ScriptForm() {
  const { stage: parentStage, setStage: setParentStage } =
    useContext(StageContext)!;
  const { position } = useContext(PositionContext);
  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const scriptForm = useForm({
    name: 'script-form',
    mode: 'uncontrolled',
    initialValues: {
      script: '',
    },
  });

  const handleSubmit = async (values: typeof scriptForm.values) => {
    const stageDb = new PouchDb<Stage>('stage');

    // update shortcut in stage
    const parent: StageEntity = await stageDb.get(parentStage!._id);
    const shortcut = parent!.children[position] as ScriptShortcut;
    shortcut.type = ShortcutType.SCRIPT;
    shortcut.script = values.script;
    await stageDb.put(parent);
    setParentStage(parent);
  };

  const getScriptShortcut = () => {
    return parentStage!.children[position] as ScriptShortcut;
  };

  useEffect(() => {
    const shortcut = getScriptShortcut();
    if (shortcut.type === ShortcutType.SCRIPT) {
      setUpdateMode(true);
      scriptForm.setValues({
        script: shortcut.script,
      });
    }
  }, [parentStage, position]);

  return (
    <form onSubmit={scriptForm.onSubmit(handleSubmit)}>
      <Stack gap="md" align="center" w="100%">
        <TextInput
          label="Script to execute"
          key={scriptForm.key('script')}
          {...scriptForm.getInputProps('script')}
        />
        <Button type="submit">Save script</Button>
      </Stack>
    </form>
  );
}
