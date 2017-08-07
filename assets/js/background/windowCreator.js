/**
*
* This code is compatible in main.js and created window so
* we are creating a global object.

  Yes it is boilerplate code.
*
**/


/**
 *
 * Window Creation Manager
 *
 **/

class WindowCreator {
    constructor(url, options, cb) {
        this.url = url;
        this.options = options;
        this.cb = cb || function() {};
        this._windowInstance = null;
        this.open();
        this.addDefaultListerners();
    }
    addDefaultListerners() {
        this.listenCrash();
    }
    listenCrash() {
        let appWin = this.get();
        let windowInfo = {
            title: path.basename(this.url, '.html'),
            url: this.url,
            id: appWin.id
        };
        appWin.webContents.on('crashed', () => {
            console.log('Crashed :: ' + windowInfo.title + " id: " + windowInfo.id);
            Emitter.emit('RendererCrash', windowInfo);
        });
    }
    open() {
        if (this.url) {
            this._windowInstance = new BrowserWindow(this.options);
            this._windowInstance.loadURL(this.url, {
                extraHeaders: 'pragma: no-cache\n'
            });
            this.hideMenuBar();
            this.show();
            this.onClose();
        }
    }
    get(cb, context) {
        /**
         *
         * When callback function is provided as an argument
         * we are using the callback to provide window handle
         * as in continous passing style or direct sync returning
         * the handle.
         *
         **/
        if (this._windowInstance) {
            let appWindow = this._windowInstance;
            if (cb) {
                cb.call(context || null, appWindow);
            } else {
                return appWindow;
            }
        }
    }
    hideMenuBar() {
        let appWin = this.get();
        appWin.setMenuBarVisibility(false);
    }
    onClose() {
        let appWin = this.get();
        appWin.once('closed', () => {
            if (this && this.url) {
                console.log('onclosed ?? :: ' + this.url);
                container.remove(this.url);
            }
        });
    }
    show() {
        let appWin = this.get();
        if (this.options && this.options.show)
            appWin.show();
    }
    hide() {
        let appWin = this.get();
        appWin.hide();
    }
}
module.exports = WindowCreator;
const {BrowserWindow} = require('electron');
let path = require('path');
let container = require('./windowAccess.js');