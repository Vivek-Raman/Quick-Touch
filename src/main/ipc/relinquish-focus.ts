import { app, ipcMain, Menu } from 'electron';

// TODO: implement and test
export default function relinquishFocus() {
  ipcMain.handle('relinquish-focus', async () => {
    if (process.platform === 'darwin') {
      app.hide();
    } else {
      Menu.sendActionToFirstResponder('hide:');
    }
  });
}
