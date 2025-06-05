import { SegmentedControlItem } from '@mantine/core';
import ShortcutType from '../enums/ShortcutType';

export const SHORTCUTS_IN_STAGE = 8;
export const CENTER_INDEX = SHORTCUTS_IN_STAGE / 2;

export const SHORTCUT_TYPES: SegmentedControlItem[] = [
  {
    label: 'Empty',
    value: ShortcutType.EMPTY,
  },
  {
    label: 'Container',
    value: ShortcutType.CONTAINER,
  },
  {
    label: 'Script',
    value: ShortcutType.SCRIPT,
  },
  {
    label: 'Open File',
    value: ShortcutType.OPEN_FILE,
  },
  {
    label: 'Hotkey',
    value: ShortcutType.HOTKEY,
  },
];
