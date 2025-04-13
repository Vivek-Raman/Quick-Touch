import { Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import enableEditMode from './edit';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const menuOptions: MenuItemConstructorOptions[] = [];
      console.log(props);
      menuOptions.push(...this.showEditOption());
      menuOptions.push({ type: 'separator' });

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

  showEditOption(): MenuItemConstructorOptions[] {
    return [
      {
        label: 'Edit screen',
        click: () => {
          enableEditMode(this.mainWindow);
        },
      },
    ];
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
    ];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
