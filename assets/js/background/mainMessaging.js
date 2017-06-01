'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// let path = require('path');
var _require = require(path.join(__dirname, '../comm/messenger.js')),
    messenger = _require.messenger,
    profile = _require.profile;

var userInfo = null;
var nativeImage = void 0;

var emitterController = {
    name: 'emitterModule',
    containerCache: {
        v2Container: null,
        sbContainer: null,
        chatContainer: null
    },
    log: function log() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        // let tmp = [].slice.call(arguments);
        // tmp.splice(0, 0, '[' + this.name + '] : ');
        console.log.apply(console, [this.name, args]);
    },

    debug: {
        _activateDebug: function _activateDebug() {},
        _deActivateDebug: function _deActivateDebug() {}
    },
    getContainer: function getContainer(title) {
        if (title) {
            switch (title) {
                case "Chat":
                    {
                        title = 'AnyWhereWorks';
                        break;
                    }
                case namespace.CONTAINER_V2_SOFTPHONE:
                    {
                        title = namespace.CONTAINER_SB;
                        break;
                    }
                case namespace.CONTAINER_CHAT:
                    {
                        title = 'AnyWhereWorks';
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
            return this.containerCache[title] || this.setContainer(title);
        }
    },

    setContainer: function setContainer(title) {
        if (title) {
            this.containerCache[title] = this.getTarget({
                "title": title
            });
            return this.containerCache[title];
        }
    },
    removeContainer: function removeContainer(url) {
        var title = void 0;
        if (url && (title = path.basename(url, '.html'))) {
            this.containerCache[title] = null;
        }
    },
    getTarget: function getTarget(lTarget) {
        console.log('searching for Target : ', lTarget);
        var targetArray = WindowManager.getAllWindows();
        for (var i = targetArray.length - 1; i >= 0; i--) {
            /*
                {
                    id : <string>, 
                    title : <string>
                }
            */
            if (targetArray[i].getURL().indexOf(lTarget.title + '.html') !== -1) {
                this.log('container["' + lTarget.title + '"], available ');
                return targetArray[i];
            }
        };
    },
    openContainer: function openContainer(msg) {
        this.log(msg);
        switch (msg.title) {
            case "V2":
                {
                    WindowManager.openV2Container();
                    break;
                }
            case "FULL":
                {
                    WindowManager.openWebContainer();
                    break;
                }
            case "Chat":
                {
                    WindowManager.openChatContainer();
                    break;
                }
            case "sbMocha":
                {
                    WindowManager.openSBMochaRunner();
                    break;
                }
            case "sbJasmineRunner":
                {
                    WindowManager.openSBJasmineRunner();
                    break;
                }
            case "v2Mocha":
                {
                    WindowManager.openV2MochaRunner();
                    break;
                }
            case "Timer":
                {
                    WindowManager.openTimerWidget(msg.options);
                    break;
                }
            default:
                {
                    break;
                }
        }
    },
    passInfo: function passInfo(containerTitle, msg) {
        if (typeof containerTitle == 'string' && (typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) == 'object') {
            var targetWindow = this.getContainer(containerTitle);
            if (targetWindow && targetWindow.send) {
                targetWindow.send('msg-to-' + containerTitle, msg);
            }
        }
    },
    decider: function decider(msg) {
        this.log('Emitter message : ', msg);
        this.log('Decider Block : ' + msg.eType);
        if (msg && msg.eType) {
            switch (msg.eType) {
                case "menuActions":
                    {
                        Emitter.emit('switchZoomUI', msg.opt);
                        break;
                    }
                case "transerInfo":
                    {
                        this.transerInfo(msg);
                        break;
                    }
                case "userInfo":
                    {
                        userInfo = msg.userObj;
                        canQuitApp = false;
                        mainModuleLoader.skillBasedLoader();
                        break;
                    }
                case "init":
                    {
                        Emitter.emit('attachAppListeners');
                        break;
                    }
                case "appQuit":
                    {
                        // Unhide all windows
                        // show the last window on top
                        canQuitApp = true;
                        this.passInfo('Chat', msg);
                        this.passInfo('V2', msg);
                        this.passInfo(namespace.CONTAINER_TIMER, msg);
                        // Making No more message reach from main daemon
                        // thread to any other browser windows.
                        this.passInfo = function () {};
                        break;
                    }
                case "bounce":
                    {
                        this.bounce(msg.opt);
                        break;
                    }
                case "dockHide":
                    {
                        this.hideDockIcon(msg.opt);
                        break;
                    }
                case "setBadge":
                    {
                        this.setBadge(msg.count);
                        break;
                    }
                case "setOverlayIcon":
                    {
                        this.setOverlayIcon(msg);
                        break;
                    }
                case "getState":
                    {
                        var _tc = new Thinclient();
                        this.passInfo('Chat', _tc);
                        break;
                    }
                case "windowEvents":
                    {
                        var container = void 0;
                        if (msg.id && parseInt(msg.id)) container = WindowManager.getWindowById(msg.id);else container = this.getContainer(msg.title);

                        windowEventsController.eventHandler(container, msg.opt, msg.paramObj);
                        // msg.title  may be Chat ,V2,FULL
                        // msg.opt may be window events like bounce,enableontop etc
                        break;
                    }
                case "activateNewV2":
                    {
                        console.log('New v2 switch is on..');
                        ipc.removeAllListeners('msg-to-V2');
                        ipc.on('msg-to-V2', emitterController.v2NewHandler);
                        /**
                         * Switch to new v2 handlers.
                         */
                        break;
                    }
                case "activateOldV2":
                    {
                        console.log('New v2 switch is off..');
                        ipc.removeAllListeners('msg-to-V2');
                        ipc.on('msg-to-V2', emitterController.v2OldHandler);
                        /**
                         * Switch to new v2 handlers.
                         */
                        break;
                    }
                case "loadWebsiteInNewWindow":
                    {
                        WindowManager.openWebsite(msg.url);
                        break;
                    }
                case "reloadV2":
                    {
                        this.passInfo('V2', msg);
                        break;
                    }
                case "open":
                    {
                        this.openContainer(msg);
                        break;
                    }
                case "reLogin":
                    {
                        userInfo = {};
                        canQuitApp = true;
                        this.passInfo('FULL', msg);
                        this.passInfo('Chat', msg);
                        this.passInfo('V2', msg);
                        this.passInfo(namespace.CONTAINER_TIMER, msg);
                        Emitter.emit('/network/boot/startup');
                        break;
                    }
                case "isRestored":
                    {
                        if (msg.container) {
                            switch (msg.container) {
                                case namespace.CONTAINER_V2:
                                    {
                                        crashManager.track.isV2 = false;
                                        break;
                                    }
                                case namespace.CONTAINER_SB:
                                    {
                                        crashManager.track.isSB = false;
                                        break;
                                    }
                                case namespace.CONTAINER_CHAT:
                                    {
                                        crashManager.track.isChat = false;
                                        break;
                                    }
                                default:
                                    {
                                        console.warn('Track : ', msg);
                                        break;
                                    }
                            }
                        }
                        break;
                    }
                case 'isCrashed':
                    {
                        if (msg.container) {
                            switch (msg.container) {
                                case namespace.CONTAINER_V2:
                                    {
                                        this.passInfo(namespace.CONTAINER_V2, {
                                            name: 'crashed',
                                            crashed: crashManager.track.isV2
                                        });
                                        break;
                                    }
                                case namespace.CONTAINER_SB:
                                    {
                                        this.passInfo(namespace.CONTAINER_SB, {
                                            name: 'crashed',
                                            crashed: crashManager.track.isSB
                                        });
                                        break;
                                    }
                                case namespace.CONTAINER_CHAT:
                                    {
                                        this.passInfo(namespace.CONTAINER_CHAT, {
                                            name: 'crashed',
                                            crashed: crashManager.track.isChat
                                        });
                                        break;
                                    }
                                default:
                                    {
                                        console.warn('Track : ', msg);
                                        break;
                                    }
                            }
                        }
                        break;
                    }
                case "dummyMessage":
                    {
                        msg.isReply = true;
                        this.passInfo('FULL', msg);
                        this.passInfo('Chat', msg);
                        this.passInfo('V2', msg);
                        break;
                    }
                case "crashReporter":
                    {
                        if (msg.source) {
                            this.passInfo(msg.source, {
                                name: 'crashReporter',
                                port: crashReportServer.port
                            });
                        }
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
    },
    setBadge: function setBadge(count) {
        if (/^darwin/.test(process.platform)) {
            count ? app.dock.setBadge(count.toString()) : app.dock.setBadge('');
        }
    },
    setOverlayIcon: function setOverlayIcon(msg) {
        try {
            if (/^win32/.test(process.platform) && msg) {

                if (!nativeImage) nativeImage = require('electron').nativeImage;

                if (msg.dataURL) {
                    // In 1.x we have to send it to main container,
                    // remote container is not serialized, so api
                    // change will affect implementation.
                    // check https://github.com/electron/electron/issues/4011
                    this.getContainer('Chat').setOverlayIcon(nativeImage.createFromDataURL(msg.dataURL), "");
                    return true;
                } else this.getContainer('Chat').setOverlayIcon(null, "");

                return false;
            }
        } catch (e) {
            console.log('SetoverLay error ', e.message);
            console.log('SetoverLay error ', e.stack);
        }
    },
    hideDockIcon: function hideDockIcon(count) {
        if (/^darwin/.test(process.platform)) {
            app.dock.hide();
        }
    },
    bounce: function bounce(isContinuous) {
        isContinuous ? app.dock.bounce('critical') : app.dock.bounce();
        // critical,normal mac/win
    },
    transerInfo: function transerInfo(msg) {
        this.log('transerInfo Block :', msg.target);
        var _target = this.getTarget(msg.target);
        if (_target && _target.send) _target.send('msg-from-main', msg);
    },
    v2OldHandler: function v2OldHandler(event, msg) {
        emitterController.passInfo('V2', msg);
    },
    v2NewHandler: function v2NewHandler(event, msg) {
        if (msg && /object/i.test(typeof msg === 'undefined' ? 'undefined' : _typeof(msg))) {
            msg.isForV2 = true;
            emitterController.passInfo(namespace.CONTAINER_V2_SOFTPHONE, msg);
        }
    },
    sbHandler: function sbHandler(event, msg) {
        emitterController.passInfo('FULL', msg);
    },
    chatHandler: function chatHandler(event, msg) {
        emitterController.passInfo('Chat', msg);
    },
    mainHandler: function mainHandler(msg) {
        emitterController.decider(msg);
    },
    timerHandler: function timerHandler(event, msg) {
        emitterController.passInfo(namespace.CONTAINER_TIMER, msg);
    }
};

// ipc.on('msg-to-Main', emitterController.mainHandler);

messenger.subscribe('msg-to-Main', function (event) {

    console.log('message received  in main : ' + event);
    emitterController.mainHandler(event.data);
});

module.exports = emitterController;
