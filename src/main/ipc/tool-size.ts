import { ipcMain } from 'electron';

export default function setupToolSize() {
  ipcMain.handle('set-tool-expanded', (_, expanded: boolean) => {
    console.log('set-tool-expanded', expanded);
  });
}
