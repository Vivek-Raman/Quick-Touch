/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import { app, BrowserWindow } from 'electron';
import { resolveHtmlPath } from './util';

export default class EditV2 {
  static openEditScreen() {
    const editWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });

    app
      .whenReady()
      .then(() => {
        editWindow.loadURL(resolveHtmlPath('editor.html'));
      })
      .catch(console.error);
  }
}
