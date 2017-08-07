/**
*
* Incoming PostMessage Listener and Controller
  All the message would reach this controller
  and message would reach the respective modules.
*
**/
(function(R, util) {
    var apiHandler = {
        name: 'apiHandler',
        log: function() {
            util.log.apply(this, arguments);
        },
        unloadTab: function(info) {
            if (info && info['close'].tabIndex) {

                this.log("info.source::" + info['originalEvent'].source);
                this.log("info.tabIndex::" + info['close'].tabIndex);
                /*
                 *  Close and status Push.
                 */
                util.publish('/tab/controller/close/tab/', {
                    source: info['originalEvent'].source,
                    isForce: false,
                    tabIndex: info['close'].tabIndex
                });
            }
        },
        pushStatus: function(sInfo) {
            /*
             * Status Push.
             */
            if (sInfo && sInfo['status'].pushStatus) {
                util.publish('/status/UIController/manual/status/change', sInfo['status'].pushStatus, sInfo.originalEvent);
            }
        },
        handler: function(msg) {
            switch (msg.opt) {
                case "close":
                    {
                        this.pushStatus(msg);
                        this.unloadTab(msg);
                    }
                case "status":
                    {
                        // NO one using this feature so commenting this
                        // in chrome app api routine.
                        // only status can be pushed.
                        // this.pushStatus(msg);
                        break;
                    }
                case 'logACK':
                    {
                        // push the ACK to feedbackAPI
                        util.publish('/feedback/gotACK', msg['logACK']);
                        break;
                    }
                case 'logs':
                    {
                        // push the logs to feedbackAPI
                        util.publish('/feedback/setLogs', msg['logs']);
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
    };

    var clientListenerHandler = {
        handler: function(msg) {
            switch (msg.opt) {
                case 'setv2status':
                    {
                        // send the status to V2
                        util.publish('/util/v2/statusPush', {
                            status: msg[msg.opt].status
                        });
                        break;
                    }
                case "loadwebsite":
                    {
                        if (msg[msg.opt].isBrowserLoad) {
                            // load in browser and get back
                            util.loadWebSiteInBrowser(msg[msg.opt].url);
                        } else if (msg[msg.opt].isFullwork) {
                            // load in our client
                            util.publish('/tab/controller/load/fullwork', msg[msg.opt].url);
                        } else {
                            util.loadWebSiteInNewWindow(msg[msg.opt].url);
                        }
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
    }

    var sbHandler = {
        name: 'sbMsgHandler',
        log: function() {
            util.log.apply(this, arguments);
        },
        load: function(loadInfo) {
            this.log('LoadTab : ', loadInfo);
            if (loadInfo) {
                util.caching.windows.getSB().show();
                util.caching.windows.getSB().focus();
                util.loadURL(loadInfo.url);
            }
        },
        unload: function(unloadInfo) {
            this.log('UnLoadTab : ', unloadInfo);
            if (unloadInfo && unloadInfo.url && util.isUrl(unloadInfo.url)) {
                util.publish('/tab/controller/close/tab/', {
                    source: null,
                    isForce: false,
                    tabIndex: util.getParameterByName('currentTabIndex', unloadInfo.url)
                });
            }
        },
        events: function(eventInfo) {
            switch (eventInfo.triggerEvent) {
                case "enter":
                    {
                        break;
                    }
                case "f8":
                    {
                        break;
                    }
                case "fetch":
                    {
                        break;
                    }
                default:
                    {
                        msgModule.log('UNKNOWN Event Operation in sbHandler Events : ', eventInfo);
                        break;
                    }
            }
        },
        handler: function(msg) {
            switch (msg.opt) {
                case "collectfeedback":
                    {
                        util.publish('/feedback/initiate', {
                            userFeedback: msg[msg.opt].userFeedback,
                            isFromChatModule: msg[msg.opt].isFromChatModule,
                            token: msg[msg.opt].token
                        });
                        break;
                    }
                case "accountOpt":
                    {
                        if (msg[msg.opt].opt == 'load') {
                            this.load(msg[msg.opt]);
                        } else if (msg[msg.opt].opt == 'unLoad') {
                            this.unload(msg[msg.opt]);
                        }
                        break;
                    }
                case "_event":
                    {
                        this.events(msg[msg.opt]);
                        break;
                    }
                case "onFocus":
                    {
                        util.zoom.updateUIOnFocus(util.zoom.getActiveTab());
                        break;
                    }
                case "zoomIn":
                    {
                        util.zoom.zoomIn(util.zoom.getActiveTab());
                        break;
                    }
                case "resetZoom":
                    {
                        util.zoom.resetZoom(util.zoom.getActiveTab());
                        break;
                    }
                case "zoomOut":
                    {
                        util.zoom.zoomOut(util.zoom.getActiveTab());
                        break;
                    }
                case "clearCache":
                    {
                        $('#preferences .clear_cache').trigger('click');
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
    };
    var msgModule = {
        name: 'MessageModule',
        log: function() {
            util.log.apply(this, arguments);
        },
        proxy: function() {
            msgModule.handler.apply(msgModule, arguments);
        },
        handler: function(e) {
            var msg = arguments[0].name ? arguments[0] : arguments[1];
            /**
             * isForV2 is added in code 
             * to bring new v2 inside the 
             * main call container, in one frame
             *
             * so 
             *     msg-to-FULL -> callContainer
             *         &
             *     msg-to-V2 -> callContainer
             *
             * In order to differentiate the messages
             * we are adding boolean indication by adding
             * this `isForV2` property along with all 
             * message from `mainMessaging` module.
             
            if( msg.isForV2 )
                return false;
            */
            switch (msg.name) {
                case "crashed":
                    {
                        if (msg.crashed) {
                            console.warn('SBWindow crash detected Restoring app data');
                            util.publish('/app/restore/check', {
                                source: 'main'
                            });
                        } else {
                            // clearing stored DATA
                            console.debug('SBWindow not crashed, Deleting Restoration data');
                            util.publish('/app/restore/removeAll', 'tabs');
                        }
                        break;
                    }
                case "fulloauth":
                    {
                        this.log('Recieved message on fulloauth block : ', msg);
                        util.publish('/app/loginModule/msg/recieved', msg);
                        break;
                    }
                case "clientlistener":
                    {
                        clientListenerHandler.handler(msg);
                        break;
                    }
                case "reLogin":
                    {
                        FULLClient["canQuit"] = true;
                        window.close();
                        break;
                    }
                case "updateEngine":
                    {
                        this.log('Downloading Engine Update');
                        util.publish('/start/engine/updater/force/', true);
                        break;
                    }
                case "sbCommunication":
                    {
                        sbHandler.handler(msg);
                        break;
                    }
                case "v2Communication":
                    {
                        console.log('Inside the v2Communication');
                        util.publish('/v2Handler/msg/handler', msg);
                        break;
                    }
                case "chromeAppAPI":
                    {
                        apiHandler.handler(msg);
                        break;
                    }
                case "tabLock":
                    {
                        /* Signal received from SB : request to Lock 
                         * the Account while tab Close with options provided
                         */
                        if (msg.enableLock)
                            util.publish("tabCloseController/lockTabOnClose", msg);
                        break;
                    }
                case "Dummy":
                    {
                        console.log('Testing DATA : reached')
                        break;
                    }
                case "appQuit":
                    {
                        /* 
                         * Flag to differentaite dock icon quit from
                         * window's X-Btn ,ie., this flag will be enabled
                         * whenever ther is a request for app quit from
                         * any window and disabled with dock icon quit request
                         */
                        if (!FULLClient["canQuit"]) {
                            $('#QuitApp').trigger('click');
                            $('#QuitApp').parent().parent().hasClass('open') ? $('#QuitApp').parent().parent().removeClass('open') : false;
                        }
                    }
                case "Application":
                    {
                        // handler for Feedback request from chat window
                        sbHandler.handler(msg);
                        break;
                    }
                case "crashReporter":
                    {
                        util.publish('/util/crashreporter/set/port', msg.port);
                        break;
                    }
                case "v2EventLogs":
                    {
                        break;
                    }
                case "analytics":
                    {
                        // Getting this message from externalTimer Widget. 
                        // We have to pass this message to analytics. 
                        util.publish('/analytics/push', msg.accountNumber, msg.eventAction, msg.connId, msg.metaInfo);
                        break;
                    }
                case "timerWidget":
                    {
                        util.publish('/timer/markActiveTabById');
                        break;
                    }
                default:
                    {
                        this.log('Default Sequence Capture this : ', msg);
                        break;
                    }
            }
        }
    }
        var sb={
              messageListener(event) {

            console.log('Message received as ', event);
            if (event && event.data && event.data.info) {
                msgModule.handler.call(msgModule, event.data.info)
            }
        }
        }
    
    var ipc = FULLClient.require('electron').ipcRenderer;
     emitter.subscribe(namespace.channel.SB, sb.messageListener);
     console.log('Before subscribing');
    //util.subscribe('/sendMessage/to/sb', sb.messageListener);
    util.subscribe('/msgModule/handler/', msgModule, msgModule.proxy);

})(this, util);
