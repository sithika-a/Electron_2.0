const {app,BrowserWindow,ipcMain} = require('electron');
app.commandLine.appendSwitch('remote-debugging-port', '9222');
let path = require('path');
let util = require('./mainUtils.js');
let mainMessaging=require('./mainMessaging.js');
let WindowManager = require('./windowManager.js');
let networkBoot= require('./networkBoot.js');
let menuActions = require('./menuActions.js');

app.on('ready', () => {
         WindowManager.openHiddenContainer();
   
         WindowManager.openChatContainer();
            // Emitter.emit('mainOnload');
            networkBoot.init();
            menuActions.setNativeMenu();
            WindowManager.openWebContainer();

            WindowManager.openV2Container();
});