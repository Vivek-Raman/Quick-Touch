import { app, BrowserWindow } from 'electron';
import path from 'path';
import { installExtensions, isDebug, resolveHtmlPath } from './util';

let editWindow: BrowserWindow | null;

export default async function createEditWindow(parent: BrowserWindow) {
  if (editWindow) {
    editWindow.focus();
    return;
  }

  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  editWindow = new BrowserWindow({
    show: true,
    alwaysOnTop: true,
    modal: true,
    parent,
    resizable: false,
    frame: true,
    transparent: false,
    movable: true,
    skipTaskbar: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  editWindow.loadURL(resolveHtmlPath('index.html'));

  editWindow.on('ready-to-show', () => {
    if (!editWindow) {
      throw new Error('"editWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      editWindow.minimize();
    } else {
      editWindow.show();
    }
  });

  editWindow.on('closed', () => {
    editWindow = null;
  });
}
