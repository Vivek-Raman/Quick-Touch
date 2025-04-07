export interface Item {
  parent: string;
  type: 'container' | 'exec-file' | 'hotkey';
}

export interface ContainerItem extends Item {
  stageId: string;
}

export interface HotkeyItem extends Item {
  keycode: string;
}
