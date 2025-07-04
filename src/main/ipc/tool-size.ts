import { BrowserWindow, ipcMain, screen } from 'electron';
import { isWindowTouchingScreenEdge } from '../util';

const EXPANDED_SIZE = 160;
const COLLAPSED_SIZE = 80;

export default class ToolSizeExpander {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;

    this.setupMoveHandler();
    this.setupListeners();
  }

  setupMoveHandler() {
    this.mainWindow.on('move', () => {
      if (!this.mainWindow) return;

      const bounds = this.mainWindow.getBounds();
      const display = screen.getDisplayMatching(bounds);

      const maxX = display.bounds.x + display.bounds.width - bounds.width;
      const maxY = display.bounds.y + display.bounds.height - bounds.height;

      const newX = Math.min(Math.max(bounds.x, display.bounds.x), maxX);
      const newY = Math.min(Math.max(bounds.y, display.bounds.y), maxY);

      if (bounds.x !== newX || bounds.y !== newY) {
        this.mainWindow.setBounds({
          x: newX,
          y: newY,
          width: bounds.width,
          height: bounds.height,
        });
      }
    });
  }

  setupListeners() {
    ipcMain.handle('set-tool-expanded', (_, expanded: boolean) => {
      const currentPosition = this.mainWindow.getPosition();

      this.mainWindow.setResizable(true);
      if (expanded) {
        this.mainWindow.setSize(EXPANDED_SIZE, EXPANDED_SIZE, true);
        this.mainWindow.setPosition(
          currentPosition[0] - (EXPANDED_SIZE - COLLAPSED_SIZE) / 2,
          currentPosition[1] - (EXPANDED_SIZE - COLLAPSED_SIZE) / 2,
          true,
        );
      } else {
        // Determine which screen edges were touched while expanded so we can snap when collapsed
        const touchedEdges = isWindowTouchingScreenEdge(this.mainWindow);
        const boundsBefore = this.mainWindow.getBounds();
        const display = screen.getDisplayMatching(boundsBefore);

        // Resize first so we know the final window width/height
        this.mainWindow.setSize(COLLAPSED_SIZE, COLLAPSED_SIZE, true);

        let snapX = currentPosition[0] - (COLLAPSED_SIZE - EXPANDED_SIZE) / 2;
        let snapY = currentPosition[1] - (COLLAPSED_SIZE - EXPANDED_SIZE) / 2;

        if (touchedEdges.isTouchingLeft) {
          snapX = display.bounds.x;
        }
        if (touchedEdges.isTouchingRight) {
          snapX = display.bounds.x + display.bounds.width - COLLAPSED_SIZE;
        }
        if (touchedEdges.isTouchingTop) {
          snapY = display.bounds.y;
        }
        if (touchedEdges.isTouchingBottom) {
          snapY = display.bounds.y + display.bounds.height - COLLAPSED_SIZE;
        }

        this.mainWindow.setPosition(snapX, snapY, true);
      }
      this.mainWindow.setResizable(false);
    });
  }
}
