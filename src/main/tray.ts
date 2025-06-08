import { app, Menu, nativeImage, Tray } from 'electron';
import { getAssetPath } from './util';
import openEditScreen from './edit';

export default class AppTray {
  tray: Tray;

  constructor() {
    this.tray = new Tray(
      nativeImage.createFromPath(getAssetPath(app, 'icon.png')),
    );

    this.tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          icon: getAssetPath(app, 'icon.png'),
          enabled: false,
          label: 'Quick-Touch',
        },
        { type: 'separator' },
        {
          label: 'Edit screen',
          click: () => {
            openEditScreen();
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click: () => {
            app.quit();
          },
        },
      ]),
    );
  }
}
