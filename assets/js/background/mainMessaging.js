

  module.exports = function(util,messenger) {
var Emitter = new(require(`events`).EventEmitter);

// var utils = require(path.join(process.cwd(),`assets/js/background/mainUtils.js`))
// var WindowManager = util.getModule(`assets/js/background/windowManager.js`)
var windowEventsController = util.getModule(`assets/js/background/windowEvents.js`);
var container = util.getModule(`assets/js/background/windowAccess.js`)(util)
var mainModuleLoader = util.getModule(`assets/js/background/mainModuleLoader.js`)(util)

let messageHandler = {
    name: `mainMessagingModule`,

    log(...args) {
        // let tmp = [].slice.call(arguments);
        // tmp.splice(0, 0, '[' + this.name + '] : ');
        console.log.apply(console, [this.name,args]);
    },
    passInfo (containerTitle, msg) {
    
        // console.log(' container in passInfo  :',container.get)
        if (typeof containerTitle == 'string' && typeof msg == 'object') {
            let targetWindow = container.get(containerTitle);
            if (targetWindow && targetWindow.send) {
                targetWindow.send('msg-to-' + containerTitle, msg);
            }
        }
    },
    decider (info) {
        // console.log('msg info : ',JSON.stringify(info))
         if (info  && info.actionType) {
        this.log('Decider Block : ',info.actionType);
       
            switch (info.actionType) {
                case "menuActions":
                    {
                        Emitter.emit('switchZoomUI', info.opt)
                        break;
                    }
                case "transerInfo":
                    {
                        this.transerInfo(msg);
                        break;
                    }
                case "userInfo":
                    {
                        userInfo = info.userObj;
                        canQuitApp = false;
                        mainModuleLoader.skillBasedLoader();
                        break;
                    }
                case "init":
                    {
                        console.log('init message',JSON.stringify(info))
                        // Emitter.emit('attachAppListeners');
                        break;
                    }
                case "appQuit":
                    {
                        // Unhide all windows
                        // show the last window on top
                        canQuitApp = true;
                        this.passInfo('Chat', msg);
                        this.passInfo('V2', msg);
                        this.passInfo(util.namespace.CONTAINER_TIMER, msg);
                        // Making No more message reach from main daemon
                        // thread to any other browser windows.
                        this.passInfo = function() {};
                        break;
                    }
                case "bounce":
                    {
                        this.bounce(info.opt);
                        break;
                    }
                case "dockHide":
                    {
                        this.hideDockIcon(info.opt);
                        break;
                    }
                case "setBadge":
                    {
                        this.setBadge(info.count);
                        break;
                    }
                case "setOverlayIcon":
                    {
                        this.setOverlayIcon(info);
                        break;
                    }
                case "getState":
                    {
                        let _tc = new Thinclient();
                        this.passInfo('Chat', _tc);
                        break;
                    }
                case "windowEvents":
                    {
                        let _container;
                        if (msg.id && parseInt(msg.id))
                            _container = WindowManager.getWindowById(msg.id);
                        else
                            _container = container.get(info.title);

                        windowEventsController.eventHandler(_container, info.opt, info.paramObj);
                        // msg.title  may be Chat ,V2,FULL
                        // msg.opt may be window events like boutnce,enableontop etc
                        break;
                    }
                case "activateNewV2":
                    {
                        this.log('New v2 switch is on..')
                        ipc.removeAllListeners('msg-to-V2');
                        ipc.on('msg-to-V2', messageHandler.v2NewHandler);
                        /**
                         * Switch to new v2 handlers.
                         */
                        break;
                    }
                case "activateOldV2":
                    {
                        this.log('New v2 switch is off..')
                        ipc.removeAllListeners('msg-to-V2');
                        ipc.on('msg-to-V2', messageHandler.v2OldHandler);
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
                        container.open(msg);
                        break;
                    }
                case "reLogin":
                    {
                        userInfo = {};
                        canQuitApp = true;
                        this.passInfo('FULL', msg);
                        this.passInfo('Chat', msg);
                        this.passInfo('V2', msg);
                        this.passInfo(utils.namespace.CONTAINER_TIMER, msg);
                        Emitter.emit('/network/boot/startup');
                        break;
                    }
                case "isRestored":
                    {
                        if (msg.container) {
                            switch (msg.container) {
                                case util.namespace.CONTAINER_V2:
                                    {
                                        crashManager.track.isV2 = false;
                                        break;
                                    }
                                case util.namespace.CONTAINER_SB:
                                    {
                                        crashManager.track.isSB = false;
                                        break;
                                    }
                                case util.namespace.CONTAINER_CHAT:
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
                                case util.namespace.CONTAINER_V2:
                                    {
                                        this.passInfo(util.namespace.CONTAINER_V2, {
                                            name: 'crashed',
                                            crashed: crashManager.track.isV2
                                        });
                                        break;
                                    }
                                case util.namespace.CONTAINER_SB:
                                    {
                                        this.passInfo(util.namespace.CONTAINER_SB, {
                                            name: 'crashed',
                                            crashed: crashManager.track.isSB
                                        });
                                        break;
                                    }
                                case util.namespace.CONTAINER_CHAT:
                                    {
                                        this.passInfo(util.namespace.CONTAINER_CHAT, {
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
      setBadge: function(count) {
        if (/^darwin/.test(process.platform)) {
            count ?
                app.dock.setBadge(count.toString()) :
                app.dock.setBadge('');
        }
    },
     setOverlayIcon: function(msg) {
        try {
            if (/^win32/.test(process.platform) && msg) {

                if (!nativeImage)
                    nativeImage = require('electron').nativeImage;

                if (msg.dataURL) {
                    // In 1.x we have to send it to main container,
                    // remote container is not serialized, so api
                    // change will affect implementation.
                    // check https://github.com/electron/electron/issues/4011
                    this.getContainer('Chat')
                        .setOverlayIcon(nativeImage.createFromDataURL(msg.dataURL), "");
                    return true;
                } else
                    this.getContainer('Chat')
                    .setOverlayIcon(null, "");

                return false;
            }
        } catch (e) {
            console.log('SetoverLay error ', e.message);
            console.log('SetoverLay error ', e.stack);
        }
    },
    transerInfo(msg) {
        this.log('transerInfo Block :', msg.target);
        let _target = this.getTarget(msg.target);
        if (_target && _target.send)
            _target.send('msg-from-main', msg);
    },
    v2OldHandler(event, msg) {
        messageHandler.passInfo('V2', msg);
    },
    v2NewHandler(event, msg) {
        if (msg && /object/i.test(typeof msg)) {
            msg.isForV2 = true;
            messageHandler.passInfo(utils.namespace.CONTAINER_V2_SOFTPHONE, msg);
        }
    },
    sbHandler(event, msg) {
        messageHandler.passInfo('FULL', msg);
    },
    chatHandler(event, msg) {
        messageHandler.passInfo('Chat', msg);
    },
    mainHandler(msg) {
        messageHandler.decider(msg);
    },
    timerHandler(event, msg) {
        messageHandler.passInfo(utils.namespace.CONTAINER_TIMER, msg);
    }
};

   messenger.subscribe(util.namespace.channel.Main, (event) => {
    messageHandler.mainHandler(event.data);

    });
   return messageHandler;
}


