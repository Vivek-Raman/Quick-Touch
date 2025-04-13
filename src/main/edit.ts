import { BrowserWindow, ipcMain, screen } from 'electron';

export default async function enableEditMode(mainWindow: BrowserWindow) {
  mainWindow.setSize(800, 800);

  // Get the primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Calculate the center position
  const x = Math.floor((width - 800) / 2);
  const y = Math.floor((height - 800) / 2);

  mainWindow.setPosition(x, y, true);
  ipcMain.emit('ipc--set-edit-mode', [true]);
}
