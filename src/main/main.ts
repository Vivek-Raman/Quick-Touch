/* eslint-disable no-new */
/* eslint global-require: off, no-console: off, promise/always-return: off */

import { app, BrowserWindow, Menu, shell } from 'electron';
import path from 'path';
import ExecuteScript from './ipc/execute-script';
import NativeListApps from './ipc/native-list-apps';
import RelinquishFocus from './ipc/relinquish-focus';
import ToolSizeExpander from './ipc/tool-size';
import MenuBuilder from './menu';
import AppTray from './tray';
import AppUpdater from './updater';
import {
  getAssetPath,
  installExtensions,
  isDebug,
  resolveHtmlPath,
} from './util';

let mainWindow: BrowserWindow | null = null;

if (!isDebug) {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug').default();
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 60,
    height: 60,
    resizable: false,
    frame: false,
    transparent: true,
    useContentSize: true,
    alwaysOnTop: true,
    movable: true,
    skipTaskbar: true,
    icon: getAssetPath(app, 'icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('system-context-menu', (event) => event.preventDefault());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // eslint-disable-next-line
  new AppUpdater();

  // eslint-disable-next-line
  new ToolSizeExpander(mainWindow);
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

Menu.setApplicationMenu(null);

app
  .whenReady()
  .then(() => {
    createWindow();
    new AppTray();
    new NativeListApps();
    new ExecuteScript();
    new RelinquishFocus();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
