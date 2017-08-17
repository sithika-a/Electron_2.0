const {app,BrowserWindow,ipcMain} = require('electron');
app.commandLine.appendSwitch('remote-debugging-port', '9222');

let windowCache = require('./windowCache.js');
let mainMessaging = require('./mainMessaging.js');

// let networkBoot= require('./networkBoot.js');
// let menuActions = require('./menuActions.js');

app.on('ready', () => {
         windowCache.open("HiddenWindow");
         windowCache.open("FULL");
         windowCache.open("Chat");
         windowCache.open("V2");
            // things to do onLoad..
            // networkBoot.init();
            // menuActions.setNativeMenu();
});