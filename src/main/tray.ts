import { app, Menu, nativeImage, Tray } from 'electron';
import { getAssetPath } from './util';
import EditV2 from './edit-v2';

export default class AppTray {
  tray: Tray;

  constructor() {
    this.tray = new Tray(
      nativeImage.createFromPath(getAssetPath(app, 'icon.png')),
    );

    this.tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          label: 'Edit screen',
          click: () => {
            EditV2.openEditScreen();
          },
        },
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
