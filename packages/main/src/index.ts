 /* eslint-disable */
import {app, Menu, Tray, nativeImage, BrowserWindow} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {restoreOrCreateUploadWindow} from './uploadBackroundWindow';
import {restoreOrCreateChangeBackgroundWindow} from './changeBackgroundWindow';
import useHandlers from './Handlers';

const fs = require('fs');
let tray = null;

app.dock.hide();
app.dock.isVisible();


app.on('ready', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

/**
 * Prevent multiple instances
 */
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

app.on('second-instance', restoreOrCreateUploadWindow);


/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);


/**
 * Create app window when background process will be ready
 */
app.whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error('Failed create window:', e));


/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('Failed install extension:', e));
}

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

app.whenReady().then(() => {
  //store.set('currentBackground', 'videoplayback.mp4');
  const img = nativeImage.createFromPath('/Users/hades/Proyectos/Wallpieperi/wallpieperi/buildResources/pie@256.png');
  const nativeimg = img.resize({width: 16, height: 16});
  tray = new Tray(nativeimg);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Change background', type: 'normal', click: () => {
      try{
        BrowserWindow.getAllWindows().filter(window => window.title === 'Upload Background')[0]?.destroy();
      }
      catch(e){
        console.error(e);
      }
      finally{
        restoreOrCreateChangeBackgroundWindow()
      }
    } },
    { label: 'Upload a new background', type: 'normal', click: () => {
      try{
        BrowserWindow.getAllWindows().filter(window => window.title === 'Change Background')[0]?.destroy();
      }
      catch(e){
        console.error(e);
      }
      finally{
        restoreOrCreateUploadWindow()
      }
    }  },
    { label: '', type: 'separator' },
    { label: 'Quit', type: 'normal', click: () => app.quit() },

  ]);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
  if (!fs.existsSync(app.getPath('userData') + '/backgrounds')){
    fs.mkdirSync(app.getPath('userData') + '/backgrounds');
}
});

app.whenReady().then(() => {
  useHandlers()
})
