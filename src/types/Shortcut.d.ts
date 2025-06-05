export interface Shortcut {
  position: number;
  type: string;
}

export interface ContainerShortcut extends Shortcut {
  stageID: string;
  stageName: string;
}

export interface HotkeyShortcut extends Shortcut {
  keycode: string;
}

export interface ScriptShortcut extends Shortcut {
  script: string;
}
