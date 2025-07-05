import { BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const menuOptions: MenuItemConstructorOptions[] = [];

      if (
        process.env.NODE_ENV === 'development' ||
        process.env.DEBUG_PROD === 'true'
      ) {
        menuOptions.push(...this.setupDevelopmentEnvironment(props));
      }
      menuOptions.push(...this.showExitOption());

      Menu.buildFromTemplate(menuOptions).popup({ window: this.mainWindow });
    });
  }

  showExitOption(): MenuItemConstructorOptions[] {
    return [
      {
        label: 'Exit',
        click: () => {
          this.mainWindow.close();
        },
      },
    ];
  }

  setupDevelopmentEnvironment(props: any): MenuItemConstructorOptions[] {
    const { x, y } = props;
    return [
      {
        label: 'Inspect element',
        click: () => {
          this.mainWindow.webContents.inspectElement(x, y);
        },
      },
      {
        label: 'Flush PouchDB',
        click: () => {
          this.mainWindow.webContents.send('ipc--dev--flush-db', true);
        },
      },
    ];
  }
}
