const {app,BrowserWindow,ipcMain} = require(`electron`);
app.commandLine.appendSwitch(`remote-debugging-port`, `9222`);


var Emitter = new(require(`events`).EventEmitter);

app.on(`ready`, () => {
        WindowManager.openHiddenContainer();
        WindowManager.openChatContainer();
});