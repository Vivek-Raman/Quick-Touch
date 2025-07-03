import { app, ipcMain, Menu } from 'electron';

// TODO: implement and test
export default function setupRelinquishFocus() {
  ipcMain.handle('relinquish-focus', async () => {
    if (process.platform === 'darwin') {
      app.hide();
    } else {
      Menu.sendActionToFirstResponder('hide:');
    }
  });
}
