import { Button } from '@mantine/core';
import { Shortcut } from '../../../types/Shortcut';
import ShortcutType from '../../enums/ShortcutType';

interface ShortcutPreviewProps {
  shortcut: Shortcut;
  showUpsertModal: Function;
}

export default function ShortcutPreview(props: ShortcutPreviewProps) {
  const { shortcut, showUpsertModal } = props;

  if (shortcut.type === ShortcutType.EMPTY) {
    return <Button onClick={() => showUpsertModal()}>Empty</Button>;
  }
  return <div>{shortcut.position}</div>;
}
