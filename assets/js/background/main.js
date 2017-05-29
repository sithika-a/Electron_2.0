var app = require('electron').app; // Module to control application life.
var BrowserWindow = require('electron').BrowserWindow; // Module to create native browser window.
var Menu = null;
var MenuItem = require('electron').MenuItem;
var EventEmitter = require("events").EventEmitter;
var Emitter = new EventEmitter();

var canQuitApp = false;
var shouldQuit = false;
var lastFocussedWindow = null;

// https://github.com/electron/electron/issues/5998
// https://github.com/electron/electron/pull/5889/files
var argv = global.sharedObject.cliArgs;
if (argv && argv['disable-gpu'])
    app.disableHardwareAcceleration();


app.commandLine.appendSwitch('remote-debugging-port', '9222'); // enabling remote debugging port
app.commandLine.appendSwitch('ignore-certificate-errors', 'true'); // Ignoring certifcate errors to load websites.
app.commandLine.appendSwitch('disable-renderer-backgrounding', 'true'); // https://pracucci.com/electron-slow-background-performances.html
app.commandLine.appendSwitch('disable-gpu', 'true');
app.commandLine.appendSwitch('disable-touch-drag-drop');

if (/^darwin/.test(process.platform)) {
    app.on('activate', function() {
        if (!userInfo || Object.keys(userInfo).length === 0) {
            // Show Chant Window after cache Cleared
            windowEventsController.eventHandler(ipcController.getContainer(namespace.CONTAINER_CHAT), 'show');
            return;
        }
        if (lastFocussedWindow == namespace.CONTAINER_CHAT && typeof userInfo != 'undefined' && userInfo.isFullWork)
            windowEventsController.eventHandler(ipcController.getContainer(namespace.CONTAINER_CHAT), 'show');
        else if (lastFocussedWindow == namespace.CONTAINER_SB)
            windowEventsController.eventHandler(ipcController.getContainer(namespace.CONTAINER_SB), 'show');
        else if (typeof userInfo != 'undefined' && userInfo.isFullWork) {
            windowEventsController.eventHandler(ipcController.getContainer(namespace.CONTAINER_CHAT), 'show');
        } else
            windowEventsController.eventHandler(ipcController.getContainer(namespace.CONTAINER_SB), 'show');
    });
}

app.on('window-all-closed', function() {
    app.quit();
});

Emitter.on('attachAppListeners', function() {
    // Event will not fire in Windows.
    console.log(jsVersion);
    app.on('before-quit', function(event) {
        console.log('before-quit event is getting fired !!!');
        if (!canQuitApp) {
            event.preventDefault();
            ipcController.sbHandler(null, {
                name: 'appQuit',
                sender: 'main'
            });
        }
    });
});

process.on('uncaughtException', function(err) {
    console.error('UncaughtException Handler : ', err.message);
    console.error('UncaughtException Handler : ', err.stack);
});

app.on('ready', function() {
    WindowManager.openChatContainer();
    shouldQuit = app.makeSingleInstance(function() {
        console.log('Single Instace Check')
    });

    if (shouldQuit) app.quit(0);

    Emitter.emit('mainOnload');
});