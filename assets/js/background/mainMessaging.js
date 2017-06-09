let messenger = require(namespace.messengerPath);

let messageHandler = {
    name: namespace.module.messageHandler,
    log(...args) {
        // let tmp = [].slice.call(arguments);
        // tmp.splice(0, 0, '[' + this.name + '] : ');
        console.log.apply(console, [this.name,args]);
    },
    passInfo (containerTitle, msg) {
        if (typeof containerTitle == 'string' && typeof msg == 'object') {
            let targetWindow = this.getContainer(containerTitle);
            if (targetWindow && targetWindow.send) {
                targetWindow.send('msg-to-' + containerTitle, msg);
            }
        }
    },
    decider (msg) {
         if (msg  && msg.info && msg.info.eType) {
        var message = msg.info
        this.log('Decider Block : ',message.eType);
       
            switch (message.eType) {
                case "menuActions":
                    {
                        Emitter.emit('switchZoomUI', msg.opt)
                        break;
                    }
                case "transerInfo":
                    {
                        this.transerInfo(msg);
                        break;
                    }
                case "userInfo":
                    {
                        userInfo = message.userObj;
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
                        this.passInfo = function() {};
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
                        let _tc = new Thinclient();
                        this.passInfo('Chat', _tc);
                        break;
                    }
                case "windowEvents":
                    {
                        let container;
                        if (msg.id && parseInt(msg.id))
                            container = WindowManager.getWindowById(msg.id);
                        else
                            container = this.getContainer(msg.title);

                        windowEventsController.eventHandler(container, msg.opt, msg.paramObj);
                        // msg.title  may be Chat ,V2,FULL
                        // msg.opt may be window events like bounce,enableontop etc
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
            messageHandler.passInfo(namespace.CONTAINER_V2_SOFTPHONE, msg);
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
        messageHandler.passInfo(namespace.CONTAINER_TIMER, msg);
    }
};

  messenger.subscribe(namespace.channel.Main, (event) => {

        console.log(`message received  in main : ${event}`);
    messageHandler.mainHandler(event.data);

    });
