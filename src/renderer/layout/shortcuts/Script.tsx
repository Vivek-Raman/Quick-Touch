import { Stack, UnstyledButton } from '@mantine/core';
import { ScriptShortcut } from '../../../types/Shortcut';
import Icon from '../../../common/Icon';

interface ScriptProps {
  item: ScriptShortcut;
  style: React.CSSProperties;
}

export default function Script(props: ScriptProps) {
  const { item, style } = props;

  const execute = () => {
    // TODO: run script
    // window.electron.ipcRenderer.send('ipc--run-script', item.script);
  };

  return (
    <UnstyledButton onClick={execute}>
      <Stack align="center" justify="center" style={style}>
        <Icon icon="tabler:terminal" size="2rem" />
      </Stack>
    </UnstyledButton>
  );
}
