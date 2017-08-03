
let WindowCreator = require(`./windowCreator.js`)
let Thinclient= require(`../DAO/oldCommDAO.js`);
let messageHandler=require('./mainMessaging.js');
let container=require('./windowAccess.js');
let menuActions = require('./menuActions.js');
let util = require('./mainUtils.js');

console.log('Container :'+container);
var WindowManager = {
        name: "WindowManager",
        log() {
            console.log.apply(console, arguments);
        },
        openHiddenContainer( state ) {
            console.log('Hidden Window is getting opened !! ');

            // if (container.get('AnyWhereWorks'))
            //     return;

            let filepath = util.getFilePath();
            let hiddenWindow = new WindowCreator('file://' + util.getFilePath() + '/view/hiddenWindow.html', {
                "title": util.namespace.HIDDEN_CONTAINER,
                "width": 1100,
                "height": 680,
                "fullscreen": false,
                "kiosk": false,
                "show": true,
                "minWidth": 1100,
                "minHeight": 680,
                "webPreferences": {
                    preload: util.getHiddenWindowPreload(),
                    webSecurity: false,
                    allowRunningInsecureContent: true,
                    allowDisplayingInsecureContent: true
                }
            });


            return hiddenWindow.get();
        },
        openWebContainer(isShowWindow) {
            // if (container.get('FULL'))
            //     return;
            console.log('WebContainer is getting opened !! ');

            let WebContainer = new WindowCreator('file://' + util.getFilePath() + '/view/FULL.html', {
                "title": util.namespace.CONTAINER_CHAT,
                "width": 1152,
                "height": 700,
                "fullscreen": false,
                "kiosk": false,
                "center": true,
                "minWidth": 1060,
                "minHeight": 680,
                "show": true,
                "webPreferences": {
                    "preload": util.getContainerPreload(),
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
                menuActions.onFocus({container: 'FULL'})
                lastFocussedWindow = util.namespace.CONTAINER_SB;
            });
            winRef.on('blur', event => {
                menuActions.onBlur()
            });
        },
        setV2Handler(winRef) {
            winRef.on('focus', event => {
                                menuActions.onFocus()
                menuActions.onFocus({container: 'V2'})
            });
            winRef.on('blur', event => {
                                menuActions.onBlur()
            });
        },
        openV2Container(isShowWindow) {
            if (container.get('V2'))
                return;

            this.log('V2Container is getting opened !! ');
            let v2Container = new WindowCreator('file://' + util.getFilePath() + '/view/V2.html', {
                "title": util.namespace.CONTAINER_V2,
                "width": 550,
                "height": 710,
                "fullscreen": false,
                "kiosk": false,
                "center": true,
                "show": false,
                "minWidth": 550,
                "minHeight": 710,
                "webPreferences": {
                    preload: util.getContainerPreload(),
                    webSecurity: false,
                    allowRunningInsecureContent: true,
                    allowDisplayingInsecureContent: true
                }
            });
            this.setV2Handler(v2Container.get());
        },
        setChatHandler(winRef) {
            // winRef.on('minimize', () => {
               
            //     let _tc = new Thinclient('state');
            //     _tc[_tc.opt]['window']['isMinimized'] = true;
            //    messageHandler.chatHandler(null, _tc);

            // });
            winRef.on('focus', (event) =>  {
                menuActions.onFocus({
                    container: 'Chat'
                });
                lastFocussedWindow = util.namespace.CONTAINER_CHAT;
                
               //  let _tc = new Thinclient('state');
               //  // console.log('tc :'+ _tc[_tc.opt]['window']['isFocused'] );
               //  _tc[_tc.opt]['window']['isFocused'] = true;
               // messageHandler.chatHandler(null, _tc);

            });
            winRef.on('blur', (event) => {
                menuActions.onBlur();
                // let _tc = new Thinclient('state');
                // _tc[_tc.opt]['window']['isBlured'] = true;

                // messageHandler.chatHandler(null, _tc);

            });
            winRef.webContents.on('new-window', e => {
                /*
                 * new Window opening should be prevented from main process 
                 * cannot be done from renderer.
                 * check this https://github.com/electron/electron/issues/2770
                 */
                e.preventDefault();
            });
        },
        openChatContainer() {
             // if (container.get('AnyWhereWorks'))
             //     return;

            console.log('ChatContainer is getting opened !! ');
            let filepath = util.getFilePath();
            console.log('FilePath :'+'file://' + util.getFilePath() + '/view/AnyWhereWorks.html');

            let chatContainer = new WindowCreator('file://' + util.getFilePath() + '/view/AnyWhereWorks.html', {
                "title": util.namespace.CONTAINER_CHAT,
                "width": 1100,
                "height": 680,
                "fullscreen": false,
                "kiosk": false,
                "show": true,
                "minWidth": 1100,
                "minHeight": 680,
                "webPreferences": {
                    preload: util.getContainerPreload(),
                    webSecurity: false,
                    allowRunningInsecureContent: true,
                    allowDisplayingInsecureContent: true
                }
            });
            //return chatContainer.open();
             this.setChatHandler(chatContainer.get());
        },
        openTimerWidget(options) {
            if (container.get(util.namespace.CONTAINER_TIMER))
                return;

            let timerContainer = new WindowCreator('file://' + util.getFilePath() + '/view/Timer.html', {
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
            new WindowCreator('file://' + util.getFilePath() + '/tests/html/sbMochaRun.html', {
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
            new WindowCreator('file://' + util.getFilePath() + '/tests/jasmine/view/FULLJasmineRunner.html', {
                "title": util.namespace.CONTAINER_CHAT + "-JasmineRunner",
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
            new WindowCreator('file://' + util.getFilePath() + '/tests/html/v2MochaRun.html', {
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
    };
module.exports = WindowManager;

    