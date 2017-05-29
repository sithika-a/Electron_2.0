"use strict";

var _require = require("electron"),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    ipcMain = _require.ipcMain;

app.commandLine.appendSwitch("remote-debugging-port", "9222");

var Emitter = new (require("events").EventEmitter)();

app.on("ready", function () {
        WindowManager.openHiddenContainer();
        WindowManager.openChatContainer();
});
