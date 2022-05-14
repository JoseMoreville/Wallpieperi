/* eslint-disable */
import { app, ipcMain, BrowserWindow, dialog } from "electron";
const Store = require("electron-store");
export const store = new Store();
const fs = require("fs");
const activeWindow = require('active-win');

export default function useHandlers(): void {
    ipcMain.handle("getBackground", (event, arg) => {
      const collection = store.get("currentBackground");
      for (const screen in collection) {
        if (Object.prototype.hasOwnProperty.call(collection, screen)) {
          const background = app.getPath("userData") + "/backgrounds/" + collection[screen];
          collection[screen] = background
        }
      }
        return collection;
      });
      
      ipcMain.handle("changeBackground", (event, arg) => {
        const DATA_BEFORE_UPDATE = store.get("currentBackground")
        let UPDATED_DATA = { ...DATA_BEFORE_UPDATE}
        for (const key in arg) {
          if (Object.prototype.hasOwnProperty.call(arg, key)) {
            const element = arg[key].replace(`file://${app.getPath("userData")}/backgrounds/`, "");
            UPDATED_DATA[key] = element
          }
        }
        store.set("currentBackground", UPDATED_DATA);
        BrowserWindow.getAllWindows()[1].reload();
        BrowserWindow.getAllWindows()[2].reload();
        return UPDATED_DATA;
      });
      
      ipcMain.handle("getBackgrounds", (event, arg) => {
        let backgroundCollection: Array<string> = fs.readdirSync(
          `${app.getPath("userData")}/backgrounds`
        );
        backgroundCollection = backgroundCollection
          .map(
            (background) =>
              `file://${app.getPath("userData")}/backgrounds/${background}`
          )
          .filter(
            (background) =>
              background.endsWith(".mp4") ||
              background.endsWith(".webm") ||
              background.endsWith(".png") ||
              background.endsWith(".jpg") ||
              background.endsWith(".jpeg")
          );
      
        return backgroundCollection;
      });
      
      ipcMain.handle("openDialog", (event, arg) => {
        dialog
          .showOpenDialog({
            title: "Select the File to be uploaded",
            defaultPath: app.getPath("desktop"),
            buttonLabel: "Upload",
            filters: [
              {
                name: "Upload a new background",
                extensions: ["png", "jpg", "mp4", "webm", "webp"],
              },
            ],
            properties: ["openFile", "openDirectory"],
          })
          .then(async (file) => {
            // file cancelled handling
            if (file.canceled) {
              throw new Error("file upload was cancelled");
              return;
            }
            fs.copyFileSync(file.filePaths[0], `${app.getPath("userData")}/backgrounds/${file.filePaths[0].split("/").pop()}`);
            try{
              BrowserWindow.getAllWindows().filter(window => window.title === 'Upload Background')[0].close();
            }
            catch(e){
              BrowserWindow.getAllWindows().filter(window => window.title === 'Upload Background')[0].destroy();
            }
          })
          .catch((err) => {
            console.error(err);
          });
      });
}

ipcMain.handle('getAudioStatus', (event, arg) => {
  return store.get('enableAudio')
})

ipcMain.handle('active', async (event, arg) => {
  return await activeWindow.sync();
})

