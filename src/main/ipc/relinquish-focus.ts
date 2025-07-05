import { app, ipcMain, Menu } from 'electron';

export default class RelinquishFocus {
  constructor() {
    ipcMain.handle('relinquish-focus', async () => {
      if (process.platform === 'darwin') {
        app.hide();
      } else {
        Menu.sendActionToFirstResponder('hide:');
      }
    });
  }
}
