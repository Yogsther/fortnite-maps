/**
 * Electron App
 * 
 */

const electron = require("electron");
const {BrowserWindow, app} = require('electron')

app.on("ready", () => {
    var w = new BrowserWindow({
        width: 850,
        height: 920, 
        resizable: false,
        icon: `file://${__dirname}/favicon.ico`
    });
    w.loadURL(`file://${__dirname}/app.html`);
    w.setMenu(null);
    //w.webContents.openDevTools();
})