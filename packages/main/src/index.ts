 /* eslint-disable */
import {app, Menu, Tray, nativeImage, BrowserWindow} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {restoreOrCreateUploadWindow} from './uploadBackroundWindow';
import {restoreOrCreateChangeBackgroundWindow} from './changeBackgroundWindow';
import useHandlers, {store} from './Handlers';
import {join} from 'path';

const fs = require('fs');
let tray = null;

app.dock.hide();
app.dock.isVisible();

//app.commandLine.appendSwitch('limit-fps', '30');

app.on('ready', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

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
 if(store.get('disableHardwareAcceleration')) {
   //disabling hardware acceleration aka cpu rendering 
   app.disableHardwareAcceleration();
 }

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
  const path = join(__dirname, '../../../buildResources/icon.png');
  const img = nativeImage.createFromPath(path);
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
    ////////////////////////////////////////////////////////////////////////////////
    { label: 'Turn power save', type: 'checkbox', 
      checked: store.get('disableHardwareAcceleration'), 
      click: () => {
        store.set('disableHardwareAcceleration', !store.get('disableHardwareAcceleration'));
        app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
        app.exit(0)
      }
   },
    ////////////////////////////////////////////////////////////////////////////////
    { label: 'Set framerate', type: 'submenu', submenu: 
    [
      {label:'30fps', type:'checkbox', 
      checked: store.get('frameRate') === 30, 
      click: () => { 
        if(store.get('frameRate') !== 30){
          store.set('frameRate', 30);
          app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
          app.exit(0)
        }
      }}, 
    ////////////////////////////////////////////////////////////////////////////////
      {label:'60fps', type:'checkbox', 
      checked: store.get('frameRate') === 60, 
      click: () => { 
        if(store.get('frameRate') !== 60){
          store.set('frameRate', 60);
          app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
          app.exit(0)
        }
      }}
    ] 
    },
    { label: 'Open at startup', 
      type: 'checkbox', 
      checked: store.get('openAtStartup'),
      click: () => {
        store.set('openAtStartup', !store.get('openAtStartup'));
        app.setLoginItemSettings({
          openAtLogin: store.get('openAtStartup'),
        })
        app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
        app.exit(0)
      } 
    },
    ////////////////////////////////////////////////////////////////////////////////
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
