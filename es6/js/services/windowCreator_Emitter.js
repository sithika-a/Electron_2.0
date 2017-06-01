/**
*
* This code is compatible in main.js and created window so
* we are creating a global object.

  Yes it is boilerplate code.
*
**/
var path = require('path');
var __BrowserWindow = getBrowserWindowConstructor();
var emitterController = require(path.join(__dirname,'../background/mainMessaging_Emitter.js'));

function getBrowserWindowConstructor() {
    if (require && typeof window == "undefined") {
        return require('electron').BrowserWindow;
    } else if (FULLClient.require) {
        var remote = util.getRemote();
        return require('electron').remote.BrowserWindow;
    }
}
/**
 *
 * Window Creation Manager
 *
 **/
function WindowCreator(url, options, cb) {
    this.url = url;
    this.options = options;
    this.cb = cb || function() {};
    this._windowInstance = null;
    this.open();
    this.addDefaultListerners();
};


WindowCreator.prototype.addDefaultListerners = function() {
    this.listenCrash();
};

WindowCreator.prototype.listenCrash = function() {
    var appWin = this.get();
    var windowInfo = {
        title: path.basename(this.url, '.html'),
        url: this.url,
        id: appWin.id
    };
    appWin.webContents.on('crashed',function(){
        console.log('Crashed :: '+windowInfo.title+" id: "+windowInfo.id);
        Emitter.emit('RendererCrash',windowInfo);
    });
}

WindowCreator.prototype.open = function() {
    if (this.url) {
        this._windowInstance = new __BrowserWindow(this.options);
        this._windowInstance.loadURL(this.url, { extraHeaders: 'pragma: no-cache\n' });
        this.hideMenuBar();
        this.show();
        this.onClose();
    }
};

WindowCreator.prototype.get = function(cb, context) {
    /**
     *
     * When callback function is provided as an argument
     * we are using the callback to provide window handle
     * as in continous passing style or direct sync returning
     * the handle.
     *
     **/
    if (this._windowInstance) {
        var appWindow = this._windowInstance;
        if (cb) {
            cb.call(context || null, appWindow);
        } else {
            return appWindow;
        }
    }
};

WindowCreator.prototype.hideMenuBar = function() {
    var appWin = this.get();
    appWin.setMenuBarVisibility(false);
};

WindowCreator.prototype.onClose = function() {
    var appWin = this.get();
    appWin.once('closed', function() {
        if (this && this.url) {
            console.log('onclosed ?? :: ' + this.url);
            emitterController.removeContainer(this.url);
        }
    }.bind(this));
};

WindowCreator.prototype.show = function() {
    var appWin = this.get();
    if (this.options && this.options.show)
        appWin.show();
};

WindowCreator.prototype.hide = function() {
    var appWin = this.get();
    appWin.hide();
};
module.exports = WindowCreator;