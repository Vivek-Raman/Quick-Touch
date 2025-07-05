/* eslint-disable global-require */
/* eslint-disable no-console */

import { URL } from 'url';
import path from 'path';
import { screen, type App, type BrowserWindow } from 'electron';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

export const getAssetPath = (app: App, ...paths: string[]): string => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');
  return path.join(RESOURCES_PATH, ...paths);
};

export function isWindowTouchingScreenEdge(
  win: BrowserWindow,
  threshold = 10,
): {
  isTouchingLeft: boolean;
  isTouchingTop: boolean;
  isTouchingRight: boolean;
  isTouchingBottom: boolean;
} {
  const windowBounds = win.getBounds();
  const display = screen.getDisplayMatching(windowBounds);
  const screenBounds = display.workArea;

  const isTouchingLeft = windowBounds.x - screenBounds.x <= threshold;
  const isTouchingTop = windowBounds.y - screenBounds.y <= threshold;
  const isTouchingRight =
    screenBounds.x +
      screenBounds.width -
      (windowBounds.x + windowBounds.width) <=
    threshold;
  const isTouchingBottom =
    screenBounds.y +
      screenBounds.height -
      (windowBounds.y + windowBounds.height) <=
    threshold;

  return {
    isTouchingLeft,
    isTouchingTop,
    isTouchingRight,
    isTouchingBottom,
  };
}
