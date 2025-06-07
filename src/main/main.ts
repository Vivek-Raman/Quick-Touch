/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell, screen, Menu } from 'electron';
import MenuBuilder from './menu';
import {
  getAssetPath,
  installExtensions,
  isDebug,
  resolveHtmlPath,
} from './util';
import AppUpdater from './updater';
import loadAddons from './ipc/addon-installed-apps';
import AppTray from './tray';

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
    width: 160,
    height: 160,
    resizable: false,
    frame: false,
    transparent: true,
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

  mainWindow.on('move', () => {
    if (!mainWindow) return;

    const bounds = mainWindow.getBounds();
    const display = screen.getDisplayMatching(bounds);

    const maxX = display.bounds.x + display.bounds.width - bounds.width;
    const maxY = display.bounds.y + display.bounds.height - bounds.height;

    const newX = Math.min(Math.max(bounds.x, display.bounds.x), maxX);
    const newY = Math.min(Math.max(bounds.y, display.bounds.y), maxY);

    if (bounds.x !== newX || bounds.y !== newY) {
      mainWindow.setBounds({
        x: newX,
        y: newY,
        width: bounds.width,
        height: bounds.height,
      });
    }
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
  new AppTray();
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

Menu.setApplicationMenu(null);
loadAddons();

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
