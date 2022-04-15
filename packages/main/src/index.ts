 /* eslint-disable */
import {app, Menu, Tray, nativeImage, ipcMain} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {restoreOrCreateUploadWindow} from './uploadBackroundWindow';
const Store = require('electron-store');
const store = new Store();
const fs = require('fs');
let tray = null;
const pageName = 'uploadBackground';
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
  const img = nativeImage.createFromPath('/Users/hades/Proyectos/Wallpieperi/wallpieperi/buildResources/icon.png');
  const nativeimg = img.resize({width: 16, height: 16});
  tray = new Tray(nativeimg);
  console.log('first', nativeimg.getSize());
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Upload a new background', type: 'normal', click: () => {
      restoreOrCreateUploadWindow()
    } },
    { label: 'Change background', type: 'normal' },
    { label: '', type: 'separator' },
    { label: 'Quit', type: 'normal', click: () => app.quit() },

  ]);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
  if (!fs.existsSync(app.getPath('userData') + '/backgrounds')){
    fs.mkdirSync(app.getPath('userData') + '/backgrounds');
}
});

ipcMain.handle('getBackground', (event, arg) => {
  const file = app.getPath('userData') + '/backgrounds/' + store.get('currentBackground')
  //event.sender.send('msg-respuesta', 'upload');
  return file
})

ipcMain.handle('newBackgroundSelected', (event, arg) => {
  store.set('currentBackground', arg);
  return arg
})