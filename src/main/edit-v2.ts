/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { app, BrowserWindow, Menu, shell } from 'electron';
import { resolveHtmlPath } from './util';

export default class EditV2 {
  static openEditScreen() {
    const editWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });

    editWindow.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });

    editWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;
      const menu = Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            editWindow.webContents.inspectElement(x, y);
          },
        },
      ]);
      menu.popup({ window: editWindow });
    });

    app
      .whenReady()
      .then(() => {
        editWindow.loadURL(resolveHtmlPath('editor.html'));
      })
      .catch(console.error);
  }
}
