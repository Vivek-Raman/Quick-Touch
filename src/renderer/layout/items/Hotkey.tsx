import { HotkeyItem } from '../../../types/Item';

interface HotkeyProps {
  item: HotkeyItem;
}

export default function Hotkey({ item }: HotkeyProps) {
  return <button type="button">{item.keycode}</button>;
}
