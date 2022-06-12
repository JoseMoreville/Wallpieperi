import { BrowserWindow, app, screen, ipcMain } from 'electron';
import { join } from 'path';
import { URL } from 'url';
const fs = require('fs');
const Store = require('electron-store');
const store = new Store();

let browserWindow: BrowserWindow;

export async function createExternalScreenWindow(position: { x: number, y: number }, size: { width: number, height: number }) {
  browserWindow = new BrowserWindow({
    type: 'desktop',
    x: position.x,
    y: position.y,
    movable: false,
    autoHideMenuBar: true,
    enableLargerThanScreen: true,
    skipTaskbar: true,
    roundedCorners: false,
    titleBarStyle: 'hidden',
    resizable: false,
    hasShadow: false,
    show: false, // Use 'ready-to-show' event to show window
    height: size.height + 5,
    width: size.width,
    webPreferences: {
      nativeWindowOpen: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      webSecurity: false,
    },
  });
  if (!store.get('frameRate')) {
    store.set('frameRate', 30);
    browserWindow?.webContents.setFrameRate(30); // might make it depend on electron store value to change between 30 and 60 with tray submenu
  } else {
    browserWindow?.webContents.setFrameRate(store.get('frameRate'));
  }
  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();
    if (import.meta.env.DEV) {
      //browserWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */

  /**
   * const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
   * ? import.meta.env.VITE_DEV_SERVER_URL +'externalScreen'
   * : new URL('../renderer/dist/externalScreen.html', 'file://' + __dirname).toString();
  */
  const pageUrl = new URL('../renderer/dist/externalScreen.html', 'file://' + __dirname).toString();

  let data = '';
  fs.readdir(`${app.getPath('userData')}/backgrounds`, async (err: Error, files: Array<string>) => {
    if (err) {
      console.error(err);
      return;
    }
    files = files.filter(file =>
      file.endsWith('.mp4') ||
      file.endsWith('.webm') ||
      file.endsWith('.png') ||
      file.endsWith('.jpg') ||
      file.endsWith('.jpeg'));

    for (const video of files) {
      if (video == store.get('currentBackground')) {
        data = `${app.getPath('userData')}/backgrounds/${video}`;
        break;
      }
    }
  });
  browserWindow.loadFile(data);
  await browserWindow.loadURL(pageUrl);
  //console.log('first', screen.getDisplayMatching(browserWindow.getBounds()).id);
  return browserWindow;
}

ipcMain.handle('instanceId', () => {
  return screen.getDisplayMatching(browserWindow.getBounds()).id;
});