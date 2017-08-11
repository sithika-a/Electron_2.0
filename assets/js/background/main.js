const {app,BrowserWindow,ipcMain} = require('electron');
app.commandLine.appendSwitch('remote-debugging-port', '9222');

let WindowManager = require('./windowManager.js');
let mainMessaging = require('./mainMessaging.js');

// let networkBoot= require('./networkBoot.js');
// let menuActions = require('./menuActions.js');

app.on('ready', () => {
         WindowManager.openHiddenContainer();
         WindowManager.openChatContainer();
         WindowManager.openWebContainer();
         WindowManager.openV2Container();
            // things to do onLoad..
            // networkBoot.init();
            // menuActions.setNativeMenu();
});