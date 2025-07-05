import { Stack, UnstyledButton } from '@mantine/core';
import Icon from '../../../common/Icon';
import { HotkeyShortcut } from '../../../types/Shortcut';

interface HotkeyProps {
  item: HotkeyShortcut;
  style: React.CSSProperties;
}

export default function Hotkey(props: HotkeyProps) {
  const { item, style } = props;

  return (
    <UnstyledButton>
      <Stack align="center" justify="center" style={style}>
        <Icon icon="tabler:keyboard" size="2rem" />
      </Stack>
    </UnstyledButton>
  );
}
