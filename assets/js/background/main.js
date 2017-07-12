const {app,BrowserWindow,ipcMain} = require(`electron`);
app.commandLine.appendSwitch(`remote-debugging-port`, `9222`);

var path = require(`path`);

var util = require(`./mainUtils.js`);


let messenger = util.getModule(`/assets/comm/messenger.js`);
var mainMessaging=util.getModule(`assets/js/background/mainMessaging.js`)(util, messenger);


console.log('mainMessaging :'+mainMessaging);
var WindowManager = util.getModule(`assets/js/background/windowManager.js`)(util);

console.log('WindowManager ? ',WindowManager)

//var WindowManager = require(path.join(process.cwd(),`assets/js/services/windowManager.js`))

var Emitter = new(require(`events`).EventEmitter);

app.on(`ready`, () => {
         WindowManager.openHiddenContainer();
   
         WindowManager.openChatContainer();

            // Emitter.emit('mainOnload');

});