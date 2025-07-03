// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc--set-edit-mode' | 'ipc--dev--flush-db';

const electronHandler = {
  ipcRenderer: {
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    listInstalledApps(): Promise<any[]> {
      return ipcRenderer.invoke('list-installed-apps');
    },
    expand(): Promise<void> {
      return ipcRenderer.invoke('set-tool-expanded', true);
    },
    collapse(): Promise<void> {
      return ipcRenderer.invoke('set-tool-expanded', false);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
