import { BrowserWindow, screen } from 'electron';

export async function enableEditMode(mainWindow: BrowserWindow) {
  mainWindow.setSize(800, 800);
  mainWindow.setSkipTaskbar(false);
  mainWindow.setAlwaysOnTop(false);

  // Get the primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Calculate the center position
  const x = Math.floor((width - 800) / 2);
  const y = Math.floor((height - 800) / 2);

  mainWindow.setPosition(x, y, true);
  mainWindow.webContents.send('ipc--set-edit-mode', true);
}

export async function disableEditMode(mainWindow: BrowserWindow) {
  mainWindow.setSize(160, 160); // FIXME: doesn't work
  mainWindow.setSkipTaskbar(true);
  mainWindow.setAlwaysOnTop(true);
  mainWindow.webContents.send('ipc--set-edit-mode', false);
}
