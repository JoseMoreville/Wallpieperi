import {ipcRenderer} from 'electron';
import {exposeInMainWorld} from './exposeInMainWorld';

export const ipcOnRender = ipcRenderer;
exposeInMainWorld('ipcRenderer', ipcOnRender);