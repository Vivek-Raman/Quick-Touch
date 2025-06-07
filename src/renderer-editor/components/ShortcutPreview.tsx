import { type MantineStyleProp, Text } from '@mantine/core';
import { Shortcut } from '../../types/Shortcut';
import ShortcutType from '../../common/enums/ShortcutType';

interface ShortcutPreviewProps {
  shortcut: Shortcut;
}

export default function ShortcutPreview(props: ShortcutPreviewProps) {
  const { shortcut } = props;
  const style: MantineStyleProp = { fontSize: 'smaller' };

  if (shortcut.type === ShortcutType.EMPTY) {
    return <Text style={style}>Empty</Text>;
  }
  if (shortcut.type === ShortcutType.CONTAINER) {
    return <Text style={style}>Container</Text>;
  }
  if (shortcut.type === ShortcutType.SCRIPT) {
    return <Text style={style}>Script</Text>;
  }

  return <div>wat</div>;
}
