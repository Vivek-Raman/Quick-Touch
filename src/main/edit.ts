import { BrowserWindow, screen } from 'electron';

export async function enableEditMode(mainWindow: BrowserWindow) {
  mainWindow.setResizable(true);
  mainWindow.setSize(800, 800);
  mainWindow.setResizable(false);
  mainWindow.setSkipTaskbar(false);
  mainWindow.setAlwaysOnTop(false);

  const display = screen.getDisplayMatching(mainWindow.getBounds());
  const { width, height } = display.workAreaSize;

  // Calculate the center position
  const x = Math.floor((width - 800) / 2);
  const y = Math.floor((height - 800) / 2);

  mainWindow.setPosition(display.workArea.x + x, display.workArea.y + y, true);
  mainWindow.webContents.send('ipc--set-edit-mode', true);
}

export async function disableEditMode(mainWindow: BrowserWindow) {
  mainWindow.setResizable(true);
  mainWindow.setSize(160, 160);
  mainWindow.setResizable(false);
  mainWindow.setSkipTaskbar(true);
  mainWindow.setAlwaysOnTop(true);
  mainWindow.webContents.send('ipc--set-edit-mode', false);
}
