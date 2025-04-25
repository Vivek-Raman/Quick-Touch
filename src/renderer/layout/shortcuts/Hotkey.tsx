import { HotkeyShortcut } from '../../../types/Shortcut';

interface HotkeyProps {
  item: HotkeyShortcut;
}

export default function Hotkey({ item }: HotkeyProps) {
  return <button type="button">{item.keycode}</button>;
}
