import { BrowserWindow, ipcMain, screen } from 'electron';
import { isWindowTouchingScreenEdge } from '../util';

const EXPANDED_SIZE = 180;
const COLLAPSED_SIZE = 60;

export default class ToolSizeExpander {
  mainWindow: BrowserWindow;

  private moveHandler: () => void;

  private isResizing = false;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;

    this.moveHandler = () => {
      if (this.isResizing) return;

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
    };

    this.setupMoveHandler();
    this.setupListeners();
  }

  setupMoveHandler() {
    this.mainWindow.on('move', this.moveHandler);
  }

  setupListeners() {
    ipcMain.handle('set-tool-expanded', (_, expanded: boolean) => {
      if (!this.mainWindow) return;

      const currentPosition = this.mainWindow.getPosition();

      // Set flag and remove listener for double protection
      this.isResizing = true;

      this.mainWindow.setResizable(true);
      if (expanded) {
        // Get screen bounds to constrain expansion
        const bounds = this.mainWindow.getBounds();
        const display = screen.getDisplayMatching(bounds);
        const screenBounds = display.workArea;

        // Calculate ideal centered expansion position
        const idealX =
          currentPosition[0] - (EXPANDED_SIZE - COLLAPSED_SIZE) / 2;
        const idealY =
          currentPosition[1] - (EXPANDED_SIZE - COLLAPSED_SIZE) / 2;

        // Constrain to screen bounds
        const maxX = screenBounds.x + screenBounds.width - EXPANDED_SIZE;
        const maxY = screenBounds.y + screenBounds.height - EXPANDED_SIZE;

        const constrainedX = Math.min(Math.max(idealX, screenBounds.x), maxX);
        const constrainedY = Math.min(Math.max(idealY, screenBounds.y), maxY);

        this.mainWindow.setSize(EXPANDED_SIZE, EXPANDED_SIZE, true);
        this.mainWindow.setPosition(constrainedX, constrainedY, true);
      } else {
        // !expanded
        const touchedEdges = isWindowTouchingScreenEdge(this.mainWindow);
        const boundsBefore = this.mainWindow.getBounds();
        const display = screen.getDisplayMatching(boundsBefore);

        this.mainWindow.setSize(COLLAPSED_SIZE, COLLAPSED_SIZE, true);

        let snapX = boundsBefore.x + (EXPANDED_SIZE - COLLAPSED_SIZE) / 2;
        let snapY = boundsBefore.y + (EXPANDED_SIZE - COLLAPSED_SIZE) / 2;

        if (touchedEdges.isTouchingLeft) {
          snapX = display.workArea.x;
        }
        if (touchedEdges.isTouchingRight) {
          snapX = display.workArea.x + display.workArea.width - COLLAPSED_SIZE;
        }
        if (touchedEdges.isTouchingTop) {
          snapY = display.workArea.y;
        }
        if (touchedEdges.isTouchingBottom) {
          snapY = display.workArea.y + display.workArea.height - COLLAPSED_SIZE;
        }

        this.mainWindow.setPosition(snapX, snapY, true);
      }
      this.mainWindow.setResizable(false);

      // Re-enable move handler with delay to ensure all operations complete
      setTimeout(() => {
        this.isResizing = false;
      }, 100);
    });
  }
}
