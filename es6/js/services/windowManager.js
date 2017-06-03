let path = require('path');
// let WindowCreator = require(path.join(__dirname,'WindowCreator.js'));
// let namespace = require(path.join(__dirname,'../assets/emitter/js/DAO/oldCommDAO.js'));

let util = {
    name: 'Utilities',
    log(...args) {
        // let tmp = [].slice.call(arguments);
        // tmp.splice(0, 0, '[' + this.name + '] : ');
        console.log.apply(console, [this.name,args]);
    },
    // log: function() {
    //     let tmp = [];
    //     for (let i = arguments.length - 1; i >= 0; i--) {
    //         tmp[i] = arguments[i];
    //     };
    //     tmp.splice(0, 0, '[' + this.name + '] : ');
    //     // console.log.apply(console, tmp);
    // }
};

let WindowManager = {
    name: "WindowManager",
    log() {
        console.log.apply(console, arguments);
    },
    getAllWindows() {
        return typeof __BrowserWindow != 'undefined' ? __BrowserWindow.getAllWindows() : [];
    },
    getWindowById(id) {
        return (parseInt(id) && typeof __BrowserWindow != 'undefined') ? __BrowserWindow.fromId(id) : false;
    },
    getConfig() {
        if (!this.config) {
            try {
                // WorkAround for check based on code
                // path or production path
                this.config = require(path.join(process.resourcesPath, "app", "config", "config.json"));
            } catch (e) {
                this.config = require(path.join(process.cwd(), 'config', 'config.json'));
            }
        }
        return this.config;
    },
    getContainerPreload() {
        return path.join(this.getFilePath(), 'es6/js/preload/preloadContainer.js');
    },
    getHiddenWindowPreload() {
        return path.join(this.getFilePath(), 'es6/js/preload/preloadHiddenWindow.js');
    },
    getwebPreload() {
        let manifest = require(path.join(this.getFilePath(), 'package.json')); // getting package json path
        arr = manifest.main.match(/(.*asar)/g) // matching asar string. This will return matching array 
        asarPath = arr && arr.length ? '/' + arr[0] : '/asar/full.asar'; // getting first matched value 
        return path.join(this.getFilePath(), asarPath, 'webPreload.min.js'); // getting asar path
    },
    getFilePath() {
        if (this.getConfig() && this.getConfig().mode == 'code') {
            return process.cwd()
        } else {
            return path.join(path.join(process.resourcesPath, "app"));
        }
    },
    openHiddenContainer() {
        console.log('Hidden Window is getting opened !! ');

        // if (emitterController.getContainer('AnyWhereWorks'))
        //     return;

        let filepath = this.getFilePath();
        let hiddenWindow = new WindowCreator('file://' + this.getFilePath() + '/view/hiddenWindow.html', {
            "title": namespace.HIDDEN_CONTAINER,
            "width": 1100,
            "height": 680,
            "fullscreen": false,
            "kiosk": false,
            "show": true,
            "minWidth": 1100,
            "minHeight": 680,
            "webPreferences": {
                preload: this.getHiddenWindowPreload(),
                webSecurity: false,
                allowRunningInsecureContent: true,
                allowDisplayingInsecureContent: true
            }
        });
        return hiddenWindow.get();
    },
    openWebContainer(isShowWindow) {
        util.log('WebContainer is getting opened !! ');
        if (emitterController.getContainer('FULL'))
            return;

        let WebContainer = new WindowCreator('file://' + this.getFilePath() + '/view/FULL.html', {
            "title": namespace.CONTAINER_CHAT,
            "width": 1152,
            "height": 700,
            "fullscreen": false,
            "kiosk": false,
            "center": true,
            "minWidth": 1060,
            "minHeight": 680,
            "show": false,
            "webPreferences": {
                "preload": this.getContainerPreload(),
                "webSecurity": false,
                "allowDisplayingInsecureContent": true,
                "allowRunningInsecureContent": true
            }
        });

        this.setSbHandler(WebContainer.get());
        return WebContainer.get();
    },
    setSbHandler(winRef) {
        winRef.on('focus', event => {
            Emitter.emit("onFocus", {
                container: 'FULL'
            });
            lastFocussedWindow = namespace.CONTAINER_SB;
        });
        winRef.on('blur', event => {
            Emitter.emit("onBlur");
        });
    },
    setV2Handler(winRef) {
        winRef.on('focus', event => {
            Emitter.emit("onFocus", {
                container: 'V2'
            });
        });
        winRef.on('blur', event => {
            Emitter.emit("onBlur");
        });
    },
    openV2Container(isShowWindow) {
        if (emitterController.getContainer('V2'))
            return;

        this.log('V2Container is getting opened !! ');
        let v2Container = new WindowCreator('file://' + this.getFilePath() + '/view/V2.html', {
            "title": namespace.CONTAINER_V2,
            "width": 550,
            "height": 710,
            "fullscreen": false,
            "kiosk": false,
            "center": true,
            "show": false,
            "minWidth": 550,
            "minHeight": 710,
            "webPreferences": {
                preload: this.getContainerPreload(),
                webSecurity: false,
                allowRunningInsecureContent: true,
                allowDisplayingInsecureContent: true
            }
        });
        this.setV2Handler(v2Container.get());
    },
    setChatHandler(winRef) {
        winRef.on('minimize', () => {
            let _tc = new Thinclient('state');
            _tc[_tc.opt]['window']['isMinimized'] = true;
            emitterController.chatHandler(null, _tc);
        });
        winRef.on('focus',() => {
            Emitter.emit("onFocus", {
                container: 'Chat'
            });
            lastFocussedWindow = namespace.CONTAINER_CHAT;
            let _tc = new Thinclient('state');
            _tc[_tc.opt]['window']['isFocused'] = true;
            emitterController.chatHandler(null, _tc);
        });
        winRef.on('blur', () => {
            Emitter.emit("onBlur");
            let _tc = new Thinclient('state');
            _tc[_tc.opt]['window']['isBlured'] = true;
            emitterController.chatHandler(null, _tc);
        });
        winRef.webContents.on('new-window',e => {
            /*
             * new Window opening should be prevented from main process 
             * cannot be done from renderer.
             * check this https://github.com/electron/electron/issues/2770
             */
            e.preventDefault();
        });
    },
    openChatContainer() {
        // if (emitterController.getContainer('AnyWhereWorks'))
        //     return;

        util.log('ChatContainer is getting opened !! ');
        let filepath = this.getFilePath();
        let chatContainer = new WindowCreator('file://' + this.getFilePath() + '/view/AnyWhereWorks.html', {
            "title": namespace.CONTAINER_CHAT,
            "width": 1100,
            "height": 680,
            "fullscreen": false,
            "kiosk": false,
            "show": true,
            "minWidth": 1100,
            "minHeight": 680,
            "webPreferences": {
                preload: this.getContainerPreload(),
                webSecurity: false,
                allowRunningInsecureContent: true,
                allowDisplayingInsecureContent: true
            }
        });
        // this.setChatHandler(chatContainer.get());
    },
    openTimerWidget(options) {
        if (emitterController.getContainer(namespace.CONTAINER_TIMER))
            return;

        let timerContainer = new WindowCreator('file://' + this.getFilePath() + '/view/Timer.html', {
            "title": "TimerWidget",
            "alwaysOnTop": true,
            "frame": false,
            "show": false,
            "width": 165,
            "height": 85,
            "maxWidth": 170,
            "maxHeight": 273,
            "x": options ? options.x : 0,
            "y": options ? options.y : 0,
            "webPreferences": {
                preload: this.getPreloadUrl()
            }
        });

        if (parseInt(process.versions['electron'].split('.')[1]) < 36)
            timerContainer.get().setAlwaysOnTop(true);
    },
    openSBMochaRunner() {
        this.log('ChatContainer is getting opened !! ');
        new WindowCreator('file://' + this.getFilePath() + '/tests/html/sbMochaRun.html', {
            "title": "Mocha",
            "width": 900,
            "height": 600,
            "fullscreen": false,
            "kiosk": false,
            "center": true,
            "webPreferences": {
                preload: this.getPreloadUrl()
            }
        });
    },
    openSBJasmineRunner() {
        this.log('openSBJasmineRunner is getting opened !! ');
        new WindowCreator('file://' + this.getFilePath() + '/tests/jasmine/view/FULLJasmineRunner.html', {
            "title": namespace.CONTAINER_CHAT + "-JasmineRunner",
            "width": 1152,
            "height": 700,
            "fullscreen": false,
            "kiosk": false,
            "center": true,
            "minWidth": 1060,
            "minHeight": 680,
            "show": true,
            "webPreferences": {
                nodeIntegration: true,
                preload: this.getPreloadUrl(),
            }
        });
    },
    openV2MochaRunner() {
        this.log('ChatContainer is getting opened !! ');
        new WindowCreator('file://' + this.getFilePath() + '/tests/html/v2MochaRun.html', {
            "title": "Mocha",
            "width": 900,
            "height": 600,
            "fullscreen": false,
            "kiosk": false,
            "center": true,
            "webPreferences": {
                preload: this.getPreloadUrl()
            }
        });
    },
    openWebsite(url) {
        this.log('openWebsite is getting opened !! ');
        new WindowCreator(url, {
            "title": "Website Loading....",
            "width": 1152,
            "height": 700,
            "fullscreen": false,
            "kiosk": false,
            "center": true,
            "webPreferences": {
                "nodeIntegration": false
            }
        });
    }
}

// Emitter.on('/windowManager/open/chat/container', WindowManager.openChatContainer.bind(WindowManager));
// Emitter.on('/windowManager/open/sb/container', WindowManager.openWebContainer.bind(WindowManager));
// Emitter.on('/windowManager/open/v2/container', WindowManager.openV2Container.bind(WindowManager));