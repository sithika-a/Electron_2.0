const {app,BrowserWindow,ipcMain} = require(`electron`);
app.commandLine.appendSwitch(`remote-debugging-port`, `9222`);

var path = require(`path`);

var util = require(`./mainUtils.js`);

let messenger = util.getModule(`assets/comm/messenger.js`);
//let messenger = require(`../../comm/messenger.js`);
//require(`../assets/js/background/mainMessaging.js`)(util, messenger)
var WindowManager = require(`../services/WindowManager.js`)(util);
//var WindowManager = require(`../services/windowManager.js`);
console.log('WindowManager ? ',WindowManager)

// var WindowManager = require(path.join(process.cwd(),`assets/js/services/WindowManager.js`))

var Emitter = new(require(`events`).EventEmitter);

app.on(`ready`, () => {
        WindowManager.openHiddenContainer();
       WindowManager.openChatContainer();
        //WindowManager.openTimerWidget;
            // Emitter.emit('mainOnload');

});