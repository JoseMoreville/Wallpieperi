/* es-lint-disable */
/* ts-lint-disable */
import {BrowserWindow, app, screen} from 'electron';
import {join} from 'path';
import {URL} from 'url';


async function createUploadWindow() {
    const browserUploadWindow = new BrowserWindow({
      //skipTaskbar: true,
      movable: true,
      roundedCorners: true,
      title: 'Upload Background',
      resizable: false,
      hasShadow: true,
      fullscreenable: false,
      show: true, // Use 'ready-to-show' event to show window
      height: 200,
      width: 250,
      webPreferences: {
        nativeWindowOpen: true,
        webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
        preload: join(__dirname, '../../preload/dist/index.cjs'),
        webSecurity: false,
      },
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
        //browserUploadWindow?.webContents.openDevTools();
      }
    });
    browserUploadWindow.on('close', () => app.dock.hide());
    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test
     */
    const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL +'upload'
      : new URL('../renderer/dist/uploadBackground.html', 'file://' + __dirname).toString();
    
     //browserUploadWindow.loadFile('/Users/hades/Library/Application Support/wallpieperi/backgrounds/videoplayback.mp4');
    await browserUploadWindow.loadURL(pageUrl);
     
    return browserUploadWindow;
  }
  
  /**
   * Restore existing BrowserWindow or Create new BrowserWindow
   */
  export async function restoreOrCreateUploadWindow() {
    let window = BrowserWindow.getAllWindows().find(w =>  !w.isDestroyed());
    window?.webContents.session.clearCache();
    
    if (BrowserWindow.getAllWindows().length === 1 || BrowserWindow.getAllWindows().length === screen.getAllDisplays().length) {
      window = await createUploadWindow();
    } else{
      window = BrowserWindow.getAllWindows().filter(w => w.isMinimized())[0];
    }
    if (window.isMinimized() ||!window.isFocused()) {
      window.restore();
    }
    app.dock.show();
    window.focus();
  }