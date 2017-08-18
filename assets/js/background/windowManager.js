// let Thinclient= require('../DAO/oldCommDAO.js');
let WindowCreator = require('./windowCreator.js');
// let menuActions = require('./menuActions.js');
let util = require('./mainUtils.js');
let channel = require('../comm/channel.js');
let windowCache = require('./windowCache.js');
console.log('Hey channel is there  ? ', channel)

let WindowManager = {
    name: "WindowManager",
    openHiddenContainer(state) {
         if (windowCache.get(util.namespace.HIDDEN_CONTAINER))
            return;
        console.log('Hidden Window is getting opened !! ');
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
                webSecurity: false,
                allowRunningInsecureContent: true,
                allowDisplayingInsecureContent: true
            }
        });
        return hiddenWindow.get();
    },
    openWebContainer(isShowWindow) {
         if (windowCache.get(util.namespace.CONTAINER_SB))
            return;
        console.log('WebContainer is getting opened !! ');
        let WebContainer = new WindowCreator('file://' + util.getFilePath() + '/view/FULL.html', {
            "title": util.namespace.CONTAINER_SB,
            "width": 1152,
            "height": 700,
            "fullscreen": false,
            "kiosk": false,
            "center": true,
            "minWidth": 1060,
            "minHeight": 680,
            "show": true,
            "webPreferences": {
                "webSecurity": false,
                "allowDisplayingInsecureContent": true,
                "allowRunningInsecureContent": true
            }
        });
        // this.setSbHandler(WebContainer.get());
        return WebContainer.get();
    },
    setSbHandler(winRef) {
        winRef.on('focus', event => {
            menuActions.onFocus({
                container: 'FULL'
            })
            lastFocussedWindow = util.namespace.CONTAINER_SB;
        });
        winRef.on('blur', event => {
            menuActions.onBlur()
        });
    },
    setV2Handler(winRef) {
        winRef.on('focus', event => {
            menuActions.onFocus()
            menuActions.onFocus({
                container: 'V2'
            })
        });
        winRef.on('blur', event => {
            menuActions.onBlur()
        });
    },
    openV2Container(isShowWindow) {
        if (windowCache.get(util.namespace.CONTAINER_V2))
            return;
        console.log('V2Container is getting opened !! ');
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
                webSecurity: false,
                allowRunningInsecureContent: true,
                allowDisplayingInsecureContent: true
            }
        });
        // this.setV2Handler(v2Container.get());
    },
    setChatHandler(winRef) {
        let messageHandler = require('./mainMessaging.js');
        console.log('messageHandler ', messageHandler)
            // winRef.on('minimize', () => {

        //     let _tc = new Thinclient('state');
        //     _tc[_tc.opt]['window']['isMinimized'] = true;
        //    messageHandler.chatHandler(null, _tc);

        // });
        winRef.on('focus', (event) => {
            menuActions.onFocus({
                container: 'Chat'
            });
            lastFocussedWindow = channel.CONTAINER_CHAT;

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
        if (windowCache.get(channel.CONTAINER_CHAT)) return;
        console.log('ChatContainer is getting opened !! ');
        let filepath = util.getFilePath();
        console.log('FilePath :' + 'file://' + util.getFilePath() + '/view/AnyWhereWorks.html');

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
                webSecurity: false,
                allowRunningInsecureContent: true,
                allowDisplayingInsecureContent: true
            }
        });
        //return chatContainer.open();
        // this.setChatHandler(chatContainer.get());
    }
};
module.exports = WindowManager;