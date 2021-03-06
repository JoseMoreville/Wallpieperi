import {BrowserWindow, screen, app,ipcMain} from 'electron';
import {join} from 'path';
import {URL} from 'url';
const fs = require('fs');
const Store = require('electron-store');
const store = new Store();

let browserWindow: BrowserWindow;

async function createWindow() {
  //browserWindow.setVisibleOnAllWorkspaces(true)
  // let the dock be on top of the window
   browserWindow = new BrowserWindow({
   type: 'desktop', 
    x: screen.getPrimaryDisplay().workAreaSize.width 
    - screen.getPrimaryDisplay().size.width 
    + Math.abs(screen.getPrimaryDisplay().workAreaSize.width - screen.getPrimaryDisplay().size.width),
    y: 0,
    movable: false,
    autoHideMenuBar: true,
    enableLargerThanScreen: true,
    skipTaskbar: true,
    roundedCorners: false,
    titleBarStyle: 'hidden',
    resizable: false,
    hasShadow: false,
    show: false, // Use 'ready-to-show' event to show window
    height: screen.getPrimaryDisplay().size.height + 5,
    width: screen.getPrimaryDisplay().size.width + Math.abs(screen.getPrimaryDisplay().workAreaSize.width - screen.getPrimaryDisplay().size.width),
    webPreferences: {
      nativeWindowOpen: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      webSecurity: false,
    },
  });
  if(!store.get('frameRate')) {
    store.set('frameRate', 30);
    browserWindow?.webContents.setFrameRate(30); // might make it depend on electron store value to change between 30 and 60 with tray submenu
  }else{
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
  const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

  let data = '';
   fs.readdir(`${app.getPath('userData')}/backgrounds`, async (err:Error, files: Array<string>) => {
      if (err){
        console.error(err);
        return;
      }
      files = files.filter( file => 
      file.endsWith('.mp4') || 
      file.endsWith('.webm') || 
      file.endsWith('.png') || 
      file.endsWith('.jpg') || 
      file.endsWith('.jpeg'));
      
      for (const video of files) {
        if(video == store.get('currentBackground')){
          data = `${app.getPath('userData')}/backgrounds/${video}`;
          break;
        }
      }
    });
    browserWindow.loadFile(data);
    //browserWindow.loadFile('/Users/hades/Library/Application Support/wallpieperi/backgrounds/videoplayback.mp4');

  /**/
  await browserWindow.loadURL(pageUrl);
  return browserWindow;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
  window?.webContents.session.clearCache();
  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}

ipcMain.handle('getAllScreens', () => {
  return screen.getAllDisplays().length;
});