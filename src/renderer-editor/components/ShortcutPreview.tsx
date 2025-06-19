import ShortcutType from '../../common/enums/ShortcutType';
import { Shortcut } from '../../types/Shortcut';
import Icon from './Icon';

interface ShortcutPreviewProps {
  shortcut: Shortcut;
}

export default function ShortcutPreview(props: ShortcutPreviewProps) {
  const { shortcut } = props;

  if (shortcut.type === ShortcutType.EMPTY) {
    return <Icon icon="tabler:new-section" size="2.25rem" />;
  }
  if (shortcut.type === ShortcutType.CONTAINER) {
    return <Icon icon="tabler:folder" size="2.25rem" />;
  }
  if (shortcut.type === ShortcutType.SCRIPT) {
    return <Icon icon="tabler:terminal" size="2.25rem" />;
  }
  return <Icon icon="tabler:question-mark" size="2.25rem" />;
}
