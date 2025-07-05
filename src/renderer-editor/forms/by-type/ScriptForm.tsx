// FIXME: This is annoying.
/* eslint-disable react/jsx-props-no-spreading */
import { Button, Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import PouchDb from 'pouchdb-browser';
import { useContext, useEffect, useState } from 'react';
import ShortcutType from '../../../common/enums/ShortcutType';
import { ScriptShortcut } from '../../../types/Shortcut';
import { Stage, StageEntity } from '../../../types/Stage';
import { PositionContext } from '../../context/PositionContext';
import { StageContext } from '../../context/StageContext';

export default function ScriptForm() {
  const { stage, setStage } = useContext(StageContext)!;
  const { position } = useContext(PositionContext);
  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const scriptForm = useForm({
    name: 'script-form',
    mode: 'uncontrolled',
    initialValues: {
      script: '',
    },
    validate: {
      script: (value) => {
        if (value.length === 0) {
          return 'Script is required';
        }
      },
    },
  });

  const handleSubmit = async (values: typeof scriptForm.values) => {
    const stageDb = new PouchDb<Stage>('stage');

    // update shortcut in stage
    const stageToPersist: StageEntity = await stageDb.get(stage!._id);
    const shortcut = stageToPersist!.children[position] as ScriptShortcut;
    shortcut.type = ShortcutType.SCRIPT;
    shortcut.script = values.script;
    const update = await stageDb.put(stageToPersist);
    stageToPersist._rev = update.rev;
    setStage(stageToPersist);
  };

  const getScriptShortcut = () => {
    return stage!.children[position] as ScriptShortcut;
  };

  useEffect(() => {
    const shortcut = getScriptShortcut();
    if (shortcut.type === ShortcutType.SCRIPT) {
      setUpdateMode(true);
      scriptForm.setValues({
        script: shortcut.script,
      });
    }
  }, [stage, position]);

  return (
    <form onSubmit={scriptForm.onSubmit(handleSubmit)}>
      <Stack gap="md" w="100%" h="100%">
        <Textarea
          autosize
          minRows={4}
          maxRows={12}
          label="Script to execute"
          key={scriptForm.key('script')}
          {...scriptForm.getInputProps('script')}
          styles={{
            input: {
              fontFamily: 'monospace',
              fontSize: '14px',
            },
          }}
        />
        <Button type="submit">Save script</Button>
      </Stack>
    </form>
  );
}
