/* eslint-disable */
import { app, ipcMain, BrowserWindow, dialog } from "electron";
const Store = require("electron-store");
export const store = new Store();
const fs = require("fs");

export default function useHandlers(): void {
    ipcMain.handle("getBackground", (event, arg) => {
        const file =
          app.getPath("userData") + "/backgrounds/" + store.get("currentBackground");
        return file;
      });
      
      ipcMain.handle("changeBackground", (event, arg) => {
        store.set(
          "currentBackground",
          arg.replace(`file://${app.getPath("userData")}/backgrounds/`, "")
        );
        BrowserWindow.getAllWindows()[1].reload();
        return arg.replace(`file://${app.getPath("userData")}/backgrounds/`, "");
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

