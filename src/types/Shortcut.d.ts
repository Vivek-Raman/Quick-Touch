export interface Shortcut {
  position: number;
  type: string;
}

export interface ContainerShortcut extends Shortcut {
  stageId: string;
}

export interface HotkeyShortcut extends Shortcut {
  keycode: string;
}
