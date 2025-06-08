import { type MantineStyleProp, Text } from '@mantine/core';
import ShortcutType from '../../common/enums/ShortcutType';
import { Shortcut } from '../../types/Shortcut';
import Icon from './Icon';

interface ShortcutPreviewProps {
  shortcut: Shortcut;
}

export default function ShortcutPreview(props: ShortcutPreviewProps) {
  const { shortcut } = props;
  const style: MantineStyleProp = { fontSize: 'smaller' };

  const getIcon = () => {
    if (shortcut.type === ShortcutType.EMPTY) {
      return <Icon name="fa6-solid:plus" />;
    }
    if (shortcut.type === ShortcutType.CONTAINER) {
      return <Icon name="fa6-solid:folder" />;
    }
    if (shortcut.type === ShortcutType.SCRIPT) {
      return <Text style={style}>Script</Text>;
    }
    return <Icon name="fa6-solid:plus" />;
  };

  return getIcon();
}
