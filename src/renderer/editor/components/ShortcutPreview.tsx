import { Shortcut } from '../../../types/Shortcut';

interface ShortcutPreviewProps {
  shortcut: Shortcut;
}

export default function ShortcutPreview(props: ShortcutPreviewProps) {
  const { shortcut } = props;

  return <div>{shortcut.position}</div>;
}
