import { Text } from '@mantine/core';
import { Shortcut } from '../../../types/Shortcut';
import ShortcutType from '../../enums/ShortcutType';

interface ShortcutPreviewProps {
  shortcut: Shortcut;
}

export default function ShortcutPreview(props: ShortcutPreviewProps) {
  const { shortcut } = props;

  if (shortcut.type === ShortcutType.EMPTY) {
    return <Text>Empty</Text>;
  }
  if (shortcut.type === ShortcutType.CONTAINER) {
    return <Text>Container</Text>;
  }

  return <div>wat</div>;
}
