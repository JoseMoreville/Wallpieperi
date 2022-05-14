/* es-lint-disable */
/* ts-lint-disable */
import {BrowserWindow, screen, app} from 'electron';
import {join} from 'path';
import {URL} from 'url';
const fs = require('fs');
const Store = require('electron-store');
const store = new Store();

// second view that is opened by the icon on tray
// yet to be configured

async function createChangeBackgroundWindow() {
    const browserUploadWindow = new BrowserWindow({
      //skipTaskbar: true,
      movable: true,
      roundedCorners: true,
      title: 'Change Background',
      resizable: true,
      hasShadow: true,
      fullscreenable: false,
      show: true, // Use 'ready-to-show' event to show window
      height: screen.getPrimaryDisplay().size.height-300,
      width: screen.getPrimaryDisplay().size.width-300,
      minHeight:screen.getPrimaryDisplay().size.height-350,
      minWidth:screen.getPrimaryDisplay().size.width-600, 
      enableLargerThanScreen: true,
      webPreferences: {
        nativeWindowOpen: true,
        webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
        preload: join(__dirname, '../../preload/dist/index.cjs'),
        webSecurity: false,
      },
      //titleBarStyle: 'hidden',
      titleBarOverlay: true,
    });
  
    /**
     * If you install `show: true` then it can cause issues when trying to close the window.
     * Use `show: false` and listener events `ready-to-show` to fix these issues.
     *
     * @see https://github.com/electron/electron/issues/25012
     */
     browserUploadWindow.on('ready-to-show', () => {
      browserUploadWindow?.show();
  
      if (import.meta.env.DEV) {
        browserUploadWindow?.webContents.openDevTools();
      }
    });

    browserUploadWindow.on('close', () => app.dock.hide());
    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test
     */
    const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL +'changeBackground'
      : new URL('../renderer/dist/changeBackground.html', 'file://' + __dirname).toString();
    
    let data = '';
    fs.readdir(`${app.getPath('userData')}/backgrounds`, async (err:Error, files: Array<string>) => {
       if (err) console.error(err);
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
     browserUploadWindow.loadFile(data);
     //browserUploadWindow.loadFile('/Users/hades/Library/Application Support/wallpieperi/backgrounds/videoplayback.mp4');
    await browserUploadWindow.loadURL(pageUrl);
     
    return browserUploadWindow;
  }
  
  /**
   * Restore existing BrowserWindow or Create new BrowserWindow
   */
  export async function restoreOrCreateChangeBackgroundWindow() {
    let window = BrowserWindow.getAllWindows().find(w =>  !w.isDestroyed());
    window?.webContents.session.clearCache();
    
    if (BrowserWindow.getAllWindows().length === 1 || BrowserWindow.getAllWindows().length === screen.getAllDisplays().length) {
      window = await createChangeBackgroundWindow();
    } else{
      window = BrowserWindow.getAllWindows().filter(w => w.isMinimized())[0];
    }
    if (window.isMinimized() ||!window.isFocused()) {
      window.restore();
    }
    app.dock.show();
    window.focus();
  }