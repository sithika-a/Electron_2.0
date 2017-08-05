const {app,BrowserWindow,ipcMain} = require('electron');
app.commandLine.appendSwitch('remote-debugging-port', '9222');
var path = require('path');
var util = require('./mainUtils.js');
// var mainMessaging=require('./mainMessaging.js');
var WindowCreator = require('./windowCreator.js')
console.log('WindowCreator : ',WindowCreator)
// console.log('mainMessaging in main @@@ : ',mainMessaging)
var WindowManager = require('./windowManager.js');


// var networkBoot= require('./networkBoot.js');
var menuActions = require('./menuActions.js');

app.on('ready', () => {
         WindowManager.openHiddenContainer();
   
         WindowManager.openChatContainer();
            // Emitter.emit('mainOnload');
            // networkBoot.init();
            menuActions.setNativeMenu();
            WindowManager.openWebContainer();

            WindowManager.openV2Container();
});