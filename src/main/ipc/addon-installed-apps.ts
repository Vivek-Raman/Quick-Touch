import { ipcMain } from 'electron';
import nativeAddon from 'list-installed-apps';

export default function loadAddons() {
  ipcMain.handle('list-installed-apps', async () => {
    try {
      return nativeAddon.getInstalledApps();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Native module error:', err);
      return [];
    }
  });
}
